<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ProfileEditForm from '@/components/ProfileEditForm.vue';
import { UserEditFormData } from '@/models/user.model';
import UserReplyList from '@/components/UserReplyList.vue';
import { useDisplay } from 'vuetify';
import UserDetailsCard from '@/components/UserDetailsCard.vue';

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
      <user-details-card v-if="user" :user="user" editable @edit="editDialolog = true">
        <template #description>
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
        </template>
      </user-details-card>
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