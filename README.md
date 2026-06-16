# EventHub — E2E Test Suite

Playwright E2E tests for the ticket booking platform. Tests run against the live staging site — no local app setup required.

---

## Prerequisites

- **Node.js 22.5+**
- **pnpm 9+** — `npm i -g pnpm` or `corepack enable`
- **Docker** (optional) — only needed to run tests in a container

---

## Setup

```bash
git clone <repo-url>
cd eventhub
pnpm install
```

---

## Root Scripts

| Script | Description |
|---|---|
| `pnpm format` | Check formatting of pages/, fixtures/, tests/, and playwright.config.ts |
| `pnpm format:fix` | Auto-fix formatting in pages/, fixtures/, tests/, and playwright.config.ts |
| `pnpm test` | Run all Playwright E2E tests (Chromium) |
| `pnpm test:ui` | Open Playwright UI mode |
| `pnpm test:report` | Open the last HTML test report |
| `pnpm test:docker` | Build the Docker image and run tests inside the container |

---

## E2E Testing

Tests run against `https://eventhub.rahulshettyacademy.com` using **Playwright** (Chromium only).

### Running tests

```bash
# all tests
pnpm test

# single spec with inline reporter
npx playwright test tests/booking-management.spec.ts --reporter=line

# UI mode (visual debugger)
pnpm test:ui

# inside Docker (no local browser install needed)
pnpm test:docker
```

### Test structure

```
pages/                          ← Page Object Models (one class per page)
├── LoginPage.ts                → goto(), login(email, password)
├── EventsPage.ts               → goto(), firstAvailableCard()
├── EventDetailPage.ts          → fillAndSubmit(), getBookingRef(), viewMyBookingsLink
├── BookingsPage.ts             → goto(), cardByRef(), clearAll()
└── BookingDetailPage.ts        → cancelBooking(), section locators

fixtures/
└── index.ts                    ← Extended test + cleanSession composite fixture

tests/                          ← Spec files only
└── booking-management.spec.ts
```

### Folder structure

```
eventhub/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json             ← TypeScript config for test layer (strict, noEmit)
├── playwright.config.ts      ← baseURL, Chromium only, HTML reporter
├── Dockerfile                ← Self-contained test runner image
├── pages/                    ← Page Object Models
│   ├── LoginPage.ts
│   ├── EventsPage.ts
│   ├── EventDetailPage.ts
│   ├── BookingsPage.ts
│   └── BookingDetailPage.ts
├── fixtures/
│   └── index.ts              ← Extended test + cleanSession fixture
└── tests/
    └── booking-management.spec.ts
```

### Page Object Models

Each page is a class with typed locators in the constructor and async action methods. Assertions stay in spec files.

```typescript
import { EventsPage } from './pages/EventsPage.ts';

const eventsPage = new EventsPage(page);
await eventsPage.goto();
const card = eventsPage.firstAvailableCard();
```

### Fixtures

`fixtures/index.ts` exports an extended `test` with two fixture layers:

**Individual page fixtures** — inject a single POM:

```typescript
test('example', async ({ eventsPage, bookingsPage }) => { … });
```

**`cleanSession`** — logs in as the test user, clears all prior bookings, and yields every POM ready to use:

```typescript
test('TC-001', async ({ cleanSession }) => {
  const { page, eventsPage, eventDetailPage, bookingsPage } = cleanSession;
  // user is already logged in and bookings list is empty
});
```

### Docker

```bash
# build image and run tests
pnpm test:docker

# or manually
docker build -t eventhub-e2e .
docker run --rm eventhub-e2e
```

### Test accounts

| User | Email | Password |
|---|---|---|
| Primary | rahulshetty1@gmail.com | Magiclife1! |
| Cross-user | rahulshetty1@yahoo.com | Magiclife1! |

---

## Playwright Test Selectors

| `data-testid` | Element |
|---|---|
| `event-card` | Each event card in listings |
| `book-now-btn` | "Book Now" link on event card |
| `quantity-input` | Ticket quantity display in booking form |
| `customer-name` | Full name input field |
| `customer-email` | Email input field |
| `customer-phone` | Phone number input field |
| `confirm-booking-btn` | Submit booking button |
| `booking-ref` | Booking reference shown on confirmation |
| `booking-card` | Each booking card in my bookings list |
| `cancel-booking-btn` | Cancel booking button |
| `confirm-dialog-yes` | Confirm button in any confirmation dialog |
| `nav-events` | Navbar "Events" link |
| `nav-bookings` | Navbar "My Bookings" link |

```typescript
await page.getByTestId('book-now-btn').click();
await page.getByLabel('Full Name').fill('Rahul Shetty');
await page.locator('#customer-email').fill('rahul@test.com');
await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
await page.locator('.confirm-booking-btn').click();
await expect(page.locator('.booking-ref').first()).toBeVisible();
```
