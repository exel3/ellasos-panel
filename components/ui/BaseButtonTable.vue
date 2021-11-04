<template lang="">
  <div class='baseButtonContainer' :style="{background: backcolor, border: bordercolor + ' 1px solid'}" @click="$emit('click')">
    <img :src="getSrc()">
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
    imgsrc: {
      type: String,
      default: "edit.svg"
    },
  },
  methods: {
    getSrc() {
      return require(`@/assets/icons/${this.imgsrc}`)
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
}
</style>