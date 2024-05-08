<template>
  <PawsList :paws="paws" />
</template>

<script lang="ts" setup>
import PawsList from '@/components/PawsList.vue';
import { Paw } from '@/model/Paw.model';
import { usePawsStore } from '@/store/paws';
import { onMounted, ref } from 'vue';

const paws = ref([] as Paw[])
const { fetchPawsData } = usePawsStore();

onMounted(async () => {
  try {
    paws.value = await fetchPawsData()
  } catch (error) {
    console.error('Error fetching items:', error)
  }
})
</script>
