export default {
    props: ["pages", "getProducts()"],  // 從外部資料引入，外到內
    template: `
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{disabled: !pages.has_pre}">
                <a class="page-link" href="#" aria-label="Previous"
                    @click="getProducts(pages.current_page - 1)">
                    <!-- "pages.current_page - 1" => 前一頁，當前頁減一 -->
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" 
                :class="{active: page === pages.current_page}" 
                v-for="page in pages.total_pages" :key="page + 123">
            <!-- pages.total_pages 總頁數跑回圈 -->
            <!-- pages.current_page 當前頁面 -->
            <!-- 這邊 page 為單純數字索引，Vue 不建議用索引當 key 值，因此加入一段隨意的值進去 -->
                <a class="page-link" href="#"
                    @click="getProducts(page)">
                    {{ page }}
                </a>
            </li>
            <li class="page-item" :class="{disabled: !pages.has_next}">
                <a class="page-link" href="#" aria-label="Next"
                    @click="getProducts(pages.current_page + 1)">
                    <!-- "pages.current_page + 1" => 後一頁，當前頁加一 -->
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`
}