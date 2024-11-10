<template>
  <v-responsive>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer">
        <!-- sidebar -->
        <v-sheet class="pa-4" color="primary">
          <div class="font-weight-bold">Welcome! {{ userStore.user?.name }}</div>
          <div class="font-weight-bold">Your Total Balance :</div>
          <div class="font-weight-bold">$ {{ userStore.user?.balance }}</div>
        </v-sheet>
        <v-divider></v-divider>

        <v-list>
          <RouterLink
            v-for="{ icon, text, route, click } in sidebarLinks"
            :key="route"
            :to="route"
            custom
          >
            <v-list-item
              :prepend-icon="icon"
              :title="text"
              link
              @click="click"
              v-if="click"
            ></v-list-item>
            <v-list-item
              :prepend-icon="icon"
              :title="text"
              link
              :to="route"
              v-else
            ></v-list-item>
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="" max-width="100" :src="logo"></v-img>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main id="main">
        <RouterView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { ref } from 'vue';
import logo from '@/assets/logo-digi.png';
import { mdiHome, mdiKeyChange, mdiLogout, mdiAccount, mdiWalletBifold } from '@mdi/js'; // Import mdiAccount for Account
import { RouterView, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();
const router = useRouter();

const drawer = ref(null);

function logout() {
  userStore.logout();
  router.push({ name: 'login' });
}

// Sidebar links including Account and Change Password
const sidebarLinks = [
  { icon: mdiHome, text: 'Home', route: '/' },
  { icon: mdiAccount, text: 'Account Form', route: '/account-form' }, // Add Account link
  { icon: mdiKeyChange, text: 'Change Password', route: '/change-password' },
  { icon: mdiWalletBifold, text: 'My Wallet', route: '/arsip-dompetku' }, // Add Arsip Dompetku link
  { icon: mdiLogout, text: 'Logout', route: '/login', click: logout },
];
</script>
