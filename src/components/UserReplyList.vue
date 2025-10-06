<script setup lang="ts">
import { ReplyStatusColor, UserReply } from '@/models/reply.model';
import { PageName } from '@/router';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  list: {
    type: Array as PropType<UserReply[]>,
    default: () => [],
  },
})
const { t } = useI18n();
</script>

<template>
  <div class="user-reply-list">
    <h2 class="text-h5 mb-6">{{ t('reply.yourItems') }}</h2>
    <v-card
      v-for="reply in list"
      :key="reply.id"
      :to="{ name: PageName.VACANCY, params: { id: reply.vacancy.id }, hash: '#' + reply.id }"
      :prepend-avatar="reply.vacancy.organization?.logoUrl"
      :title="reply.vacancy.title"
      :subtitle="reply.vacancy.organization.name"
      variant="flat"
      class="mt-5">
      <v-card-text>
        <span class="text-subtitle-1 text-medium-emphasis">
          {{ reply.date.toLocaleString() }}
        </span>
        <p v-if="reply.content" class="text-body-1 text-break mt-4">
          {{ reply.content }}
        </p>
      </v-card-text>
      <template #append>
        <v-chip :color="ReplyStatusColor[reply.status]">
          {{ reply.status }}
        </v-chip>
      </template>
    </v-card>
  </div>
</template>