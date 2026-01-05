# U-Ask Chatbot Automation Suite

The **U-Ask Chatbot Automation Suite** is a robust, scalable, and maintainable test automation framework developed for the **U-Ask UAE Government Chatbot**. 
The framework leverages **Playwright**, **TypeScript**, and the **Page Object Model (POM)** design pattern to ensure high-quality automated testing, reusability, and ease of maintenance.

## Technology Stack

- **Playwright** – End-to-end browser automation
- **TypeScript** – Strongly typed scripting for better maintainability
- **Page Object Model (POM)** – Structured and reusable test architecture
- **Node.js / npm** – Dependency and package management

## Project Structure

- `pages/`: Contains Page Object Model classes (e.g., `ChatPage.ts`).
- `tests/`: Contains test specifications (e.g., `chatbot.test.ts`).
- `data/`: Contains test data in JSON format (`test-data.json`).
- `playwright.config.ts`: Main configuration for Playwright.

```text
├── pages/
│   └── ChatPage.ts          # Page Object Model classes
├── tests/
│   └── chatbot.test.ts     # Test specifications
├── data/
│   └── test-data.json      # Test data and configurations
├── playwright.config.ts    # Playwright configuration

## Prerequisites

Environment Setup (macOS)
Install Required Software

Node.js
https://nodejs.org/en/download

Visual Studio Code
https://code.visualstudio.com/download



## Setup Instructions

1. **Clone the repository** (or copy the files to your local machine).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Install Playwright Browsers**:
   ```bash
   npx playwright install chromium
   ```

## Running Tests

- **Run all tests**:
  ```bash
  npx playwright test
  ```
- **Run tests in headed mode**:
  ```bash
  npx playwright test --headed
  ```
- **Run a specific test file**:
  ```bash
  npx playwright test tests/chatbot.test.ts
  ```
- **Generate and view report**:
  ```bash
  npx playwright show-report
  ```

## Configuration

### Test Language
The tests are designed to handle both English and Arabic. You can configure the language in `test-data.json` or by modifying the `switchLanguage` call in the test scripts.

### Test Data
Modify `data/test-data.json` to add more queries, expected keywords, or security injection strings.

## AI/ML Validation Strategy

- **Response Validation**: The framework uses keyword-based validation to ensure AI responses are relevant and not hallucinated.
- **Security Testing**: Includes scenarios for XSS and Prompt Injection to ensure the chatbot's safety.
- **Multilingual Support**: Validates both LTR (English) and RTL (Arabic) layouts.

General Setup
Uses Playwright Test framework with Page Object Model (POM) (ChatPage)
Test data (URLs, prompts, queries, security inputs) is read from a JSON file
Covers UI, Functional, and Security aspects of the U-Ask chatbot
Tests run on both Desktop and Mobile viewports
Supports English (LTR) and Arabic (RTL) languages


UI Testing – Desktop & Mobile
Navigates to the chatbot URL before each test
Accepts disclaimer / continue popup before interaction
Validates chat UI behavior for: English Arabic with Mobile and Desktop

Ensures:
User can type a question
Message is sent successfully
Input field is cleared after submission

Loader & Performance UI ChecksValidates that:
A loading indicator (loader) appears after sending a message
Loader disappears once the response is received
Sends multiple messages to: Ensure scrolling works for long chat histories

Functional Testing – AI Response Validation
Iterates over English queries defined in test data
For each query:
Sends the message to the chatbot
Waits for AI response
Validates response contains expected keywords
Confirms input field is cleared after response
Ensures chatbot responses are relevant and meaningful


Security & Injection Handling
Validates chatbot security against:
XSS injection
Ensures <script> tags are not reflected in responses
Prompt injection
Ensures AI does not follow malicious instructions (e.g., telling jokes when it shouldn’t)
Confirms chatbot safely handles malicious inputs

Tags & Test Organization: Uses tags for test filtering: 
@UI, @Functional, @Security
@EN, @AR
@Desktop, @Mobile
Tests are grouped using test.describe for clarity and maintainability

## Note on CAPTCHA
The live site `https://ask.u.ae/` uses reCAPTCHA. In a real-world CI/CD environment, it is recommended to:
1. Use a staging environment where CAPTCHA is disabled.
2. Use a bypass key provided by the development team.
3. Use a CAPTCHA solving service (not recommended for stable automation).