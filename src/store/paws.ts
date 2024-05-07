import { ref } from 'vue';
import { defineStore } from 'pinia'
import { Paw } from '@/model/Paw.model';
import mockPaws from '@/store/MOCK_DATA.ts';

export const usePawsStore = defineStore('paws', () => {
  const paws = ref(mockPaws as Paw[])

  return { paws }
})
