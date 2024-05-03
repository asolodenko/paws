<template>
  <PawsList :paws="paws" />
</template>

<script lang="ts" setup>
import PawsList from '@/components/PawsList.vue';
import { usePawsStore } from '@/store/paws';
import { storeToRefs } from 'pinia';


const pawsStore = usePawsStore();
const { paws } = storeToRefs(pawsStore);
</script>
