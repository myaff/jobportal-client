<script setup lang="ts">
import { VacancyReply, ReplyStatusColor } from '@/models/reply.model';
import { UserRole } from '@/models/user.model';
import { useUserStore } from '@/store/user';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  list: {
    type: Array as PropType<VacancyReply[]>,
    default: () => [],
  },
})
const { t } = useI18n();
const userStore = useUserStore();
const user = computed(() => userStore.user);
const role = computed(() => user.value?.role ?? UserRole.USER);
const listMapped = computed(() => {
  return props.list.map(item => ({
    ...item,
    isMine: role.value === UserRole.USER
      && item.author.email === user.value?.email,
  }))
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
      :title="reply.isMine ? t('reply.yourItem') : user?.fullName"
      :subtitle="reply.date.toLocaleString()"
      :id="reply.id"
      class="reply-list__item mt-5">
      <template #prepend>
        <v-avatar color="info">
          <v-icon v-if="reply.isMine" icon="mdi-star" />
          <span v-else class="text-h5">{{ reply.author.abbreviation }}</span>
        </v-avatar>
      </template>
      <v-card-text>
        <p class="text-body-1 text-break">{{ reply.content }}</p>
      </v-card-text>
      <template #append>
        <v-chip :color="ReplyStatusColor[reply.status]">
          {{ reply.status }}
        </v-chip>
      </template>
    </v-card>
  </div>
</template>