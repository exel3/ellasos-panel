<template lang="">
<Loading v-if="$fetchState.pending" class="fetchState" />
  <p v-else-if="$fetchState.error" class="fetchState">Error al cargar los datos</p>
  <section v-else>
    <article v-if="user.isMain" class="newlocal">
          <div class="selectContainer">
          <label for="owner">Pais</label>
   <select id="owner" class="selectOwner" name="owner" @change="setCountrySelected($event.target.value)">
             <option disabled selected value>Seleccione pais..</option>
               <option  v-for="country in countries" :key="country.id" :value="country.name">{{country.name}}</option>
        </select>
          </div>
    </article>
    <article class="newlocal">
      <div class="titleCard"><p>Boton emergencia medica</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="message">Detalle</label>
          <input id="message" type="text" autocomplete="off" v-model="emergencyNum.message">
          </div>
          <div>
          <label for="contraseña">Telefono</label>
          <input id="contraseña" v-model="emergencyNum.phones[0].phoneNumber" type="text"  :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="!emergencyNumInitial? updateButton('emergency') : addButton('emergency')">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button :disabled="loadingMode" @click.prevent="!emergencyNumInitial? updateButton('emergency') : addButton('emergency')">{{!emergencyNumInitial? 'Modificar' : 'Agregar'}}</button>
      </div>
    </article>
      <article class="newlocal">
      <div class="titleCard"><p>Boton Policia</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="message">Detalle</label>
          <input id="message" type="text" autocomplete="off"  v-model="policeNum.message">
          </div>
          <div>
          <label for="contraseña">Telefono</label>
          <input id="contraseña" v-model="policeNum.phones[0].phoneNumber" type="text"  :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="!policeNumInitial? updateButton('police') : addButton('police')">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button :disabled="loadingMode" @click.prevent="!policeNumInitial? updateButton('police') : addButton('police')">{{!policeNumInitial? 'Modificar' : 'Agregar'}}</button>
      </div>
    </article>
    <EditModal v-if="showEditModal" :local="buttonSelected" :countries="countries" :user="user" @click:cancel="showEditModal=false" @update:local="updateButton($event); showEditModal=false" @cancel:click="showEditModal=false"  />
    <DeleteModal v-if="showDeleteModal" @delete:local="deleteButton" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/locals/DeleteModal.vue'
import EditModal from '@/components/locals/EditModal.vue'
import Loading from '@/components/ui/Loading.vue'
export default {
  name: 'ButtonsIndex',
  components: {
    DeleteModal,
    EditModal,
    Loading
  },
  data: () => ({
    user: {},
    countries: [],
    countrySelected: {},
    currentButtons: [],
    buttonSelected: {},
    emergencyNum: { phones: [{ phoneNumber: '' }], message: '' },
    emergencyNumInitial: false,
    policeNum: { phones: [{ phoneNumber: '' }], message: '' },
    policeNumInitial: false,
    showDeleteModal: false,
    showEditModal: false,
    searchValue: '',
    tableFilter: [],
    loadingMode: false
  }),
  async fetch () {
    await this.$axios
      .$get('/api/getUser')
      .then(async (response) => {
        this.user = response
        this.user.isMain
          ? await this.$axios
            .$get('/api/getAllButtons')
            .then(async (response) => {
              await this.$axios
                .$get('/api/getAllCountries')
                .then((response) => {
                  this.countries = response.countries
                })
                .catch((e) => {
                  this.$toasted.show(`Error al recuperar paises: ${e.response.data.msg}`, {
                    theme: 'toasted-primary',
                    position: 'top-right',
                    duration: 5000
                  })
                })
              this.currentButtons = response.buttons
              this.tableFilter = response.buttons
            })
            .catch((e) => {
              this.$toasted.show(`Error al recuperar botones: ${e.response.data.msg}`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000
              })
            })
          : await this.$axios
            .$get('/api/getAllButtons')
            .then((response) => {
              this.currentButtons = response.buttons
              this.tableFilter = response.buttons
              this.loadingMode = false
              this.$fetchState.pending = false
              if (!this.user.isMain) {
                this.policeNum = [...response.buttons].find(n => n.name === 'police')
                this.emergencyNum = [...response.buttons].find(n => n.name === 'emergency')
                if (!this.policeNum) { this.policeNum = { phones: [{ phoneNumber: '' }], message: '' }; this.policeNumInitial = true }
                if (!this.emergencyNum) { this.emergencyNum = { phones: [{ phoneNumber: '' }], message: '' }; this.emergencyNumInitial = true }
              }
            })
            .catch((e) => {
              this.$toasted.show(`Error al recuperar botones: ${e.response.data.msg}`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000
              })
            })
      })
      .catch((e) => {
        this.$toasted.show(`Error al recuperar el tipo de usuario: ${e.response.data.msg}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      })
  },
  methods: {
    async getButtons () {
      this.loadingMode = true
      this.$fetchState.pending = true
      this.currentButtons = []
      this.tableFilter = []
      await this.$axios
        .$get('/api/getAllButtons')
        .then((response) => {
          this.currentButtons = response.buttons
          this.tableFilter = response.buttons
          this.loadingMode = false
          this.$fetchState.pending = false
        })
        .catch((e) => {
          this.loadingMode = false
          this.$toasted.show(`Error al recuperar botones: ${e.response.data.msg}`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
        })
    },
    searchFilter () {
      this.tableFilter = this.currentButtons.filter(
        (u) =>
          (u.name
            ? u.name.toLowerCase().includes(this.searchValue.toLowerCase())
            : false) ||
          (u.location_address
            ? u.location_address
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
            : false) ||
          (u.client
            ? u.client.toLowerCase().includes(this.searchValue.toLowerCase())
            : false) ||
          (u.location_city_name
            ? u.location_city_name
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
            : false) ||
          (u.location_country_name
            ? u.location_country_name
              .toLowerCase()
              .includes(this.searchValue.toLowerCase())
            : false)
      )
    },
    setCountrySelected (countryName) {
      this.countrySelected = this.countries.find((o) => countryName === o.name)
      const buttonsByCounty = this.currentButtons.filter(b => b.country.id === this.countrySelected.id)
      this.policeNum = [...buttonsByCounty].find(n => n.name === 'police')
      this.emergencyNum = [...buttonsByCounty].find(n => n.name === 'emergency')
      if (!this.policeNum) { this.policeNum = { phones: [{ phoneNumber: '' }] }; this.policeNumInitial = true }
      if (!this.emergencyNum) { this.emergencyNum = { phones: [{ phoneNumber: '' }] }; this.emergencyNumInitial = true }
    },
    validateNum (tel) {
      if (this.user.isMain) {
        if (!this.countrySelected.id) {
          this.$toasted.show('Seleccione pais', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          return false
        } else {
          const regTel =
       /^\d{3,}$/
          if (!regTel.test(tel)) {
            this.$toasted.show('Numero de telefono incorrecto', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            })
            return false
          } else {
            return true
          }
        }
      } else {
        const regTel =
       /^\d{3,}$/
        if (!regTel.test(tel)) {
          this.$toasted.show('Numero de telefono incorrecto', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          return false
        } else {
          return true
        }
      }
    },
    async addButton (type) {
      let validacion = false
      let countryID = this.user.country
      if (this.user.isMain) {
        countryID = this.countrySelected.id
      }
      if (type === 'police') {
        validacion = this.validateNum(this.policeNum.phones[0].phoneNumber)
      } else {
        validacion = this.validateNum(this.emergencyNum.phones[0].phoneNumber)
      }
      if (validacion) {
        let body = {}
        if (type === 'police') {
          body = {
            name: 'police',
            phone: [this.policeNum.phones[0].phoneNumber],
            country: countryID,
            message: this.policeNum.message
          }
        } else {
          body = {
            name: 'emergency',
            phone: [this.emergencyNum.phones[0].phoneNumber],
            country: countryID,
            message: this.emergencyNum.message
          }
        }
        this.$toasted.show('Guardando cambios..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        await this.$axios
          .$post('/api/createNewButton', body)
          .then((res) => {
            if (type === 'police') {
              this.policeNumInitial = false
              this.policeNum = res.button
            } else if (type === 'emergency') {
              this.emergencyNumInitial = false
              this.emergencyNum = res.button
            }
            const newButton = res.button
            const countryOfButton = this.countries.find(c => c.id === newButton.country)
            newButton.country = countryOfButton
            this.tableFilter.push(newButton)
            this.currentButtons = [...this.tableFilter]
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            })
            this.loadingMode = false
          })
          .catch((e) => {
            if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '[{"invalid name":"Name is already in use"}]'
            ) {
              this.$toasted.show('ERROR: Nombre de boton en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else {
              this.$toasted.show(
                `Error al crear boton: ${e}`,
                {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000
                }
              )
            }
            this.loadingMode = false
          })
      }
    },
    async updateButton (type) {
      let validacion = false
      if (type === 'police') {
        validacion = this.validateNum(this.policeNum.phones[0].phoneNumber)
      } else {
        validacion = this.validateNum(this.emergencyNum.phones[0].phoneNumber)
      }
      if (validacion) {
        this.loadingMode = true
        let body = {}
        let buttonID = ''
        if (type === 'police') {
          this.policeNumInitial = false
          body = {
            phone: [this.policeNum.phones[0].phoneNumber],
            message: this.policeNum.message
          }
          buttonID = this.policeNum.id
        } else {
          this.emergencyNumInitial = false
          body = {
            phone: [this.emergencyNum.phones[0].phoneNumber],
            message: this.emergencyNum.message
          }
          buttonID = this.emergencyNum.id
        }
        await this.$axios
          .$put(`/api/updateButton/${buttonID}`, body)
          .then((res) => {
            if (type === 'police') {
              this.policeNumInitial = false
            } else if (type === 'emergency') {
              this.emergencyNumInitial = false
            }
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            })
            const indexT = this.currentButtons.findIndex(
              (t) => t.id === res.button.id
            )
            this.tableFilter[indexT].phones = res.button.phones
            this.currentButtons = this.tableFilter
            this.loadingMode = false
          })
          .catch((e) => {
            if (
              JSON.stringify(e.response.data.error['Errors List']) ===
            '[{"invalid name":"Name is already in use"}]'
            ) {
              this.$toasted.show('ERROR: Nombre de usuario en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else if (
              JSON.stringify(e.response.data.error['Errors List']) ===
            '{"message error":"message in use"}'
            ) {
              this.$toasted.show('ERROR: Email en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else {
              this.$toasted.show(
              `Error al actualizar boton: ${JSON.stringify(
                e.response.data.error['Errors List']
              )}`,
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000
              }
              )
            }
            this.loadingMode = false
          })
      }
    },
    deleteButton () {
      this.loadingMode = true
      const buttonID = this.buttonSelected.id
      this.$axios
        .$delete(`/api/deleteButton/${buttonID}`)
        .then((res) => {
          this.$toasted.show('Cambios guardados', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          this.currentButtons = this.currentButtons.filter(
            (u) => u.id !== this.buttonSelected.id
          )
          this.showDeleteModal = false
          this.tableFilter = this.currentButtons
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(
            `Error al borrar cliente: ${JSON.stringify(
              e.response.data.error['Errors List']
            )}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            }
          )

          this.loadingMode = false
        })
    }
  }
}
</script>
<style scoped>
@media (max-width: 1000px) {
  section {
    padding: 0 0.1rem;
  }
  td {
    padding: 0.1rem 0.1rem;
  }
  th {
    padding: 0.5rem 0.1rem;
  }
  .newlocal {
    max-height: 35rem;
  }
  .titleCard {
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    gap: 1rem 0;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    gap: 1rem 0;
  }
}
@media (min-width: 1000px) {
  section {
    padding: 0 5rem;
  }
  td {
    padding: 0.5rem;
  }
  th {
    padding: 0.5rem;
  }

.newlocal {
  overflow: hidden;
}
  .titleCard {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: column;
    gap: 0 1rem;
  }
}
section {
  position: relative;
  background: var(--background-color);
  display: grid;
  grid-auto-flow: row;
  gap: 2rem 0;
  margin-top: 4rem;
  box-sizing: border-box;
  height: calc(100vh - 10rem);
}

article {
  background: white;
  border: 0;
  box-sizing: border-box;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-radius: 0.375rem;
  z-index: 2;
}

.bodyTableContainer {
  width: 100%;
  height: 35rem;
}
.localList {
  height: 40rem;
  overflow: hidden;
}

.titleCard {
  position: relative;
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.fetchState {
  position: absolute;
  z-index: 50;
  color: white;
}

.titleCard p {
  font-size: 1.0625rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
  display: grid;
  align-items: center;
  justify-content: center;
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

.selectContainer {
  padding: 1rem;
}

label {
  color: #525f7f;
  font-size: 0.875rem;
  font-weight: 600;
}

input {
  width: 100%;
  height: 2rem;
  padding: 0.625rem 0.75rem;
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

.contentCard {
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
}

.contentCard form {
  box-sizing: border-box;
}

.contentCard form div {
  display: grid;
  grid-auto-flow: row;
}
.containerAddBtn {
  max-height: 4rem;
  display: grid;
  justify-items: end;
  padding-bottom: 1.25rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.containerAddBtn button {
  width: 8rem;
  height: 2rem;
  border: none;
  text-transform: none;
  transition: all 0.15s ease;
  letter-spacing: 0.025em;
  font-size: 0.875rem;
  will-change: transform;
  color: #fff;
  background-color: #5e72e4;
  border-color: #5e72e4;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  padding: 5px;
}

th {
  background: #f6f9fc;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  color: #8898aa;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: start;
}
td {
  border-bottom: 1px solid #ebeef5;
  line-height: 1;
  text-align: start;
  white-space: nowrap;
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
  color: #525f7f;
}
.searchContainer {
  height: 100%;
  width: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.searchContainer form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.searchContainer input {
  box-sizing: border-box;
  height: 2.5rem;
  padding: 0 3rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.searchIcon {
  position: absolute;
  top: 0.55rem;
  left: 1rem;
  z-index: 1;
}
.clearIcon {
  position: absolute;
  top: 0.55rem;
  left: calc(100% - 3rem);
  z-index: 1;
  cursor: pointer;
}

.inputContainer {
  width: 80%;
  position: relative;
  border: none;
  box-sizing: border-box;
}
</style>
