import { AmazonScrape } from '../Contracts/AmazonScrape';
import { Book } from '../Contracts/Book';

class GoogleBooksRA {
  constructor() {}
  public async list(scrapes: Array<AmazonScrape>): Promise<Array<Book>> {
    console.log(scrapes);
    return [];
  }
}

export default new GoogleBooksRA();
