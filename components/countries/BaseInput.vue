<template>
  <input :value="valueinput" :class="inputBase" @input="$emit('input', $event.target.value)">
</template>
<script>
export default {
  name: 'BaseInput',
  props: {
    valueinput: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    borderColor: 'transparent',
    inputBase: 'inputBase'
  })
}
</script>
<style scoped>
.inputBase {
  color: black;
      border: none;
      background: transparent;
      height: 2rem;
     width: calc(100% - 0.5rem);
      padding: 0.3rem;
}
.inputBaseAlert {
    color: black;
     border: 1px solid red;
     border-radius: 0.2rem;
      background: rgba(0,0,0,0.5);
      height: 100%;
     width: calc(100% - 0.5rem);
}
.inputBase {
   border: 1px solid #dee2e6;
   border-radius: 0.2rem;
}
.inputBase:disabled {
    background: rgba(0,0,0,0.1);
}
</style>
