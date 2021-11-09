<template>
  <div class="containerLogin">
    <div class="loginBox">
      <h1>Ella SOS</h1>
      <form v-if="!isRegisterMode" class="loginForm">
        <p>Inicie sesión con su usuario y contraseña</p>
        <input
          v-model="userName"
          class="loginInput"
          type="text"
          data-value="false"
          autocomplete="off"
          required="true"
          placeholder="Usuario"
          :disabled="loadingMode"
        />
        <input
          v-model="userPassword"
          class="loginInput"
          type="password"
          data-value="false"
          autocomplete="on"
          required="true"
          placeholder="Password"
          :disabled="loadingMode"
        />
        <div class="containerButton">
          <button
            class="buttonSubmit"
            type="submit"
            :disabled="loadingMode"
            @click.prevent="loginWithUserNameAndEmail()"
          >
            Acceder
          </button>
        </div>
      </form>
      <div v-if="loadingMode"><p>Cargando...</p></div>
      <span class="poweredSpan"
        ><a href="https://polluxcoop.com ">Powered by <b>Pollux</b></a></span
      >
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MainLogin',
  layout: 'auth',
  data: () => ({
    isRegisterMode: false,
    userPassword: '',
    userName: '',
    loadingMode: false
  }),

  methods: {
    ...mapMutations({
      setUser: 'authentication/setUser',
      setClient: 'data/setClient'
    }),
    loginWithUserNameAndEmail () {
      this.loginWithUserName()
    },

    loginWithUserName () {
      this.loadingMode = true
      const post = {
        username: this.userName,
        password: this.userPassword
      }

      this.$axios.$post('/api/admin/login', post)
        .then((result) => {
          this.loadingMode = false
          this.$router.push('buttons')
        })
        .catch((error) => {
          this.loadingMode = false
          error.statusCode === 401
            ? this.$toasted.show(`Login error: ${error}`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
            : this.$toasted.show(
              'Login error: Usuario o contraseña incorrectos',
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              }
            )
        })
    }
  }
}
</script>
<style scoped>
.colorSwitch {
  position: absolute;
  left: calc(100% - 2rem);
  top: 1rem;
}
.containerLogin {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loginBox {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 28.125rem;
  min-height: 31.25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.625rem;
  padding: 2.5rem 3.75rem;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.5s 0s ease;
}

.registerForm {
  display: grid;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
}

.registerForm label {
  width: 100%;
}

.loginForm {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.containerButton {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

button {
  font-weight: 500;
  font-size: 0.875rem;
  background-color: black;
  border: none;
  padding: 0.4375rem 1.125rem;
  border-radius: 0.3125rem;
  overflow: hidden;
  cursor: pointer;
  color: white;
  margin: 0.5rem 0;
}

p {
  font-weight: 400;
  font-size: 0.875rem;
  text-align: center;
}

h1 {
  margin: 1rem;
  font-weight: 400;
  font-size: 1.5rem;
  text-align: center;
}

.loginInput {
  width: 100%;
  padding: 1rem 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 0.3125rem;
  margin: 1rem 0;
}

.registerInput {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.3125rem;
  margin: 0.5rem 0 1.5rem 0;
}

.poweredSpan p {
  font-weight: bold;
  color: inherit;
  text-decoration: none;
}

a {
  color: inherit;
  text-decoration: none;
}

.poweredSpan {
  position: absolute;
  left: 0;
  bottom: 2%;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  color: black;
}

.socialButtons {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.register {
  cursor: pointer;
  font-weight: bold;
}

.backButton {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}
</style>
