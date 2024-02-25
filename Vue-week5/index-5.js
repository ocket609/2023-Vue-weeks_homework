const APIUrl = "https://vue3-course-api.hexschool.io/v2";
const APIPath = "qoo";

// 定義驗證規則，驗證失敗時才會跳出提示文字
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 設定語言環境
// 使用 VeeValidateI18n.loadLocaleFromURL 語法載入繁體中文的 CDN
// 只要將末端的 ar.json 改為 zh_TW.json 即可，這段意思是語言代碼
// 再使用 VeeValidate.configure 將回饋訊息的語言設定為繁體中文，並在輸入內容就即時驗證
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json');

VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 直接包成元件
const userModal = {
    // 把資料傳進去
    props: ["tempProduct", "addToCart"],
    data() {
        return {
            // 建立屬性給 userProductModal 用
            modalUser: null,
            // 要記錄用戶選擇的數量
            qty: 1,  // 預設為1
        };
    },
    methods: {
        open() {  // 開啟 Modal
            this.modalUser.show();
        },
        close() {  // 關閉 Modal
            this.modalUser.hide();
        }
    },
    watch: { // 重置
        tempProduct() {  // 當 tempProduct 的值有變化時，重置回1
            this.qty = 1;
        }
    },
    template: "#userProductModal",
    // 取 ref 來用
    mounted() {
        // 加入之後可以使用 this
        this.modalUser = new bootstrap.Modal(this.$refs.modal);
        //this.modalUser.show();
    }
}

const app = Vue.createApp({
    data() {
        return {
            products: [], // 產品列表
            tempProduct: {},
            status: {  // 所有狀態都集中管理
                // 讀取也是種狀態
                addCartLoading: "",  // 加入購物車
                modalLoading: "",  // 查看更多
                cartQtyLoading: ""  // 購物車列表數量
            },

            // 表單資料(驗證/送出訂單)
            form: {
                user: {
                    name: "",
                    email: "",
                    tel: "",
                    address: "",
                },
                message: "",
            },

            // 購物車資料集
            carts: {},
        }
    },
    methods: {  // 方法
        // 取得產品資訊
        getProducts() {
            const url = `${APIUrl}/api/${APIPath}/products/all`;
            axios
                .get(url)
                .then((res) => {
                    console.log(res.data);
                    this.products = res.data.products // 儲存產品列表
                })
                .catch((err) => {
                    console.log(err.data.message);
                })
        },
        openModal(product) {  // 用參數的方式將 product 傳進去
            this.tempProduct = product;
            this.$refs.userModal.open();

            // loading...
            this.status.modalLoading = product.id;
            // 關閉 Modal 後 loading 還在，不知該怎麼寫；因此先給關閉******
            //this.status.modalLoading = "";
        },

        // 加入購物車
        addToCart(product_id, qty = 1) {
        // 帶入產品ID
        // 購物車會帶入數量， qty = 1 -> 給參數預設值
            const url = `${APIUrl}/api/${APIPath}/cart`;
            // 客戶購物車 API文件 post 需求結構
            const order = {
                product_id,
                qty,  // 帶上數量
            };
            console.log(order);

            // loading...
            this.status.addCartLoading = product_id;  // 指向當前ID
            // 加入過程中會把ID儲存起來
            
            // 如要測試 order，API先不送
            axios
                .post(url, { data: order })
                .then((res) => {
                    console.log(res.data);
                    this.status.addCartLoading = ""; // 加入購物車完成後清空
                    // 加入購物車後重新取得購物車產品列表
                    this.getCart();
                    // 加入後關閉 Modal
                    this.$refs.userModal.close();
                })
                .catch((err) => {
                    console.log(err.data.message);
                })
        },

        // 購物車數量調整
        adjustCartQty(item, qty = 1){
            const url = `${APIUrl}/api/${APIPath}/cart/${item.id}`;
            // 客戶購物車數量調整 API文件 put
            const order = {
                product_id: item.product_id,
                qty,
            };
            console.log(order);

            // loading...
            this.status.cartQtyLoading = item.id;
            
            // 為確保可正確執行，測試 order，API先不送
            axios
                .put(url, { data: order })
                .then((res) => {
                    console.log(res.data);
                    this.status.cartQtyLoading = "";  // 發送後清空
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err.data.message);
                })
        },

        // 刪除購物車
        removeCartItem(id){
            const url = `${APIUrl}/api/${APIPath}/cart/${id}`;
            this.status.cartQtyLoading = id;  // 與購物車數量調整，共用 loading

            // 確保可正確執行，測試時API先不送
            axios
                .delete(url)
                .then((res) => {
                    console.log(res.data);
                    this.status.cartQtyLoading = "";  // 發送後清空
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err.data.message);
                    alert(err.data.message);
                })
        },

        // 購物車
        getCart() {
            const url = `${APIUrl}/api/${APIPath}/cart`;
            axios
                .get(url)
                .then((res) => {
                    console.log(res);
                    // 把整個購物車的資料帶出來
                    this.carts = res.data.data;  // 帶出的資料存到 data.return.carts 內
                    console.log(this.carts);
                })
                .catch((err) => {
                    console.log(err.data.message);
                })
        },

        // 送出訂單
        createOrder() {
            const url = `${APIUrl}/api/${APIPath}/order`;
            // 送出訂單 API文件 post

            // 宣告變數 order 存放串接 API 需要的表單資料(需求的資料結構同 data > form 內的資料格式)
            const order = this.form;  // this.form => 往外找，取到 data.return.form
            console.log(order);
            
            // 為確保可正確執行，測試 order，API先不送
            axios
                .post(url, { data: order })
                .then((res) => {
                    console.log(res.data);
                    alert(res.data.message);
                    this.$refs.form.resetForm();  // 成功送出後使用 resetForm() 語法來清除表單欄位的內容
                    this.form.message = ""; // 成功送出後，清空留言
                    this.getCart();
                })
                .catch((err) => {
                    console.log(err.data.message);
                    alert(err.data.message);
                })
        }

    },
    components: {  // 區域註冊，把 userModal 加入到元件裡面，使用屬性 components
        userModal,
        // 也可以另外包成JS檔再帶進來(第四週作業)
    },
    mounted() {  // 生命週期，取資料
        this.getProducts();
        this.getCart();
    },
});
app.component('VForm', VeeValidate.Form);  // 對應到 HTML 中原本的 form 標籤
app.component('VField', VeeValidate.Field);  // 對應到 input 標籤
app.component('ErrorMessage', VeeValidate.ErrorMessage);  // 驗證失敗時會顯示的提示訊息

app.mount("#app");
