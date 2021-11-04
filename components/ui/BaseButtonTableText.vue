<template lang="">
  <div class='baseButtonContainer' :style="{background: backcolor, border: bordercolor + ' 1px solid'}" @click="$emit('click')">
    <p :style="{color: color}">{{text}}</p>
  </div>
</template>
<script>
export default {
  name: 'BaseButtonTable',
  props: {
    backcolor: {
      type: String,
      default: 'transparent',
    },
    bordercolor: {
      type: String,
      default: 'transparent'
    },
    color: {
      type: String,
      default: 'black'
    },
    text: {
      type: String,
      required: true
    },
  },
}
</script>
<style scoped>
.baseButtonContainer {
  padding: 0.1rem 0.4rem;
  user-select: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: grid;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>