<template>
  <q-page class="q-pa-md q-gutter-y-md">
    <h5>Configuração de Perfil</h5>
    <div class="row q-col-gutter-md full-width">
      <q-input
        class="col-md-6 col-xs-12"
        v-model="form.enterprise"
        outlined
        label="Nome da Imobiliária"
      />
      <q-input
        class="col-md-6 col-xs-12"
        v-model="form.full_name"
        outlined
        label="Nome do usuário responsável"
      />
      <q-input outlined v-model="form.primary_color" class="col-md-6 col-xs-12">
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="form.primary_color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        outlined
        v-model="form.secondary_color"
        class="col-md-6 col-xs-12"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="form.secondary_color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="row justify-center full-width">
      <q-btn label="Salvar Perfil" @click="saveProfile" color="primary" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import {useRouter} from 'vue-router'

defineOptions({
  name: "UpdateProfile",
  layout: "admin",
});

const authStore = useAuthStore(); // Obtém a store de autenticação
const user = ref(authStore.user) // Acessa o ID do usuário logado
const router = useRouter()

const form = ref({
  enterprise: "",
  full_name: "",
  primary_color: '',
  secondary_color: '',
});

const funFetchProfile = async () => {
  try {
    const profile = await authStore.fetchProfile(user.value.id);

    if (!profile) {
      throw new Error("Perfil não encontrado.");
    }

    form.value.enterprise = profile.enterprise;
    form.value.full_name = profile.full_name;
    form.value.primary_color = profile.primary_color;
    form.value.secondary_color = profile.secondary_color;


  } catch (err) {
    console.error("Erro ao buscar perfil ou propriedades:", err);
  }
};

const saveProfile = async () => {
  if (!user.value.id) {
    error.value = "Usuário não autenticado";
    return;
  }

  await authStore.updateProfile(user.value.id, form.value.enterprise, form.value.full_name, form.value.primary_color, form.value.secondary_color);
  router.push("/admin");
};



onMounted(async () => {
 funFetchProfile()
});
</script>
