<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h6">{{ action === 'visit' ? 'Request to Visit' : 'Adopt Pet' }}</span>
      </v-card-title>

      <v-card-text>
        <VisitForm v-if="action === 'visit'" v-model="dateTimeObj" />
        <p v-else>Adopt pet {{ props.paw.name }}</p>
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
import { ref, watch } from 'vue';
import VisitForm from './VisitForm.vue';
import axios from '../plugins/axios';

const props = defineProps<{
  action: string,
  paw: Paw,
  user: User,
  modelValue: boolean
}>();

const emit = defineEmits(['update:modelValue']);

const dialog = ref(props.modelValue);
const dateTimeObj = ref({
  date: '',
  time: ''
});

// Watch for v-model changes
watch(() => props.modelValue, (newVal: boolean) => {
  dialog.value = newVal;
});

const close = () => {
  dialog.value = false;
  emit('update:modelValue', false);
};

const send = async () => {
  const pawId = props.paw.id;
  const pawName = props.paw.name;
  const userId = props.user.uid;
  const userName = props.user.displayName;

  if (props.action === 'visit') {
    await sendRequest('sendVisitRequest', {
      pawId,
      pawName,
      userId,
      userName,
      date: '2024-12-05T00:00:00.634Z',
      time: '10:00'
    });
  } else {
    await sendRequest('sendAdoptRequest', {
      pawId,
      pawName,
      userId,
      userName
    });
  }
  dialog.value = false;
  emit('update:modelValue', false);
};

const sendRequest = async (api: string, body: object) => {
  try {
    const response = await axios.post(`/api/${api}`, body);

    if (response.status !== 200) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = response.data;
    console.log('Request approved:', result);
  } catch (error) {
    console.error('Error sending request:', error);
  }
}
</script>