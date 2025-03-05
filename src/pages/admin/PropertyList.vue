<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <h1 class="text-h4 q-my-none">Gerenciar Imóveis</h1>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Novo Imóvel" @click="createProperty" />
      </div>
    </div>

    <q-card>
      <q-card-section>
        <q-input v-model="filter" dense clearable outlined placeholder="Buscar imóveis..." class="q-mb-md">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table :rows="propertyStore.properties" :columns="columns" row-key="id" :filter="filter"
          :loading="propertyStore.loading">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="props.row.status === 'available' ? 'positive' :
                props.row.status === 'sold' ? 'negative' :
                  props.row.status === 'rented' ? 'secondary' : 'warning'
                " text-color="white" dense>
                {{ getStatusLabel(props.row.status) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-chip :color="props.row.type === 'sale' ? 'primary' : 'accent'" text-color="white" dense>
                {{ getTypeLabel(props.row.type) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn flat round color="primary" icon="edit" size="sm" @click="editProperty(props.row.id)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>

              <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row.id)">
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>

              <q-btn flat round color="secondary" icon="visibility" size="sm" :to="`/property/${props.row.id}`">
                <q-tooltip>Visualizar</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md">
              <q-icon name="apartment" size="2em" color="grey-7" />
              <span class="q-ml-sm">Nenhum imóvel encontrado</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { usePropertyStore } from 'src/stores/property'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const propertyStore = usePropertyStore()
const router = useRouter()
const $q = useQuasar()

const filter = ref('')

onMounted(async () => {
  await propertyStore.fetchPropertiesByUserId()
})

function editProperty(id) {
  router.push(`/admin/properties/edit/${id}`)
}

function createProperty() {
  router.push('/admin/properties/create')
}

function confirmDelete(id) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await deleteProperty(id)
  })
}

async function deleteProperty(id) {
  await propertyStore.deleteProperty(id)
}

function getStatusLabel(status) {
  const statusMap = {
    'available': 'Disponível',
    'sold': 'Vendido',
    'rented': 'Alugado',
    'reserved': 'Reservado'
  }

  return statusMap[status] || status
}

function getTypeLabel(type) {
  return type === 'sale' ? 'Venda' : 'Aluguel'
}

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true
  },
  {
    name: 'title',
    required: true,
    label: 'Título',
    align: 'left',
    field: 'title',
    sortable: true
  },
  {
    name: 'type',
    required: true,
    label: 'Tipo',
    align: 'left',
    field: row => getTypeLabel(row.type),
    sortable: true
  },
  {
    name: 'price',
    required: true,
    label: 'Preço',
    align: 'right',
    field: 'price',
    format: val => `R$ ${val.toLocaleString('pt-BR')}`,
    sortable: true
  },
  {
    name: 'city',
    required: true,
    label: 'Cidade',
    align: 'left',
    field: 'city',
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: row => getStatusLabel(row.status),
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Ações',
    align: 'center',
    field: 'actions'
  }
]
</script>
