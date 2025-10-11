<script setup lang="ts">
import { FullReply, ReplyStatuses } from '@/models/reply.model';
import { User, UserRole } from '@/models/user.model';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import UserDetailsCard from './UserDetailsCard.vue';
import { PageName } from '@/router';

const props = defineProps({
  list: {
    type: Array as PropType<FullReply[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:reply']);
const { t } = useI18n();
const userStore = useUserStore();
const user = computed(() => userStore.user);
const role = computed(() => user.value?.role ?? UserRole.USER);
const appStore = useAppStore();
const replyStatuses = computed(() => appStore.replyStatus);
const listMapped = computed(() => {
  return props.list
    .map(item => {
      item.isMine = role.value === UserRole.USER
        && item.author.email === user.value?.email;
      item.fullStatus = replyStatuses.value.get(item.status);
      return item;
    });
})
const replyToEdit = ref<FullReply | null>(null);
const statusMenuOpen = ref(false);
const statusMenuTarget = ref<Element | null>();
const openReplyStatusMenu = (reply: FullReply, e: MouseEvent | KeyboardEvent) => {
  if (!user.value?.managerAndUp) return;
  replyToEdit.value = reply;
  statusMenuTarget.value = (e?.target as HTMLElement)?.closest('.v-chip');
  statusMenuOpen.value = true;
}
watch(statusMenuOpen, value => {
  if (!value) {
    replyToEdit.value = null;
    statusMenuTarget.value = null;
  }
})
const updateReplyStatus = (reply: Pick<FullReply, 'id' | 'status'>, key: string) => {
  if (key !== reply.status) emits('update:reply', { id: reply.id, formData: { status: key } });
  statusMenuOpen.value = false;
}

// user details
const { smAndUp } = useDisplay();
const userDetailsOpen = ref(false);
const userDetails = ref<User | null>(null);
const openUserDetails = (item: User) => {
  userDetails.value = item;
  userDetailsOpen.value = true;
}
const closeUserDetails = () => {
  userDetailsOpen.value = false;
  userDetails.value = null;
}
</script>

<template>
  <div class="vacancy-reply-list">
    <v-card
      v-for="reply in listMapped"
      :key="reply.id"
      :id="reply.id"
      :hover="false"
      variant="flat"
      class="reply-list__item mb-5">
      <v-card-item>
        <div class="d-flex flex-wrap ga-3 align-center">
          <v-avatar color="info" size="40" @click="openUserDetails(reply.author)">
            <v-icon v-if="reply.isMine" icon="mdi-star" />
            <span v-else class="text-h6 text-lg-h5">
              {{ reply.author.abbreviation }}
            </span>
          </v-avatar>
          <div class="content">
            <div class="text-h6 font-weight-bold cursor-pointer" @click="openUserDetails(reply.author)">
              {{ reply.isMine ? t('reply.yourItem') : reply.author?.fullName }}
            </div>
            <div class="text-subtitle-2 text-grey">
              {{ reply.date.toLocaleString() }}
            </div>
          </div>
          <div v-if="reply?.fullStatus" class="status w-100 w-sm-auto ml-sm-auto">
            <v-chip :color="reply.fullStatus.color" @click="e => openReplyStatusMenu(reply, e)">
              {{ reply.fullStatus.localizedName }}
            </v-chip>
          </div>
        </div>
      </v-card-item>
      <v-card-text>
        <p class="text-body-1 text-break">{{ reply.content }}</p>
      </v-card-text>
      <v-card-actions v-if="reply.cv">
        <v-btn
          variant="text"
          prepend-icon="mdi-paperclip"
          color="primary"
          :href="reply.getCVLink()"
          target="_blank">
          {{ reply.cv }}
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          :to="{ name: PageName.VACANCY, params: { id: reply.vacancy.id } }"
          append-icon="mdi-chevron-right"
          spaced="end"
          block
          height="70"
          class="pa-2"
          variant="tonal">
          <div class="text-left">
            <div class="font-weight-bold">
              {{ reply.vacancy.title }},
              <span class="text-medium-emphasis ml-2">
                {{ reply.vacancy.organization.name }}
              </span>
            </div>
            <div class="text-medium-emphasis mt-1">
              {{ reply.vacancy.date.toLocaleDateString() }}
            </div>
          </div>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-if="userDetails && smAndUp" v-model="userDetailsOpen" max-width="600">
      <user-details-card :user="userDetails" :show-avatar="false" />
      <v-btn
        icon="mdi-close"
        variant="plain"
        class="position-absolute top-9 right-0"
        @click="closeUserDetails" />
    </v-dialog>
    <v-bottom-sheet v-if="userDetails && !smAndUp" v-model="userDetailsOpen">
      <user-details-card :user="userDetails" :show-avatar="false" />
      <v-btn
        icon="mdi-close"
        variant="plain"
        class="position-absolute top-9 right-0"
        @click="closeUserDetails" />
    </v-bottom-sheet>
    <v-menu
      v-if="statusMenuTarget && replyToEdit"
      v-model="statusMenuOpen"
      :target="statusMenuTarget"
      location="bottom end"
      scroll-strategy="close">
      <v-list
        class="py-0"
        density="compact"
        item-value="code"
        item-props
        slim>
        <v-list-item
          v-for="[key, value] in replyStatuses"
          :key="key"
          :active="key === replyToEdit?.status"
          @click="updateReplyStatus(replyToEdit, key)">
          {{ value.localizedName }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>