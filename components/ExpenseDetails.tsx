"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryBadge from "./CategoryBadge";
import ExpenseForm from "./ExpenseForm";
import Spinner from "./Spinner";
import Toast from "./Toast";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Expense } from "@/lib/validation";

export default function ExpenseDetails({ id }: { id: string }) {
    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        api(`/api/expenses/${id}`).then(({ data, error }) => {
            setExpense(data);
            setError(error);
            setLoading(false);
        });
    }, [id]);

    function toast(message: string) {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }

    async function handleDelete() {
        if (!window.confirm(`Czy na pewno usunąć wydatek „${expense?.title}”?`))
            return;

        const { error } = await api(`/api/expenses/${id}`, "DELETE");
        if (error) {
            window.alert(error);
            return;
        }
        setDeleted(true);
        toast("Usunięto wydatek.");
    }

    if (loading) return <Spinner text="Ładowanie wydatku..." />;

    if (!expense) {
        return (
            <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}{" "}
                <Link href="/" className="underline">
                    Wróć do pulpitu
                </Link>
            </p>
        );
    }

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            {deleted ? (
                <p>
                    Wydatek został usunięty.{" "}
                    <Link href="/" className="text-brand hover:underline">
                        Wróć do pulpitu
                    </Link>
                </p>
            ) : editing ? (
                <>
                    <h2 className="mb-4 text-lg font-semibold">
                        Edycja wydatku
                    </h2>
                    <ExpenseForm
                        expense={expense}
                        onSaved={(saved) => {
                            setExpense(saved);
                            setEditing(false);
                            toast("Zapisano zmiany.");
                        }}
                        onCancel={() => setEditing(false)}
                    />
                </>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-xl font-semibold wrap-break-word">
                            {expense.title}
                        </h2>
                        <CategoryBadge category={expense.category} />
                    </div>
                    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                        <dt className="text-zinc-500">Kwota</dt>
                        <dd className="font-semibold">
                            {formatMoney(expense.amount)}
                        </dd>
                        <dt className="text-zinc-500">Data</dt>
                        <dd>{formatDate(expense.date)}</dd>
                        <dt className="text-zinc-500">Notatka</dt>
                        <dd className="wrap-break-word">
                            {expense.note ?? "—"}
                        </dd>
                    </dl>
                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={() => setEditing(true)}
                            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-navy"
                        >
                            Edytuj
                        </button>
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Usuń
                        </button>
                    </div>
                </>
            )}

            <Toast message={toastMessage} show={showToast} />
        </div>
    );
}
