import { MainContainer } from './components/MainContainer.js';
import { BooksCard } from './components/BooksCard.js';
const main = () => {
  new Vue({
    el: '#app',
    components: {
      MainContainer,
      BooksCard
    }
  });
};

export { main };
