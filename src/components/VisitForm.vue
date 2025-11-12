<template>
  <p>
    We are open from {{ timeMin }} to {{ timeMax }}. Please select a time between these hours.
  </p>
  <VTextField
    :value="formatted"
    :active="dateMenu"
    label="Date"
    prepend-icon="mdi-calendar"
    readonly
    type="date"
  >
    <VMenu
      v-model="dateMenu"
      :close-on-content-click="true"
      activator="parent"
      transition="scale-transition"
    >
      <VDatePicker
        v-model="date"
        width="400"
        first-day-of-week="1"
      />
    </VMenu>
  </VTextField>

  <VTextField
    v-model="time"
    :active="timeMenu"
    label="Time"
    prepend-icon="mdi-clock-time-four-outline"
    readonly
  >
    <VMenu
      v-model="timeMenu"
      :close-on-content-click="false"
      activator="parent"
      transition="scale-transition"
    >
      <VTimePicker
        v-if="timeMenu"
        v-model="time"
        full-width
        format="24hr"
        :max="timeMax"
        :min="timeMin"
      />
    </VMenu>
  </VTextField>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const date = defineModel<Date>('date')
const time = defineModel<string>('time')
const timeMenu = ref(false)
const formatted = computed(() => {
  if (!date.value) {return null}
  const yyyy = date.value.getFullYear()
  const mm = String(date.value.getMonth() + 1).padStart(2, '0')
  const dd = String(date.value.getDate()).padStart(2, '0')
  const formattedDate = `${yyyy}-${mm}-${dd}`
  return formattedDate
})
const dateMenu = ref(false)

const timeMin = `${import.meta.env.WORKING_DAY_START ?? 8}:00`
const timeMax = `${import.meta.env.WORKING_DAY_END ?? 21 - 1}:50`

</script>