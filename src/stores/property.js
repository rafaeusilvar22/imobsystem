import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useQuasar } from 'quasar'
import { useAuthStore } from './auth'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref([])
  const loading = ref(false)
  const error = ref(null)
  const $q = useQuasar()

  async function fetchProperties(userId) {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (err) throw err

      properties.value = data
    } catch (err) {
      console.error('Error fetching properties:', err)
      error.value = err.message
      $q.notify({
        type: 'negative',
        message: `Erro ao carregar imóveis: ${err.message}`
      })
    } finally {
      loading.value = false
    }
  }

  async function fetchPropertiesByUserId() {
    const authStore = useAuthStore(); // Obtém a store de autenticação
    const userId = authStore.user?.id; // Acessa o ID do usuário

    if (!userId) {
      error.value = 'Usuário não autenticado';
      return;
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (err) throw err;

      properties.value = data;

      console.log('Properties:', properties.value);
    } catch (err) {
      error.value = err.message;
      $q.notify({
        type: 'negative',
        message: `Erro ao carregar imóveis: ${err.message}`
      });
    } finally {
      loading.value = false;
    }
  }


  async function getPropertyById(id) {
    try {
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (err) throw err

      return data
    } catch (err) {
      console.error('Error fetching property:', err)
      $q.notify({
        type: 'negative',
        message: `Erro ao carregar imóvel: ${err.message}`
      })
      return null
    }
  }

  async function addProperty(property) {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('Usuário não autenticado')
      }

      // Add user_id to the property data
      const propertyWithUserId = {
        ...property,
        user_id: authStore.user.id
      }

      const { data, error: err } = await supabase
        .from('properties')
        .insert(propertyWithUserId)
        .select()

      if (err) throw err

      properties.value.unshift(data[0])

      $q.notify({
        type: 'positive',
        message: 'Imóvel cadastrado com sucesso'
      })

      return data[0]
    } catch (err) {
      console.error('Error adding property:', err)
      error.value = err.message
      $q.notify({
        type: 'negative',
        message: `Erro ao cadastrar imóvel: ${err.message}`
      })
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProperty(id, updatedProperty) {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()

      if (!authStore.user) {
        throw new Error('Usuário não autenticado')
      }

      // Add user_id to the property data
      const propertyWithUserId = {
        ...updatedProperty,
        user_id: authStore.user.id
      }

      const { data, error: err } = await supabase
        .from('properties')
        .update(propertyWithUserId)
        .eq('id', id)
        .select()

      if (err) throw err

      const index = properties.value.findIndex(property => property.id === id)
      if (index !== -1) {
        properties.value[index] = data[0]
      }

      $q.notify({
        type: 'positive',
        message: 'Imóvel atualizado com sucesso'
      })

      return data[0]
    } catch (err) {
      console.error('Error updating property:', err)
      error.value = err.message
      $q.notify({
        type: 'negative',
        message: `Erro ao atualizar imóvel: ${err.message}`
      })
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteProperty(id) {
    loading.value = true
    error.value = null

    try {
      const { error: err } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (err) throw err

      properties.value = properties.value.filter(property => property.id !== id)

      $q.notify({
        type: 'positive',
        message: 'Imóvel excluído com sucesso'
      })

      return true
    } catch (err) {
      console.error('Error deleting property:', err)
      error.value = err.message
      $q.notify({
        type: 'negative',
        message: `Erro ao excluir imóvel: ${err.message}`
      })
      return false
    } finally {
      loading.value = false
    }
  }

  function getFilteredProperties(filters) {
    let filteredProps = [...properties.value]

    if (filters.type) {
      filteredProps = filteredProps.filter(p => p.type === filters.type)
    }

    if (filters.minPrice) {
      filteredProps = filteredProps.filter(p => p.price >= filters.minPrice)
    }

    if (filters.maxPrice) {
      filteredProps = filteredProps.filter(p => p.price <= filters.maxPrice)
    }

    if (filters.bedrooms) {
      filteredProps = filteredProps.filter(p => p.bedrooms >= filters.bedrooms)
    }

    if (filters.city) {
      filteredProps = filteredProps.filter(p =>
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    return filteredProps
  }

  async function uploadPropertyImage(file, propertyId) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}.${fileExt}`
      const filePath = `properties/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      $q.notify({
        type: 'negative',
        message: `Erro ao fazer upload da imagem: ${err.message}`
      })
      return null
    }
  }

  return {
    properties,
    loading,
    error,
    fetchPropertiesByUserId,
    fetchProperties,
    getPropertyById,
    addProperty,
    updateProperty,
    deleteProperty,
    getFilteredProperties,
    uploadPropertyImage
  }
})
