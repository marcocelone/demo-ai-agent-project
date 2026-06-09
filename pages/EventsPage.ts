import { Page, Locator } from "@playwright/test";

export class EventsPage {
  readonly page: Page;
  readonly eventCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventCards = page.getByTestId("event-card");
  }

  async goto(): Promise<void> {
    await this.page.goto("/events");
  }

  firstAvailableCard(): Locator {
    return this.eventCards
      .filter({
        has: this.page.getByTestId("book-now-btn"),
      })
      .first();
  }
}
