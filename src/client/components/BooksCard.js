const BooksCard = Vue.component('books-card', {
  template: ` <div class="books__card">
                <div
                  class="books__card-content"
                  @mouseleave="hasHover = false"
                  @mouseenter="hasHover = true"
                >
                  <span 
                    v-if="hasHover"
                    > {{book.title}}</span>
                  <img 
                    v-else 
                    :src="book.src"
                    />
                </div>
                <div class="books__action-btns-col">
                  <span 
                    class="add-btn btn"
                    @click="add(book)"
                    >Add</span>
                  <span
                    class="info-btn btn"
                    @click="showInfo(book)"
                    >Info</span>
                </div>
              </div>`,
  props: {
    book: Object
  },
  data: () => ({
    hasHover: false
  })
});
export { BooksCard };
