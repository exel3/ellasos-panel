<template>
  <div class="itemContainer" @click="$emit('click')">
    <div class="row title">
    <div><img :src="getImg()"></div>
    <div @click="showOptions = !showOptions">{{ title }}</div>
    </div>
    <div v-if="showOptions" class="options">
      <ul>
        <nuxt-link
          v-for="(option, index) in options"
          :key="title + index"
          :to="option.url"
          class="liItem"
          >{{ option.title }}</nuxt-link
        >
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ItemAsideMenu',

  props: {
    title: {
      type: String,
      required: true,
    },
    imgsrc: {
      type: String,
      required: true
    },
    mainurl: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    showOptions: false,
  }),
  methods: {
    getImg() {
      return require(`@/assets/icons/${this.imgsrc}`)
    }
  }
}
</script>
<style scoped>
* {
  color: rgba(0, 0, 0, 0.6);
}

.itemContainer {
  margin-bottom: 1rem;
}

.title {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  padding: 0.675rem 1.5rem;
  gap: 0 1rem;
  margin-bottom:0.3rem;
}

.liItem {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 1rem;
  padding-top: 0.45rem;
  padding-bottom: 0.45rem;
  padding-left: 5rem;
  text-decoration: none;
}
</style>