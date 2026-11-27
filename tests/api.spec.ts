import { test, expect } from "@playwright/test";
import { clearExpenses, expense } from "./helpers";

test.describe("API /api/expenses", () => {
    test.beforeEach(async ({ request }) => {
        await clearExpenses(request);
    });

    test("dodaje wydatek (201) i zwraca go na liście", async ({ request }) => {
        const created = await request.post("/api/expenses", { data: expense });
        expect(created.status()).toBe(201);

        const list = await request.get("/api/expenses");
        const expenses = await list.json();
        expect(expenses).toHaveLength(1);
        expect(expenses[0].title).toBe("Zakupy");
    });

    test("odrzuca niepoprawne dane (400)", async ({ request }) => {
        const response = await request.post("/api/expenses", {
            data: { ...expense, title: "", amount: -5 },
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.details.title).toBeTruthy();
        expect(body.details.amount).toBeTruthy();
    });

    test("edytuje wydatek (200)", async ({ request }) => {
        const created = await (
            await request.post("/api/expenses", { data: expense })
        ).json();

        const response = await request.put(`/api/expenses/${created.id}`, {
            data: { ...expense, title: "Zakupy v2" },
        });
        expect(response.status()).toBe(200);
        expect((await response.json()).title).toBe("Zakupy v2");
    });

    test("usuwa wydatek (204), potem zwraca 404", async ({ request }) => {
        const created = await (
            await request.post("/api/expenses", { data: expense })
        ).json();

        const deleted = await request.delete(`/api/expenses/${created.id}`);
        expect(deleted.status()).toBe(204);

        const missing = await request.get(`/api/expenses/${created.id}`);
        expect(missing.status()).toBe(404);
    });
});
