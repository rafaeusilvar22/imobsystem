<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <h1 class="text-h4 q-my-none">{{ pageTitle }}</h1>
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="arrow_back" label="Voltar" @click="onCancel" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-sm">Carregando dados do imóvel...</p>
    </div>

    <q-form v-else @submit.prevent="onSubmit" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Informações Básicas</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="property.title" label="Título *" outlined
                :rules="[val => !!val || 'Título é obrigatório']" />
            </div>

            <div class="col-12">
              <q-input v-model="property.description" label="Descrição *" type="textarea" outlined rows="4"
                :rules="[val => !!val || 'Descrição é obrigatória']" />
            </div>

            <div class="col-12 col-md-6">
              <q-select v-model="property.type" :options="[
                { label: 'Venda', value: 'sale' },
                { label: 'Aluguel', value: 'rent' }
              ]" label="Tipo *" outlined map-options emit-value :rules="[val => !!val || 'Tipo é obrigatório']" />
            </div>

            <div class="col-12 col-md-6">
              <q-select v-model="property.status" :options="[
                { label: 'Disponível', value: 'available' },
                { label: 'Vendido', value: 'sold' },
                { label: 'Alugado', value: 'rented' },
                { label: 'Reservado', value: 'reserved' }
              ]" label="Status *" outlined map-options emit-value :rules="[val => !!val || 'Status é obrigatório']" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model.number="property.price" label="Preço *" type="number" outlined prefix="R$ " :rules="[
                val => val !== null && val !== undefined || 'Preço é obrigatório',
                val => val >= 0 || 'Preço deve ser maior ou igual a zero'
              ]" />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle v-model="property.featured" label="Destacar imóvel na página inicial" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Características</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input v-model.number="property.bedrooms" label="Quartos *" type="number" outlined :rules="[
                val => val !== null && val !== undefined || 'Número de quartos é obrigatório',
                val => val >= 0 || 'Número de quartos deve ser maior ou igual a zero'
              ]" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model.number="property.bathrooms" label="Banheiros *" type="number" outlined :rules="[
                val => val !== null && val !== undefined || 'Número de banheiros é obrigatório',
                val => val >= 0 || 'Número de banheiros deve ser maior ou igual a zero'
              ]" />
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model.number="property.area" label="Área (m²) *" type="number" outlined suffix=" m²" :rules="[
                val => val !== null && val !== undefined || 'Área é obrigatória',
                val => val >= 0 || 'Área deve ser maior ou igual a zero'
              ]" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Localização</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="property.address" label="Endereço *" outlined
                :rules="[val => !!val || 'Endereço é obrigatório']" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="property.city" label="Cidade *" outlined
                :rules="[val => !!val || 'Cidade é obrigatória']" />
            </div>

            <div class="col-12 col-md-3">
              <q-select v-model="property.state" :options="states" label="Estado *" outlined
                :rules="[val => !!val || 'Estado é obrigatório']" />
            </div>

            <div class="col-12 col-md-3">
              <q-input v-model="property.zipCode" label="CEP *" outlined mask="#####-###"
                :rules="[val => !!val || 'CEP é obrigatório']" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">Imagens</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-file multiple accept=".jpg, .jpeg, .png" label="Adicionar imagens" outlined
            @update:model-value="onFileSelected" clearable counter bottom-slots>
            <template v-slot:prepend>
              <q-icon name="add_photo_alternate" />
            </template>
            <template v-slot:hint>
              Formatos aceitos: JPG, JPEG, PNG
            </template>
          </q-file>

          <div class="row q-col-gutter-md q-mt-md">
            <div v-for="(image, index) in uploadedImages" :key="image.id" class="col-6 col-md-3">
              <q-card>
                <q-img :src="image.url" :ratio="1" />

                <q-card-section class="q-pa-xs">
                  <div class="text-caption ellipsis">{{ image.name }}</div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-xs">
                  <q-btn flat round color="negative" icon="delete" size="sm" @click="removeImage(index)" />
                </q-card-actions>
              </q-card>
            </div>

            <div v-if="uploadedImages.length === 0" class="col-12 text-center q-pa-md">
              <q-icon name="photo_library" size="3rem" color="grey-5" />
              <p class="text-grey-7 q-mt-sm">Nenhuma imagem adicionada</p>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-mt-lg">
        <div class="col-12 text-right">
          <q-btn flat label="Cancelar" color="grey-7" @click="onCancel" class="q-mr-sm" />
          <q-btn type="submit" label="Salvar" color="primary" :loading="saving" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyStore } from '../../stores/property'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'PropertyForm',
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const propertyStore = usePropertyStore()
const $q = useQuasar()

const isEdit = computed(() => route.params.id !== undefined)
const pageTitle = computed(() => isEdit.value ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel')

const property = ref({
  title: '',
  description: '',
  price: 0,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  images: [],
  type: 'sale',
  status: 'available',
  featured: false
})

const uploadedImages = ref([])
const loading = ref(false)
const saving = ref(false)

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

onMounted(async () => {
  if (isEdit.value) {
    await loadProperty()
  }
})

async function loadProperty() {
  loading.value = true

  try {
    const propertyData = await propertyStore.getPropertyById(route.params.id)

    if (!propertyData) {
      $q.notify({
        type: 'negative',
        message: 'Imóvel não encontrado'
      })
      router.push('/admin/properties')
      return
    }

    property.value = { ...propertyData }

    // Convert images to file objects for preview
    if (property.value.images && property.value.images.length > 0) {
      uploadedImages.value = property.value.images.map((url, index) => ({
        id: index,
        url,
        name: `Imagem ${index + 1}`,
        isUploaded: true
      }))
    }
  } catch (error) {
    console.error('Error loading property:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar o imóvel'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  saving.value = true

  try {
    // Upload new images first
    const newImageUrls = []

    for (const file of uploadedImages.value) {
      if (!file.isUploaded && file.file) {
        // Generate a temporary ID if we're creating a new property
        const tempId = isEdit.value ? route.params.id : Date.now().toString()
        const imageUrl = await propertyStore.uploadPropertyImage(file.file, tempId)

        if (imageUrl) {
          newImageUrls.push(imageUrl)
        }
      } else if (file.isUploaded && file.url) {
        // Keep existing uploaded images
        newImageUrls.push(file.url)
      }
    }

    // Update property with new image URLs
    const propertyData = {
      ...property.value,
      images: newImageUrls
    }

    let result

    if (isEdit.value) {
      result = await propertyStore.updateProperty(route.params.id, propertyData)
    } else {
      result = await propertyStore.addProperty(propertyData)
    }

    if (result) {
      $q.notify({
        type: 'positive',
        message: isEdit.value ? 'Imóvel atualizado com sucesso' : 'Imóvel cadastrado com sucesso'
      })

      router.push('/admin/properties')
    }
  } catch (error) {
    console.error('Error saving property:', error)
    $q.notify({
      type: 'negative',
      message: `Erro ao ${isEdit.value ? 'atualizar' : 'cadastrar'} o imóvel`
    })
  } finally {
    saving.value = false
  }
}

function onCancel() {
  router.push('/admin/properties')
}

function onFileSelected(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()

    reader.onload = (e) => {
      uploadedImages.value.push({
        id: Date.now() + i,
        file: file,
        url: e.target.result,
        name: file.name,
        isUploaded: false
      })
    }

    reader.readAsDataURL(file)
  }
}

function removeImage(index) {
  uploadedImages.value.splice(index, 1)
}
</script>

<style scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
