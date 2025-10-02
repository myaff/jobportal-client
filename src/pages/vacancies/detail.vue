<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const { t } = useI18n();
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
    title: `Vacancy #${route.params.id}`,
  },
]);
</script>

<template>
  <div class="page">
    <v-container>
      <v-breadcrumbs :items="breakcrumbs" />
      <v-row>
        <v-col cols="8">
          <v-sheet>
            Vacancies detail id: {{ route.params.id }}
          </v-sheet>
        </v-col>
        <v-col cols="4">
          Aside content
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>