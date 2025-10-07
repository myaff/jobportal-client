import DictionaryService from '@/services/dictionary.service';
import { defineStore } from 'pinia'
import { ref } from 'vue';
import { VacancyProp, VacancyStatus } from '@/models/vacancy.model';
import { ReplyStatus } from '@/models/reply.model';

export const useAppStore = defineStore('app', () => {
  const dictionaryService = new DictionaryService();
  const vacancyType = ref<Map<string, VacancyProp>>(new Map());
  const vacancyStatus = ref<Map<string, VacancyStatus>>(new Map());
  const replyStatus = ref<Map<string, ReplyStatus>>(new Map());

  function getVacancyTypes() {
    return dictionaryService.getVacancyType()
      .then(data => {
        vacancyType.value.clear();
        data.reduce((acc, item) => {
          acc.set(item.name, item);
          return acc;
        }, vacancyType.value);
        return vacancyType.value;
      })
  }

  function getVacancyStatuses() {
    return dictionaryService.getVacancyStatuses()
      .then(data => {
        vacancyStatus.value.clear();
        data.reduce((acc, item) => {
          acc.set(item.name, item);
          return acc;
        }, vacancyStatus.value);
        return vacancyStatus.value;
      })
  }

  function getReplyStatuses() {
    return dictionaryService.getReplyStatus()
      .then(data => {
        replyStatus.value.clear();
        data.reduce((acc, item) => {
          acc.set(item.name, item);
          return acc;
        }, replyStatus.value);
        return replyStatus.value;
      })
  }

  async function init() {
    await Promise.allSettled([
      getVacancyTypes(),
      getVacancyStatuses(),
      getReplyStatuses(),
    ]);
  }

  return {
    vacancyType,
    vacancyStatus,
    replyStatus,
    init,
    getVacancyTypes,
    getVacancyStatuses,
    getReplyStatuses,
  };
});
