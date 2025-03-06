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

            <div class="col-12 col-md-3">
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

            <div class="col-12 col-md-3">
              <q-btn
                color="secondary"
                class="full-width"
                label="Filtros avançados"
                icon="filter_list"
                @click="toggleFilters"
              />
            </div>
          </div>

          <q-slide-transition>
            <div v-show="showFilters" class="q-mt-md">
              <q-separator class="q-my-md" />

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <p class="q-mb-sm">Faixa de preço:</p>
                  <q-range
                    v-model="priceRange"
                    :min="0"
                    :max="5000000"
                    :step="50000"
                    label
                    label-always
                    color="secondary"
                    :left-label-value="`R$ ${priceRange[0].toLocaleString(
                      'pt-BR'
                    )}`"
                    :right-label-value="`R$ ${priceRange[1].toLocaleString(
                      'pt-BR'
                    )}`"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    v-model="selectedBedrooms"
                    :options="[
                      { label: 'Qualquer quantidade', value: null },
                      { label: '1+ quartos', value: 1 },
                      { label: '2+ quartos', value: 2 },
                      { label: '3+ quartos', value: 3 },
                      { label: '4+ quartos', value: 4 },
                    ]"
                    outlined
                    dense
                    map-options
                    emit-value
                    label="Quartos"
                    bg-color="white"
                  />
                </div>
              </div>

              <div class="row q-mt-md">
                <div class="col-12 text-right">
                  <q-btn
                    flat
                    label="Limpar filtros"
                    color="grey-7"
                    @click="clearFilters"
                    class="q-mr-sm"
                  />
                  <q-btn
                    color="primary"
                    label="Aplicar filtros"
                    @click="toggleFilters"
                  />
                </div>
              </div>
            </div>
          </q-slide-transition>
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
          <span
            v-if="
              searchQuery ||
              selectedType ||
              selectedBedrooms ||
              priceRange[0] > 0 ||
              priceRange[1] < 5000000
            "
          >
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
import { ref, onMounted, computed } from "vue";
import { formattedCurrency } from "src/utils/globalFunctions";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
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
const route = useRoute();

const enterpriseData = enterpriseStore.currentEnterpriseData;
const searchQuery = ref("");
const priceRange = ref([0, 5000000]);
const selectedType = ref(null);
const selectedBedrooms = ref(null);
const showFilters = ref(false);

onMounted(async () => {
  await funFetchProperties();
  console.log(enterpriseData);
});

const featuredProperties = computed(() => {
  return propertyStore.properties.filter((p) => p.featured);
});

const filteredProperties = computed(() => {
  let filtered = propertyStore.properties;

  // Filter by search query (title or city)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
    );
  }

  // Filter by price range
  filtered = filtered.filter(
    (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]
  );

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter((p) => p.type === selectedType.value);
  }

  // Filter by bedrooms
  if (selectedBedrooms.value) {
    filtered = filtered.filter((p) => p.bedrooms >= selectedBedrooms.value);
  }

  return filtered;
});

// Busca o perfil e as propriedades do usuário
const funFetchProperties = async () => {
  try {
    await propertyStore.fetchProperties(enterpriseData.id);
  } catch (err) {
    console.error("Erro ao buscar perfil ou propriedades:", err);
  }
};

function viewPropertyDetails(id) {
  router.push(`/property/${id}`);
}

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function clearFilters() {
  searchQuery.value = "";
  priceRange.value = [0, 5000000];
  selectedType.value = null;
  selectedBedrooms.value = null;
}
</script>
