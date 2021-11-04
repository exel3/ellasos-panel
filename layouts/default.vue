<template>
  <div>
    <BaseHeader @click:responsive="showAsideMenu=!showAsideMenu" />
    <AsideMenu :show="showAsideMenu" @click:responsive="showAsideMenu=!showAsideMenu"/>
    <v-main>
      <v-container>
        <section class="containerDefault">
          <div class="backgroundGreen"></div>
          <Nuxt />
        </section>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import BaseHeader from '@/components/ui/BaseHeader.vue'
import AsideMenu from '@/components/ui/AsideMenu.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AsideMenu,
    BaseHeader,
  },
  middleware: 'auth',
  data: () => ({
    showAsideMenu: false,
  }),
}
</script>

<style>
@media (max-width: 1000px) {
  .containerDefault {
    padding-left: 0;
  }

  .backgroundGreen {
display:none
}
}
@media (min-width: 1000px) {
  .containerDefault {
    padding-top: 5rem;
    padding-left: 15rem;
  }

  .backgroundGreen {
  left: 0;
  position: absolute;
  top: 4rem;
  width: 100%;
  height: 15rem;
  background: #2dce89;
  z-index: 1;
}
}

.containerDefault {
  background: var(--background-color);
}


</style>
