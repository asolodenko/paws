<template>
  <VDialog v-model="dialog" max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="text-h6">{{ action === 'visit' ? 'Request to Visit' : 'Adopt Pet' }}</span>
      </VCardTitle>

      <VCardText>
        <VisitForm v-if="action === 'visit'" v-model:date="date" v-model:time="time" />
        <div v-else>
          <p>
            Adopt pet {{ props.paw.name }}
          </p>
          <br />
          <p v-if="!isEligible" class="text-warning mb-4">
            <VIcon icon="mdi-alert" size="small" />
            To adopt {{ props.paw.name }}, you need to complete 5 visits first.
            You currently have {{ visitCount }} fulfilled visit{{ visitCount !== 1 ? 's' : '' }}.
          </p>
          <p v-if="isEligible" class="text-success mb-4">
            <VIcon icon="mdi-check-circle" size="small" />
            You're eligible to adopt {{ props.paw.name }}!
          </p>
          <p>
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
          :disabled="(!time && action === 'visit') || (action === 'adopt' && !isEligible)"
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
import { ref, computed } from 'vue'
import VisitForm from './VisitForm.vue'
import { sendPOST } from '../plugins/axios'
import { Request } from '@/model/Request.model'
import { PENDING } from '@/constants'
import { useRequestStore } from '@/store/request'

const props = defineProps<{
  action: 'visit' | 'adopt',
  paw: Paw,
  user: User | null,
}>()
const dialog = defineModel<boolean>()

const requestStore = useRequestStore()

// Check if user is eligible to adopt this pet
const isEligible = computed(() => {
  if (!props.user || !props.paw.id) {
    return false
  }
  return requestStore.isEligibleToAdopt(props.user.uid, props.paw.id)
})

// Get visit count for messaging
const visitCount = computed(() => {
  if (!props.user || !props.paw.id) {
    return 0
  }
  return requestStore.getFulfilledVisitCount(props.user.uid, props.paw.id)
})

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
}

</script>
