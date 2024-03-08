<template>
    <h2>產品列表</h2>
    <div class="container">
        <div class="text-end mt-4">
            <button class="btn btn-primary" @click="openModal('new')">
                建立新的產品
            </button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">
                        分類
                    </th>
                    <th>產品名稱</th>
                    <th width="120">
                        原價
                    </th>
                    <th width="120">
                        售價
                    </th>
                    <th width="100">
                        是否啟用
                    </th>
                    <th width="120">
                        編輯
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td>{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td class="text-end">{{ item.origin_price}}</td>
                    <td class="text-end">{{ item.price }}</td>
                    <td>
                        <span class="text-success" v-if="item.is_enabled">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit', item)">
                                編輯
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', item)">
                                刪除
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <PaginationComponent
            :pages = "pages"
            :get-products = "getProducts"
        ></PaginationComponent>
        <!-- 分頁 -->
    </div>
    <!-- Modal -->
    <ProductModal
        :temp-Product="tempProduct"
        :update-Product="updateProduct"
        ref="pModal"></ProductModal>
    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
                aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
// BS5 Modal
import { Modal } from 'bootstrap'
import PaginationComponent from '../../components/PaginationComponent.vue'
import ProductModal from '../../components/ProductModal.vue'

const { VITE_URL, VITE_NAME } = import.meta.env

export default {
  data () {
    return {
      products: [],
      tempProduct: {
        imageUrl: [] // 多圖
      },
      pages: {}, // 分頁

      // 建立屬性，給 productModal 用
      modalproduct: null,
      // 建立屬性，給 delProductModal 用
      modalDel: null,
      // 判斷是否為新增 (來決定API行為為新增或編輯)
      isNew: false
    }
  },
  // 通常 axios 會另外定義方法去跑他
  // 方法
  methods: {
    // 登入驗證
    checkUser () {
      const url = `${VITE_URL}/api/user/check`
      axios
        .post(url)
        .then((res) => {
          // console.log(res.data);
          console.log(res.data.success)
          if (res.data.success) {
            // success = true 執行 getProducts()
            this.getProducts()
          }
        })
        .catch((err) => {
          console.log(err)
          window.location = 'login-4.html'
        })
    },
    getProducts (page = 1) {
      // 參數預設值
      /* 取得產品資料 */
      const url = `${VITE_URL}/api/${VITE_NAME}/admin/products?page=${page}`
      console.log(url) // 檢查是否有正確取得，是否一致
      axios
        .get(url)
        .then((res) => {
          console.log(res.data)
          this.products = res.data.products
          this.pages = res.data.pagination // 取到 data 分頁
        })
        .catch((err) => {
          console.log(err)
          alert(err.data.message)
        })
    },

    // 開啟 Modal
    // status 為新增 new 或編輯 edit ； item 帶入 products 內容
    openModal (status, item) {
      console.log('openModal')
      // 判斷 status 把兩個流程拆開
      if (status === 'new') {
        // 新增初始 tempProduct 為空物件
        this.tempProduct = {
          imagesUrl: [] // 可多圖，初始為陣列
        }
        this.isNew = true
        // this.modalproduct.show(); // 開啟 Modal
        this.$refs.pModal.openModal()
      } else if (status === 'edit') {
        this.tempProduct = { ...item } // 淺拷貝
        // 判斷 this.tempProduct.imagesUrl 這個是不是陣列，如果不是的話我們幫他補進去
        // 確保不管有沒有資料，都能做"新增圖片"的行為
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          this.tempProduct.imagesUrl = []
        }
        this.isNew = false
        this.$refs.pModal.openModal()
      } else if (status === 'delete') {
        this.tempProduct = { ...item }
        this.modalDel.show()
      }
      // this.modalproduct.show(); 寫入新增與編輯的判斷中
    },
    // 建立產品 與 編輯產品
    updateProduct () {
      let changeAPI = 'post'

      // 新增 API - post
      let url = `${VITE_URL}/api/${VITE_NAME}/admin/product`
      // 更新 API - put
      if (!this.isNew) { // 判斷如果不是新增
        url = `${VITE_URL}/api/${VITE_NAME}/admin/product/${this.tempProduct.id}`
        changeAPI = 'put'
      }

      axios
      // 看API文件，post 會夾帶 data資料
        // eslint-disable-next-line no-unexpected-multiline
        [changeAPI](url, {
          data: this.tempProduct
        })
        .then((res) => {
          console.log(res.data)
          // 建立完新產品要重新取得列表
          this.getProducts()
          // 新增成功後關閉 Modal
          // this.modalproduct.hide(); // 關閉 Modal
          this.$refs.pModal.closeModal()
          this.tempProduct = {} // 清除框內輸入內容
        })
        .catch((err) => {
          console.log(err)
          alert(err.data.message)
        })
    },
    deleteProduct () {
      const url = `${VITE_URL}/api/${VITE_NAME}/admin/product/${this.tempProduct.id}`

      axios
        .delete(url, {
          data: this.tempProduct
        })
        .then((res) => {
          console.log(res.data)
          // 建立完新產品重新取得列表
          this.getProducts()
          // 新增成功後關閉 Modal
          this.modalDel.hide() // 關閉 Modal
        })
        .catch((err) => {
          console.log(err)
          alert(err.data.message)
        })
    }
  },
  // 生命週期，拉資料
  mounted () {
    /* 登入驗證 */
    // 拉出cookie
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    console.log(token)
    axios.defaults.headers.common.Authorization = token
    // 管理後台的 api 必須要帶入 token，要帶在 headers 裡面；axios 裡查到上方語法帶入 token

    // 登入驗證
    this.checkUser()
    // this.getProducts();
    // 驗證後執行 getProducts()
    // 改到驗證後執行

    // 產品
    console.log(this.$refs)
    // 對應到 HTML Modal區塊

    this.modalDel = new Modal(this.$refs.delProductModal)
    // this.modalproduct.show(); 測試可開啟後移動到 openModal() 內  // 改到元件內
    // this.modalDel.show();
  },
  // 區域元件
  components: {
    PaginationComponent,
    ProductModal
  }
}
</script>
