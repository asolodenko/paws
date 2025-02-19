<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ action === 'visit' ? 'Request to Visit' : 'Adopt Pet' }}</span>
      </v-card-title>

      <v-card-text>
        <VisitForm v-if="action === 'visit'" v-model:date="date" v-model:time="time" />
        <div v-else>
          Adopt pet {{ props.paw.name }}
          <br>
          <br>
          <p>
            In accordance with the rules of the shelter, to adopt a pet you need to send a request to the shelter administration.
            The request will be considered within 24 hours. If the request is approved, you will see a notification in account page.
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="close">Close</v-btn>
        <v-btn color="primary" variant="tonal" @click="send">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { Paw } from '@/model/Paw.model';
import { User } from '@/model/User.model';
import { ref } from 'vue';
import VisitForm from './VisitForm.vue';
import axios from '../plugins/axios';
import { Request } from '@/model/Request.model';
import { PENDING } from '@/constants';

const props = defineProps<{
  action: 'visit' | 'adopt',
  paw: Paw,
  user: User | null,
}>();
const dialog = defineModel<boolean>();

const close = () => {
  dialog.value = false;
};

const date = ref(new Date());
const time = ref('');

const send = async () => {
  const pawId = props.paw.id;
  const pawName = props.paw.name;
  const userId = props.user?.uid || '';
  const userName = props.user?.displayName || '';
  const email = props.user?.email || '';

  const request: Request = {
    pawId,
    pawName,
    userId,
    userName,
    userEmail: email,
    type: props.action,
    createdAt: new Date().toISOString(),
    status: PENDING,
    ...(props.action === 'visit' && { date: date.value.toISOString(), time: time.value })
  };

  await sendRequest('sendRequest', request);
  dialog.value = false;
};

const sendRequest = async (api: string, body: object) => {
  try {
    const response = await axios.post(`/${api}`, body);

    if (response.status !== 200) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = response.data;
  } catch (error) {
    console.error('Error sending request:', error);
  }
}
</script>