# Testing Standards Reference

Complete testing requirements for City of Amsterdam projects. Source: developers.amsterdam.

## Table of Contents

- [Core Principle](#core-principle)
- [Coverage Targets](#coverage-targets)
- [Frontend Testing](#frontend-testing)
- [Backend Testing](#backend-testing)
- [Regression Testing](#regression-testing)
- [API Mocking](#api-mocking)
- [Test Best Practices](#test-best-practices)
- [Test Plan Template](#test-plan-template)

## Core Principle

**Every production-ready project must have unit and integration tests.** Testing is not optional and not an afterthought.

> "Write tests that closely resemble how your application is used."

## Coverage Targets

| Context | Minimum Coverage | Applies To |
|---------|-----------------|------------|
| Frontend (new projects) | **70%** | Production code |
| Backend (new projects) | **80%** | Production code |
| Legacy applications | Best effort | New code/features only |

Coverage standards for legacy apps apply only to new code and features where feasible.

## Frontend Testing

### Framework Selection

| Purpose | Framework | Notes |
|---------|-----------|-------|
| Unit & integration tests | **Jest** or **Vitest** | Vitest preferred for Vite projects |
| Component testing | **React Testing Library** | Test behavior, not implementation |
| Snapshot testing | Jest or Vitest + `react-test-renderer` | For UI regression detection |
| E2E / regression | **Playwright** or **Cypress** | See [Regression Testing](#regression-testing) |
| API mocking | **MSW** or **Mirage JS** | See [API Mocking](#api-mocking) |

### React Testing Library Patterns

#### Component Test

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchForm } from "./SearchForm";

describe("SearchForm", () => {
  it("calls onSearch with the input value", async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();

    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByRole("textbox", { name: /zoeken/i });
    await user.type(input, "Amsterdam");

    const button = screen.getByRole("button", { name: /zoeken/i });
    await user.click(button);

    expect(handleSearch).toHaveBeenCalledWith("Amsterdam");
  });

  it("disables submit when input is empty", () => {
    render(<SearchForm onSearch={jest.fn()} />);

    const button = screen.getByRole("button", { name: /zoeken/i });
    expect(button).toBeDisabled();
  });
});
```

#### Key Practices

- Use `data-testid` attributes for elements without semantic roles
- Query by role, label, or text first (accessible queries)
- Use `userEvent` over `fireEvent` for realistic interactions
- Test re-rendering logic and state changes
- Simulate user interactions realistically

#### Query Priority

| Priority | Query | When |
|----------|-------|------|
| 1 | `getByRole` | Buttons, inputs, headings, links |
| 2 | `getByLabelText` | Form fields |
| 3 | `getByText` | Non-interactive text content |
| 4 | `getByPlaceholderText` | When no label exists |
| 5 | `getByTestId` | Last resort, no semantic alternative |

### Vitest Configuration (Vite Projects)

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
```

### Jest Configuration

```js
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterSetup: ["<rootDir>/src/test/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
```

## Backend Testing

### Django Test Framework

```python
from django.test import TestCase, Client
from django.urls import reverse
from .models import Location


class LocationAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.location = Location.objects.create(
            name="Centraal Station",
            lat=52.3791,
            lon=4.9003,
        )

    def test_list_locations(self):
        response = self.client.get(reverse("location-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["results"]), 1)

    def test_create_location_requires_auth(self):
        response = self.client.post(
            reverse("location-list"),
            data={"name": "Dam Square", "lat": 52.3731, "lon": 4.8932},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)
```

### FastAPI with pytest

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.anyio
async def test_list_locations():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/locations")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


@pytest.mark.anyio
async def test_create_location_requires_auth():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/locations",
            json={"name": "Dam Square", "lat": 52.3731, "lon": 4.8932},
        )
        assert response.status_code == 401
```

### Backend Coverage Target: 80%

```ini
# pytest.ini or pyproject.toml [tool.pytest.ini_options]
[pytest]
addopts = --cov=src --cov-report=term --cov-report=html --cov-fail-under=80
```

## Regression Testing

### E2E Frameworks

| Framework | Best For |
|-----------|----------|
| **Playwright** | Cross-browser, modern, fast parallel execution |
| **Cypress** | Developer-friendly, strong debugging, component tests |

E2E testing is **not mandatory** but strongly recommended. The Vakgroep provides dedicated testers — POs should contact them.

### Playwright Example

```ts
import { test, expect } from "@playwright/test";

test("user can search for a location", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("textbox", { name: /zoeken/i }).fill("Vondelpark");
  await page.getByRole("button", { name: /zoeken/i }).click();

  await expect(page.getByText("Vondelpark")).toBeVisible();
});

test("map displays markers for search results", async ({ page }) => {
  await page.goto("/kaart");

  await page.getByRole("textbox", { name: /zoeken/i }).fill("bibliotheek");
  await page.getByRole("button", { name: /zoeken/i }).click();

  const markers = page.locator("[data-testid='map-marker']");
  await expect(markers).toHaveCount(await markers.count());
  expect(await markers.count()).toBeGreaterThan(0);
});
```

## API Mocking

### Mock Service Worker (MSW) — Recommended

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/v1/locations", () => {
    return HttpResponse.json([
      { id: 1, name: "Centraal Station", lat: 52.3791, lon: 4.9003 },
      { id: 2, name: "Dam Square", lat: 52.3731, lon: 4.8932 },
    ]);
  }),

  http.post("/api/v1/locations", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 201 });
  }),
];
```

```ts
// src/test/setup.ts
import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Key Rules

- Mock **external** services, not your own application code
- Don't test third-party APIs or libraries
- Use `data-testid` attributes when no semantic query is available

## Test Best Practices

| Do | Don't |
|----|-------|
| Test behavior and user interactions | Test implementation details |
| Mock external services | Mock your own application code |
| Write tests alongside features | Treat testing as afterthought |
| Use accessible queries (role, label) | Over-rely on `data-testid` |
| Test realistic user flows | Test individual CSS classes |
| Keep tests independent | Share state between tests |
| Name tests descriptively | Use generic test names |

## Test Plan Template

Every project should have a test plan. Adapt this template:

```markdown
# Test Plan — [Project Name]

## Coverage Targets
- Frontend: 70% (statements, branches, functions, lines)
- Backend: 80%

## Test Types
- [ ] Unit tests (components, utilities, models)
- [ ] Integration tests (API endpoints, database queries)
- [ ] Snapshot tests (UI regression)
- [ ] E2E tests (critical user flows) — if applicable

## Frameworks
- Frontend: [Vitest/Jest] + React Testing Library
- Backend: [Django TestCase / pytest]
- E2E: [Playwright/Cypress] — if applicable
- Mocking: [MSW/Mirage JS]

## Pipeline Integration
- Tests run on every PR
- Coverage report generated and checked against thresholds
- E2E tests run on staging deployment (if applicable)

## File Structure
```
src/
├── components/
│   ├── SearchForm.tsx
│   └── SearchForm.test.tsx      # Co-located test
├── hooks/
│   ├── useLocations.ts
│   └── useLocations.test.ts
└── test/
    ├── setup.ts                 # Test setup (MSW, globals)
    └── factories/               # Test data factories
```

## Responsibilities
- Developers: write unit + integration tests with features
- QA / Vakgroep: E2E test plans and execution (on request)
```
