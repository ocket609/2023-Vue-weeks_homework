/* 注意：productModal 必須是在全域環境宣告，假設直接從 mounted 內宣告，會導致該變數作用域只存在 mounted 範圍內（因為 mounted 也屬於函式），而無法在 openModal 函式中順利取得該變數，導致錯誤。 */
let productModal = null;  // 這為何使用null 而不是 ""?
let delProductModal = null;
const APIUrl = "https://vue3-course-api.hexschool.io/v2";
const APIPath = "qoo";

const app = {
    // 資料
    data() {
    // 先在 data 將會用到的資料定義好
        return {
            products: [],

            // 是預期開啟 Modal 時會代入的資料，在 Modal 顯示單一產品內容
            tempProduct: {},
            // 用於表示當前 Modal 是新增或編輯 Modal，以便做後續串接 API 時的判斷
            isNew: false,
        }
    },
    // 方法
    methods: {
        // 登入驗證
        checkAdmin() {
            const url = `${APIUrl}/api/user/check`;
            axios
                .post(url)
                .then((res) => {
                    //console.log(res.data);
                    //console.log("驗證成功"); // 測試用，功能沒問題後可移除
                    alert("驗證成功"); // 測試用，功能沒問題後可移除
                    this.getProducts();
                })
                .catch((err) => {
                    //console.log(err);
                    alert(err.data.message);
                    window.location = "./login-3.html";
                    // 驗證失敗，就進入 .catch 將頁面重新導向回 login-3.html
                })
        },

        // 取得產品資訊
        getProducts() {
            // 只要 API 後方有 /admin 的一定要有 token 驗證才行 ( 也就是必須透過 login 的 API )
            const url = `${APIUrl}/api/${APIPath}/admin/products`;
            axios
                .get(url)
                .then((res) => {
                    //console.log(res.data);
                    this.products = res.data.products;
                    //console.log(this.products);
                })
                .catch((err) => {
                    //console.log(err.data.message);
                    alert(err.data.message);
                })
        },

        // 開啟 Modal
        // 新增 / 編輯 / 刪除 這三支 API 都是在 Modal 操作，所以可以將開啟 Modal 方式整合成一個函式。
        // Bootstrap 提供的語法，開啟 Modal 使用 show()，關閉 Modal 使用 hide()。
        // 到 openModal 函式，對 openModal 使用 show() 語法就完成開啟 Modal 的操作。
        openModal(status, item) {

            // 利用 if 判斷
            // 若 status 為 "new"，表示點擊到新增按鈕，清空當前的 tempProduct 內容，並將 isNew 的值改為 true，最後再開啟 productModal。
            // 若 status 為 "edit"，表示點擊到編輯按鈕，使用展開運算子 …item 將當前產品資料傳入 tempProduct，再將 isNew 的值改為 false，最後開啟 productModal。
            // 若 status 為 "delete"，表示點擊到刪除按鈕，同樣使用展開運算子將產品資料傳入 tempProduct，用意是後續串接刪除 API 時，需要取得該產品的 id，最後開啟 delProductModal。
            if (status === "new") {  // 判斷為 new 新增
                this.tempProduct = {};
                this.isNew = true;
                productModal.show();
            } else if (status === "edit") { // 判斷為 edit 編輯
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            } else if (status === "delete") { // 判斷為 delete 刪除
                this.tempProduct = {...item};
                delProductModal.show();
            }
        },

        // 新增、修改
        updateProduct() {
            // 先宣告 API 網址與串接方法兩個變數
            // 使用 let 可修改
            let url = `${APIUrl}/api/${APIPath}/admin/product/${this.tempProduct.id}`;
            let whichOneAPI = "put";  // put 編輯修改

            // post 新增
                // 判斷 isNew 的值，得知當前開啟的是新增還是編輯 Modal，再動態調整這兩個變數內容。
            if (this.isNew) {
                url = `${APIUrl}/api/${APIPath}/admin/product`;
                whichOneAPI = "post";
            }
            // 這邊的this.isNew = 取到 data.isNew: false，API應該是 編輯才對?

            // axios.post / axios.put
            axios
                // 將兩個變數(url、whichOneAPI)與 tempProduct 資料代入 axios 做串接，就不用分開寫兩次 axios 串接
                [whichOneAPI](url, {
                    data: this.tempProduct
                })
                .then((res) => {
                    //console.log(res.data);
                    alert(res.data.message);
                    productModal.hide();  // 串接完成後，使用 hide 方法關閉 Modal。
                    this.getProducts();  // 重新取得所有產品資料，完成產品更新。
                })
                .catch((err) => {
                    //console.log(err.data.message);
                    alert(err.data.message);
                })
        },

        // 刪除
        // 先前在 openModal 函式已經寫好，開啟刪除 Modal 時，就將當前產品資料傳入 tempProduct，所以這裡就可以直接使用 this.tempProduct.id 取得該產品 id，完成刪除產品功能。
        delProduct() {
            const url = `${APIUrl}/api/${APIPath}/admin/product/${this.tempProduct.id}`;
            axios
                .delete(url)
                .then((res) => {
                    //console.log(res.data);
                    alert(res.data.message);
                    delProductModal.hide();  // 刪除成功後，同樣要記得關閉刪除 Modal
                    this.getProducts();  // 更新資料後，重新取得所有產品的函式，更新所有產品資料。
                })
                .catch((err) => {
                    //console.log(err.response);
                    alert(err.data.message);
                })
        }
    },
    // 
    mounted() {
        // 到 mounted 將 token 取出，並直接設定到 axios 的預設內容中，這種寫法可以不用在每次發送請求時重複帶入 token 這段，較簡便的作法。
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        this.checkAdmin();

        // productModal 在全域宣告變數後，到 mounted 內使用 new bootstrap.Modal 語法來建立 Modal 實體。
        productModal = new bootstrap.Modal(
            // 第一個參數是你要設定為 Modal 的 DOM 元素。
            document.getElementById("productModal"), 
            // 第二個參數則是各種選項設定
            {
            keyboard: false,  // 禁止使用者透過 Esc 按鍵來關閉 Modal 視窗。
            backdrop: "static"  // 禁止使用者點擊 Modal 以外的地方來關閉視窗，避免輸入到一半資料遺失等等。
            }
        );
        delProductModal = new bootstrap.Modal(
            document.getElementById("delProductModal"), 
            {
                keyboard: false,
                backdrop: 'static'
            }
        );

    },
}
Vue.createApp(app).mount("#app");