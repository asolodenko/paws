import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, onSnapshot, addDoc } from "firebase/firestore"
import { firestore } from '@/firebase'
import { Request } from '@/model/Request.model'

export const useVisitRequestsStore = defineStore('visitRequests', () => {
  const loading = ref(false);
  const requests = ref([] as Request[]);//reactive([] as Paw[]);
  // Action to fetch paws data from Firestore
  // async function fetchPawsData(): Promise<Paw[]> {
  //   loading.value = true;
  //   const pawsRef = collection(firestore, "paws");
  //   const querySnapshot = await getDocs(pawsRef);
  //   const paws = querySnapshot.docs.map(doc => {
  //     return {
  //       id: doc.id,
  //       ...doc.data()
  //     } as Paw
  //   });
  //   loading.value = false;
  //   return paws;
  // }
  // Action to set up a listener for real-time updates from Firestore
  function fetchRequests() {
    const requestsCollection = collection(firestore, "visitRequests");
    onSnapshot(requestsCollection, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const request = { id: doc.id, ...doc.data() } as Request;
  
        const index = requests.value.findIndex((r) => r.id === request.id);
        if (index !== -1) {
          requests.value[index] = request;
        } else {
          requests.value.push(request);
        }
      });
    });
  }

  function postRequest(request: Request) {
    const requestsCollection = collection(firestore, "visitRequests");
    addDoc(requestsCollection, request)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  return { loading, requests, fetchRequests, postRequest }
})
