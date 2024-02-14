const APIUrl = "https://vue3-course-api.hexschool.io/v2";
const APIPath = "qoo";

import pagination from "./pagination.js";

const app = {
    data() {
        return {
            products: [],
            tempProduct: {
                imageUrl: [], // 多圖
            },
            pages: {}, // 分頁

            // 建立屬性，給 productModal 用
            modalproduct: null,
            // 建立屬性，給 delProductModal 用
            modalDel: null,
            // 判斷是否為新增 (來決定API行為為新增或編輯)
            isNew: false,
        }
    },
    // 通常 axios 會另外定義方法去跑他
    methods: {  // 方法 
        getProducts(page = 1) {  // 參數預設值
            /* 取得產品資料 */
            const url = `${APIUrl}/api/${APIPath}/admin/products?page=${page}`;
            console.log(url); // 檢查是否有正確取得，是否一致
            axios
                .get(url)
                .then((res) => {
                    console.log(res.data);
                    this.products = res.data.products;
                    this.pages = res.data.pagination; // 取到 data 分頁
                })
                .catch((err) => {
                    console.log(err);
                })
        },

        // 開啟 Modal
        // status 為新增 new 或編輯 edit ； item 帶入 products 內容 
        openModal(status, item) {
            console.log("openModal");
            // 判斷 status 把兩個流程拆開
            if (status === "new") {
                // 新增初始 tempProduct 為空物件
                this.tempProduct = {
                    imagesUrl: [] // 可多圖，初始為陣列
                };
                this.isNew = true;
                this.modalproduct.show(); // 開啟 Modal
            } else if (status === "edit") {
                this.tempProduct = { ...item }; // 淺拷貝
                // 判斷 this.tempProduct.imagesUrl 這個是不是陣列，如果不是的話我們幫他補進去
                // 確保不管有沒有資料，都能做"新增圖片"的行為
                if (!Array.isArray(this.tempProduct.imagesUrl)) {
                    this.tempProduct.imagesUrl = [];
                }
                this.isNew = false;
                this.modalproduct.show();
            } else if (status === "delete") {
                this.tempProduct = { ...item };
                this.modalDel.show();
            }
            //this.modalproduct.show(); 寫入新增與編輯的判斷中
        },
        // 建立產品 與 編輯產品
        updateProduct() {
            let changeAPI = "post";

            // 新增 API - post
            let url = `${APIUrl}/api/${APIPath}/admin/product`;
            // 更新 API - put
            if (!this.isNew) { // 判斷如果不是新增
                url = `${APIUrl}/api/${APIPath}/admin/product/${this.tempProduct.id}`;
                changeAPI = "put";
            }

            axios
                // 看API文件，post 會夾帶 data資料
                [changeAPI](url, {
                    data: this.tempProduct,
                })
                .then((res) => {
                    console.log(res.data);
                    // 建立完新產品要重新取得列表
                    this.getProducts();
                    // 新增成功後關閉 Modal
                    this.modalproduct.hide(); // 關閉 Modal
                    this.tempProduct = {}; // 清除框內輸入內容
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        deleteProduct() {
            const url = `${APIUrl}/api/${APIPath}/admin/product/${this.tempProduct.id}`;

            axios
                .delete(url, {
                    data: this.tempProduct,
                })
                .then((res) => {
                    console.log(res.data);
                    // 建立完新產品重新取得列表
                    this.getProducts();
                    // 新增成功後關閉 Modal
                    this.modalDel.hide(); // 關閉 Modal
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
    mounted() {  // 生命週期，拉資料
        /* 登入驗證 */
        // 拉出cookie
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        console.log(token);
        axios.defaults.headers.common['Authorization'] = token;
        // 管理後台的 api 必須要帶入 token，要帶在 headers 裡面；axios 裡查到上方語法帶入 token

        this.getProducts();  // 驗證後執行 getProducts()

        // 產品
        console.log(this.$refs);
                                               // 對應到 HTML Modal區塊
        this.modalproduct = new bootstrap.Modal(this.$refs.productModal);
        this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
        // this.modalproduct.show(); 測試可開啟後移動到 openModal() 內
        // this.modalDel.show();
    },
    components: {  // 區域元件
        pagination,
    }
};
Vue.createApp(app).mount("#app");