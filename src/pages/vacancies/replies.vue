<script setup lang="ts">
import { ReplyDto, VacancyReply } from '@/models/reply.model';
import { PageName } from '@/router';
import ReplyService from '@/services/reply.service';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VacancyReplyList from '@/components/VacancyReplyList.vue';

const { t } = useI18n();
const userStore = useUserStore();
const token = computed(() => userStore.token);
const replyService = new ReplyService();
ReplyService.setAuthToken(token.value);

const list = ref<VacancyReply[]>([]);
const isLoading = ref(false);
function updateList() {
  isLoading.value = true;
  return replyService
    .getAll()
    .then(data => list.value = data)
    .finally(() => isLoading.value = false);
}
onMounted(() => {
  updateList();
})
function updateReply(payload: { id: VacancyReply['id'], formData: Partial<ReplyDto> }) {
  return replyService.update(payload.id, payload.formData).then(() => {
    updateList();
  });
}
</script>

<template>
  <div class="page">
    <v-container>
      <div class="page__content d-flex flex-column ga-3">
        <v-progress-circular v-if="isLoading" indeterminate class="mx-auto my-10" />
        <vacancy-reply-list
          v-else-if="!isLoading && list?.length"
          :list="list"
          @update:reply="updateReply" />
        <v-empty-state
          v-else
          class="my-10"
          :headline="t('reply.empty.heading')"
          :title="t('reply.empty.title')"
          :text="t('reply.empty.text')">
          <template #actions>
            <v-btn
              :to="{ name: PageName.MY_VACANCIES }"
              color="blue"
              size="x-large"
              :text="t('reply.empty.goToVacancies')"
              class="mt-8" />
          </template>
        </v-empty-state>
      </div>
    </v-container>
  </div>
</template>