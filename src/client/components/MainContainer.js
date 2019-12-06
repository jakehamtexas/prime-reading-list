import { tempBooks } from './temp.js';

const listEndpoint = 'http://localhost:8080/';
const MainContainer = Vue.component('main-container', {
  template: ` <div class="books">
                <div @click="doListRequest">List Socket</div>
                <div @click="cancelRequest">Cancel Request</div>
                <div class="books__wrapper">
                  <books-card
                    v-for="book of books"
                    :book="book"
                    />
                <div>
              </div>
              `,
  data: () => ({
    books: [],
    cancelTokenSource: null
  }),
  methods: {
    async doListRequest() {
      const cancelToken = this.cancelTokenSource.token;
      try {
        await axios.get(`${listEndpoint}list`, {
          params: {},
          cancelToken
        });
      } catch (e) {
        console.log(e);
      }
    },
    cancelRequest() {
      this.cancelTokenSource.cancel();
    },
    add(book) {},
    showInfo(book) {}
  },
  created() {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    this.cancelTokenSource = source;
    const socket = io(listEndpoint);
    socket.on('scrapes-ready', scrapes => {
      this.books = _.uniqBy([...scrapes, ...this.books], 'isbn');
    });
    //this.books = tempBooks;
  }
});
export { MainContainer };
