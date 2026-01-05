import { test, expect } from '@playwright/test';
import ChatPage from '../pages/chatPage';
import * as testData from '../data/test-data.json';


test.describe('UI Checking on Desktop and Mobile ', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(testData.URL)
    const chatPage = new ChatPage(page)
    await chatPage.clickAcceptContinue()
  })

  test("English : UI Check and Loading on Desktop", { tag: ['@EN', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {

    const chatPage = new ChatPage(page)
    await chatPage.fillAskQuestionField_english(testData.prompt_english_driving_license)
    await chatPage.checkInputCleared_en()
  })

  test("English : UI Check and Loading on Mobile", { tag: ['@EN', '@UI', '@Mobile'] }, async ({ page }) => {

    await page.setViewportSize({ width: 402, height: 874 });
    const chatPage = new ChatPage(page)
    await chatPage.fillAskQuestionField_english(testData.prompt_english_driving_license)
    await chatPage.checkInputCleared_en()
  })


  test("Arabic : UI Check and Loading on Desktop", { tag: ['@AR', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {
    const chatPage = new ChatPage(page)
    
    await chatPage.OpenArabicPage()
    await chatPage.fillAskQuestionField_arabic(testData.prompt_arabic_driving_license)
    await chatPage.checkInputCleared_ar()
  })


  test("Arabic : UI Check and Loading on Mobile", { tag: ['@AR', '@UI', '@Mobile'] }, async ({ page }) => {

    await page.setViewportSize({ width: 402, height: 874 });
    const chatPage = new ChatPage(page)
    
    await chatPage.OpenArabicPage()
    await chatPage.fillAskQuestionField_arabic(testData.prompt_english_driving_license)
    await chatPage.checkInputCleared_ar()
  })


  test("Validate the UI Loader on screen", { tag: ['@EN', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {

    const chatPage = new ChatPage(page)
    await chatPage.fillAskQuestionField_english(testData.prompt_english_driving_license)
    await chatPage.checkInputCleared_en()
    await chatPage.waitForLoaderToEnd()
  })

  test('Scroll enabled for long chat', { tag: ['@EN', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {
    const chatPage = new ChatPage(page)
    for (let i = 0; i < 6; i++) {
      await chatPage.fillAskQuestionField_english(testData.prompt_english_driving_license)
      await chatPage.waitForLoaderToEnd()
    }
  })

  test('Validate the Chat History button on chat widget', { tag: ['@EN', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {
    const chatPage = new ChatPage(page)
    await expect(chatPage.chatInput).toBeVisible();
    await expect(chatPage.chatHistoryBtn).toBeVisible();
  });

  test('Arabic language and RTL layout', { tag: ['@AR', '@UI', '@Deskop', '@Mobile'] }, async ({ page }) => {
    const chatPage = new ChatPage(page)
    await chatPage.switchLanguage('AR');
    await expect(page).toHaveURL(/.*\/ar\/.*/);
    const isRtl = await chatPage.isRTL();
  });
});

test.describe('U-Ask Functional Test', () => {
  let chatPage: ChatPage;
  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.navigate();
    await chatPage.acceptDisclaimer();
  });

  for (const query of testData.queries.filter(q => q.language === 'EN')) {
    test(`Chatbot Response validation for: ${query.prompt}`, { tag: ['@EN', '@Functional'] }, async () => {
      await chatPage.sendMessage(query.prompt);
      await chatPage.page.waitForTimeout(10000)
      const response = await chatPage.getLatestResponse();
      for (const keyword of query.expectedKeywords) {
        expect(response?.toLowerCase()).toContain(keyword.toLowerCase());
      }
      await expect(chatPage.chatInput).toHaveValue('');
    });
  }
});

test.describe('Security and Injection Handling', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.navigate();
    await chatPage.acceptDisclaimer();
  });

  test('Validate the Security handling XSS injection safely', { tag: ['@EN', '@Security'] }, async () => {
    const xssPrompt = testData.security.find(s => s.id === 'xss_injection')?.prompt || '';
    await chatPage.sendMessage(xssPrompt);

    const response = await chatPage.getLatestResponse();
    expect(response).not.toContain('<script>');
  });

  test('Validate the resist prompt injection', { tag: ['@EN', '@Security'] }, async () => {
    const injectionPrompt = testData.security.find(s => s.id === 'prompt_injection')?.prompt || '';
    await chatPage.sendMessage(injectionPrompt);

    const response = await chatPage.getLatestResponse();
    expect(response?.toLowerCase()).not.toContain('joke');
  })
});