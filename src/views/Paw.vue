<template>
  <PawCard :paw="currentPaw" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PawCard from '@/components/PawCard.vue';
import { usePawStore } from '@/store/paw';
import { storeToRefs } from 'pinia';

const route = useRoute();
const pawId = route.params.id as string;
const { fetchPawData } = usePawStore();
const pawStore = usePawStore();
const { currentPaw } = storeToRefs(pawStore);

onMounted(async () => {
  await fetchPawData(pawId);
})
</script>
