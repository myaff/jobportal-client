<script setup lang="ts">
import { ReplyStatuses, VacancyReply } from '@/models/reply.model';
import { User, UserRole } from '@/models/user.model';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import UserDetailsCard from './UserDetailsCard.vue';

const props = defineProps({
  list: {
    type: Array as PropType<VacancyReply[]>,
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
const newOnly = ref(user.value && user.value.managerAndUp);
const listMapped = computed(() => {
  return props.list
    .filter(item => {
      if (newOnly.value) return item.status === ReplyStatuses.NEW;
      return item;
    })
    .map(item => {
      item.isMine = role.value === UserRole.USER
        && item.author.email === user.value?.email;
      item.fullStatus = replyStatuses.value.get(item.status);
      return item;
    });
})
const replyToEdit = ref<VacancyReply | null>(null);
const statusMenuOpen = ref(false);
const statusMenuTarget = ref<Element | null>();
const openReplyStatusMenu = (reply: VacancyReply, e: MouseEvent | KeyboardEvent) => {
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
const updateReplyStatus = (reply: Pick<VacancyReply, 'id' | 'status'>, key: string) => {
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
    <div class="vacancy-reply-list__head d-flex flex-wrap justify-space-between align-center mb-6">
      <h3 class="text-h5">
        {{ t('reply.items') }}
      </h3>
      <v-switch
        v-if="user?.managerAndUp"
        v-model="newOnly"
        :color="newOnly ? 'blue': 'default'"
        :label="t('reply.newOnly')"
        hide-details />
    </div>
    <v-card
      v-for="reply in listMapped"
      :key="reply.id"
      :id="reply.id"
      class="reply-list__item mt-5">
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