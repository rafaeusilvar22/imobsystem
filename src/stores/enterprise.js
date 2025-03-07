import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import { setCssVar } from 'quasar'

export const useEnterpriseStore = defineStore('enterprise', () => {
  const currentEnterpriseData = ref(null)
  const enterpriseUrl = ref(null)

  const fetchEnterprise = async (url) => {
    try {
      const { data, error } = await supabase
        .from("enterprise")
        .select("*")
        .eq("identification_url", url)
        .single()

      if (error) throw error

      currentEnterpriseData.value = data
      enterpriseUrl.value = url

      localStorage.setItem('enterpriseUrl', url)


      // Define as cores dinamicamente
      if (data) {
        setCssVar("primary", data.primary_color)
        setCssVar("secondary", data.secondary_color)
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }
  const fetchEnterpriseById = async (id) => {
    try {
      const { data, error } = await supabase
        .from("enterprise")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error

      currentEnterpriseData.value = data

      // Define as cores dinamicamente
      if (data) {
        setCssVar("primary", data.primary_color)
        setCssVar("secondary", data.secondary_color)
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  async function updateEnterprise(userId, enterprise, identification_url, primaryColor, secondaryColor, logoFile) {
    try {
      let logoUrl = null;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`
        const filePath = `enterprise-logo/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('enterprise-logo')
          .upload(filePath, logoFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('enterprise-logo')
          .getPublicUrl(filePath)

        logoUrl = data.publicUrl
      }

      const { data, error } = await supabase
        .from('enterprise')
        .upsert({
          id: userId,
          identification_url: identification_url,
          enterprise: enterprise,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          logo_url: logoUrl
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return null;
      }

      localStorage.setItem("enterpriseUrl", currentEnterpriseData.value.identification_url);

      return data;

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return null;
    }
  };

  return {
    currentEnterpriseData,
    fetchEnterprise,
    updateEnterprise,
    fetchEnterpriseById
  }
}, {
  persist: {
    storage: localStorage,
  }
})
