<template>
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
import { ref } from 'vue';
import { useDate } from 'vuetify';

const props = defineProps<{
  dateTimeObj: object
}>();

const time = ref(props.dateTimeObj);
const timeMenu = ref(false);
const date = ref('2010-04-13')//useDate();
const formatted = '2010-04-13'//, 'fullDateWithWeekday')
const dateMenu = ref(false);


const timeMin = `${process.env.WORKING_DAY_START}:00`;
const timeMax = `${process.env.WORKING_DAY_END - 1}:50`;

</script>