import { Page, Locator, expect } from '@playwright/test';
import TestData from "../data/test-data.json"

export default class ChatPage {
  readonly page: Page;
  readonly askquestion_en: Locator
  readonly askquestion_ar: Locator
  readonly disclaimerAcceptBtn: Locator;
  readonly chatInput: Locator;
  readonly sendBtn: Locator;
  readonly chatMessages: Locator;
  readonly languageToggle: Locator;
  readonly loadingIndicator: Locator;
  readonly chatHistoryBtn: Locator;
  readonly loader: Locator;
  readonly sendbutton_en: Locator
  readonly sendbutton_ar: Locator
  readonly arabic: Locator
  readonly english: Locator
  readonly response: Locator

  constructor(page: Page) {
    this.page = page;
    this.disclaimerAcceptBtn = this.page.getByRole('button', { name: 'Accept and continue' });
    this.askquestion_en = this.page.getByRole('textbox', { name: 'Please ask me a question' })
    this.askquestion_ar = this.page.getByRole('textbox', { name: 'من فضلك، اطرح سؤالك' })
    this.sendbutton_en = this.page.getByRole('button', { name: 'Send Message' })
    this.sendbutton_ar = this.page.getByRole('button', { name: 'إرسال رسالة' })
    this.chatInput = this.page.locator('#conversation');
    this.sendBtn = this.page.locator('button.send-btn');
    this.chatMessages = this.page.locator('[id^="msg-"]');
    this.languageToggle = this.page.locator('a:has-text("العربية"), a:has-text("English")');
    this.loadingIndicator = this.page.locator('.dot-flashing');
    this.chatHistoryBtn = this.page.getByRole('button', { name: 'Open Chat History' });
    this.loader = this.page.getByRole('option', { name: 'loader' })
    this.arabic = this.page.getByLabel('Arabic')
    this.english = this.page.getByLabel('English')
    this.response = this.page.locator('run-type-renderer > div')
  }

  async navigate() {
    await this.page.goto('/en/uask/');
  }

  async acceptDisclaimer() {

    await this.disclaimerAcceptBtn.click();

  }

  async sendMessage(message: string) {
    await this.chatInput.fill(message);
    await this.chatInput.press('Enter');
  }

  async getLatestResponse(): Promise<string | null> {
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => { });
    const messages = this.chatMessages;
    const count = await messages.count();
    if (count > 0) {
      return await messages.nth(count - 1).innerText();
    }
    await this.page.waitForTimeout(15000);
    return null;
  }

  async switchLanguage(lang: 'EN' | 'AR') {
    const currentLang = await this.page.url();
    if (lang === 'AR' && currentLang.includes('/en/')) {
      await this.arabic.click();
    } else if (lang === 'EN' && currentLang.includes('/ar/')) {
      await this.english.click();
    }
  }

  async isRTL(): Promise<boolean> {
    const dir = await this.page.getAttribute('html', 'dir');
    return dir === 'rtl';
  }

  async waitForLoaderToEnd() {
    const loader_logo = this.loader;
    await loader_logo.waitFor({ state: 'hidden' });
  }

  // async pagecheck() {
  //       await this.page.getByRole('button', { name: 'Open Chat History' }).click();
  //       await this.page.getByRole('button', { name: 'Delete Chat' }).click();
  // }

  async fillAskQuestionField_english(str: string): Promise<void> {
    await expect(this.askquestion_en).toBeVisible()
    await this.askquestion_en.fill(str)

    await this.sendbutton_en.click()
    await this.page.waitForLoadState()
  }

  async fillAskQuestionField_arabic(str: string): Promise<void> {
    await expect(this.askquestion_ar).toBeVisible()
    await this.askquestion_ar.fill(str)

    await this.sendbutton_ar.click()
    await this.page.waitForLoadState()
  }

  async clickAcceptContinue() {
    await expect(this.disclaimerAcceptBtn).toBeVisible()
    await this.disclaimerAcceptBtn.click()
  }

  async checkInputCleared_en() {
    await expect(this.askquestion_en).toHaveValue('');
  }

  async checkInputCleared_ar() {
    await expect(this.askquestion_ar).toHaveValue('');
  }

  async OpenArabicPage() {
    await expect(this.askquestion_en).toBeVisible()
    await this.arabic.click()
    await this.askquestion_ar.click()
    await expect(this.askquestion_ar).toBeVisible()
  }

  async waitForResponse() {
    await expect(this.response).toBeVisible()
    const missingWords = await this.compareLocatorText(this.response);
    expect(missingWords).toEqual([]);
  }

  async compareLocatorText(locator: Locator): Promise<string[]> {
    const text = (await locator.allTextContents()).join(' ').toLowerCase();
    return TestData.words.filter(word => !text.includes(word.toLowerCase())
    );
  }
}
