import AmazonRA from '../ResourceAccess/AmazonRA';
import { HeadlessBrowser } from '../Contracts/HeadlessBrowser';
import { IDisposable } from '../Contracts/IDisposable';

const asyncUsing = async <TDisposableResourceType extends IDisposable>(
  resource: TDisposableResourceType,
  asyncFunction: (resource: TDisposableResourceType) => Promise<void>
): Promise<void> => {
  try {
    return await asyncFunction(resource);
  } finally {
    await resource.dispose();
  }
};

class BookManager {
  public async list(
    io: any,
    lastPageNumber: number,
    hasAbortedRequest: Promise<boolean>
  ): Promise<void> {
    let numPagesFromBrowser: number = 0;
    await asyncUsing<HeadlessBrowser>(new HeadlessBrowser(), async browser => {
      const page = await browser.getPage();
      numPagesFromBrowser = (await hasAbortedRequest)
        ? 0
        : await AmazonRA.getNumPagesFromBrowser(page);
    });
    const numPages = Math.min(numPagesFromBrowser, lastPageNumber);

    await asyncUsing<HeadlessBrowser>(new HeadlessBrowser(), async browser => {
      const page = await browser.getPage();
      const listIterator = AmazonRA.ListGenerator(numPages, page);
      let listIteratorResult = await listIterator.next();
      while (!listIteratorResult.done) {
        const scrapes = listIteratorResult.value;
        io.emit('scrapes-ready', scrapes);
        listIteratorResult = await listIterator.next();
      }
    });
  }
}

export default new BookManager();
