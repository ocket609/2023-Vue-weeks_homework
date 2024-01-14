// login
const app = {
    data() {
        return {
            user: {
                "username": "",  // API文件規格
                "password": ""  // API文件規格
              }
        }
    },
    methods: {
        login() {
            // 宣告變數存放API網址
            const APIUrl = "https://vue3-course-api.hexschool.io/v2/admin/signin";
            axios
                .post(APIUrl, this.user) // this.user => data.return.user
                // axios 發送 POST 請求，並帶上 this.user 的資料 (使用者輸入的帳號與密碼)
                .then((response) => { // 登入成功
                    console.log(response);
                          // 解構賦值
                    const { token, expired } = response.data; // 將 token, expired 兩個變數從回傳的資料中取出
                    // 這邊可以從 API 文件查看預期會回傳哪些資料(status、message、uid、token、expired)。
                    // token 是登入成功時該 API 會產生的資料，可以理解成一個登入憑證，在串接後台 API 時需要帶入這個 token 才能通過驗證取得資料。
                    // expired 則是一個時間戳記，用於記錄使用者登入的時間。
                    console.log(token, expired);
                    console.dir(token, expired);

                    document.cookie = `loginToken=${token}; expires=${new Data (expired)};`;
                    // 利用 document.cookie 語法將 token 存入網站 cookie 中，並使用 expired 設置過期時間，這裡 expired 回傳的是後端幫我們處理好的值。
                    window.location = "";
                    // 儲存完 token 後，就可以執行 window.location = "index.html"; 這段，將網頁重新導向到產品頁面，完成登入頁面的功能。
                })
                .catch((err) => { // 登入失敗
                    console.log(err.data);
                    alert("登入錯誤！")
                })
        }
    },
}
Vue.createApp(app).mount("#app");

// window.location = "..." -> 跳轉到某頁