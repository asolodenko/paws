import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, getDocs, onSnapshot, addDoc } from "firebase/firestore"
import { Paw } from '@/model/Paw.model'
import { firestore } from '@/firebase'

export const usePawsStore = defineStore('paws', () => {
  const loading = ref(false);
  // Action to fetch paws data from Firestore
  async function fetchPawsData(): Promise<Paw[]> {
    loading.value = true;
    const pawsRef = collection(firestore, "paws");
    const querySnapshot = await getDocs(pawsRef);
    const paws = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as Paw
    });
    loading.value = false;
    return paws;
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

  function postPaws(paws: Paw[]) {
    const pawsCollection = collection(firestore, "paws");
    paws.forEach(async (paw) => {
      const docRef = await addDoc(pawsCollection, paw);
      console.log("Document written with ID: ", docRef.id);
    })
  }

  return { loading, fetchPawsData, fetchPaws, postPaws }
})
