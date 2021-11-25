<template>
  <Loading v-if="$fetchState.pending" class="fetchState" />
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
    <article class="newActionsArticle">
      <div class="titleCard"><p>Nuevo ¿Que hacer en caso de ..?</p></div>
      <div class="newActionsContainer">
        <form @submit.prevent="">
          <div class="newActionsForm">
            <label for="newActions">Caso o situacion</label>
            <input
              id="newActions"
              v-model="newActions"
              type="text"
              autocomplete="off"
              @keyup.enter.prevent="addNewActions"
            />
          </div>
          <div v-if="shownewContentInput" class="newContentForm">
            <textarea
              v-model="newContent"
              type="text"
              autocomplete="off"
              placeholder="Respuesta"
              @keyup.enter.prevent="addNewActions"
            />
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button @click.prevent="addNewActions()">
          {{ buttonAddTitle }}
        </button>
      </div>
    </article>
    <article v-if="tableFilter.length > 0" class="userList">
      <div class="titleCard"><p>Lista de contenidos</p></div>
    </article>
    <article
      v-for="(actions, indexactions) in tableFilter"
      :key="actions._id"
      class="contentList"
    >
      <table>
        <thead>
          <tr>
            <th>
              <input
                v-model="currentActions[indexactions].name"
                class="actionsInput"
                @blur="actionselected = actions;showToast();confirmChangeactions()"
              />
            </th>
            <th>
              <img
                src="@/assets/icons/deleteGray.svg"
                @click="showDeleteModal = true; actionselected = actions"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <textarea
                v-model="actions.content"
                class="contentInput"
                @blur="actionselected = actions;confirmChangeactions()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </article>
    <DeleteModal
      v-if="showDeleteModal"
      @delete:local="deleteActions"
      @cancel:delete="showDeleteModal = false"
    />
  </section>
</template>
<script>
import DeleteModal from '@/components/questions/DeleteModal.vue'
import Loading from '@/components/ui/Loading.vue'
export default {
  name: 'ActionsIndex',
  components: {
    DeleteModal,
    Loading
  },
  data: () => ({
    loadingMode: false,
    showDeleteModal: false,
    shownewContentInput: false,
    actionselected: {},
    currentActions: [],
    countrySelected: {},
    actionsLength: 0,
    tableFilter: [],
    localcontents: [],
    newActions: '',
    newContent: '',
    buttonAddTitle: 'Agregar',
    user: {
      id: '',
      type: '',
      username: ''
    }
  }),
  async fetch () {
    await this.$axios.$get('/api/getUser').then(async (response) => {
      this.user = response
      this.user.isMain
        ? await this.$axios
          .$get('/api/getAllCountries')
          .then((response) => {
            this.countries = response.countries
          })
          .catch((e) => {
            this.$toasted.show(`Error al recuperar paises: ${e}`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            })
          })
        : await this.$axios.$post('/api/getAllActions/0', { country: this.user.country }).then(response => {
          this.currentActions = response.actions
          this.tableFilter = response.actions
          this.loadingMode = false
        })
          .catch((e) => {
            this.loadingMode = false
            this.$toasted.show(
            `Error al recuperar usuario: ${e}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            }
            )
          })
    })
      .catch((e) => {
        this.loadingMode = false
        this.$toasted.show(
            `Error al recuperar usuario: ${JSON.stringify(
              e.response.data.error['Errors List']
            )}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            }
        )
      })
  },
  methods: {
    setCountrySelected (countryName) {
      this.countrySelected = this.countries.find((o) => countryName === o.name)
      this.getAllActions()
    },
    async getAllActions () {
      this.loadingMode = true
      let body = {}
      this.user.isMain ? body = { country: this.countrySelected.id } : body = { country: this.user.country }
      await this.$axios.$post('/api/getAllActions/0', body).then(response => {
        this.currentActions = response.actions
        this.tableFilter = response.actions
        this.loadingMode = false
      })
        .catch((e) => {
          this.loadingMode = false
          this.$toasted.show(
            `Error al recuperar usuario: ${e}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            }
          )
        })
    },
    addNewActions () {
      if ((this.newActions !== '') & (this.buttonAddTitle === 'Agregar')) {
        this.changeShownewContentInput()
        this.buttonAddTitle = 'Confirmar'
      } else if (this.newContent === '') {
        this.$toasted.show('Debe completar el contenido', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      } else if (this.user.isMain && !this.countrySelected.id) {
        this.$toasted.show('Debe seleccionar un pais', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      } else {
        this.$toasted.show('Creando contenido..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000
        })
        this.confirmaddNewActions()
      }
    },
    changeShownewContentInput () {
      this.shownewContentInput = true
    },
    async confirmaddNewActions () {
      if (
        (this.newContent !== '') &
        (this.newActions !== '')
      ) {
        const temporalActions = {
          name: this.newActions,
          content: this.newContent,
          country: this.countrySelected.id ? this.countrySelected.id : this.user.country
        }
        if (this.currentActions === undefined) {
          this.currentActions = []
        }
        // this.currentActions.push(temporalActions)
        const body = temporalActions
        await this.$axios
          .$post('/api/createNewActions', body)
          .then((res) => {
            this.tableFilter.push(res.actions)
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 2000
            })
          }
          )
          .catch((e) => {
            this.$toasted.show(
                `Error al guardar cambios:${e}`,
                {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 10000
                }
            )
            this.loadingMode = false
          })
        this.newActions = ''
        this.newContent = ''
        this.shownewContentInput = false
        this.buttonAddTitle = 'Agregar'
      }
    },

    confirmChangeactions () {
      let body = this.actionselected
      const index = this.currentActions.findIndex(q => q.id === this.actionselected.id)
      if (this.currentActions[index].name === this.actionselected.name) {
        body = { ...this.actionselected, name: null }
      } else if (this.currentActions[index].content === this.actionselected.content) {
        body = { ...this.actionselected, content: null }
      } else {
        body = { ...this.actionselected }
      }
      const emptyAswers = this.currentActions.filter((q) =>
        q.content === ''
      )
      if (emptyAswers.length > 0) {
        this.$toasted.show('No se admiten contenidos vacios', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      } else {
        this.$axios
          .$put(`/api/updateActions/${this.actionselected.id}`, body)
          .then((res) =>
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 2000
            })
          )
          .catch((e) => {
            this.$toasted.show(
              `Error al guardar cambios:${e}`,
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              }
            )
            this.loadingMode = false
          })
      }
    },

    async deleteActions () {
      this.currentActions = this.currentActions.filter(
        (q) => this.actionselected.name !== q.name
      )
      this.tableFilter = [...this.currentActions]
      try {
        this.$toasted.show('Borrando pregunta..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 2000
        })
        await this.$axios.$delete(`/api/deleteActions/${this.actionselected.id}`)
          .then(response =>
            this.$toasted.show('Contenido borrado', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            }))
      } catch (e) {
        this.$toasted.show(`Error al borrar pregunta: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      }
      this.showDeleteModal = false
    },
    addnewContent (actionsIndex) {
      this.currentActions[actionsIndex].contents.push('')
    },
    showToast () {
      this.$toasted.show('Guardando cambios..', {
        theme: 'toasted-primary',
        position: 'top-right',
        duration: 2000
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
  .newTable {
    max-height: 30rem;
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
  .newTable {
    max-height: 30rem;
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
  overflow: hidden;
}
.contentList {
  margin-bottom: 1rem;
}

.newUser {
  max-height: 15rem;
}

.titleCard {
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.titleCard p {
  font-size: 1.0625rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
}

.selectlocal {
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

textarea {
    width: 100%;
  min-height: 6rem;
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

table img {
  cursor: pointer;
}

.newActionsContainer {
  display: grid;
  grid-auto-flow: row;
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
}

.actionsInput {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
}

.contentInput {
  line-height: 1.5;
  color: #525f7f;
  font-weight: 400;
}
#newActions {
  margin-top: 1rem;
}
.newActionsForm {
  margin-bottom: 1rem;
}
.newContentForm {
  margin-bottom: 1rem;
}
.invisibleImg {
  opacity: 0;
  cursor: default;
}
.newTable {
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

.imgDeletecontent {
  width: 1.3rem;
}

.inputContainer {
  width: 80%;
  position: relative;
  border: none;
  box-sizing: border-box;
}
</style>
