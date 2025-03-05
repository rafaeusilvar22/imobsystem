<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[(val) => !!val || 'Email é obrigatório']"
          />

          <q-input
            v-model="password"
            label="Senha"
            type="password"
            outlined
            :rules="[(val) => !!val || 'Senha é obrigatória']"
          />

          <div class="q-mt-md">
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="authStore.loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- <q-card-section class="text-center q-pt-none">
        <p>Não tem uma conta?</p>
        <q-btn
          flat
          color="secondary"
          label="Registrar-se"
          @click="goToRegister"
        />
      </q-card-section> -->
    </q-card>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

defineOptions({
  name: "LoginPage",
});

const email = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

async function handleLogin() {
  const result = await authStore.login(email.value, password.value)

  if (result) {
    const redirectPath = route.query.redirect || '/admin'
    router.push(redirectPath)
  }
}

function goToRegister() {
  router.push('/register')
}
</script>
