export class EventDetailPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByLabel("Full Name");
    this.emailInput = page.locator("#customer-email");
    this.phoneInput = page.getByPlaceholder("+91 98765 43210");
    this.confirmBtn = page.locator(".confirm-booking-btn");
    this.bookingRefEl = page.locator(".booking-ref").first();
    this.viewMyBookingsLink = page.getByRole("link", {
      name: "View My Bookings",
    });
  }

  async fillAndSubmit({
    name = "Test User",
    email = "testuser@example.com",
    phone = "9876543210",
  } = {}) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.confirmBtn.click();
  }

  async getBookingRef() {
    await this.bookingRefEl.waitFor();
    return (await this.bookingRefEl.textContent())?.trim() ?? "";
  }
}
