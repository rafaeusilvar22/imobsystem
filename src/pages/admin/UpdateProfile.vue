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
      <div class="col-md-6 col-xs-12">
        <q-file
          accept=".jpg, .jpeg, .png"
          label="Adicionar logo"
          outlined
          @update:model-value="onFileSelected"
          clearable
          counter
          bottom-slots
        >
          <template v-slot:prepend>
            <q-icon name="add_photo_alternate" />
          </template>
          <template v-slot:hint> Formatos aceitos: JPG, JPEG, PNG </template>
        </q-file>
      </div>
      <div class="col-3">
        <div v-if="logoImage" class="col-6 col-md-3">
          <q-card>
            <q-img :src="logoImage.url" :ratio="1" />

            <q-card-section class="q-pa-xs">
              <div class="text-caption ellipsis">{{ logoImage.name }}</div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-xs">
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="removeImage"
              />
            </q-card-actions>
          </q-card>
        </div>

        <div v-if="!logoImage" class="full-width text-center q-pa-md">
          <q-icon name="photo_library" size="3rem" color="grey-5" />
          <p class="text-grey-7 q-mt-sm">Nenhuma imagem adicionada</p>
        </div>
      </div>
    </div>
    <div class="row justify-center full-width">
      <q-btn label="Salvar Perfil" @click="saveProfile" color="primary" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useEnterpriseStore } from "src/stores/enterprise";
import { removeSpecialCharactersAndSpaces } from "src/utils/globalFunctions";
import { useRouter } from "vue-router";

defineOptions({
  name: "UpdateProfile",
  layout: "admin",
});

const authStore = useAuthStore(); // Obtém a store de autenticação
const user = ref(authStore.user); // Acessa o ID do usuário logado
const enterpriseStore = useEnterpriseStore();
const router = useRouter();

const form = ref({
  enterprise: "",
  primary_color: "",
  secondary_color: "",
});

const logoImage = ref(null);

const funFetchEnterprise = async () => {
  try {
    const respEnterprise = await enterpriseStore.fetchEnterpriseById(
      user.value.id
    );

    if (!respEnterprise) {
      throw new Error("Perfil não encontrado.");
    }

    form.value.enterprise = respEnterprise.enterprise;
    form.value.primary_color = respEnterprise.primary_color;
    form.value.secondary_color = respEnterprise.secondary_color;
    if (respEnterprise.logo_url) {
      logoImage.value = {
        url: respEnterprise.logo_url,
        name: "Logo Atual",
        isUploaded: true,
      };
    }
  } catch (err) {
    console.error("Erro ao buscar perfil ou propriedades:", err);
  }
};

const saveProfile = async () => {
  if (!user.value.id) {
    error.value = "Usuário não autenticado";
    return;
  }

  let logoFile = null;
  if (logoImage.value && !logoImage.value.isUploaded) {
    logoFile = logoImage.value.file;
  }

  await enterpriseStore.updateEnterprise(
    user.value.id,
    form.value.enterprise,
    removeSpecialCharactersAndSpaces(form.value.enterprise),
    form.value.primary_color,
    form.value.secondary_color,
    logoFile
  );

  // Atualiza o currentEnterpriseData na store
  await enterpriseStore.fetchEnterpriseById(user.value.id);

  router.push("/admin");
};

function onFileSelected(file) {
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      logoImage.value = {
        id: Date.now(),
        file: file,
        url: e.target.result,
        name: file.name,
        isUploaded: false,
      };
    };

    reader.readAsDataURL(file);
  }
}

function removeImage() {
  logoImage.value = null;
}

onMounted(async () => {
  funFetchEnterprise();
});
</script>

<style scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
