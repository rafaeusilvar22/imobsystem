<template>
  <q-card class="property-card cursor-pointer zoom-effect">
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
      <div
        class="absolute-bottom text-subtitle2 text-center"
        style="background-color: rgba(0, 0, 0, 0.7)"
      >
        {{ property.city }}, {{ property.state }}
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
          <q-icon name="fa-solid fa-bed" size="xs" color="secondary" />
          <div class="text-caption">{{ property.bedrooms }}</div>
        </div>
        <div class="col text-center">
          <q-icon name="fa-solid fa-toilet" size="xs" color="secondary" />
          <div class="text-caption">{{ property.bathrooms }}</div>
        </div>
        <div class="col text-center">
          <q-icon
            name="fa-solid fa-ruler-combined"
            size="xs"
            color="secondary"
          />
          <div class="text-caption">{{ property.area }} m²</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { formattedCurrency } from "src/utils/globalFunctions";

defineOptions({
  name: "RealEstateCard",
});

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
});
</script>
