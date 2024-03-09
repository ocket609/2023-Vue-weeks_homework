<template>
    <h2>訂單</h2>
    <div class="container">
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>購買時間</th>
                    <th>Email</th>
                    <th>購買款項</th>
                    <th>應付金額</th>
                    <th>是否付款</th>
                    <th>編輯</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in orders" :key="item.id">
                    <tr v-if="orders.length" :class="{ 'text-secondary':!item.is_paid }">
                        <!-- 購買時間 -->
                        <td>{{ item.create_at }}</td>
                        <!-- Email -->
                        <td>{{ item.user.email }}</td>
                        <!-- 購買款項 -->
                        <td>{{  }}</td>
                        <!-- 應付金額 -->
                        <td>{{  }}</td>
                        <!-- 是否付款 -->
                        <td></td>
                        <!-- 編輯 -->
                        <td>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm" type="button" @click.prevent="openModal(item)">檢視</button>
                                <button class="btn btn-outline-danger btn-sm" type="button" @click.prevent="delOpenModel(item)">刪除</button>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <!-- 傳入子元件 OrderModal -->
        <OrderModal ref="orderModal" :order="tempOrder" @update-paid="updatePaid"></OrderModal>
        <!-- ref="orderModal" 用於抓取該元件 -->
        <!-- :order="tempOrder" 將父元件的訂單資訊內容傳入子元件 -->
        <!-- @update-paid="updatePaid" 則是用於監聽子元件的 update-paid 函式 -->
    </div>
    <RouterView></RouterView>
</template>

<script>
import axios from 'axios'
import OrderModal from '../../components/OrderModal.vue'

const { VITE_URL, VITE_NAME } = import.meta.env

export default {
  data () {
    return {
      orders: {},
      tempOrder: {},
      currentPage: 1,
      pagination: {}
    }
  },
  components: {
    OrderModal
  },
  methods: {
    // 取得訂單
    getOrder (currentPage = 1) {
      const url = `${VITE_URL}/api/${VITE_NAME}/admin/order?page=${currentPage}`
      // 當前頁面
      this.currentPage = currentPage
      axios
        .get(url)
        .then((res) => {
          console.log(res.data.orders)
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })
    },
    openModal (item) {
      // 鈕觸發 openModal 函式後，將當前訂單資訊重新賦值給 tempOrder
      this.tempOrder = { ...item }
      // 宣告一個 orderComponent 變數用於抓取子元件 orderModal
      const orderComponent = this.$refs.orderModal
      // 並調用 openModal 函式開啟 modal
      orderComponent.openModal()
    },
    delOpenModel (item) {},
    updatePaid (item) {
      const url = `${VITE_URL}/api/${VITE_NAME}/admin/order/${item.id}`
      const paid = {
        is_paid: item.is_paid
      }
      axios
        .put(url, { data: paid })
        .then((res) => {
          console.log(res.data.orders)
          // 串接 API 成功後，同樣宣告一個 orderComponent 變數並調用 hideModal 函式關閉 modal
          const orderComponent = this.$refs.orderModal
          orderComponent.hideModal()

          // 重新取得訂單資料更新畫面
          this.getOrder(this.currentPage)
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    delOrder (item) {}
  }
}
</script>

<style></style>
