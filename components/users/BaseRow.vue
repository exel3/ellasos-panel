<template>
  <tr>
     <td><p>{{ admin.email }}</p></td>
       <td><p>No visible</p></td>
           <td><p>{{ admin.namesAndSurname }}</p></td>
           <td><p>{{ admin.country.name }}</p></td>
    <td v-if="user.isMain" class="tdOptions">
      <BaseButtonTable
        backcolor="#f7fafc"
        bordercolor="#f7fafc"
        imgsrc="edit.svg"
        @click="
          $emit('click:edit')
        "
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click:delete', admin)"
      />
    </td>
  </tr>
</template>
<script>
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRow',
  components: {
    BaseButtonTable
  },
  props: {
    admin: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
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
