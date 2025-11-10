<template>
  <PawsList :paws="availablePawsList" />
</template>

<script lang="ts" setup>
import PawsList from '@/components/PawsList.vue'
import { Paw } from '@/model/Paw.model'
import { onMounted, ref, computed } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'

const pawsList = ref([] as Paw[])

// Filter out adopted pets - only show available pets
const availablePawsList = computed(() => {
  return pawsList.value.filter(paw => 
    paw.adoptionStatus !== 'adopted',
  )
})

onMounted(() => {
  try {
    const pawsCollection = collection(firestore, 'paws')
    onSnapshot(pawsCollection, (snapshot) => {
      pawsList.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        } as Paw
      ))
    })
  } catch (error) {
    console.error('Error fetching items:', error)
  }
})
</script>
