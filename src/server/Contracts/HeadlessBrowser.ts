import { IDisposable } from './IDisposable';
import { Page, Browser, launch } from 'puppeteer';

export class HeadlessBrowser implements IDisposable {
  private readonly _url: string;

  private readonly _browser: Promise<Browser>;
  constructor({ url = null, isHeadless = true } = {}) {
    this._browser = launch({ headless: isHeadless });
    this._url =
      url ||
      'https://www.amazon.com/s?bbn=133140011&rh=n%3A133140011%2Cp_n_special_merchandising_browse-bin%3A14807080011&dc&fst=as%3Aoff&qid=1574550143&rnid=14807079011&ref=lp_133140011_nr_p_n_special_merchand_0';
  }

  public async getPage(): Promise<Page> {
    const browser = await this._browser;
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      const blockedResourceTypes = [
        'image',
        'media',
        'font',
        'texttrack',
        'object',
        'beacon',
        'csp_report',
        'imageset'
      ];

      const skippedResources = [
        'quantserve',
        'adzerk',
        'doubleclick',
        'adition',
        'exelator',
        'sharethrough',
        'cdn.api.twitter',
        'google-analytics',
        'googletagmanager',
        'google',
        'fontawesome',
        'facebook',
        'analytics',
        'optimizely',
        'clicktale',
        'mixpanel',
        'zedo',
        'clicksor',
        'tiqcdn'
      ];
      const requestUrl = request
        .url()
        .split('?')[0]
        .split('#')[0];
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
        skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(this._url);
    return page;
  }
  public async dispose(): Promise<void> {
    const browser = await this._browser;
    await browser.close();
  }
}
