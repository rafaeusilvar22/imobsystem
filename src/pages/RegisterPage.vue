<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'As senhas não coincidem'
    return
  }

  const result = await authStore.register(email.value, password.value)

  if (result) {
    router.push('/admin')
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Registrar</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input v-model="email" label="Email" type="email" outlined :rules="[
            val => !!val || 'Email é obrigatório',
            val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Email inválido'
          ]" />

          <q-input v-model="password" label="Senha" type="password" outlined :rules="[
            val => !!val || 'Senha é obrigatória',
            val => val.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
          ]" />

          <q-input v-model="confirmPassword" label="Confirmar Senha" type="password" outlined :rules="[
            val => !!val || 'Confirmação de senha é obrigatória',
            val => val === password || 'As senhas não coincidem'
          ]" />

          <div v-if="authStore.error" class="text-negative q-mb-md">
            {{ authStore.error }}
          </div>

          <div class="q-mt-md">
            <q-btn label="Registrar" type="submit" color="primary" class="full-width" :loading="authStore.loading" />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <p>Já tem uma conta?</p>
        <q-btn flat color="secondary" label="Fazer Login" @click="goToLogin" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
