import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { collection, getDocs, onSnapshot, addDoc } from "firebase/firestore"
import { Paw } from '@/model/Paw.model'
import { firestore } from '@/firebase'

export const usePawsStore = defineStore('paws', () => {
  const loading = ref(false);
  const paws = reactive([] as Paw[]);
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
  function fetchPaws() {
    const pawsCollection = collection(firestore, "paws");
    onSnapshot(pawsCollection, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const pet = { id: doc.id, ...doc.data() } as Paw;
  
        // Find existing pet index
        const index = paws.findIndex((p) => p.id === pet.id);
        if (index !== -1) {
          paws[index] = pet; // Update existing pet
        } else {
          paws.push(pet); // Add new pet
        }
      });
    });
  }

  function postPaws(paws: Paw[]) {
    const pawsCollection = collection(firestore, "paws");
    paws.forEach(async (paw) => {
      const docRef = await addDoc(pawsCollection, paw);
      console.log("Document written with ID: ", docRef.id);
    })
  }

  return { loading, paws, fetchPawsData, fetchPaws, postPaws }
})
