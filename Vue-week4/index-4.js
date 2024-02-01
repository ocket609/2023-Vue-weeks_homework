const APIUrl = "https://vue3-course-api.hexschool.io/v2";
const APIPath = "qoo";

const app = {
    data() {
        return {
            tempProduct: {},
            products: {}
        }
    },
    // 通常 axios 會另外定義方法去跑他
    methods: {  // 方法 
        getProducts() {
            /* 取得產品資料 */
            const url = `${APIUrl}/api/${APIPath}/admin/products/all`;
            console.log(url); // 檢查是否有正確取得，是否一致
            axios
                .get(url)
                .then((res) => {
                    console.log(res.data);
                    this.products = res.data.products;
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
    },
};
Vue.createApp(app).mount("#app");