<template>
  <p>
    We are open from {{ timeMin }} to {{ timeMax }}. Please select a time between these hours.
  </p>
  <v-text-field
    :value="formatted"
    :active="dateMenu"
    label="Date"
    prepend-icon="mdi-calendar"
    readonly
    type="date"
  >
    <v-menu
      v-model="dateMenu"
      :close-on-content-click="true"
      activator="parent"
      transition="scale-transition"
    >
      <v-date-picker
        v-model="date"
        width="400"
        first-day-of-week="1"
      ></v-date-picker>
    </v-menu>
  </v-text-field>

  <v-text-field
    v-model="time"
    :active="timeMenu"
    label="Time"
    prepend-icon="mdi-clock-time-four-outline"
    readonly
  >
    <v-menu
      v-model="timeMenu"
      :close-on-content-click="false"
      activator="parent"
      transition="scale-transition"
    >
      <v-time-picker
        v-if="timeMenu"
        v-model="time"
        full-width
        format="24hr"
        :max="timeMax"
        :min="timeMin"
      ></v-time-picker>
    </v-menu>
  </v-text-field>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useDate } from 'vuetify';

const date = defineModel<Date>('date');
const time = defineModel<string>('time');
const adapter = useDate()
const timeMenu = ref(false);
const formatted = computed(() => {
  if (!date.value) return null;
  const yyyy = date.value.getFullYear();
  const mm = String(date.value.getMonth() + 1).padStart(2, '0');
  const dd = String(date.value.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  return formattedDate;
});
const dateMenu = ref(false);

const timeMin = `${process.env.WORKING_DAY_START ?? 8}:00`;
const timeMax = `${process.env.WORKING_DAY_END ?? 21 - 1}:50`;

</script>