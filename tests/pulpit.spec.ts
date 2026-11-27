import { test, expect } from "@playwright/test";
import { clearExpenses, expense } from "./helpers";

test.describe("Strona główna (pulpit)", () => {
    test.beforeEach(async ({ request }) => {
        await clearExpenses(request);
    });

    test("pokazuje komunikat, gdy nie ma wydatków", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("Brak wydatków.")).toBeVisible();
    });

    test("wyświetla listę wydatków i sumę", async ({ page, request }) => {
        await request.post("/api/expenses", { data: expense });
        await request.post("/api/expenses", {
            data: { ...expense, title: "Bilet", amount: 4.5, category: "Transport" },
        });

        await page.goto("/");
        await expect(page.getByText("Zakupy")).toBeVisible();
        await expect(page.getByText("Bilet")).toBeVisible();
        await expect(page.getByText("Liczba wydatków: 2")).toBeVisible();
        await expect(page.getByText("50,00 zł")).toBeVisible();
    });

    test("filtruje wydatki po kategorii", async ({ page, request }) => {
        await request.post("/api/expenses", { data: expense });
        await request.post("/api/expenses", {
            data: { ...expense, title: "Bilet", category: "Transport" },
        });

        await page.goto("/");
        await page.getByRole("button", { name: "Transport" }).click();

        await expect(page.getByText("Bilet")).toBeVisible();
        await expect(page.getByText("Zakupy")).toBeHidden();
    });
});
