<template>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="modal">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                        <span>訂單細節</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h3>用戶資料</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>姓名</th>
                                        <td>{{ tempOrder.uesr.name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{{ tempOrder.user.email }}</td>
                                    </tr>
                                    <tr>
                                        <th>電話</th>
                                        <td>{{ tempOrder.user.tel }}</td>
                                    </tr>
                                    <tr>
                                        <th>地址</th>
                                        <td>{{ tempOrder.user.address }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-md-8">
                            <h3>訂單細節</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>訂單編號</th>
                                        <td>{{ tempOrder.id }}</td>
                                    </tr>
                                    <tr>
                                        <th>下單時間</th>
                                        <td>{{ tempOrder.create_at }}</td>
                                    </tr>
                                    <tr>
                                        <th>付款時間</th>
                                        <td>
                                            <span class="text-success" v-if="tempOrder.paid_date"></span>
                                            <span v-else>時間不正確</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>付款狀態</th>
                                        <td>
                                            <strong v-if="tempOrder.is_paid">已付款</strong>
                                            <span v-else>尚未付款</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>總金額</th>
                                        <td>{{ tempOrder.total }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h3>選購商品</h3>
                            <table>
                                <thead>
                                    <tr></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <td></td>
                                        <td class="text-end"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="d-flex justify-content-end">
                                <div class="form-check">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        value=""
                                        id="flexCheckDefault"
                                        v-model="tempOrder.is_paid">
                                    <label class="form-check-label" for="flexCheckDefault">
                                        <span v-if="tempOrder.is_paid">已付款</span>
                                        <span v-else>未付款</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="$emit('update-paid, tempOrder')">修改付款狀態</button>
                    <!-- 運用 emit 自定義事件將修改好的 tempOrder 訂單資料回傳給父元件 -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//  import 匯入 modalMixin
import modalMixin from '../mixins/modalMixin'

export default {
  props: {
    order: {
      type: Object,
      default () {
        return {}
      }
    },
    data () {
      return {
        modal: '',
        tempOrder: {},
        isPaid: false
      }
    },
    // eslint-disable-next-line vue/require-prop-type-constructor, no-undef
    emits: ['update-paid'],
    // (1) 上方 import 匯入
    // (2) 下方 加入 mixins: [modalMixin],，就可以直接在該元件使用 modalMixin 中的開關 modal 函式
    // 開關 modal 操作對應到 AdminOrderView
    mixins: [modalMixin],

    // 將父元件透過 props 傳入的 order 訂單資訊使用 watch 監聽
    watch: {
      order () {
        // 重新宣告一個 tempOrder 變數賦值
        this.tempOrder = this.order
        // 避免從子元件直接修改到父元件的資料，違反 Vue 的單向數據流原則造成錯誤
      }
    }
  }
}
</script>

<style></style>
