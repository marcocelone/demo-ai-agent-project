export class EventsPage {
  constructor(page) {
    this.page = page;
    this.eventCards = page.getByTestId("event-card");
  }

  async goto() {
    await this.page.goto("/events");
  }

  firstAvailableCard() {
    return this.eventCards
      .filter({
        has: this.page.getByTestId("book-now-btn"),
      })
      .first();
  }
}
