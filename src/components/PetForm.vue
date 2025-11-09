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
            
            <!-- Birth Date -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.birthDate"
                label="Birth Date*"
                type="date"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar"
              />
            </VCol>
            
            <!-- Weight -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.weight"
                label="Weight (kg)*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-weight-kilogram"
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
            
            <!-- Image URL -->
            <VCol cols="12">
              <VTextField
                v-model="formData.img"
                label="Image URL*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-image"
              />
            </VCol>
            
            <!-- Temperament -->
            <VCol cols="12">
              <VTextField
                v-model="formData.temperament"
                label="Temperament*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-emoticon-happy"
                hint="e.g., Friendly, Energetic, Calm"
              />
            </VCol>
            
            <!-- Activity Level -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.activityLevel"
                label="Activity Level*"
                :items="threeLevelOptions"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-run"
              />
            </VCol>
            
            <!-- Grooming Needs -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.groomingNeeds"
                label="Grooming Needs*"
                :items="threeLevelOptions"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-content-cut"
              />
            </VCol>
            
            <!-- Health Condition -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="formData.healthCondition"
                label="Health Condition*"
                :items="healthOptions"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-medical-bag"
              />
            </VCol>
            
            <!-- Food Flavor -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.foodFlavor"
                label="Preferred Food Flavor*"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-food"
              />
            </VCol>
            
            <!-- Toy Type -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.toyType"
                label="Favorite Toy Type*"
                :rules="[rules.required]"
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

// Watch for pet changes to populate form in edit mode
watch(() => props.pet, (newPet) => {
  if (newPet) {
    formData.value = {
      name: newPet.name,
      breed: newPet.breed,
      gender: newPet.gender,
      birthDate: newPet.birthDate,
      weight: newPet.weight,
      coatColor: newPet.coatColor,
      img: newPet.img,
      temperament: newPet.temperament,
      activityLevel: newPet.activityLevel,
      groomingNeeds: newPet.groomingNeeds,
      healthCondition: newPet.healthCondition,
      foodFlavor: newPet.foodFlavor,
      toyType: newPet.toyType,
    }
  } else {
    formData.value = { ...defaultFormData }
  }
}, { immediate: true })

const closeDialog = () => {
  formData.value = { ...defaultFormData }
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
