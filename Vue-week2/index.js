// 產品資料格式-Vue
const app = {
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io/v2",
            apiPath: "qoo",
            products: [],
            temProduct: {},
        };
    },
    methods: {
        // 先在 data 將會用到的資料定義好，再到 methods 宣告一個 checkAdmin 函式，處理驗證登入的功能
        // 登入驗證
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios
                .post(url)
                .then((response) => {
                // 若驗證成功，進入 .then 顯示文字「驗證成功！」並執行取得產品資料函式
                    console.log(response.data);
                    console.log("驗證成功"); // 測試用，功能沒問題後可移除
                    this.getProducts();
                })
                .catch((err) => {
                    console.log(err.data);
                    // 驗證失敗，就進入 .catch 將頁面重新導向回 login.html
                    window.location = "";
                })
        },

        // 取得產品資訊
        getProducts() {
            const url = `${this.apiUrl}/api/${apiPath}/admin/products`;
            axios
                .get(url)
                .then((response) => {
                    console.log(response.data);
                    this.products = response.data.products;
                })
                .catch((err) => {
                    conolse.log(err.data);
                })
        }
    },
    mounted() {
        // 到 mounted 將 token 取出，並直接設定到 axios 的預設內容中，這種寫法可以不用在每次發送請求時重複帶入 token 這段，較簡便的作法。
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        //this.checkAdmin();
    },
};
Vue.createApp(app).mount("#app");