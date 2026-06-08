import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { EventsPage } from "../pages/EventsPage.js";
import { EventDetailPage } from "../pages/EventDetailPage.js";
import { BookingsPage } from "../pages/BookingsPage.js";
import { BookingDetailPage } from "../pages/BookingDetailPage.js";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  eventsPage: async ({ page }, use) => {
    await use(new EventsPage(page));
  },

  eventDetailPage: async ({ page }, use) => {
    await use(new EventDetailPage(page));
  },

  bookingsPage: async ({ page }, use) => {
    await use(new BookingsPage(page));
  },

  bookingDetailPage: async ({ page }, use) => {
    await use(new BookingDetailPage(page));
  },

  // Composite fixture: authenticated user with no prior bookings + all POMs ready
  cleanSession: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const bookingsPage = new BookingsPage(page);

    await loginPage.login();
    await bookingsPage.clearAll();

    await use({
      page,
      eventsPage: new EventsPage(page),
      eventDetailPage: new EventDetailPage(page),
      bookingsPage,
      bookingDetailPage: new BookingDetailPage(page),
    });
  },
});

export { expect };
