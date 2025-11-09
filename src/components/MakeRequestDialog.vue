<template>
  <VDialog v-model="dialog" max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="text-h6">{{ action === 'visit' ? 'Request to Visit' : 'Adopt Pet' }}</span>
      </VCardTitle>

      <VCardText>
        <VisitForm v-if="action === 'visit'" v-model:date="date" v-model:time="time" />
        <div v-else>
          <p class="mb-3">
            Adopt pet {{ props.paw.name }}
          </p>
          
          <!-- Eligibility status -->
          <VAlert
            v-if="!props.isEligibleForAdoption"
            type="warning"
            variant="tonal"
            class="mb-3"
          >
            <div class="text-body-2">
              <strong>Adoption Requirements:</strong>
              <br />
              You need {{ 5 - props.visitCount }} more fulfilled visit{{ 5 - props.visitCount !== 1 ? 's' : '' }} to this pet before you can adopt.
              <br />
              Current visits: {{ props.visitCount }}/5
            </div>
          </VAlert>
          
          <p v-if="props.isEligibleForAdoption">
            In accordance with the rules of the shelter, to adopt a pet you need to send a request to the shelter administration.
            The request will be considered within 24 hours. If the request is approved, you will see a notification in account page.
          </p>
        </div>
      </VCardText>

      <VCardActions>
        <VBtn @click="close">
          Close
        </VBtn>
        <VBtn
          :disabled="(!time && action === 'visit') || (action === 'adopt' && !isEligibleForAdoption)"
          :loading="loading"
          color="secondary"
          variant="elevated"
          @click="send"
        >
          Send
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { Paw } from '@/model/Paw.model'
import { User } from '@/model/User.model'
import { ref } from 'vue'
import VisitForm from './VisitForm.vue'
import { sendPOST } from '../plugins/axios'
import { Request } from '@/model/Request.model'
import { PENDING } from '@/constants'

const props = defineProps<{
  action: 'visit' | 'adopt',
  paw: Paw,
  user: User | null,
  visitCount: number,
  isEligibleForAdoption: boolean,
}>()

const emit = defineEmits<{
  requestSent: []
}>()

const dialog = defineModel<boolean>()

const close = () => {
  dialog.value = false
}

const date = ref(new Date())
const time = ref('')

const loading = ref(false)

const send = async () => {
  const pawId = props.paw.id
  const pawName = props.paw.name
  const userId = props.user?.uid || ''
  const userName = props.user?.displayName || ''
  const email = props.user?.email || ''

  const request: Request = {
    id: '',
    pawId,
    pawName,
    userId,
    userName,
    userEmail: email,
    type: props.action,
    createdAt: new Date().toISOString(),
    status: PENDING,
    ...(props.action === 'visit' && { date: date.value.toISOString(), time: time.value }),
  }

  loading.value = true
  await sendPOST('sendRequest', request)
  dialog.value = false
  loading.value = false
  emit('requestSent')
}

</script>
