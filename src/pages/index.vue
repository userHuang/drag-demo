<template>
  <drag-demo :drag-list=dragList></drag-demo>
</template>

<script>
import DragDemo from '@/components/DragDemo'
// dragList: [{
//   id: '',
//   dataList: []
// }, {
//   id: '',
//   dataList: []
// }]]
export default {
  data () {
    return {
      dragList: [{
        id: 'A',
        dataList: [{
          value: '1'
        }, {
          value: '2'
        }, {
          value: '3'
        }, {
          value: '4'
        }, {
          value: '5'
        }]
      }, {
        id: 'B',
        dataList: []
      }, {
        id: 'C',
        dataList: []
      }]
    }
  },
  components: {
    DragDemo
  }
}
</script>
