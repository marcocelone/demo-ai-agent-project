import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("you@email.com");
    this.passwordInput = page.getByLabel("Password");
    this.loginBtn = page.locator("#login-btn");
    this.homeLink = page.getByRole("link", { name: /Browse Events/i }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async login(
    email = process.env.TEST_USER_EMAIL || "rahulshetty1@gmail.com",
    password = process.env.TEST_USER_PASSWORD || "Magiclife1!",
  ): Promise<void> {
    await this.goto();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
    await this.homeLink.waitFor();
  }
}
