import { defineStore } from 'pinia'
import { collection, getDocs, onSnapshot } from "firebase/firestore"
import { Paw } from '@/model/Paw.model'
import { firestore } from '@/firebase'

export const usePawsStore = defineStore('paws', () => {

  // Action to fetch paws data from Firestore
  async function fetchPawsData(): Promise<Paw[]> {
    const pawsRef = collection(firestore, "paws");
    const querySnapshot = await getDocs(pawsRef);
    const paws = querySnapshot.docs.map(doc => doc.data() as Paw)
    return paws
  }

  // Action to set up a listener for real-time updates from Firestore
  function fetchPaws(callback: any) {
    const pawsCollection = collection(firestore, "paws");

    return onSnapshot(pawsCollection, (snapshot) => {
      const paws = [] as Paw[];
      snapshot.forEach((doc) => {
        paws.push(doc.data() as Paw)
      })
      if(callback) callback(paws)
    })
  }

  return { fetchPawsData, fetchPaws }
})
