<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileEditForm from '@/components/ProfileEditForm.vue';
import { UserEditFormData } from '@/models/user.model';
import UserReplyList from '@/components/UserReplyList.vue';
import { useDisplay } from 'vuetify';

const { t } = useI18n();
const breakcrumbs = computed(() => [
  {
    title: t('app.pages.home'),
    to: { name: 'home' },
  },
  {
    title: t('app.pages.account'),
    to: { name: 'account' },
  },
]);
const userStore = useUserStore();
const user = computed(() => userStore.user);
const replies = computed(() => userStore.replies);
const editDialolog = ref(false);
const editFormCmp = ref();
const userDescription = ref(user.value?.description);
const descriptionEditable = ref(false);
const descriptionChanged = computed(() => {
  if (!user.value) return false;
  return user.value.description !== userDescription.value;
})

function onDescriptionBlur() {
  descriptionEditable.value = descriptionChanged.value;
}

function saveDescription() {
  editProfile({ description: userDescription.value }).then(() => {
    descriptionEditable.value = false;
    userDescription.value = user.value?.description ?? '';
  })
}

function editProfile(payload: Omit<UserEditFormData, 'email'>) {
  return userStore.editProfile(payload).then(() => {
    if (editFormCmp.value?.reset) editFormCmp.value.reset();
    editDialolog.value = false;
  })
}

onMounted(() => userStore.getReplies());
const { smAndUp } = useDisplay();
</script>

<template>
  <div class="page">
    <v-container>
      <v-breadcrumbs :items="breakcrumbs" />
      <v-card v-if="user" variant="flat" :hover="false">
        <v-card-item>
          <div class="d-flex flex-wrap ga-2 align-center">
            <v-avatar v-if="smAndUp" color="grey-lighten-3" size="64">
              <v-icon icon="mdi-account" size="32" />
            </v-avatar>
            <div class="content ma-2">
              <h2 class="text-h5 text-lg-h4 mx-2 mt-2 font-weight-bold">
                {{ user?.fullName }}
              </h2>
              <p class="text-h6 mx-2 mb-2 text-grey">
                {{ user.email }}
              </p>
            </div>
            <div class="setting position-absolute top-0 right-0 mt-1 mr-1 mt-sm-2 mr-sm-2">
              <v-btn
                icon="mdi-cog"
                variant="flat"
                @click="editDialolog = true" />
            </div>
          </div>
        </v-card-item>
        <v-card-text>
          <div class="user-description">
            <v-textarea
              v-model="userDescription"
              :placeholder="t('user.descriptionPlaceholder')"
              :persistent-placeholder="!descriptionEditable"
              :readonly="!descriptionEditable"
              :single-line="!descriptionEditable"
              rows="2"
              variant="solo-filled"
              flat
              auto-grow
              :class="{ readonly: !descriptionEditable }"
              @blur="onDescriptionBlur">
              <template #append-inner>
                <v-btn
                  v-if="!descriptionEditable"
                  icon="mdi-pencil"
                  variant="plain"
                  @click="descriptionEditable = true" />
                <v-btn
                  v-if="descriptionChanged"
                  icon="mdi-content-save"
                  variant="plain"
                  color="primary"
                  @click="saveDescription" />
              </template>
            </v-textarea>
          </div>
        </v-card-text>
      </v-card>
      <user-reply-list v-if="replies?.length" :list="replies" class="mt-12" />
      <v-dialog v-model="editDialolog" max-width="500">
        <v-card :title="t('user.edit')">
          <v-card-text>
            <profile-edit-form
              v-if="user"
              :user="user"
              @submit="editProfile" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>