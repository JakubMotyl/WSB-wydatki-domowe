"use client";

import { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import ExpenseList from "./ExpenseList";
import Spinner from "./Spinner";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Expense } from "@/lib/validation";

export default function ExpensesDashboard() {
    const [category, setCategory] = useState("");
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const url = category
            ? `/api/expenses?category=${category}`
            : "/api/expenses";

        api(url).then(({ data, error }) => {
            setExpenses(data ?? []);
            setError(error);
            setLoading(false);
        });
    }, [category]);

    function changeCategory(newCategory: string) {
        setCategory(newCategory);
        setLoading(true);
    }

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">
                    Suma wydatków{category && ` – ${category}`}
                </p>
                <p className="text-3xl font-bold">{formatMoney(total)}</p>
                <p className="text-sm text-zinc-500">
                    Liczba wydatków: {expenses.length}
                </p>
            </div>

            <CategoryFilter value={category} onChange={changeCategory} />

            {loading && <Spinner text="Ładowanie wydatków..." />}

            {!loading && error && (
                <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </p>
            )}

            {!loading && !error && <ExpenseList expenses={expenses} />}
        </div>
    );
}
