import { test, expect } from "../fixtures/index.ts";
import { EventsPage } from "../pages/EventsPage.ts";
import { EventDetailPage } from "../pages/EventDetailPage.ts";

// ── Shared action ───────────────────────────────────────────────────────────────

interface BookingResult {
  bookingRef: string;
  eventTitle: string;
}

async function bookFirstEvent({
  eventsPage,
  eventDetailPage,
}: {
  eventsPage: EventsPage;
  eventDetailPage: EventDetailPage;
}): Promise<BookingResult> {
  await eventsPage.goto();
  const card = eventsPage.firstAvailableCard();
  await expect(card).toBeVisible();
  const eventTitle = (await card.locator("h3").textContent())?.trim() ?? "";
  console.log(`Booking event: "${eventTitle}"`);

  await card.getByTestId("book-now-btn").click();
  await eventDetailPage.fillAndSubmit();

  const bookingRef = await eventDetailPage.getBookingRef();
  console.log(`Booking confirmed. Ref: ${bookingRef}`);
  return { bookingRef, eventTitle };
}

// ── Test Suite ─────────────────────────────────────────────────────────────────

test.describe("Booking Management — Critical Happy Paths", () => {
  // TC-001 ───────────────────────────────────────────────────────────────────
  test("TC-001: displays booking card on bookings list page", async ({
    cleanSession,
  }) => {
    const { bookingsPage, eventsPage, eventDetailPage } = cleanSession;

    const { bookingRef, eventTitle } = await bookFirstEvent({
      eventsPage,
      eventDetailPage,
    });

    await bookingsPage.goto();
    const card = bookingsPage.cardByRef(bookingRef);
    await expect(card).toBeVisible();
    await expect(card).toContainText(eventTitle);
    await expect(card).toContainText("confirmed");
    await expect(card).toContainText(bookingRef);
  });

  // TC-002 ───────────────────────────────────────────────────────────────────
  test("TC-002: shows all sections on booking detail page", async ({
    cleanSession,
  }) => {
    const {
      page,
      bookingsPage,
      eventsPage,
      eventDetailPage,
      bookingDetailPage,
    } = cleanSession;

    const { bookingRef, eventTitle } = await bookFirstEvent({
      eventsPage,
      eventDetailPage,
    });

    await bookingsPage.goto();
    await bookingsPage
      .cardByRef(bookingRef)
      .getByRole("link", { name: "View Details" })
      .click();
    await expect(page).toHaveURL(/\/bookings\/\d+/);

    await expect(bookingDetailPage.bookingRefEl).toContainText(bookingRef);
    await expect(bookingDetailPage.eventDetailsSection).toBeVisible();
    await expect(page.getByText(eventTitle).first()).toBeVisible();
    await expect(bookingDetailPage.customerDetailsSection).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
    await expect(bookingDetailPage.paymentSummarySection).toBeVisible();
    await expect(bookingDetailPage.totalPaidText).toBeVisible();
    await expect(bookingDetailPage.checkRefundBtn).toBeVisible();
  });

  // TC-006 ───────────────────────────────────────────────────────────────────
  test("TC-006: navigates to bookings list after booking via View My Bookings link", async ({
    cleanSession,
  }) => {
    const { page, eventsPage, eventDetailPage, bookingsPage } = cleanSession;

    await eventsPage.goto();
    const card = eventsPage.firstAvailableCard();
    await expect(card).toBeVisible();
    await card.getByTestId("book-now-btn").click();
    await expect(page).toHaveURL(/\/events\/\d+/);

    await eventDetailPage.fillAndSubmit();
    const bookingRef = await eventDetailPage.getBookingRef();

    await eventDetailPage.viewMyBookingsLink.click();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingsPage.cardByRef(bookingRef)).toBeVisible();
  });

  // TC-102 ───────────────────────────────────────────────────────────────────
  test("TC-102: booking reference starts with first letter of event title (uppercase)", async ({
    cleanSession,
  }) => {
    const { eventsPage, eventDetailPage } = cleanSession;

    const { bookingRef, eventTitle } = await bookFirstEvent({
      eventsPage,
      eventDetailPage,
    });
    const expectedPrefix = eventTitle[0].toUpperCase();
    expect(bookingRef).toMatch(new RegExp(`^${expectedPrefix}-[A-Z0-9]{6}$`));
    console.log(
      `Ref "${bookingRef}" correctly starts with "${expectedPrefix}-" (event: "${eventTitle}")`,
    );
  });

  // TC-003 + TC-506 ──────────────────────────────────────────────────────────
  test("TC-003: cancels booking from detail page — shows toast and redirects", async ({
    cleanSession,
  }) => {
    const {
      page,
      bookingsPage,
      eventsPage,
      eventDetailPage,
      bookingDetailPage,
    } = cleanSession;

    const { bookingRef } = await bookFirstEvent({
      eventsPage,
      eventDetailPage,
    });

    await bookingsPage.goto();
    await bookingsPage
      .cardByRef(bookingRef)
      .getByRole("link", { name: "View Details" })
      .click();
    await expect(page).toHaveURL(/\/bookings\/\d+/);

    await bookingDetailPage.cancelBooking();

    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingDetailPage.cancelSuccessToast).toBeVisible();
    await expect(bookingsPage.emptyStateText).toBeVisible();
  });

  // TC-004 ───────────────────────────────────────────────────────────────────
  test("TC-004: clears all bookings and shows empty state", async ({
    cleanSession,
  }) => {
    const { page, bookingsPage, eventsPage, eventDetailPage } = cleanSession;

    await bookFirstEvent({ eventsPage, eventDetailPage });

    await bookingsPage.goto();
    await expect(bookingsPage.cards.first()).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await bookingsPage.clearAllBtn.click();

    await expect(bookingsPage.emptyStateText).toBeVisible();
    await expect(bookingsPage.browseEventsLink).toBeVisible();
  });
});
