<template>
  <q-page>
    <div class="bg-primary text-white">
      <div class="container q-pa-xl">
        <h1 class="text-h2 text-weight-bold q-mb-md">
          Encontre o imóvel dos seus sonhos
        </h1>
        <p class="text-h5 q-mb-xl">
          Milhares de opções para compra e aluguel em todo o Brasil
        </p>

        <q-card class="search-card q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="searchQuery"
                outlined
                dense
                placeholder="Busque por cidade ou título do imóvel"
                bg-color="white"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="selectedType"
                :options="[
                  { label: 'Todos os tipos', value: null },
                  { label: 'Venda', value: 'sale' },
                  { label: 'Aluguel', value: 'rent' },
                ]"
                outlined
                dense
                map-options
                emit-value
                label="Tipo"
                bg-color="white"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Featured Properties -->
    <div class="q-pa-md q-mt-lg">
      <div class="text-center">
        <h2 class="text-h4 q-mb-xs">Imóveis em Destaque</h2>
        <p class="text-subtitle1 q-mb-lg">
          Confira nossas melhores opções selecionadas para você
        </p>
      </div>

      <div v-if="propertyStore.loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-sm">Carregando imóveis...</p>
      </div>

      <div
        v-else-if="featuredProperties.length === 0"
        class="text-center q-pa-xl"
      >
        <q-icon name="apartment" size="4rem" color="grey-5" />
        <p class="text-h6 q-mt-md">Nenhum imóvel em destaque no momento</p>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div
          v-for="property in featuredProperties"
          :key="property.id"
          class="col-12 col-md-4"
        >
          <q-card
            class="property-card cursor-pointer"
            @click="viewPropertyDetails(property.id)"
          >
            <q-img
              :src="
                property.images && property.images.length > 0
                  ? property.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'
              "
              :ratio="16 / 9"
              basic
            >
              <div class="absolute-top-left bg-transparent q-pa-sm">
                <q-badge color="secondary" v-if="property.featured">
                  Destaque
                </q-badge>
              </div>

              <div class="absolute-top-right bg-transparent q-pa-sm">
                <q-badge color="primary" v-if="property.type === 'sale'">
                  Venda
                </q-badge>
                <q-badge color="accent" v-else> Aluguel </q-badge>
              </div>

              <div
                class="absolute-bottom text-subtitle2 text-center"
                style="background-color: rgba(0, 0, 0, 0.7)"
              >
                {{ property.city }}, {{ property.state }}
              </div>
            </q-img>

            <q-card-section>
              <div class="text-h6 ellipsis-2-lines">{{ property.title }}</div>
              <div class="text-subtitle1 text-primary q-mt-sm">
                {{ formattedCurrency(property.price) }}
              </div>

              <div class="row q-mt-md">
                <div class="col text-center">
                  <q-icon name="bed" size="sm" />
                  <div class="text-caption">
                    {{ property.bedrooms }} quartos
                  </div>
                </div>
                <div class="col text-center">
                  <q-icon name="bathroom" size="sm" />
                  <div class="text-caption">
                    {{ property.bathrooms }} banheiros
                  </div>
                </div>
                <div class="col text-center">
                  <q-icon name="square_foot" size="sm" />
                  <div class="text-caption">{{ property.area }} m²</div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                color="primary"
                label="Ver detalhes"
                class="full-width"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- All Properties -->
    <div class="q-pa-md q-mt-lg">
      <div class="text-center">
        <h2 class="text-h4 q-mb-xs">Todos os Imóveis</h2>
        <p class="text-subtitle1 q-mb-lg">
          {{ filteredProperties.length }} imóveis encontrados
          <span v-if="searchQuery || selectedType">
            com os filtros aplicados
          </span>
        </p>
      </div>

      <div v-if="propertyStore.loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-sm">Carregando imóveis...</p>
      </div>

      <div
        v-else-if="filteredProperties.length === 0"
        class="text-center q-pa-xl"
      >
        <q-icon name="search_off" size="4rem" color="grey-5" />
        <p class="text-h6 q-mt-md">
          Nenhum imóvel encontrado com os filtros aplicados
        </p>
        <q-btn
          color="primary"
          label="Limpar filtros"
          @click="clearFilters"
          class="q-mt-md"
        />
      </div>

      <div v-else class="row q-col-gutter-md">
        <div
          v-for="property in filteredProperties"
          :key="property.id"
          class="col-12 col-md-4 col-lg-3"
        >
          <q-card
            class="property-card cursor-pointer"
            @click="viewPropertyDetails(property.id)"
          >
            <q-img
              :src="
                property.images && property.images.length > 0
                  ? property.images[0]
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'
              "
              :ratio="16 / 9"
              basic
            >
              <div class="absolute-top-right bg-transparent q-pa-sm">
                <q-badge color="primary" v-if="property.type === 'sale'">
                  Venda
                </q-badge>
                <q-badge color="accent" v-else> Aluguel </q-badge>
              </div>
            </q-img>

            <q-card-section>
              <div class="text-h6 ellipsis-2-lines">{{ property.title }}</div>
              <div class="text-subtitle2">
                {{ property.city }}, {{ property.state }}
              </div>
              <div class="text-subtitle1 text-primary q-mt-sm">
                {{ formattedCurrency(property.price) }}
              </div>

              <div class="row q-mt-md">
                <div class="col text-center">
                  <q-icon name="bed" size="sm" />
                  <div class="text-caption">{{ property.bedrooms }}</div>
                </div>
                <div class="col text-center">
                  <q-icon name="bathroom" size="sm" />
                  <div class="text-caption">{{ property.bathrooms }}</div>
                </div>
                <div class="col text-center">
                  <q-icon name="square_foot" size="sm" />
                  <div class="text-caption">{{ property.area }} m²</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <!-- <div class="bg-secondary text-white q-pa-xl q-mt-xl text-center">
      <h2 class="text-h4 q-mb-md">Tem um imóvel para vender ou alugar?</h2>
      <p class="text-h6 q-mb-lg">Cadastre seu imóvel em nossa plataforma e alcance milhares de potenciais compradores e
        inquilinos.</p>
      <q-btn color="white" text-color="secondary" label="Cadastrar Imóvel" size="lg" to="/admin/properties/create" />
    </div> -->
  </q-page>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { formattedCurrency } from "src/utils/globalFunctions";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useEnterpriseStore } from "../stores/enterprise";
import { usePropertyStore } from "../stores/property";

defineOptions({
  name: "HomePage",
  layout: "default",
});

const authStore = useAuthStore();
const propertyStore = usePropertyStore();
const enterpriseStore = useEnterpriseStore();
const router = useRouter();

const enterpriseData = computed(() => enterpriseStore.currentEnterpriseData);
const searchQuery = ref("");
const selectedType = ref(null);

const funFetchProperties = async () => {
  try {
    if (enterpriseData.value && enterpriseData.value.id) {
      await propertyStore.fetchProperties(enterpriseData.value.id);
    }
  } catch (err) {
    console.error("Erro ao buscar perfil ou propriedades:", err);
  }
};

// Observa quando enterpriseData está disponível para buscar propriedades
watch(
  enterpriseData,
  (newValue) => {
    if (newValue && newValue.id) {
      funFetchProperties();
    }
  },
  { immediate: true }
);

const featuredProperties = computed(() => {
  return propertyStore.properties.filter((p) => p.featured);
});

const filteredProperties = computed(() => {
  let filtered = propertyStore.properties;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
    );
  }

  if (selectedType.value) {
    filtered = filtered.filter((p) => p.type === selectedType.value);
  }

  return filtered;
});

function viewPropertyDetails(id) {
  router.push(`/property/${id}`);
}
</script>
