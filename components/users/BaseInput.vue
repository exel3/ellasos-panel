<template>
  <input :value="valueinput" :class="inputBase" :disabled="status" @input="$emit('input', $event.target.value)">
</template>
<script>
export default {
  name: 'BaseInput',
  props: {
    valueinput: {
      type: String,
      default: ""
    },
  status: {
    type:Boolean,
    required:true
  }
  },
  data: () => ({
    borderColor:'transparent',
    inputBase: 'inputBase'
  }),
  methods:{
    getBorderColor(currentValue){
     currentValue===''? this.inputBase ='inputBaseAlert' :   this.inputBase = 'inputBase'}
  }
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
      background: transparent;
      height: 100%;
     width: calc(100% - 0.5rem);
}
.inputBase:enabled {
   border: 1px solid #dee2e6;
   border-radius: 0.2rem;
}
  .inputBase:disabled {
  border: none;
  }
</style>