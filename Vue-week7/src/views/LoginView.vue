<template>
    <h2>登入頁面</h2>
    <div class="container">
        <div class="row justify-content-center">
            <h1 class="h3 mb-3 font-weight-normal">
                請先登入
            </h1>
            <div class="col-8">
                <form id="form" class="form-signin" @submit.prevent="login">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="username"
                    placeholder="name@example.com" required autofocus v-model="user.username">
                    <label for="username">Email address</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="password"
                    placeholder="Password" required  v-model="user.password">
                    <label for="password">Password</label>
                </div>
                <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
                    登入
                </button>
                </form>
            </div>
        </div>
        <p class="mt-5 mb-3 text-muted">
            &copy; 2021~∞ - 六角學院
        </p>
    </div>
    <RouterView></RouterView>
</template>

<script>
import axios from 'axios'

// 取出環境變數
console.log(import.meta.env)
const { VITE_URL } = import.meta.env
// const APIUrl = 'https://vue3-course-api.hexschool.io/v2'

export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      const url = `${VITE_URL}/admin/signin`
      axios
        .post(url, this.user)
        .then((res) => {
          // console.log(res.data)
          const { token, expired } = res.data
          // console.log(token, expired)
          document.cookie = `loginToken=${token}; expires=${new Date(expired)}`
          // 到期日
          this.$router.push('admin/products') // 轉址
        })
        .catch(() => {
          alert('登入失敗，請重新操作')
        })
    }
  },
  mounted () {
    console.log(this.$router, this.torte)
  }
}
</script>
