import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'
import { useQuasar } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const $q = useQuasar()

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    loading.value = true

    try {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        user.value = data.session.user
      }
    } catch (err) {
      console.error('Error initializing auth:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }

  }

  async function updateProfile(userId, enterprise, fullName, primaryColor, secondaryColor) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        enterprise: enterprise,
        full_name: fullName,
        primary_color: primaryColor,
        secondary_color: secondaryColor
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return null;
    }

    return data;
  };

  async function fetchProfile(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return data;
  };

  async function register(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password
      })

      if (err) throw err

      user.value = data.user

      $q.notify({
        type: 'positive',
        message: 'Registro realizado com sucesso!'
      })

      return data
    } catch (err) {
      console.error('Error registering:', err)
      error.value = err.message

      $q.notify({
        type: 'negative',
        message: `Erro ao registrar: ${err.message}`
      })

      return null
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (err) throw err

      user.value = data.user

      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!'
      })

      return data
    } catch (err) {
      console.error('Error logging in:', err)
      error.value = err.message

      $q.notify({
        type: 'negative',
        message: `Erro ao fazer login: ${err.message}`
      })

      return null
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase.auth.signOut()

      if (err) throw err

      user.value = null

      $q.notify({
        type: 'positive',
        message: 'Logout realizado com sucesso!'
      })

      return true
    } catch (err) {
      console.error('Error logging out:', err)
      error.value = err.message

      $q.notify({
        type: 'negative',
        message: `Erro ao fazer logout: ${err.message}`
      })

      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    updateProfile,
    fetchProfile,
    isAuthenticated,
    initialize,
    register,
    login,
    logout
  }
})
