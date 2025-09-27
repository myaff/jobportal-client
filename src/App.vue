<script lang="ts" setup>
  //
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-container>
        <v-toolbar-title>My App</v-toolbar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>