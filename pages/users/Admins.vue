<template lang="">
<Loading v-if="$fetchState.pending" class="fetchState" />
  <p v-else-if="$fetchState.error" class="fetchState">Error al cargar los datos</p>
  <section v-else>
    <article class="newUser">
      <div class="titleCard"><p>Agregar nuevo administrador</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="email">Nombre y apellido</label>
          <input id="email" v-model="newUser.namesAndSurname" type="text" :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addNewUser">
          </div>
          <div>
          <label for="email">Email</label>
          <input id="email" v-model="newUser.email" type="email" :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addNewUser">
          </div>
          <div>
          <label for="contraseña">Contraseña</label>
          <input id="contraseña" v-model="newUser.password" type="text"  :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addNewUser">
          </div>
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
        </form>
      </div>
      <div class="containerAddBtn">
        <button :disabled="loadingMode" @click.prevent="addNewUser">Agregar</button>
      </div>
    </article>
    <article class="userList">
       <div class="titleCard">
         <p>Lista de administradores</p>
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
<th>Email</th>
<th>Contraseña</th>
<th>Nombre</th>
<th>Pais</th>
<th>Opciones</th>
</tr>
</thead>
<tbody>
<BaseRow v-for="admin in tableFilter"
:key="admin.id"
:admin="admin"
:user="user"
@click="showDeleteModal = true; userSelected = admin"
@click:delete="showDeleteModal=true; userSelected=admin"
@click:edit="showEditModal=true; userSelected=admin"
/>
</tbody>

</table>
  </div>
    </article>
    <EditModal v-if="showEditModal" :user="userSelected" :countries="countries" @click:cancel="showEditModal=false" @update:user="updateUser($event); showEditModal=false" @cancel:click="showEditModal=false"  />
    <DeleteModal v-if="showDeleteModal" @delete:user="deleteUser" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/users/DeleteModal.vue'
import EditModal from '@/components/users/EditModal.vue'
import BaseRow from '@/components/users/BaseRow.vue'
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
    currentUsers: [],
    userSelected: {},
    newUser: { namesAndSurname: '', email: '', password: '', id: null, avatar: null },
    showDeleteModal: false,
    showEditModal: false,
    searchValue: '',
    countries: [],
    tableFilter: [],
    loadingMode: false,
    countrySelected: {}
  }),
  async fetch () {
    await this.$axios
      .$get('/api/getAllAdmins')
      .then(async (response) => {
        this.currentUsers = response.admins
        this.tableFilter = response.admins
        await this.$axios.$get('/api/getAllCountries')
          .then(async (response) => {
            this.countries = response.countries
            await this.$axios.$get('/api/getUser')
              .then((response) => {
                this.user = response
              })
              .catch((e) => {
                this.$toasted.show(`Error al recuperar el usuario actual: ${e.response.data.msg}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 10000
                })
              })
          })
          .catch((e) => {
            this.$toasted.show(`Error al recuperar los paises: ${e.response.data.msg}`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          })
      })
      .catch((e) => {
        this.$toasted.show(`Error al recuperar los administradores: ${e.response.data.msg}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000
        })
      })
  },
  methods: {
    async getUsers () {
      this.loadingMode = true
      await this.$axios
        .$get('/api/getAllAdmins')
        .then((response) => {
          this.currentUsers = response.admins
          this.tableFilter = response.admins
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(`Error al recuperar los administradores: ${e.response.data.msg}`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          })
          this.loadingMode = false
        })
    },
    searchFilter () {
      this.tableFilter = this.currentUsers.filter(
        (u) =>
          (u.namesAndSurname ? u.namesAndSurname.toLowerCase().includes(this.searchValue.toLowerCase()) : false) ||
          (u.email ? u.email.toLowerCase().includes(this.searchValue.toLowerCase()) : false)
      )
    },
    setCountrySelected (countryName) {
      this.countrySelected = this.countries.find((o) => countryName === o.name)
    },
    addNewUser () {
      this.loadingMode = true
      const regname = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
      const regemail =
       /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
      const regPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/
      const emailInUse = (this.tableFilter.filter(a => a.email === this.newUser.email).length > 0)
      if (!this.user.isMain) {
        this.countrySelected.id = this.user.country
      }
      if (!regPassword.test(this.newUser.password)) {
        this.$toasted.show(
          'La contraseña debe contener mínimo 8 y máximo 16 caracteres, al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y no contener espacios',
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000
          }
        )
        this.loadingMode = false
      } else if (!regname.test(this.newUser.namesAndSurname)) {
        this.$toasted.show('Formato de nombre y apellido incorrecto, debe contener solo letras', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
      } else if (!regemail.test(this.newUser.email)) {
        this.$toasted.show('Formato de email incorrecto', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        this.loadingMode = false
      } else if (emailInUse) {
        this.$toasted.show('Email en uso', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        this.loadingMode = false
      } else if (!this.countrySelected.id) {
        this.$toasted.show('Seleccione un pais', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        this.loadingMode = false
      } else {
        const { email, password, namesAndSurname, avatar } = this.newUser
        const country = this.countrySelected.id
        const body = { namesAndSurname, email, password, country, avatar }
        this.$toasted.show('Guardando cambios..', {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000
        })
        this.$axios
          .$post('/api/createNewAdmin', body)
          .then((res) => {
            const newAdmin = res.admin
            const countryForAdmin = this.countries.find(c => newAdmin.country === c.id)
            newAdmin.country = countryForAdmin
            this.currentUsers.push(newAdmin)
            this.tableFilter = [...this.currentUsers]
            this.$toasted.show('Cambios guardados', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000
            })
            this.newUser.namesAndSurname = ''
            this.newUser.email = ''
            this.newUser.password = ''
            this.newUser.id = null
            this.loadingMode = false
          })
          .catch((e) => {
            if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '{"namesAndSurname error":"namesAndSurname in use"}'
            ) {
              this.$toasted.show('ERROR: Nombre de usuario en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '{"email error":"email in use"}'
            ) {
              this.$toasted.show('ERROR: Email en uso', {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000
              })
            } else {
              this.$toasted.show(
                `Error al crear administrador: ${JSON.stringify(
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
      this.loadingMode = false
    },
    updateUser (userC) {
      this.loadingMode = true
      const AdminID = userC.id
      const body = { ...userC }
      console.log(body)
      body.avatar = !body.avatar ? '' : body.avatar
      this.$axios
        .$put(`/api/updateAdmin/${AdminID}`, body)
        .then((res) => {
          const userUpdated = res.admin
          userUpdated.country = this.countries.find(c => res.admin.country === c.id)
          const index = this.tableFilter.findIndex(u => u.id === userUpdated.id)
          this.tableFilter[index] = userUpdated
          // this.currentUsers.push(this.newUser)
          this.$toasted.show('Cambios guardados', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          // this.getUsers()
          this.loadingMode = false
        })
        .catch((e) => {
          if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"namesAndSurname error":"namesAndSurname in use"}'
          ) {
            this.$toasted.show('ERROR: Nombre de usuario en uso', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          } else if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"email error":"email in use"}'
          ) {
            this.$toasted.show('ERROR: Email en uso', {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000
            })
          } else {
            this.$toasted.show(
              `Error al actualizar Admin: ${JSON.stringify(
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
    },
    deleteUser () {
      this.loadingMode = true
      const AdminID = this.userSelected.id

      this.$axios
        .$delete(`/api/deleteAdmin/${AdminID}`)
        .then((res) => {
          this.$toasted.show('Cambios guardados', {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000
          })
          this.currentUsers = this.currentUsers.filter(
            (u) => u.id !== this.userSelected.id
          )
          this.showDeleteModal = false
          this.tableFilter = this.currentUsers
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(
            `Error al borrar Admine: ${JSON.stringify(
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
  .newUser {
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
  .newUser {
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
.newUser {
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
