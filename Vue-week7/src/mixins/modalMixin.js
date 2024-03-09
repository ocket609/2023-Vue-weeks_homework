// 用於管理 modal 的開關功能
// 需要用到 modal 的區塊就能直接引入該檔案使用

import Modal from 'bootstrap/js/dist/modal'

export default {
  // 加入 methods，讓外層可以呼叫他
  methods: {
    // 開
    openModal () {
      this.modal.show()
    },
    // 關
    hideModal () {
      this.modal.hide()
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal)
  }
}
