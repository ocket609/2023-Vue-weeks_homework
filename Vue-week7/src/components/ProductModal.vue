<template>
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 id="productModalLabel" class="modal-title">
                        <span>新增產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="mb-2">
                                <div class="mb-3">
                                    <label for="imageUrl" class="form-label">輸入圖片網址</label>
                                    <!-- tempProduct 資料帶入欄位定位 -->
                                    <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="editProduct.imageUrl">
                                </div>
                                <img class="img-fluid" :src="editProduct.imageUrl" alt="">
                            </div>
                            <div>
                                <h4>多圖設置</h4>
                                <!-- 判斷 editProduct.imagesUrl 是一個陣列 -->
                                <div v-if="Array.isArray(editProduct.imagesUrl)">
                                    <div v-for="(img, key) in editProduct.imagesUrl" :key="key + 123">
                                        <img :src="img" alt="" class="img-fluid">
                                        <input type="text" class="form-control" v-model="editProduct.imagesUrl[key]">
                                    </div>
                                    <button class="btn btn-outline-primary btn-sm d-block w-100" v-if="editProduct.imagesUrl.length === 0 || editProduct.imagesUrl[editProduct.imagesUrl.length - 1]" @click="editProduct.imagesUrl.push('')">
                                    <!-- 最後一個有值的情況下 -->
                                        新增圖片
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm d-block w-100" v-else @click="editProduct.imagesUrl.pop('')">
                                        刪除圖片
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="mb-3">
                                <label for="title" class="form-label">標題</label>
                                <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="editProduct.title">
                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="category" class="form-label">分類</label>
                                    <input id="category" type="text" class="form-control"
                                        placeholder="請輸入分類" v-model="editProduct.category">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">單位</label>
                                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="editProduct.unit">
                                </div>
                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model="editProduct.origin_price">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">售價</label>
                                    <input id="price" type="number" min="0" class="form-control"
                                        placeholder="請輸入售價" v-model="editProduct.price">
                                </div>
                            </div>
                            <hr>
                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入產品描述" v-model="editProduct.description">
                                </textarea>
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">說明內容</label>
                                <textarea id="description" type="text" class="form-control"
                                    placeholder="請輸入說明內容" v-model="editProduct.content">
                                </textarea>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input id="is_enabled" class="form-check-input" type="checkbox"
                                        :true-value="1" :false-value="0" v-model="editProduct.is_enabled">
                                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-primary" @click="updateProduct">
                        確認
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  props: ['tempProduct', 'updateProduct'], // 解決當下 Modal 的錯誤
  data () { // 要把 modalproduct 給整個元件做使用，因此要宣告一個新的變數，所以要加入 data
    return {
      modalproduct: null,
      editProduct: {}
    }
  },
  methods: { // 讓外層可以呼叫他，可以加入 methods
    openModal () { // 加入開啟行為
      this.modalproduct.show()
    },
    closeModal () { // 加入關閉行為
      this.modalproduct.hide()
    }
  },
  watch: {
    tempProduct () {
      this.editProduct = this.tempProduct
    }
  },
  mounted () {
    this.modalproduct = new Modal(this.$refs.productModal)
    // this.modalproduct.show()  // 測試是否可以正常開啟
    this.editProduct = this.tempProduct
  }
}
</script>

<style></style>
