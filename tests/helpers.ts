import type { APIRequestContext } from "@playwright/test";

export const expense = {
    title: "Zakupy",
    amount: 45.5,
    category: "Jedzenie",
    date: "2026-11-20",
    note: "Biedronka",
};

// Usuwa wszystkie wydatki z bazy testowej, żeby każdy test zaczynał od zera.
export async function clearExpenses(request: APIRequestContext) {
    const response = await request.get("/api/expenses");
    for (const item of await response.json()) {
        await request.delete(`/api/expenses/${item.id}`);
    }
}
