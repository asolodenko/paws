
<template>
  <RouterLink
    :to="to"
    :active-class="activeClassDefault"
    :inactive-class="inactiveClassDefault"
    :exact-active-class="exactActiveClass"
    class="text-white text-decoration-none"
  >
    <slot></slot>
  </RouterLink>
</template>

<script lang="ts" setup>
import { RouterLinkProps } from 'vue-router'

interface CustomProps {
  inactiveClass?: string;
  exactActiveClass?: string;
}

const props = withDefaults(defineProps<RouterLinkProps & CustomProps>(), {
  exactActiveClass: 'text-primaryLight',
})

const activeClassDefault = props.activeClass ?? 'text-white text-decoration-none'
const inactiveClassDefault = props.inactiveClass ?? 'text-white text-decoration-none'

</script>

<style>

</style>