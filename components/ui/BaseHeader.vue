<template>
  <header>
    <div class="menuResponsive" @click="$emit('click:responsive')"><img src="@/assets/icons/menu.svg" /></div>
    <nuxt-link to="/locals" class="logoAndTitle">
      <div class="dashboard">Dashboard</div>
      <h1></h1>
    </nuxt-link>
    <nuxt-link to="/profile" class="profileGroup">
      <div class="profile">
        <img src="@/assets/images/default-profile.png" />
      </div>
      <p>{{ currentU.username }}</p>
    </nuxt-link>
  </header>
</template>
<script>
export default {
  name: 'BaseHeader',
  data: () => ({
    currentU: {},
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then((response) => {
        this.currentU = response
      })
      .catch((e) => {
        this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
      })
  },
}
</script>
<style scoped>
@media (max-width: 1000px) {
  .dashboard {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  header {
    padding-left: 1rem;
  }

  .menuResponsive {
    user-select: none;
    cursor: pointer;
  }
}
@media (min-width: 1000px) {
  .dashboard {
    font-size: 1.5rem;
    position: absolute;
    left: 20rem;
    top: 15px;
  }
  header {
    padding-left: 16rem;
  }
  .menuResponsive {
    user-select: none;
    display: none;
  }
}
header {
  position: fixed;
  display: grid;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px;
  border-color: hsla(0, 0%, 100%, 0.08);
  background: white;
  box-sizing: border-box;
  grid-auto-flow: column;
  padding: 0 2rem;
  z-index: 99;
  top: 0;
  user-select: none;
  background-color: #2dce89;
  color: white;
  height: 4rem;
}
.logoAndTitle {
  display: grid;
  place-content: left;
  align-items: center;
  grid-auto-flow: column;
  text-decoration: none;
  color: white;
}
.dashboard {
  height: 4rem;
  width: 10rem;
  text-align: center;
  user-select: none;
  font-size: 1.5rem;
}

h1 {
  margin-left: 1rem;
  color: white;
  font-size: 24px;
  user-select: none;
}

.profileGroup {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0 1rem;
  text-decoration: none;
  color: hsla(0, 0%, 100%, 0.95);
  font-size: 0.875rem;
  font-weight: 600;
}

.profile {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;
  box-sizing: border-box;
  background: #fff;
  border-radius: 50%;
  overflow: hidden;
}

.profile img {
  height: 100%;
  width: 100%;
  user-select: none;
}
</style>