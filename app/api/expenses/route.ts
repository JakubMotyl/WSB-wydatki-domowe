import { NextResponse } from "next/server";
import { createExpense, getExpenses } from "@/lib/db";
import { CATEGORIES, validateExpense } from "@/lib/validation";

// GET /api/expenses?category=Jedzenie&order=asc
// category – filtr po kategorii, order – sortowanie po dacie (asc/desc, domyślnie desc)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const order = searchParams.get("order") ?? "desc";

    if (category && !CATEGORIES.includes(category)) {
        return NextResponse.json(
            {
                error: "Błąd walidacji danych.",
                details: {
                    category: `Dozwolone kategorie: ${CATEGORIES.join(", ")}.`,
                },
            },
            { status: 400 },
        );
    }
    if (order !== "asc" && order !== "desc") {
        return NextResponse.json(
            {
                error: "Błąd walidacji danych.",
                details: {
                    order: "Parametr order musi mieć wartość asc lub desc.",
                },
            },
            { status: 400 },
        );
    }

    return NextResponse.json(getExpenses(category, order));
}

// POST /api/expenses – dodanie wydatku
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const { data, errors } = validateExpense(body);

    if (!data) {
        return NextResponse.json(
            { error: "Błąd walidacji danych.", details: errors },
            { status: 400 },
        );
    }
    return NextResponse.json(createExpense(data), { status: 201 });
}
