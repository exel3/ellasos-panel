<template>
  <tr>
    <td>
      <p>{{ local.name }}</p>
    </td>
    <td>
      <p>{{ local.location_address }}</p>
    </td>
    <td>
      <p>{{ local.location_city_name }}</p>
    </td>
    <td>
      <p>{{ clientName }}</p>
    </td>
    <td class="tdOptions">
      <BaseButtonTable
        backcolor="#f7fafc"
        bordercolor="#f7fafc"
        imgsrc="edit.svg"
        @click="$emit('click:edit', clientName)"
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click:delete', local)"
      />
    </td>
  </tr>
</template>
<script>
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRow',
  components: {
    BaseButtonTable,
  },
  props: {
    local: {
      type: Object,
      required: true,
    },
    owners: {
      type: Array,
      required: true,
    },
    user: {
      type: Object,
      required: true
    }
  },
  data:() => ({
    clientName: ''
  }),
  mounted() {
    this.setClientName()
  },
  methods: {
    setClientName() {
      if(this.user.type === "admin"){
      this.clientName = this.owners.find((o) => o.id === this.local.client).username
    }
    else {
      this.clientName = this.user.username
    }
    }
  }

}
</script>
<style>
@media (min-width: 1000px) {
  td {
    padding: 1rem;
  }
}
@media (max-width: 1000px) {
  td {
    padding: 0.1rem 0.5rem;
  }
}
td {
  border-bottom: 1px solid #ebeef5;
  line-height: 1;
  text-align: start;
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
  color: #525f7f;
}
.tdOptions img {
  cursor: pointer;
}
td p {
  line-break: anywhere;
}
</style>