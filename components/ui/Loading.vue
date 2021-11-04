<template>
  <div class="loadingContainer">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
@media (max-width: 1000px) {
  .loadingContainer{
width: 100%;
  }
  
}
@media (min-width: 1000px) {
  .loadingContainer{
width: calc(100% - 10rem);
  }
  
}
 .loadingContainer {
position:absolute;
height: 100%;
display: grid;
align-items: center;
justify-content: center;
 }
 .spinner {
   border: 4px solid #4488fe;
   width: 2rem;
   height: 2rem;
   border-radius: 50%;
   border-left-color: transparent;
   animation: spin 1s ease infinite;
 }
 @keyframes spin {
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg)
   }
 }
</style>