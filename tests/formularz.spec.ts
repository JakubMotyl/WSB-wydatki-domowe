import { test, expect } from "@playwright/test";
import { clearExpenses } from "./helpers";

test.describe("Formularz dodawania wydatku", () => {
    test.beforeEach(async ({ page, request }) => {
        await clearExpenses(request);
        await page.goto("/expenses/new");
    });

    test("dodaje wydatek, który pojawia się na pulpicie", async ({ page }) => {
        await page.getByLabel("Tytuł").fill("Kino");
        await page.getByLabel("Kwota (zł)").fill("30");
        await page.getByLabel("Kategoria").selectOption("Rozrywka");
        await page.getByLabel("Data").fill("2026-11-22");
        await page.getByRole("button", { name: "Zapisz" }).click();

        await expect(page.getByText("Zapisano wydatek.")).toBeVisible();

        await page.goto("/");
        await expect(page.getByText("Kino")).toBeVisible();
    });

    test("blokuje pusty formularz i pokazuje błędy", async ({ page }) => {
        await page.getByRole("button", { name: "Zapisz" }).click();

        await expect(page.getByText("Podaj tytuł.")).toBeVisible();
        await expect(page.getByText("Kwota musi być większa od zera.")).toBeVisible();
        await expect(page.getByText("Wybierz datę.")).toBeVisible();
    });

    test("odrzuca ujemną kwotę", async ({ page }) => {
        await page.getByLabel("Tytuł").fill("Kino");
        await page.getByLabel("Kwota (zł)").fill("-5");
        await page.getByLabel("Data").fill("2026-11-22");
        await page.getByRole("button", { name: "Zapisz" }).click();

        await expect(page.getByText("Kwota musi być większa od zera.")).toBeVisible();
        await expect(page.getByText("Zapisano wydatek.")).toBeHidden();
    });
});
