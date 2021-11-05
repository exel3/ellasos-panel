<template>
  <div class="editModalLocalContainer">
    <div class="editModalLocal">
      <label>Nombre de local:</label>
      <BaseInput :valueinput="local.name" @input="newlocal.name = $event" />
      <label>Direccion:</label>
      <BaseInput
        :valueinput="local.location_address"
        @input="newlocal.locationAddress = $event"
      />
      <label>Ciudad:</label>
      <BaseInput
        :valueinput="local.location_city_name"
        @input="newlocal.locationCityName = $event"
      />
          <div v-if="user.type==='admin'" class="selectContainer">
          <label for="owner">Dueño:</label>
        <select id="owner" class="selectOwner" name="owner" @change="setOwnerSelected($event.target.value)" >
          <option
            v-for="owner in owners"
            :key="'dropBox' + owner.id"
            :value="owner.username"
            :selected="owner.username===local.clientName? 'selected': false"
          >
            {{owner.username}}
          </option>
        </select>
          </div>
      <label>Pais:</label>
      <BaseInput
        :valueinput="local.location_country_name"
        @input="newlocal.locationCountryName = $event"
      />

      <div class="tdOptionsLocal">
        <BaseButtonEdit
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Confirmar"
          color="white"
          @click="updateEditLocal()"
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
import BaseInput from '@/components/locals/BaseInput.vue'
import BaseButtonEdit from '@/components/locals/BaseButtonEdit.vue'
export default {
  name: 'EditModalTables',
  components: {
    BaseInput,
    BaseButtonEdit,
  },
  props: {
    local: {
      type: Object,
      required: true,
    },
    owners: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    newlocal: {},
  }),
  mounted() {
    this.newlocal.locationAddress = this.local.location_address
    this.newlocal.locationCityName = this.local.location_city_name
    this.newlocal.locationCountryName = this.local.location_country_name
    this.newlocal.id = this.local.id
    this.newlocal.name = this.local.name
    this.newlocal.clientID = this.local.client
    this.newlocal.clientName = this.local.clientName
   
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
    },
      setOwnerSelected(ownerName) {
      this.newlocal.clientID = this.owners.find(o => ownerName === o.username).id
    },
    updateEditLocal() {
      if (this.newlocal.name.length < 1) {
        this.$toasted.show(`El nombre no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (this.newlocal.locationAddress.length < 0) {
        this.$toasted.show(`La direccion no puede estar vacia`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
        } else if (this.newlocal.clientName.length < 0) {
        this.$toasted.show(`El dueño no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:local', this.newlocal)
      }
    },
  },
}
</script>
<style scoped>
.editModalLocalContainer {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  box-sizing: border-box;
  overflow: hidden;
  top:65px;
  left: 0;
}
.editModalLocal {
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
  gap: 0.5rem;
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

.tdOptionsLocal {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
  position: absolute;
  bottom: 5rem;
  width: calc(100% - 2rem);
}
.selectOwner {
   width: 100%;
  height: 2.5rem;
  padding:0 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
  margin-top:0.5rem;
}
</style>