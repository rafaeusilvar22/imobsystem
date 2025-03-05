<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Dashboard</h1>

    <div v-if="propertyStore.loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-sm">Carregando dados...</p>
    </div>

    <template v-else>
      <div class="row q-col-gutter-md">
        <!-- Total Properties -->
        <div class="col-12 col-md-4">
          <q-card class="bg-primary text-white">
            <q-card-section>
              <div class="text-h6">Total de Imóveis</div>
              <div class="text-h3">{{ totalProperties }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- For Sale -->
        <div class="col-12 col-md-4">
          <q-card class="bg-secondary text-white">
            <q-card-section>
              <div class="text-h6">À Venda</div>
              <div class="text-h3">{{ forSaleCount }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- For Rent -->
        <div class="col-12 col-md-4">
          <q-card class="bg-accent text-white">
            <q-card-section>
              <div class="text-h6">Para Alugar</div>
              <div class="text-h3">{{ forRentCount }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <!-- Available -->
        <div class="col-12 col-md-4">
          <q-card class="bg-positive text-white">
            <q-card-section>
              <div class="text-h6">Disponíveis</div>
              <div class="text-h3">{{ availableCount }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sold -->
        <div class="col-12 col-md-4">
          <q-card class="bg-negative text-white">
            <q-card-section>
              <div class="text-h6">Vendidos</div>
              <div class="text-h3">{{ soldCount }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Rented -->
        <div class="col-12 col-md-4">
          <q-card class="bg-info text-white">
            <q-card-section>
              <div class="text-h6">Alugados</div>
              <div class="text-h3">{{ rentedCount }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-h5">Ações Rápidas</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-btn
                color="primary"
                icon="add"
                label="Adicionar Imóvel"
                class="full-width"
                to="/admin/properties/create"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                color="secondary"
                icon="list"
                label="Listar Imóveis"
                class="full-width"
                to="/admin/properties"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                color="accent"
                icon="edit"
                label="Editar Informações"
                class="full-width"
                to="/admin/update-profile"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { usePropertyStore } from '../../stores/property'

const propertyStore = usePropertyStore()

onMounted(async () => {
  await propertyStore.fetchPropertiesByUserId()
})

const totalProperties = computed(() => propertyStore.properties.length)
const forSaleCount = computed(() => propertyStore.properties.filter(p => p.type === 'sale').length)
const forRentCount = computed(() => propertyStore.properties.filter(p => p.type === 'rent').length)
const availableCount = computed(() => propertyStore.properties.filter(p => p.status === 'available').length)
const soldCount = computed(() => propertyStore.properties.filter(p => p.status === 'sold').length)
const rentedCount = computed(() => propertyStore.properties.filter(p => p.status === 'rented').length)
</script>
