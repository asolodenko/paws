
<template>
  <router-link
    v-bind="$props"
    :to="$props.to"
    custom
    v-slot="{ isActive, href, navigate }"
    exact-active-class="text-primaryLight"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClassDefault : inactiveClassDefault"
    >
      <slot />
    </a>
  </router-link>
</template>

<script lang="ts" setup>
import { RouterLinkProps } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

interface CustomProps {
  inactiveClass?: string;
}

const props = defineProps<RouterLinkProps & CustomProps>();

const activeClassDefault = props.activeClass ?? 'text-white text-decoration-none';
const inactiveClassDefault = props.inactiveClass ?? 'text-white text-decoration-none';

</script>

<style>

</style>