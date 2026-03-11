import { Page } from 'puppeteer';

export interface BrowserAuthConfig {
  url: string;
  targetUrlPattern: string;
  extractData: (page: Page, request?: any) => Promise<string>;
  loadingMessage: string;
  successMessage: string;
}