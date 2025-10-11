<script setup lang="ts">
import { User } from '@/models/user.model';
import { useDisplay } from 'vuetify';

const props = defineProps({
  user: {
    type: User,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(['edit']);
const { smAndUp } = useDisplay();
</script>

<template>
  <v-card v-if="user" variant="flat" :hover="false">
    <v-card-item>
      <div class="d-flex flex-wrap ga-2 align-center">
        <v-avatar v-if="smAndUp && showAvatar" color="grey-lighten-3" size="64">
          <v-icon icon="mdi-account" size="32" />
        </v-avatar>
        <div class="content ma-2">
          <h2 class="text-h5 text-lg-h4 mx-2 mt-2 font-weight-bold">
            {{ user?.fullName }}
          </h2>
          <p class="text-h6 mx-2 mb-2 text-grey">
            {{ user.email }}
          </p>
        </div>
        <div v-if="editable" class="setting position-absolute top-0 right-0 mt-1 mr-1 mt-sm-2 mr-sm-2">
          <v-btn
            icon="mdi-cog"
            variant="flat"
            @click="emits('edit')" />
        </div>
      </div>
    </v-card-item>
    <v-card-text>
      <slot name="description">
      <div v-if="user?.description" class="user-description pa-3 bg-grey-lighten-4">
          <p class="text-body-1">
            {{ user.description }}
          </p>
        </div>
      </slot>
    </v-card-text>
  </v-card>
</template>