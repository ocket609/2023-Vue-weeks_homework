const APIUrl = "https://vue3-course-api.hexschool.io/v2";

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
            const url = `${APIUrl}/admin/signin`;
            axios
                .post(url, this.user)
                .then((res) => {
                    console.log(res.data);

                    // 將 token, expired 兩個變數從回傳的資料中取出
                           // 解構賦值
                    const { token, expired } = response.data;
                    console.log(token, expired);
                    console.dir(token, expired);
                    // token 是登入成功時該 API 會產生的資料，可以理解成一個登入憑證，在串接後台 API 時需要帶入這個 token 才能通過驗證取得資料。
                    // expired 則是一個時間戳記，用於記錄使用者登入的時間。

                    document.cookie = `loginToken=${token}; expires=${new Date (expired)}; path=/`;
                    // 利用 document.cookie 語法將 token 存入網站 cookie 中，並使用 expired 設置過期時間，這裡 expired 回傳的是後端幫我們處理好的值。

                    window.location = "https://ocket609.github.io/2023-Vue-weeks_homework/Vue-week3/index-3";
                    // 儲存完 token 後，就可以執行 window.location = "index.html"; 這段，將網頁重新導向到產品頁面，完成登入頁面的功能。
                })
                .catch((err) => {
                    console.log(err.response);
                    alert("登入錯誤！");
                })
        }
    },
}
Vue.createApp(app).mount("#app");