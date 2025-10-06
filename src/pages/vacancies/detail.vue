<script setup lang="ts">
import { getQueryParamValue } from '@/composables/useUrlHelper';
import { VacancyReply } from '@/models/reply.model';
import { Vacancy } from '@/models/vacancy.model';
import ReplyService from '@/services/reply.service';
import VacancyService from '@/services/vacancies.service';
import { useUserStore } from '@/store/user';
import { AxiosError } from 'axios';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import VacancyReplyList from '@/components/VacancyReplyList.vue';
import ReplyForm from '@/components/ReplyForm.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const vacancyService = new VacancyService();
const vacancyId = computed(() => getQueryParamValue(route.params?.id));
const vacancy = ref<Vacancy | null>(null);
const breakcrumbs = computed(() => [
  {
    title: t('app.pages.home'),
    to: { name: 'home' },
  },
  {
    title: t('app.pages.vacancies'),
    to: { name: 'vacancies' },
  },
  {
    title: vacancy.value && vacancy.value?.title
      ? vacancy.value.title
      : `${t('vacancy.item')} #${vacancyId.value}`,
  },
]);
const isLoading = ref(false);
const errorStatus = ref<number | null>(null);
const errorText = ref('');

function fetchDetails(id: string) {
  isLoading.value = true;
  return vacancyService
    .getById(id)
    .then(data => {
      vacancy.value = data;
      errorStatus.value = null;
      errorText.value = '';
      replies.value = [];
    })
    .catch(e => {
      console.log(e);
      if (e instanceof AxiosError) {
        errorStatus.value = e.status ?? null;
      }
      if (errorStatus.value === 404) {
        errorText.value = t('vacancy.notFound');
      } else {
        errorText.value = t('errors.serverError');
      }
    })
    .finally(() => isLoading.value = false);
}

const userStore = useUserStore();
const token = computed(() => userStore.token);
const isAuthorized = computed(() => userStore.isAuthorized);
const replyService = new ReplyService();
const replies = ref<VacancyReply[]>([]);
const isRepliesLoading = ref(false);
function fetchReplies(id: string) {
  isRepliesLoading.value = true;
  return replyService.getAllByVacancy(id)
    .then(data => {
      replies.value = data ?? [];
    })
    .finally(() => isRepliesLoading.value = false);
}

watchEffect(async () => {
  if (vacancyId.value) {
    if (token.value) ReplyService.setAuthToken(token.value);
    await fetchDetails(vacancyId.value);
    fetchReplies(vacancyId.value);
  }
})

const replyFormCmp = ref();
function sendReply(formData: FormData) {
  return replyService
    .create(vacancyId.value, formData)
    .then(() => {
      if (replyFormCmp.value?.reset) replyFormCmp.value.reset();
    })
}
</script>

<template>
  <div class="page">
    <v-container>
      <v-breadcrumbs :items="breakcrumbs" />
      <v-row v-if="isLoading || vacancy">
        <v-col cols="8">
          <div class="page__content">
            <v-skeleton-loader v-if="isLoading" type="article" />
            <v-sheet v-else-if="vacancy" class="px-6 py-8">
              <h1 class="text-h3">{{ vacancy.title }}</h1>
              <div class="text-body-1 mt-6" v-html="vacancy.description"></div>
            </v-sheet>
          </div>
          <div class="replies mt-8">
            <vacancy-reply-list v-if="isAuthorized && replies?.length" :list="replies" />
            <reply-form
              v-else-if="isAuthorized && !replies?.length && !isRepliesLoading"
              ref="replyFormCmp"
              @submit="sendReply" />
          </div>
        </v-col>
        <v-col cols="4">
          <v-sheet v-if="vacancy" class="pa-4">
            Aside content
          </v-sheet>
        </v-col>
      </v-row>
      <v-empty-state
        v-else
        :headline="errorStatus?.toString()"
        :title="errorText">
        <v-btn
          prepend-icon="mdi-arrow-left"
          :text="t('actions.back')"
          @click="router.back()" />
      </v-empty-state>
    </v-container>
  </div>
</template>