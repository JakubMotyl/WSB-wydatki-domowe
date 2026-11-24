// Walidacja danych wydatku po stronie serwera (używana w POST i PUT).

export const CATEGORIES = [
    "Jedzenie",
    "Transport",
    "Rachunki",
    "Rozrywka",
    "Inne",
];

export interface ExpenseInput {
    title: string;
    amount: number;
    category: string;
    date: string; // RRRR-MM-DD
    note: string | null;
}

export interface Expense extends ExpenseInput {
    id: number;
}

function isValidDate(value: unknown): boolean {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateExpense(body: any): {
    data?: ExpenseInput;
    errors?: Record<string, string>;
} {
    const errors: Record<string, string> = {};

    if (typeof body !== "object" || body === null) {
        return { errors: { body: "Ciało żądania musi być obiektem JSON." } };
    }

    if (typeof body.title !== "string" || body.title.trim() === "") {
        errors.title = "Tytuł jest wymagany.";
    }
    if (typeof body.amount !== "number" || isNaN(body.amount)) {
        errors.amount = "Kwota musi być liczbą.";
    } else if (body.amount <= 0) {
        errors.amount = "Kwota musi być większa od zera.";
    }
    if (!CATEGORIES.includes(body.category)) {
        errors.category = `Kategoria musi być jedną z: ${CATEGORIES.join(", ")}.`;
    }
    if (!isValidDate(body.date)) {
        errors.date = "Data musi być poprawna i mieć format RRRR-MM-DD.";
    }
    if (body.note != null && typeof body.note !== "string") {
        errors.note = "Notatka musi być tekstem.";
    }

    if (Object.keys(errors).length > 0) return { errors };

    return {
        data: {
            title: body.title.trim(),
            amount: body.amount,
            category: body.category,
            date: body.date,
            note: body.note?.trim() || null,
        },
    };
}
