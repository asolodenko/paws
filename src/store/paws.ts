import { defineStore } from 'pinia'
import { Paw } from '@/model/Paw.model';
import mockPaws from '@/store/MOCK_DATA.ts';

export const usePawsStore = defineStore('paws', {
  state: () => ({
    paws: mockPaws as Paw[]
  }),
  getters: {},
  actions: {}
})
