import { test, expect } from "@playwright/test";

test.describe("Home screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the app title", async ({ page }) => {
    await expect(page.getByText("Einbürgerungstest Trainer")).toBeVisible();
  });

  test("shows 10 day cards", async ({ page }) => {
    for (let day = 1; day <= 10; day++) {
      await expect(page.getByText(`Tag ${day}`, { exact: true })).toBeVisible();
    }
  });

  test("shows Tagesfragen and Alle bisherigen buttons", async ({ page }) => {
    const tagesButtons = page.getByRole("button", { name: "Tagesfragen" });
    const alleButtons = page.getByRole("button", { name: "Alle bisherigen" });
    await expect(tagesButtons).toHaveCount(10);
    await expect(alleButtons).toHaveCount(10);
  });

  test("shows the author footer", async ({ page }) => {
    await expect(page.getByText("Jorge Ramírez")).toBeVisible();
  });
});

test.describe("Quiz flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("starts a quiz when clicking Tagesfragen", async ({ page }) => {
    const tagesButtons = page.getByRole("button", { name: "Tagesfragen" });
    await tagesButtons.first().click();

    await expect(page.getByText("1 / 33")).toBeVisible();
    await expect(page.getByText("Bestätigen")).toBeVisible();
    await expect(page.getByText(/Frage \d+/)).toBeVisible();
  });

  test("can select an option and confirm", async ({ page }) => {
    const tagesButtons = page.getByRole("button", { name: "Tagesfragen" });
    await tagesButtons.first().click();

    const options = page.locator("button").filter({ has: page.locator("span") });
    const optionButtons = options.filter({ hasText: /^[ABCD]/ });
    await optionButtons.first().click();

    await page.getByText("Bestätigen").click();

    const feedback = page.getByText(/Richtig|Falsch/);
    await expect(feedback).toBeVisible();
  });

  test("can advance to the next question after confirming", async ({ page }) => {
    const tagesButtons = page.getByRole("button", { name: "Tagesfragen" });
    await tagesButtons.first().click();

    const options = page.locator("button").filter({ has: page.locator("span") });
    const optionButtons = options.filter({ hasText: /^[ABCD]/ });
    await optionButtons.first().click();

    await page.getByText("Bestätigen").click();
    await page.getByText(/Weiter/).click();

    await expect(page.getByText("2 / 33")).toBeVisible();
  });

  test("can navigate back to home from quiz", async ({ page }) => {
    const tagesButtons = page.getByRole("button", { name: "Tagesfragen" });
    await tagesButtons.first().click();

    await page.getByText(/Tag 1/).click();

    await expect(page.getByText("Einbürgerungstest Trainer")).toBeVisible();
  });
});

test.describe("Full quiz completion", () => {
  test("completes a Day 10 quiz and sees results", async ({ page }) => {
    await page.goto("/");

    const day10Tages = page.getByRole("button", { name: "Tagesfragen" }).last();
    await day10Tages.click();

    await expect(page.getByText(/1 \/ 13/)).toBeVisible();

    for (let questionIndex = 0; questionIndex < 13; questionIndex++) {
      const options = page.locator("button").filter({ has: page.locator("span") });
      const optionButtons = options.filter({ hasText: /^[ABCD]/ });
      await optionButtons.first().click();
      await page.getByText("Bestätigen").click();

      if (questionIndex < 12) {
        await page.getByText(/Weiter/).click();
      } else {
        await page.getByText("Ergebnis anzeigen").click();
      }
    }

    await expect(page.getByText(/\/13/)).toBeVisible();
    await expect(page.getByText(/% richtig/)).toBeVisible();
    await expect(page.getByText("Nochmal versuchen")).toBeVisible();
    await expect(page.getByText("Zur Übersicht")).toBeVisible();
  });

  test("can return home from results and see score badge", async ({ page }) => {
    await page.goto("/");

    const day10Tages = page.getByRole("button", { name: "Tagesfragen" }).last();
    await day10Tages.click();

    for (let questionIndex = 0; questionIndex < 13; questionIndex++) {
      const options = page.locator("button").filter({ has: page.locator("span") });
      const optionButtons = options.filter({ hasText: /^[ABCD]/ });
      await optionButtons.first().click();
      await page.getByText("Bestätigen").click();

      if (questionIndex < 12) {
        await page.getByText(/Weiter/).click();
      } else {
        await page.getByText("Ergebnis anzeigen").click();
      }
    }

    await page.getByText("Zur Übersicht").click();
    await expect(page.getByText("Einbürgerungstest Trainer")).toBeVisible();
    await expect(page.getByText(/Tages: \d+\/13/)).toBeVisible();
  });
});
