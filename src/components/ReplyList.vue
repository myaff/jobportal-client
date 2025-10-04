<script setup lang="ts">
import Reply from '@/models/reply.model';
import { UserRole } from '@/models/user.model';
import { useUserStore } from '@/store/user';
import { computed, PropType } from 'vue';

const props = defineProps({
  list: {
    type: Array as PropType<Reply[]>,
    default: () => [],
  },
})
const userStore = useUserStore();
const user = computed(() => userStore.user);
const role = computed(() => user.value?.role ?? UserRole.USER);
</script>

<template>
  <v-sheet variant="outlined" class="pa-4">
    <v-card
      v-for="reply in list"
      :key="reply.id">
      <v-card-item>
        <p>{{ reply.content }}</p>
      </v-card-item>
    </v-card>
  </v-sheet>
</template>