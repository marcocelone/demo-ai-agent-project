# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-management.spec.ts >> Booking Management — Critical Happy Paths >> TC-001: displays booking card on bookings list page
- Location: tests/booking-management.spec.ts:37:7

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: /clear all bookings/i })

```

# Test source

```ts
  1  | import { Page, Locator } from "@playwright/test";
  2  | 
  3  | export class BookingsPage {
  4  |   readonly page: Page;
  5  |   readonly emptyStateText: Locator;
  6  |   readonly clearAllBtn: Locator;
  7  |   readonly cards: Locator;
  8  |   readonly browseEventsLink: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.emptyStateText = page.getByText("No bookings yet");
  13 |     this.clearAllBtn = page.getByRole("button", {
  14 |       name: /clear all bookings/i,
  15 |     });
  16 |     this.cards = page.getByTestId("booking-card");
  17 |     this.browseEventsLink = page
  18 |       .getByRole("main")
  19 |       .getByRole("link", { name: "Browse Events" });
  20 |   }
  21 | 
  22 |   async goto(): Promise<void> {
  23 |     await this.page.goto("/bookings");
  24 |   }
  25 | 
  26 |   cardByRef(bookingRef: string): Locator {
  27 |     return this.cards.filter({ hasText: bookingRef });
  28 |   }
  29 | 
  30 |   async clearAll(): Promise<void> {
  31 |     await this.goto();
  32 |     const isEmpty = await this.emptyStateText.isVisible().catch(() => false);
  33 |     if (isEmpty) return;
  34 |     this.page.once("dialog", (dialog) => dialog.accept());
> 35 |     await this.clearAllBtn.click();
     |                            ^ Error: locator.click: Test ended.
  36 |     await this.emptyStateText.waitFor();
  37 |   }
  38 | }
  39 | 
```