<template>
  <div class="drag-page container">
    <transition-group>
    <ul @mousedown="mousedown(drag, index, $event)" :id="drag.id" v-for="(drag, index) in dragList" :key='drag.id'>
      <transition-group>
        <li :id="`li_${item.value}`" class="drag-el" :curli="i" v-for="(item, i) in drag.dataList" :key="`${drag.id}_${item.value}`">{{item.value}}</li>
      </transition-group>
      <li :style="dragStyle" v-if="parentNodeId == drag.id">{{value}}</li>
    </ul>
    </transition-group>
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

    .v-enter-active {
      animation: bounce-in .5s;
    }
    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
  }
</style>

<script type="text/ecmascript-6">
const id2index = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5
}
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
      }],

      dragStyle: {},
      parentNodeId: '',
      value: ''
    }
  },
  methods: {
    mousedown (drag, curUl, event) {
      if (event.target.className === 'drag-el') {
        const value = event.target.innerText
        const parentNodeId = drag.id
        const curLiIndex = event.target.attributes.curli.value
        const curULIndex = curUl
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

          const otherULdataFix = (index, i) => {
            // 移到的UL的id
            const ele = this.dragList[selectIndex].id
            let replaceIndex = -1
            const pNode = document.querySelectorAll(`#${ele}`)[0]
            document.querySelectorAll(`#${ele} span li`).forEach((item, index) => {
            // 当前li的占位坐标
              const offsetY = item.offsetTop + pNode.offsetTop
              if (targetY > offsetY) {
                replaceIndex = index
              }
              if (targetY < 110) {
                replaceIndex = -1
              }
            })
            this.dragList[index].dataList.splice(replaceIndex + 1, 0, {
              value
            })
            this.dragList[i].dataList = this.dragList[i].dataList.filter(item => item.value !== value)
          }

          const sameUlDataFix = (ele) => {
            let replaceIndex = 0
            const pNode = document.querySelectorAll(`#${ele}`)[0]
            document.querySelectorAll(`#${ele} span li`).forEach((item, index) => {
            // 当前li的占位坐标
              const offsetY = item.offsetTop + pNode.offsetTop
              if (targetY > offsetY) {
                replaceIndex = index
              }
            })
            let dataList = this.dragList[curULIndex].dataList
            if (dataList.length > 1 && curLiIndex !== replaceIndex) {
              const curLiArr = dataList[curLiIndex]
              const replaceArr = dataList[replaceIndex]
              dataList = dataList.map((item, i) => {
                if (` ${i} ` !== ` ${curLiIndex} ` && ` ${i} ` !== ` ${replaceIndex} `) {
                  return item
                }
              })
              dataList[curLiIndex] = replaceArr
              dataList[replaceIndex] = curLiArr
              this.dragList[curULIndex].dataList = [...dataList]
              document.querySelectorAll(`#li_${value}`)[0].classList.add('v-enter-active')
              setTimeout(() => {
                document.querySelectorAll(`#li_${value}`)[0].classList.remove('v-enter-active')
              }, 500)
            }
          }
          if (id2index[parentNodeId] !== selectIndex) {
            otherULdataFix(selectIndex, id2index[parentNodeId])
          } else {
            sameUlDataFix(parentNodeId)
          }
        }
      }
    }
  }
}
</script>
