<template>
  <div class="containerLogin">
    <div class="loginBox">
      <h1>Ella SOS</h1>
        <div v-if="isCompleteMode" class="loginForm">Contraseña actualizada con exito!</div>
      <form v-else class="loginForm">
        <p>Ingrese nueva contraseña</p>
        <input
        @keyup="validateFormat($event.target._value)"
          v-model="password"
          class="loginInput"
          type="password"
          data-value="false"
          autocomplete="false"
          required="true"
          placeholder="Contraseña"
          :disabled="loadingMode"
        />
        <p v-if="isBadFormat" class="alertText">Formato incorrecto, la contraseña debe contener entre 8 y 16 caracteres, que incluyan: un numero, una minuscula y una mayuscula</p>
        <input
          v-model="passwordRe"
          class="loginInput"
          type="password"
          data-value="false"
          autocomplete="false"
          required="true"
          placeholder="Repita contraseña"
          :disabled="loadingMode"
        />
        <div class="containerButton">
          <button
            class="buttonSubmit"
            type="submit"
            :disabled="loadingMode || isBadFormat"
            @click.prevent="validateToken()"
          >
            Cambiar contraseña
          </button>
        </div>
      </form>
      <div v-if="loadingMode"><p>Cargando...</p></div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ValidatePassword',
  layout: 'auth',
  data: () => ({
    password: '',
    passwordRe: '',
    loadingMode: false,
    token: '',
    isCompleteMode: false,
    isBadFormat: false
  }),
  async fetch () {
    this.token = this.$router.currentRoute.params.token
  },
  methods: {
    validateFormat (text) {
      const regExPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/
      if (regExPass.test(text)) {
        this.isBadFormat = false
      } else {
        this.isBadFormat = true
      }
    },
    async validateToken () {
      if (this.password === this.passwordRe && this.password !== '') {
        this.loadingMode = true
        //   const headers = {
        //     headers:
        // { authorization: 'Bearer ' + this.token }
        //   }
        const body = {
          password: this.password
        }
        await this.$axios.$get(`https://ellasos.herokuapp.com/api/admins/resetpassword/${'Bearer' + this.token}`, body)
          .then((result) => {
            this.loadingMode = false
            this.isCompleteMode = true
          })
          .catch((error) => {
            console.log(error.response.data.msg)
            this.loadingMode = false
            this.$toasted.show(`Error en validacion: ${error}`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          })
      } else {
        this.$toasted.show('Las contraseñas ingresadas no coinciden', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 50000
        })
      }
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
  width:100%;
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
.alertText {
    color:brown;
    font-size: 0.6rem;
}
</style>
