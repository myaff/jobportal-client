<script setup lang="ts">
import { VacancyReply } from '@/models/reply.model';
import { UserRole } from '@/models/user.model';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  list: {
    type: Array as PropType<VacancyReply[]>,
    default: () => [],
  },
})
const emits = defineEmits(['download']);
const { t } = useI18n();
const userStore = useUserStore();
const user = computed(() => userStore.user);
const role = computed(() => user.value?.role ?? UserRole.USER);
const appStore = useAppStore();
const replyStatuses = computed(() => appStore.replyStatus);
const listMapped = computed(() => {
  return props.list.map(item => {
    item.isMine = role.value === UserRole.USER
      && item.author.email === user.value?.email;
    item.fullStatus = replyStatuses.value.get(item.status);
    return item;
  })
})
</script>

<template>
  <div class="vacancy-reply-list">
    <h3 class="text-h5 mb-6">
      {{ t('reply.items') }}
    </h3>
    <v-card
      v-for="reply in listMapped"
      :key="reply.id"
      :id="reply.id"
      class="reply-list__item mt-5">
      <v-card-item>
        <div class="d-flex flex-wrap ga-3 align-center">
          <v-avatar color="info" size="40">
            <v-icon v-if="reply.isMine" icon="mdi-star" />
            <span v-else class="text-h6 text-lg-h5">
              {{ reply.author.abbreviation }}
            </span>
          </v-avatar>
          <div class="content">
            <div class="text-h6 font-weight-bold">
              {{ reply.isMine ? t('reply.yourItem') : user?.fullName }}
            </div>
            <div class="text-subtitle-2 text-grey">
              {{ reply.date.toLocaleString() }}
            </div>
          </div>
          <div v-if="reply?.fullStatus" class="status w-100 w-sm-auto ml-sm-auto">
            <v-chip :color="reply.fullStatus.color">
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
  </div>
</template>