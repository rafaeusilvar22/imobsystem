import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import { setCssVar } from 'quasar'

export const useBrandColorsStore = defineStore('user', () => {
  const currentEnterpriseData = ref({
    themeColor: null
  })

  const loadThemeColor = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error('Error loading theme color:', error)
      return
    }

    currentEnterpriseData.value.themeColor = data
    setCssVar("primary", data.primary_color) // Define a cor dinamicamente
    setCssVar("secondary", data.secondary_color) // Define a cor dinamicamente
  }

  return {
    currentEnterpriseData,
    loadThemeColor
  }
})
