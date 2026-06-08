export class BookingDetailPage {
  constructor(page) {
    this.page = page;
    this.bookingRefEl = page.locator("span.font-mono.font-bold").first();
    this.eventDetailsSection = page.getByText("Event Details");
    this.customerDetailsSection = page.getByText("Customer Details");
    this.paymentSummarySection = page.getByText("Payment Summary");
    this.totalPaidText = page.getByText("Total Paid");
    this.checkRefundBtn = page.locator("#check-refund-btn");
    this.cancelBtn = page.getByRole("button", { name: "Cancel Booking" });
    this.cancelDialogTitle = page.getByText("Cancel this booking?");
    this.confirmCancelBtn = page.locator("#confirm-dialog-yes");
    this.cancelSuccessToast = page.getByText("Booking cancelled successfully");
  }

  async cancelBooking() {
    await this.cancelBtn.click();
    await this.cancelDialogTitle.waitFor();
    await this.confirmCancelBtn.click();
  }
}
