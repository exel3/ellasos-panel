<template lang="">
<Loading v-if="$fetchState.pending" class="fetchState" />
  <p v-else-if="$fetchState.error" class="fetchState">Error al cargar los datos</p>
  <section v-else>
    <article class="newCountry">
      <div class="titleCard"><p>Agregar nuevo pais</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="name">Nombre</label>
          <input id="name" v-model="newCountry.name" type="text" placeholder="Argentina" :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addnewCountry">
          </div>
             <div>
          <label for="identificador">Identificador</label>
          <input id="identificador" v-model="newCountry.secondaryId" type="text" placeholder="arg" :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addnewCountry">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button :disabled="loadingMode" @click.prevent="addnewCountry">Agregar</button>
      </div>
    </article>
    <article class="userList">
       <div class="titleCard">
         <p>Lista de paises</p>
          <div class="searchContainer">
          <div class="inputContainer">
            <img class="searchIcon" src="@/assets/icons/search.svg" />
            <img
              v-if="searchValue != ''"
              class="clearIcon"
              src="@/assets/icons/clearInput.svg"
              @click="
                searchValue = ''
                searchFilter()
              "
            />
            <form @submit.prevent>
              <input
                v-model="searchValue"
                placeholder="Buscar.."
                @keyup.prevent="searchFilter()"
              />
            </form>
          </div>
        </div>
       </div>
        <div class="bodyTableContainer">
     <table>
<thead>
<tr>
<th>Pais</th>
<th>Identificador</th>
<th>Opciones</th>
</tr>
</thead>
<tbody>
<BaseRow v-for="country in tableFilter"
:key="country.id"
:country="country"
@click="showDeleteModal = true; countrySelected = country"
@click:delete="showDeleteModal=true; countrySelected=country"
@click:edit="showEditModal=true; countrySelected=country"
/>
</tbody>

</table>
  </div>
    </article>
    <EditModal v-if="showEditModal" :country="countrySelected" @click:cancel="showEditModal=false" @update:country="updateCountry($event); showEditModal=false" @cancel:click="showEditModal=false"  />
    <DeleteModal v-if="showDeleteModal" @delete:country="deleteCountry" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/countries/DeleteModal.vue'
import EditModal from '@/components/countries/EditModal.vue'
import BaseRow from '@/components/countries/BaseRow.vue'
import Loading from '@/components/ui/Loading.vue'
export default {
  name: 'AdminsIndex',
  components: {
    DeleteModal,
    EditModal,
    BaseRow,
    Loading
  },
  data: () => ({
    user: {},
    countrySelected: {},
    newCountry: { name: '', secondaryId: '' },
    showDeleteModal: false,
    showEditModal: false,
    searchValue: '',
    tableFilter: [],
    currentCountries: [],
    loadingMode: false
  }),
  async fetch () {
    await this.$axios
    await this.$axios.$get('/api/getUser')
      .then(async (response) => {
        this.user = response
        await this.$axios.$get('/api/getAllCountries')
          .then((response) => {
            this.tableFilter = response.countries
            this.currentCountries = response.countries
          })
          .catch((e) => {
            this.$toasted.show(`Error al recuperar paises: ${e}`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          })
      })
      .catch((e) => {
        this.$toasted.show(`Error al recuperar el usuario actual: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000
        })
      })
  },
  methods: {
    async getCountries () {
      this.loadingMode = true
      await this.$axios
        .$get('/api/getAllCountries')
        .then((response) => {
          this.currentCountries = response.countries
          this.tableFilter = response.countries
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(`Error al recuperar los paises: ${e}`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          })
          this.loadingMode = false
        })
    },
    searchFilter () {
      this.tableFilter = this.currentCountries.filter(
        (u) =>
          (u.name ? u.name.toLowerCase().includes(this.searchValue.toLowerCase()) : false) ||
          (u.secondaryId ? u.secondaryId.toLowerCase().includes(this.searchValue.toLowerCase()) : false)
      )
    },
    addnewCountry () {
      this.loadingMode = true
      const nameInUse = (this.tableFilter.filter(c => c.name === this.newCountry.name).length > 0)
      const secondaryIdInUse = (this.tableFilter.filter(c => c.secondaryId === this.newCountry.secondaryId).length > 0)
      const regCountry =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
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
      } else if (nameInUse) {
        this.$toasted.show(
          'Nombre de pais en uso',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
        this.loadingMode = false
      } else if (secondaryIdInUse) {
        this.$toasted.show(
          'Identificador de pais en uso',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
        this.loadingMode = false
      } else if (!regCountry.test(this.newCountry.secondaryId)) {
        this.$toasted.show(
          'Formato de identificador de pais incorrecto',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
        this.loadingMode = false
      } else {
        const { name, secondaryId } = this.newCountry
        const body = { name, secondaryId }
        this.$toasted.show('Guardando cambios..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        this.$axios
          .$post('/api/createNewCountry', body)
          .then((res) => {
            this.currentCountries.push(res.country)
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
              '{"name error":"name in use"}'
            ) {
              this.$toasted.show('ERROR: Nombre de usuario en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '{"secondaryId error":"secondaryId in use"}'
            ) {
              this.$toasted.show('ERROR: secondaryId en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else {
              this.$toasted.show(
                `Error al crear pais: ${e.response.data.msg}`,
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
    updateCountry (countryC) {
      let body = {}
      this.loadingMode = true
      const countryID = countryC.id
      const index = this.tableFilter.findIndex(c => countryC.id === c.id)
      const countryPrev = this.tableFilter[index]
      if (countryPrev.name === countryC.name) {
        body = { secondaryId: countryC.secondaryId }
      }
      if (countryPrev.secondaryId === countryC.secondaryId) {
        body = { name: countryC.name }
      }
      if (countryPrev.name !== countryC.name && countryPrev.secondaryId !== countryC.secondaryId) {
        body = { ...countryC }
      }
      this.$axios
        .$put(`/api/updateCountry/${countryID}`, body)
        .then((res) => {
          const countryUpdated = res.country
          const index = this.tableFilter.findIndex(u => u.id === countryUpdated.id)
          this.tableFilter[index] = countryUpdated
          // this.currentCountries.push(this.newCountry)
          this.$toasted.show('Cambios guardados', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          // this.getCountries()
          this.loadingMode = false
        })
        .catch((e) => {
          if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"name error":"name in use"}'
          ) {
            this.$toasted.show('ERROR: Nombre de usuario en uso', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          } else if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"secondaryId error":"secondaryId in use"}'
          ) {
            this.$toasted.show('ERROR: secondaryId en uso', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          } else {
            this.$toasted.show(
              `Error al actualizar pais: ${
                e.response.data.error.msg
              }`,
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000
              }
            )
          }
          this.loadingMode = false
        })
    },
    deleteCountry () {
      this.loadingMode = true
      const countryID = this.countrySelected.id

      this.$axios
        .$delete(`/api/deleteCountry/${countryID}`)
        .then((res) => {
          this.$toasted.show('Cambios guardados', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          this.currentCountries = this.currentCountries.filter(
            (u) => u.id !== this.countrySelected.id
          )
          this.showDeleteModal = false
          this.tableFilter = this.currentCountries
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(
            `Error al borrar pais: ${JSON.stringify(
              e.response.data.msg
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
  .newCountry {
    max-height: 25rem;
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
  .newCountry {
    max-height: 15rem;
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
.userList {
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
.newCountry {
  overflow: hidden;
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
