<template>
    <div class="container">
        <h2>後台</h2>
        <nav>
            <RouterLink to="/admin/products">產品列表</RouterLink> |
            <RouterLink to="/admin/order">訂單</RouterLink> |
            <RouterLink to="/admin/coupon">優惠卷</RouterLink> |
            <RouterLink to="/">返回前台</RouterLink>
        </nav>
        <RouterView></RouterView>
    </div>
</template>

<script>
import axios from 'axios'

const { VITE_URL } = import.meta.env

export default {
  methods: {
    // 登入驗證
    checkAdmin () {
      const url = `${VITE_URL}/api/user/check`
      axios
        .post(url)
        .then((response) => {
          console.log('驗證成功：', response.data.success)
        })
        .catch(() => {
          // console.log(err.data)
          this.$router.push('/login')
        })
    }
  },
  mounted () {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    axios.defaults.headers.common.Authorization = token
    this.checkAdmin()
  }
}
</script>
