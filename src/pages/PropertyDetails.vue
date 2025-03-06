<template>
  <q-page padding>
    <div v-if="loading" class="flex flex-center" style="height: 400px">
      <q-spinner color="primary" size="3em" />
      <span class="q-ml-sm">Carregando imóvel...</span>
    </div>

    <div v-else-if="property">
      <div class="q-mb-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el
            label="Início"
            icon="home"
            @click="handleGoToPage('/home')"
          />
          <q-breadcrumbs-el :label="property.title" />
        </q-breadcrumbs>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Property Images -->
        <div class="col-12 col-md-8">
          <q-carousel
            v-model="slide"
            animated
            arrows
            navigation
            infinite
            height="400px"
            class="rounded-borders"
          >
            <q-carousel-slide
              v-for="(image, index) in property.images &&
              property.images.length > 0
                ? property.images
                : [
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
                  ]"
              :key="index"
              :name="index + 1"
            >
              <q-img :src="image" style="height: 100%" />
            </q-carousel-slide>
          </q-carousel>
        </div>

        <!-- Property Info -->
        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h4">{{ property.title }}</div>
              <div class="text-subtitle1">{{ property.address }}</div>
              <div class="text-subtitle2">
                {{ property.city }}, {{ property.state }} -
                {{ property.zipCode }}
              </div>

              <q-chip
                :color="getStatusColor(property.status)"
                text-color="white"
                class="q-mt-sm"
              >
                {{ getStatusLabel(property.status) }}
              </q-chip>

              <q-chip
                :color="property.type === 'sale' ? 'primary' : 'secondary'"
                text-color="white"
              >
                {{ property.type === "sale" ? "Venda" : "Aluguel" }}
              </q-chip>

              <div class="text-h4 text-primary q-mt-md">
                {{ formattedCurrency(property.price) }}
              </div>

              <q-separator class="q-my-md" />

              <div class="row q-col-gutter-sm">
                <div class="col-4 text-center">
                  <q-icon name="bed" size="md" />
                  <div class="text-body1">{{ property.bedrooms }}</div>
                  <div class="text-caption">Quartos</div>
                </div>
                <div class="col-4 text-center">
                  <q-icon name="bathroom" size="md" />
                  <div class="text-body1">{{ property.bathrooms }}</div>
                  <div class="text-caption">Banheiros</div>
                </div>
                <div class="col-4 text-center">
                  <q-icon name="square_foot" size="md" />
                  <div class="text-body1">{{ property.area }}</div>
                  <div class="text-caption">m²</div>
                </div>
              </div>

              <q-separator class="q-my-md" />

              <q-btn
                color="primary"
                class="full-width q-mb-sm"
                label="Entrar em contato"
                icon="phone"
                @click="contactOwner"
              />

              <q-btn
                outline
                color="secondary"
                class="full-width"
                label="Agendar visita"
                icon="event"
                @click="contactOwner"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Property Description -->
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h5 q-mb-md">Descrição</div>
          <p class="text-body1">{{ property.description }}</p>
        </q-card-section>
      </q-card>

      <!-- Location -->
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h5 q-mb-md">Localização</div>
          <div class="text-body1">
            <p><strong>Endereço:</strong> {{ property.address }}</p>
            <p><strong>Cidade:</strong> {{ property.city }}</p>
            <p><strong>Estado:</strong> {{ property.state }}</p>
            <p><strong>CEP:</strong> {{ property.zipCode }}</p>
          </div>
        </q-card-section>
      </q-card>

      <!-- Similar Properties -->
      <div v-if="similarProperties.length > 0" class="q-mt-xl">
        <h3 class="text-h5 q-mb-md">Imóveis Similares</h3>
        <q-separator class="q-mb-md" />

        <div class="row q-col-gutter-md">
          <div
            v-for="similarProperty in similarProperties"
            :key="similarProperty.id"
            class="col-12 col-md-4"
          >
            <q-card class="property-card">
              <q-img
                :src="
                  similarProperty.images && similarProperty.images.length > 0
                    ? similarProperty.images[0]
                    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'
                "
                :ratio="16 / 9"
                basic
              >
                <div class="absolute-top-right q-pa-sm">
                  <q-badge
                    color="primary"
                    v-if="similarProperty.type === 'sale'"
                  >
                    Venda
                  </q-badge>
                  <q-badge color="secondary" v-else> Aluguel </q-badge>
                </div>
              </q-img>

              <q-card-section>
                <div class="text-h6">{{ similarProperty.title }}</div>
                <div class="text-subtitle2">
                  {{ similarProperty.city }}, {{ similarProperty.state }}
                </div>
                <div class="text-h5 text-primary q-mt-sm">
                  {{ formattedCurrency(similarProperty.price) }}
                </div>
              </q-card-section>

              <q-card-actions>
                <q-btn
                  flat
                  color="primary"
                  label="Ver detalhes"
                  @click="router.push(`/property/${similarProperty.id}`)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-icon name="error_outline" size="4rem" color="negative" />
      <p class="text-h5 q-mt-md">Imóvel não encontrado</p>
      <q-btn
        color="primary"
        label="Voltar para a página inicial"
        to="/"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePropertyStore } from "../stores/property";
import { useEnterpriseStore } from "../stores/enterprise";
import { formattedCurrency } from "src/utils/globalFunctions";
import { useGotoRouter } from "src/composables/goToRouter";
import { useAuthStore } from "../stores/auth";
import { useQuasar } from "quasar";

defineOptions({
  name: "PropertyDetails",
  layout: "main",
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const propertyStore = usePropertyStore();
const enterpriseStore = useEnterpriseStore();
const { handleGoToPage } = useGotoRouter();
const $q = useQuasar();

const enterpriseData = enterpriseStore.currentEnterpriseData;
const property = ref(null);
const userId = ref(null);
const loading = ref(true);
const slide = ref(1);
const similarProperties = ref([]);

onMounted(async () => {
  await loadProperty();
});

async function loadProperty() {
  loading.value = true;
  try {
    const propertyData = await propertyStore.getPropertyById(route.params.id);
    if (!propertyData) {
      $q.notify({
        type: "negative",
        message: "Imóvel não encontrado",
      });
      router.push("/");
      return;
    }
    property.value = propertyData;
    userId.value = propertyData.user_id;
    // Load similar properties

    await propertyStore.fetchProperties(userId.value);
    similarProperties.value = propertyStore.properties
      .filter(
        (p) =>
          p.id !== property.value.id &&
          p.type === property.value.type &&
          p.bedrooms >= property.value.bedrooms - 1 &&
          p.bedrooms <= property.value.bedrooms + 1
      )
      .slice(0, 3);
  } catch (error) {
    console.error("Error loading property:", error);
    $q.notify({
      type: "negative",
      message: "Erro ao carregar o imóvel",
    });
  } finally {
    loading.value = false;
  }
}

function formatPrice(price, type) {
  if (!price || !type) return "";
  return type === "rent"
    ? `R$ ${price.toLocaleString("pt-BR")}/mês`
    : `R$ ${price.toLocaleString("pt-BR")}`;
}

function getStatusLabel(status) {
  if (!status) return "";
  const statusMap = {
    available: "Disponível",
    sold: "Vendido",
    rented: "Alugado",
    reserved: "Reservado",
  };
  return statusMap[status] || status;
}

function getStatusColor(status) {
  if (!status) return "";
  const colorMap = {
    available: "positive",
    sold: "negative",
    rented: "secondary",
    reserved: "warning",
  };
  return colorMap[status] || "grey";
}

function contactOwner() {
  $q.dialog({
    title: "Contato",
    message: "Deseja entrar em contato sobre este imóvel?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: "positive",
      message: "Solicitação enviada! Em breve entraremos em contato.",
    });
  });
}
</script>
