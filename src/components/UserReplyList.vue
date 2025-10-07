<script setup lang="ts">
import { UserReply } from '@/models/reply.model';
import { PageName } from '@/router';
import { useAppStore } from '@/store/app';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  list: {
    type: Array as PropType<UserReply[]>,
    default: () => [],
  },
})
const { t } = useI18n();
const appStore = useAppStore();
const replyStatuses = computed(() => appStore.replyStatus);
const listMapped = computed(() => {
  return props.list.map(item => ({
    ...item,
    status: replyStatuses.value.get(item.status),
  }))
})
</script>

<template>
  <div class="user-reply-list">
    <h2 class="text-h5 mb-6">{{ t('reply.yourItems') }}</h2>
    <v-card
      v-for="reply in listMapped"
      :key="reply.id"
      :to="{ name: PageName.VACANCY, params: { id: reply.vacancy.id }, hash: '#' + reply.id }"
      variant="flat"
      class="mt-5">
      <v-card-item>
        <div class="d-flex flex-wrap ga-3 align-center">
          <v-avatar
            v-if="reply.vacancy.organization?.logoUrl"
            color="info"
            size="40"
            :image="reply.vacancy.organization.logoUrl" />
          <div class="content">
            <div class="text-h6 font-weight-bold">
              {{ reply.vacancy.title }}
            </div>
            <div class="text-subtitle-2 text-grey">
              {{ reply.vacancy.organization.name }}
            </div>
          </div>
          <div v-if="reply?.status" class="status w-100 w-sm-auto ml-sm-auto">
            <v-chip :color="reply.status.color">
              {{ reply.status.localizedName }}
            </v-chip>
          </div>
        </div>
      </v-card-item>
      <v-card-text>
        <span class="text-subtitle-1 text-medium-emphasis">
          {{ reply.date.toLocaleString() }}
        </span>
        <p v-if="reply.content" class="text-body-1 text-break mt-4">
          {{ reply.content }}
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>