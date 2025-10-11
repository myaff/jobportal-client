<script setup lang="ts">
import { ReplyDto, FullReply } from '@/models/reply.model';
import { PageName } from '@/router';
import ReplyService from '@/services/reply.service';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ManagerReplyList from '@/components/ManagerReplyList.vue';
import { useAppStore } from '@/store/app';
import StatusFilter from '@/components/StatusFilter.vue';
import { useDisplay } from 'vuetify';

const { t } = useI18n();
const userStore = useUserStore();
const token = computed(() => userStore.token);
const replyService = new ReplyService();
ReplyService.setAuthToken(token.value);

const list = ref<FullReply[]>([]);
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
function updateReply(payload: { id: FullReply['id'], formData: Partial<ReplyDto> }) {
  return replyService.update(payload.id, payload.formData).then(() => {
    updateList();
  });
}

const appStore = useAppStore();
const replyStatuses = computed(() => appStore.replyStatus);
const choosenReplyStatuses = ref<string[]>([]);
const choosenReplyStatusesSet = computed(() => {
  if (!choosenReplyStatuses.value.length
    || choosenReplyStatuses.value.length === replyStatuses.value.size) return new Set();
  return new Set(choosenReplyStatuses.value);
})
const vacancyStatuses = computed(() => appStore.vacancyStatus);
const choosenVacancyStatuses = ref<string[]>([]);
const choosenVacancyStatusesSet = computed(() => {
  if (!choosenVacancyStatuses.value.length
    || choosenVacancyStatuses.value.length === vacancyStatuses.value.size) return new Set();
  return new Set(choosenVacancyStatuses.value);
})
const filteredList = computed(() => {
  if (!choosenReplyStatusesSet.value.size
    && !choosenVacancyStatusesSet.value.size) return list.value;
  return list.value.filter(item => {
    if (choosenReplyStatusesSet.value.size && !choosenReplyStatusesSet.value.has(item.status)) return false;
    if (choosenVacancyStatusesSet.value.size && !choosenVacancyStatusesSet.value.has(item.vacancy.status)) return false;
    return true;
  })
})
const { lgAndUp } = useDisplay();
const showMobileFilters = ref(false);
watch(lgAndUp, value => {
  if (value) showMobileFilters.value = false;
})
</script>

<template>
  <div class="page">
    <v-container>
      <div class="page__content d-flex flex-column ga-3 py-4">
        <v-progress-circular v-if="isLoading" indeterminate class="mx-auto my-10" />
        <v-row v-else-if="!isLoading && list?.length">
          <v-col v-if="lgAndUp" cols="4">
            <div class="page__filter position-sticky">
              <status-filter
                :title="t('reply.statusFilter')"
                :list="replyStatuses"
                v-model="choosenReplyStatuses" />
              <status-filter
                :title="t('vacancy.statusFilter')"
                :list="vacancyStatuses"
                v-model="choosenVacancyStatuses"
                class="mt-6" />
            </div>
          </v-col>
          <v-col cols="12" lg="8">
            <manager-reply-list
              :list="filteredList"
              @update:reply="updateReply" />
          </v-col>
        </v-row>
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
      <v-fab
        v-if="!lgAndUp"
        icon
        location="right bottom"
        app
        @click="showMobileFilters = true">
          <v-badge v-if="choosenReplyStatuses.length || choosenVacancyStatuses.length" color="blue" dot>
            <v-icon icon="mdi-tune-variant" />
          </v-badge>
          <v-icon v-else icon="mdi-tune-variant" />
      </v-fab>
    </v-container>
    <v-bottom-sheet v-model="showMobileFilters">
      <v-sheet class="px-3 py-4">
        <status-filter
          :title="t('reply.statusFilter')"
          :list="replyStatuses"
          v-model="choosenReplyStatuses" />
        <status-filter
          :title="t('vacancy.statusFilter')"
          :list="vacancyStatuses"
          v-model="choosenVacancyStatuses"
          class="mt-6" />
        <v-btn
          variant="plain"
          icon="mdi-close"
          class="position-absolute top-0 right-0"
          @click="showMobileFilters = false" />
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &__filter {
    top: calc(var(--v-layout-top) + 32px);
  }
}
</style>