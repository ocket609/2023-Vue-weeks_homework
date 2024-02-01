//import { createApp } from "https://unpkg.com/vue@3/dist/vue.global.js";  // 不用 <script> 的cdn連接法
const APIUrl = "https://vue3-course-api.hexschool.io/v2";

// 建環境時將常見三結構先上去 (data methods mounted)
const app = {
    data() {
        return {
            user: {
                "username": "",
                "password": ""
            },
            //text: "123" // 初寫測試
        }
    },
    methods: {
        login() {
            const url = `${APIUrl}/admin/signin`;
            axios
                .post(url, this.user) // 取 data > user
                .then((res) => {
                    console.log(res.data); // 輸入資料登入後 console 看不到 res 資訊
                    const { token, expired } = res.data;
                    console.log(token, expired );
                    document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
                                                                      // 到期日
                    window.location = "./index-4.html"; // 轉址
                    // 把取到的頁面存到 cookie 存放點，換頁還是可以在網頁 Application 內找到 loginToken
                })
                .catch((err) => {
                    console.log(err);
                    alert("登入失敗，請重新操作");
                })
        }
    },
    mounted() {
        //console.log(this.text); // 初寫測試
    }
};

Vue.createApp(app).mount("#app");