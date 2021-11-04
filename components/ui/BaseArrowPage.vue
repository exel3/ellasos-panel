<template>
  <div class="pageContainer"><img v-if="currentpage > 1" src="@/assets/icons/arrowLeft.svg" @click="changePage('down')">{{currentpage}}/{{totalpage}}<img v-if="currentpage < totalpage" src="@/assets/icons/arrowRight.svg" @click="changePage('up')"></div>
</template>

<script>
export default {
name: 'BaseArrowPage',
props: {
  totalpage:{
    type: Number,
    required: true
  },
  currentpage: {
    type: Number,
    default: 1
  }
},
data:()=>({
}),
methods: {
changePage(valor) {
  if(valor === 'up'){
  this.$emit('set:page', this.currentpage+1)}
  else if(valor === 'down'){
   this.$emit('set:page', this.currentpage-1)}
   else {
     this.$emit('set:page', valor)
   }
}
}
}
</script>

<style scoped>
.pageContainer {
  position: absolute;
  bottom: 0.3rem;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-auto-flow: column;
  height: 2rem;
  user-select: none;
}

.pageContainer img {
  cursor:pointer;
  height: 2rem;
}

</style>