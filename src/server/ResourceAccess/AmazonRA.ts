import { Page } from 'puppeteer';
import { AmazonScrape } from '../Contracts/AmazonScrape';
class AmazonRA {
  public async *ListGenerator(
    numPages: number,
    page: Page
  ): AsyncGenerator<AmazonScrape[], void, unknown> {
    for (let i = 0; i < numPages; i++) {
      const batch: Array<AmazonScrape> = await this.getBatch(page);
      const selector = `.${'a-last'}`;
      if (await page.$(selector)) {
        const navPromise = page.waitForNavigation();
        await page.click(selector);
        await navPromise;
      }
      yield batch;
    }
  }
  private async getBatch(page: Page) {
    return await page.evaluate(() => {
      const isbns = Array.from(document.getElementsByTagName('*'))
        .filter(el => el.hasAttribute('data-asin'))
        .map(el => el.getAttribute('data-asin'));
      return Array.from(document.querySelectorAll('img.s-image')).map(
        (img, idx) => ({
          src: img.getAttribute('src'),
          title: img.getAttribute('alt'),
          isbn: isbns[idx]
        })
      );
    });
  }
  public async getNumPagesFromBrowser(page: Page): Promise<number> {
    const ulSelector = '.a-pagination';
    const ul = await page.$(ulSelector);
    if (ul) {
      return page.evaluate((ulSelector: string) => {
        const ul = document.querySelector(ulSelector) || new Element();
        const lis = ul.children ? ul.children : new HTMLCollection();
        const pageNumberLi =
          Array.from(lis).find((_, index, lis) => index === lis.length - 2) ||
          new Element();
        return Number(pageNumberLi.textContent);
      }, ulSelector);
    } else {
      throw Error("selector isn't working.");
    }
  }
}

export default new AmazonRA();
