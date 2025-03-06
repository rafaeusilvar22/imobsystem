<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ currentEnterpriseData.enterprise }}
        </q-toolbar-title>

        <q-btn flat round dense icon="home" @click="handleGoToPage('/home')" />
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          round
          dense
          icon="admin_panel_settings"
          to="/admin"
        />
        <q-btn
          v-if="!authStore.isAuthenticated"
          flat
          dense
          label="Login"
          to="/login"
        />
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          dense
          label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable @click="handleGoToPage('/home')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Início</q-item-label>
            <q-item-label caption>Página principal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="authStore.isAuthenticated" clickable to="/admin">
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Administração</q-item-label>
            <q-item-label caption>Gerenciar imóveis</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="!authStore.isAuthenticated" clickable to="/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>Acesse sua conta</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-item v-if="!authStore.isAuthenticated" clickable to="/register"> -->
        <!-- <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section> -->
        <!-- <q-item-section>
            <q-item-label>Registrar</q-item-label>
            <q-item-label caption>Crie uma conta</q-item-label>
          </q-item-section> -->
        <!-- </q-item> -->

        <q-item v-if="authStore.isAuthenticated" clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Sair da conta</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useBrandColorsStore } from "../stores/brandColors";
import { useGotoRouter } from "src/composables/goToRouter";
import { useEnterpriseStore } from "../stores/enterprise";
import { supabase } from "../supabase";
import { setCssVar } from "quasar";
import { Loading } from "quasar";

import { currentEnterpriseData } from "src/composables/currentEnterpriseData";

defineOptions({
  name: "MainLayout",
});

const route = useRoute();
const router = useRouter();
const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const { handleGoToPage } = useGotoRouter();
const enterpriseStore = useEnterpriseStore();
const brandColorsStore = useBrandColorsStore();

const enterpriseUrl = route.params.enterpriseUrl;
const enterpriseData = enterpriseStore.currentEnterpriseData;

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onMounted(async () => {
  authStore.initialize();
  await funFetchEnterprise();
});

const funFetchEnterprise = async () => {
  Loading.show();
  try {
    const respEnterprise = await enterpriseStore.fetchEnterprise(enterpriseUrl);

    if (!respEnterprise) {
      throw new Error("Empresa não encontrada.");
    }

    currentEnterpriseData.value = respEnterprise;

    await brandColorsStore.loadThemeColor(enterpriseUrl); // Carrega a cor do tema
  } catch (err) {
    console.error("Erro ao buscar perfil ou propriedades:", err);
  } finally {
    Loading.hide();
  }
};

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>
