import { Page, Locator } from "@playwright/test";

export class BookingsPage {
  readonly page: Page;
  readonly emptyStateText: Locator;
  readonly clearAllBtn: Locator;
  readonly cards: Locator;
  readonly browseEventsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyStateText = page.getByText("No bookings yet");
    this.clearAllBtn = page.getByRole("button", {
      name: /clear all bookings/i,
    });
    this.cards = page.getByTestId("booking-card");
    this.browseEventsLink = page
      .getByRole("main")
      .getByRole("link", { name: "Browse Events" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/bookings");
  }

  cardByRef(bookingRef: string): Locator {
    return this.cards.filter({ hasText: bookingRef });
  }

  async clearAll(): Promise<void> {
    await this.goto();
    const isEmpty = await this.emptyStateText.isVisible().catch(() => false);
    if (isEmpty) return;
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.clearAllBtn.click();
    await this.emptyStateText.waitFor();
  }
}
