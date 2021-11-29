<template>
  <div class="editModalContainer">
    <div class="editModal">
         <label>Nombre:</label>
      <BaseInput :valueinput="country.name" @input="newCountry.name = $event" />
            <label>Identificador:</label>
      <BaseInput :valueinput="country.secondaryId" @input="newCountry.secondaryId = $event" />
      <div class="tdOptionscountry">
        <BaseButtonEdit
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Confirmar"
          color="white"
          @click="updateCountry()"
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
import BaseInput from '@/components/countries/BaseInput.vue'
import BaseButtonEdit from '@/components/countries/BaseButtonEdit.vue'
export default {
  name: 'EditModalCountry',
  components: {
    BaseInput,
    BaseButtonEdit
  },
  props: {
    country: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    newCountry: {
      name: '',
      secondaryId: ''
    },
    countrySelected: {}
  }),
  methods: {
    clickCancel () {
      this.$emit('cancel:click')
    },
    updateCountry () {
      const regCountry = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
      if (this.newCountry.name === '') {
        this.newCountry.name = this.country.name
      }
      if (this.newCountry.secondaryId === '') {
        this.newCountry.name = this.country.secondaryId
      }
      if (!regCountry.test(this.newCountry.name)) {
        this.$toasted.show(
          'Formato de nombre de pais incorrecto',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
        this.loadingMode = false
      } else {
        if (this.newCountry.secondaryId === '') {
          this.newCountry.secondaryId = null
        }
        if (this.newCountry.name === '') {
          this.newCountry.name = null
        }
        this.newCountry.id = this.country.id
        this.$emit('update:country', this.newCountry)
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

.tdOptionscountry {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
  position: absolute;
  bottom: 5rem;
  width: calc(100% - 2rem);
}
</style>
