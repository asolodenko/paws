
<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
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
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  // @ts-ignore
  ...RouterLink.props,
  inactiveClass: String,
})

const activeClassDefault = props.activeClass ?? 'text-white text-decoration-none';
const inactiveClassDefault = props.inactiveClass ?? 'text-white text-decoration-none';

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<style>

</style>