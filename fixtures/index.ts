import { test as base, expect, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.ts";
import { EventsPage } from "../pages/EventsPage.ts";
import { EventDetailPage } from "../pages/EventDetailPage.ts";
import { BookingsPage } from "../pages/BookingsPage.ts";
import { BookingDetailPage } from "../pages/BookingDetailPage.ts";

export interface CleanSession {
  page: Page;
  eventsPage: EventsPage;
  eventDetailPage: EventDetailPage;
  bookingsPage: BookingsPage;
  bookingDetailPage: BookingDetailPage;
}

type Fixtures = {
  loginPage: LoginPage;
  eventsPage: EventsPage;
  eventDetailPage: EventDetailPage;
  bookingsPage: BookingsPage;
  bookingDetailPage: BookingDetailPage;
  cleanSession: CleanSession;
};

export const test = base.extend<Fixtures>({
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
