<template>
  <PawsList :paws="paws" />
</template>

<script lang="ts" setup>
import PawsList from '@/components/PawsList.vue';
import { Paw } from '@/model/Paw.model';
import { usePawsStore } from '@/store/paws';
import { onMounted, onUnmounted, ref } from 'vue';

const paws = ref([] as Paw[])
const { fetchPaws } = usePawsStore();

onMounted(() => {
  const unsubscribe = fetchPaws((newItems: Paw[]) => {
    paws.value = newItems
  })

  onUnmounted(unsubscribe)
})
</script>
