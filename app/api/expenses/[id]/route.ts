import { NextResponse } from "next/server";
import { deleteExpense, getExpense, updateExpense } from "@/lib/db";
import { validateExpense } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

const notFound = () =>
    NextResponse.json({ error: "Nie znaleziono wydatku." }, { status: 404 });

// GET /api/expenses/:id
export async function GET(_request: Request, { params }: Context) {
    const { id } = await params;
    const expense = getExpense(Number(id));
    return expense ? NextResponse.json(expense) : notFound();
}

// PUT /api/expenses/:id – edycja (te same pola co w POST)
export async function PUT(request: Request, { params }: Context) {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const { data, errors } = validateExpense(body);

    if (!data) {
        return NextResponse.json(
            { error: "Błąd walidacji danych.", details: errors },
            { status: 400 },
        );
    }
    const updated = updateExpense(Number(id), data);
    return updated ? NextResponse.json(updated) : notFound();
}

// DELETE /api/expenses/:id
export async function DELETE(_request: Request, { params }: Context) {
    const { id } = await params;
    if (!deleteExpense(Number(id))) return notFound();
    return new NextResponse(null, { status: 204 });
}
