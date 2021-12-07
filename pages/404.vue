<template>
  <div class="containerLogin">
    <div class="loginBox">
        <p class="number">404</p>
        <p class="title">Pagina no encontrada</p>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ValidatePassword',
  layout: 'auth'
}
</script>
<style scoped>
.number {
    font-size: 3rem;
}
.title {
    font-size: 1rem;
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
  justify-content: center;
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
