<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-img 
          src='./../assets/00001.jpg'
          alt="Pet Image" 
          class="rounded"
          max-height="400"
          max-width="100%"
        />
      </v-col>

      <v-col cols="12" md="6" class="d-flex flex-column justify-space-between">
        <!-- Pet Details -->
        <v-card class="pa-4">
          <v-card-title class="text-h5">{{ currentPaw.name }}</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Gender:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.gender }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Age:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.birthDate }} years</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Breed:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.breed }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Color:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.coatColor }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Temperament:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.temperament }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Weight:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.weight }} kg</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Health condition:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.healthCondition }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Activity level:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.activityLevel }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Grooming needs:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.groomingNeeds }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Favorite food flavor:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.foodFlavor }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Toy type:</v-list-item-title>
                <v-list-item-subtitle>{{ currentPaw.toyType }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Actions -->
        <v-row class="mt-4" v-if="isAuth">
          <v-col cols="6">
            <v-btn
              color="primary" 
              block 
              @click="openModal('visit')"
            >
              Request to Visit
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="secondary" 
              block 
              @click="openModal('adopt')"
            >
              Adopt Pet
            </v-btn>
          </v-col>
        </v-row>

        <div v-else>
          Please login to send requests
        </div>
      </v-col>
    </v-row>

    <!-- Modal -->
    <MakeRequestDialog
      v-model="isModalOpen"
      :action="modalAction"
      :paw="currentPaw"
      :user="user"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePawStore } from '@/store/paw';
import { storeToRefs } from 'pinia';
import MakeRequestDialog from '@/components/MakeRequestDialog.vue';
import { useUserStore } from '@/store/user';

const route = useRoute();
const pawId = route.params.id as string;
const { fetchPawData } = usePawStore();
const pawStore = usePawStore();
const userStore = useUserStore();
const { currentPaw } = storeToRefs(pawStore);
const { isAuth, user } = storeToRefs(userStore);
const isModalOpen = ref(false);
const modalAction = ref<'visit' | 'adopt'>('visit');

onMounted(async () => {
  await fetchPawData(pawId);
})

const openModal = (action: 'visit' | 'adopt') => {
  modalAction.value = action;
  isModalOpen.value = true;
}
</script>
