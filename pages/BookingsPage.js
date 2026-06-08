export class BookingsPage {
  constructor(page) {
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

  async goto() {
    await this.page.goto("/bookings");
  }

  cardByRef(bookingRef) {
    return this.cards.filter({ hasText: bookingRef });
  }

  async clearAll() {
    await this.goto();
    const isEmpty = await this.emptyStateText.isVisible().catch(() => false);
    if (isEmpty) return;
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.clearAllBtn.click();
    await this.emptyStateText.waitFor();
  }
}
