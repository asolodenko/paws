<template>
  <VDialog
    v-model="dialogModel"
    max-width="800"
    persistent
  >
    <VCard>
      <VCardTitle class="text-h5 bg-primary">
        {{ isEditMode ? 'Edit Pet' : 'Add New Pet' }}
      </VCardTitle>
      
      <VCardText class="pt-4">
        <VForm ref="formRef" v-model="formValid">
          <VRow>
            <!-- Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.name"
                label="Name*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-paw"
              />
            </VCol>
            
            <!-- Breed -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.breed"
                label="Breed*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-dog"
              />
            </VCol>
            
            <!-- Gender -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.gender"
                label="Gender*"
                :items="genderOptions"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-gender-male-female"
              />
            </VCol>
            
            <!-- Coat Color -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.coatColor"
                label="Coat Color*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-palette"
              />
            </VCol>
            
            <!-- Birth Date -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.birthDate"
                label="Birth Date"
                type="date"
                prepend-inner-icon="mdi-calendar"
              />
            </VCol>
            
            <!-- Weight -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.weight"
                label="Weight (kg)"
                prepend-inner-icon="mdi-weight-kilogram"
              />
            </VCol>
            
            <!-- Image Upload -->
            <VCol cols="12">
              <VFileInput
                v-model="imageFile"
                label="Pet Image"
                accept="image/*"
                prepend-icon="mdi-camera"
                show-size
                @change="handleImageUpload"
              >
                <template #selection="{ fileNames }">
                  <VChip
                    v-if="fileNames.length > 0"
                    color="primary"
                    label
                    size="small"
                  >
                    {{ fileNames[0] }}
                  </VChip>
                </template>
              </VFileInput>
              
              <div v-if="imagePreview || formData.img" class="mt-2">
                <VImg
                  :src="imagePreview || formData.img"
                  max-height="200"
                  max-width="200"
                  class="rounded"
                />
              </div>
            </VCol>
            
            <!-- Temperament -->
            <VCol cols="12">
              <VTextField
                v-model="formData.temperament"
                label="Temperament"
                prepend-inner-icon="mdi-emoticon-happy"
                hint="e.g., Friendly, Energetic, Calm"
              />
            </VCol>
            
            <!-- Activity Level -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.activityLevel"
                label="Activity Level"
                :items="threeLevelOptions"
                prepend-inner-icon="mdi-run"
              />
            </VCol>
            
            <!-- Grooming Needs -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.groomingNeeds"
                label="Grooming Needs"
                :items="threeLevelOptions"
                prepend-inner-icon="mdi-content-cut"
              />
            </VCol>
            
            <!-- Health Condition -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.healthCondition"
                label="Health Condition"
                :items="healthOptions"
                prepend-inner-icon="mdi-medical-bag"
              />
            </VCol>
            
            <!-- Food Flavor -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.foodFlavor"
                label="Preferred Food Flavor"
                prepend-inner-icon="mdi-food"
              />
            </VCol>
            
            <!-- Toy Type -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.toyType"
                label="Favorite Toy Type"
                prepend-inner-icon="mdi-basketball"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      
      <VCardActions>
        <VSpacer />
        <VBtn
          color="grey"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!formValid"
          @click="submitForm"
        >
          {{ isEditMode ? 'Update' : 'Create' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Paw } from '@/model/Paw.model'

const props = defineProps<{
  modelValue: boolean
  pet?: Paw | null
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formRef = ref()
const formValid = ref(false)
const imageFile = ref<File[]>([])
const imagePreview = ref<string | null>(null)

const isEditMode = computed(() => !!props.pet)

const defaultFormData = {
  name: '',
  breed: '',
  gender: '',
  birthDate: '',
  weight: '',
  coatColor: '',
  img: '',
  temperament: '',
  activityLevel: '',
  groomingNeeds: '',
  healthCondition: '',
  foodFlavor: '',
  toyType: '',
}

const formData = ref({ ...defaultFormData })

const genderOptions = ['Male', 'Female']
const threeLevelOptions = ['low', 'moderate', 'high']
const healthOptions = ['healthy', 'underweight', 'overweight', 'dental issues']

const rules = {
  required: (value: string) => !!value || 'This field is required',
}

// Handle image file upload
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      formData.value.img = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Watch for pet changes to populate form in edit mode
watch(() => props.pet, (newPet) => {
  if (newPet) {
    formData.value = {
      name: newPet.name,
      breed: newPet.breed,
      gender: newPet.gender,
      birthDate: newPet.birthDate || '',
      weight: newPet.weight || '',
      coatColor: newPet.coatColor,
      img: newPet.img || '',
      temperament: newPet.temperament || '',
      activityLevel: newPet.activityLevel || '',
      groomingNeeds: newPet.groomingNeeds || '',
      healthCondition: newPet.healthCondition || '',
      foodFlavor: newPet.foodFlavor || '',
      toyType: newPet.toyType || '',
    }
    imagePreview.value = null
    imageFile.value = []
  } else {
    formData.value = { ...defaultFormData }
    imagePreview.value = null
    imageFile.value = []
  }
}, { immediate: true })

const closeDialog = () => {
  formData.value = { ...defaultFormData }
  imageFile.value = []
  imagePreview.value = null
  if (formRef.value) {
    formRef.value.reset()
  }
  emit('update:modelValue', false)
}

const submitForm = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (valid) {
      const petData = {
        ...formData.value,
        id: props.pet?.id,
      }
      emit('submit', petData)
    }
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}
</style>
