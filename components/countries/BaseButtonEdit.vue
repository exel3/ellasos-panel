<template lang="">
  <div class='baseButtoEditContainer' :style="{background: backcolor, border: bordercolor + ' 1px solid', color: color}" @click="$emit('click')">
    <p>{{text}}</p>
  </div>
</template>
<script>
export default {
  name: 'BaseButtonEdit',
  props: {
    backcolor: {
      type: String,
      default: 'transparent',
    },
    bordercolor: {
      type: String,
      default: 'transparent'
    },
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  methods: {
  },
}
</script>
<style scoped>
.baseButtoEditContainer {
  padding: 0.5rem 0.4rem;
  user-select: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
}
</style>