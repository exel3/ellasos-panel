<template>
  <div class="editModalContainer">
    <div class="editModal">
      <label>Correo electronico:</label>
      <BaseInput
        :valueinput="user.email"
        :status=true
        @input="newUser.email = $event"
      />
      <label>Password:</label>
      <BaseInput placeholder="No visible" @input="newUser.password = $event" />
         <label>Nombre y apellido:</label>
      <BaseInput :valueinput="user.namesAndSurname" @input="newUser.namesAndSurname = $event" />
 <div class="selectContainer">
          <label for="owner">Pais</label>
        <select id="owner" class="selectOwner" name="owner"  @change="setCountrySelected($event.target.value)">
           <option disabled selected value></option>
          <option
            v-for="country in countries"
            :key="'dropBox' + country.id"
            :value="country.name"
          >
            {{country.name}}
          </option>
        </select>
          </div>
      <div class="tdOptionsUser">
        <BaseButtonEdit
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Confirmar"
          color="white"
          @click="updateUser()"
        />
        <BaseButtonEdit
          backcolor="white"
          bordercolor="#5e72e4"
          text="Cancelar"
          color="#5e72e4"
          @click="clickCancel()"
        />
      </div>
    </div>
    <div class="background" @click="$emit('click:cancel')"></div>
  </div>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonEdit from '@/components/users/BaseButtonEdit.vue'
export default {
  name: 'EditModalUser',
  components: {
    BaseInput,
    BaseButtonEdit
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    newUser: {
      password: '',
      email: '',
      namesAndSurname: '',
      country: ''
    },
    countrySelected: {}
  }),
  mounted () {
    const user = this.user
    this.newUser = { ...user, password: '' }
  },
  methods: {
    clickCancel () {
      this.$emit('cancel:click')
    },
    setCountrySelected (countryName) {
      this.countrySelected = this.countries.find((o) => countryName === o.name)
    },
    updateUser () {
      const regemail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const regPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/

      if (
        this.newUser.password !== ''
          ? !regPassword.test(this.newUser.password)
          : false
      ) {
        this.$toasted.show(
          'La contraseña debe contener mínimo 8 y máximo 16 caracteres, al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y no contener espacios',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
      } else if (!regemail.test(this.newUser.email)) {
        this.$toasted.show('Formato de email incorrecto', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      } else {
        if (this.newUser.password === '') {
          this.newUser.password = this.user.password
        }
        if (this.newUser.namesAndSurname === '') {
          this.newUser.namesAndSurname = this.user.namesAndSurname
        }
        if (this.newUser.country) { this.newUser.country = this.countrySelected.id }
        this.$emit('update:user', this.newUser)
      }
    }
  }
}
</script>
<style scoped>
.editModalContainer {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  box-sizing: border-box;
  overflow: hidden;
  top: 65px;
  left: 0;
}
.editModal {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  right: 0;
  height: 100%;
  width: 20rem;
  background: white;
  animation: move 0.5s ease;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
}
.background {
  width: 100%;
  height: 100%;
}
@keyframes move {
  0% {
    transform: translate(15rem);
  }
  100% {
    transform: translate(0);
  }
}

.selectOwner {
  width: 100%;
  height: 2rem;
  padding: 0 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
}

.tdOptionsUser {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
  position: absolute;
  bottom: 5rem;
  width: calc(100% - 2rem);
}
</style>
