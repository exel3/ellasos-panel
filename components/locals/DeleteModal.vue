<template>
  <div class="containerModal">
    <div class="modalBox">
      <div class="imgContainer"><img src="@/assets/icons/warning.svg" /></div>
      <div class="modalText">
        <h1>ADVERTENCIA</h1>
        <p>
          Eliminar el local borrará todas sus mesas de la base de datos,
          ¿Desea continuar?
        </p>
      </div>
      <div class="modalButtons">
        <button @click.prevent="$emit('delete:local')">Eliminar</button
        ><button @click.prevent="$emit('cancel:delete')">Cancelar</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DeleteModal',
}
</script>
<style scoped>
@media (max-width: 1000px) {
  .modalBox {
    width: 15rem;
    height: 20rem;
  }
  .containerModal {
    left: 0;
    width: 100%;
  }
}
@media (min-width: 1000px) {
  .modalBox {
    width: 30rem;
    height: 20rem;
  }
  .containerModal {
    left: 15rem;
    width: calc(100% - 15rem);
  }
}
.containerModal {
  position: fixed;
  top: 65px;
  height: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: grid;
  align-items: center;
  justify-content: center;
}

.modalBox {
  border-radius: 0.375rem;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border: none;
  background: white;
  padding: 1.25rem;
  position: relative;
}

.modalText {
  color: #595959;
}

.modalText h1 {
  text-align: center;
}

.modalButtons {
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-auto-flow: column;
  position: absolute;
  bottom: 1rem;
  left: 0;
  gap: 0 1rem;
}

.modalButtons button {
  color: #fff;
  background-color: #fb6340;
  border-color: #fb6340;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  font-weight: 600;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.625rem 1.25rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  text-transform: uppercase;
  cursor: pointer;
}

.imgContainer {
  height: 50%;
  width: 100%;
}

.imgContainer img {
  width: 100%;
  height: 100%;
}
</style>