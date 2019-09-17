<template>
  <div class="drag-page container">
    <ul @mousedown="mousedown" :id="drag.id" v-for="drag in dragList" :key='drag.id'>
      <li :id="item.value" class="drag-el" v-for="(item, index) in drag.dataList" :key="index">{{item.value}}</li>
      <li :style="dragStyle" v-if="parentNodeId == drag.id">{{value}}</li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
  .drag-page{
    margin-left: 230px;
    ul{
      width: 300px;
      height: 300px;
      background: #FFFFF0;
      border: 1px solid #CCC;
      display: inline-block;
      margin-right: 120px;
      margin-top: 20px;
      vertical-align: top;
      position relative;

      li{
        margin: 0 auto;
        height: 30px;
        margin-top: 20px;
        background: #EED2EE;
        list-style-type: none;
        width: 90%;
        border-radius: 5px;
        line-height: 30px;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
export default {
  name: 'Drag',
  data () {
    return {
      permitDrag: false, // 是否允许移动标识

      dragList: [{
        id: 'A',
        dataList: [{
          value: '1'
        }, {
          value: '2'
        }, {
          value: '3'
        }]
      }, {
        id: 'B',
        dataList: []
      }, {
        id: 'C',
        dataList: []
      }, {
        id: 'D',
        dataList: []
      }, {
        id: 'E',
        dataList: []
      }, {
        id: 'F',
        dataList: []
      }],

      dragStyle: {},
      parentNodeId: '',
      value: ''
    }
  },
  methods: {
    mousedown (event) {
      if (event.target.className === 'drag-el') {
        const value = event.target.innerText
        const parentNodeId = event.target.parentNode.id
        this.parentNodeId = parentNodeId
        this.value = value
        this.permitDrag = true
        this.dragStyle = {
          'position': 'absolute',
          'background-color': '#FF8C69',
          'margin-top': '0px',
          'top': event.target.offsetTop + 'px',
          'left': event.target.offsetLeft + 'px',
          'display': 'block',
          'z-index': '99'
        }

        document.onmousemove = e => {
          if (!this.permitDrag) {
            return
          }
          // 偏移距离
          var x = e.clientX - (event.clientX - event.target.offsetLeft)
          var y = e.clientY - (event.clientY - event.target.offsetTop)
          this.dragStyle = {...this.dragStyle, left: x + 'px', top: y + 'px'}
          // 鼠标坐标
          const targetX = e.x
          const targetY = e.y
          document.querySelectorAll('.container ul').forEach((item, index) => {
            const offsetTop = item.offsetTop
            const offsetLeft = item.offsetLeft
            const offsetX = offsetLeft + item.offsetWidth
            const offsetY = offsetTop + item.offsetHeight
            if ((targetY > offsetTop && targetY < offsetY) && (targetX > offsetLeft && targetX < offsetX)) {
              item.style.backgroundColor = '#FFEFD5'
            } else {
              item.style.backgroundColor = '#FFFFF0'
            }
          })
        }

        document.onmouseup = e => {
          if (!this.permitDrag) {
            return
          }
          this.permitDrag = false
          this.dragStyle = {
            'position': 'absolute',
            'background-color': '#FF8C69',
            'display': 'none'
          }
          let selectIndex
          // 当前鼠标的坐标
          const targetX = e.x
          const targetY = e.y
          // console.log(targetX, targetY, 'targetX, targetY')
          document.querySelectorAll('.container ul').forEach((item, index) => {
            // 每个ul的占位坐标
            const offsetTop = item.offsetTop
            const offsetLeft = item.offsetLeft
            const offsetX = offsetLeft + item.offsetWidth
            const offsetY = offsetTop + item.offsetHeight
            // console.log(offsetX, '====offsetX===')
            // console.log(offsetY, '====offsetY===')
            if ((targetY > offsetTop && targetY < offsetY) && (targetX > offsetLeft && targetX < offsetX)) {
              selectIndex = index
              item.style.backgroundColor = '#FFFFF0'
            }
          })
          if (selectIndex === undefined) {
            return
          }

          const dataFix = (index, i) => {
            this.dragList[index].dataList.push({
              value
            })
            this.dragList[i].dataList = this.dragList[i].dataList.filter(item => item.value !== value)
          }

          if (parentNodeId === 'A' && selectIndex !== 0) {
            dataFix(selectIndex, 0)
          }
          if (parentNodeId === 'B' && selectIndex !== 1) {
            dataFix(selectIndex, 1)
          }
          if (parentNodeId === 'C' && selectIndex !== 2) {
            dataFix(selectIndex, 2)
          }
          if (parentNodeId === 'D' && selectIndex !== 3) {
            dataFix(selectIndex, 3)
          }
          if (parentNodeId === 'E' && selectIndex !== 4) {
            dataFix(selectIndex, 4)
          }
          if (parentNodeId === 'F' && selectIndex !== 5) {
            dataFix(selectIndex, 5)
          }
        }
      }
    }
  }
}
</script>
