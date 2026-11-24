"use client";

import { useState } from "react";
import FormField from "./FormField";
import Toast from "./Toast";
import { api } from "@/lib/api";
import { CATEGORIES, type Expense } from "@/lib/validation";

export default function ExpenseForm({
    expense,
    onSaved,
    onCancel,
}: {
    expense?: Expense;
    onSaved?: (expense: Expense) => void;
    onCancel?: () => void;
}) {
    const [title, setTitle] = useState(expense?.title ?? "");
    const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
    const [category, setCategory] = useState(
        expense?.category ?? CATEGORIES[0],
    );
    const [date, setDate] = useState(expense?.date ?? "");
    const [note, setNote] = useState(expense?.note ?? "");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState("");
    const [saving, setSaving] = useState(false);

    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    function validate() {
        const newErrors: Record<string, string> = {};
        if (title.trim() === "") newErrors.title = "Podaj tytuł.";
        if (!(Number(amount) > 0))
            newErrors.amount = "Kwota musi być większa od zera.";
        if (date === "") newErrors.date = "Wybierz datę.";
        return newErrors;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setSaving(true);
        const body = { title, amount: Number(amount), category, date, note };
        const { data, error } = expense
            ? await api(`/api/expenses/${expense.id}`, "PUT", body)
            : await api("/api/expenses", "POST", body);
        setSaving(false);
        setApiError(error);
        if (error) return;

        if (onSaved) {
            onSaved(data);
        } else {
            setTitle("");
            setAmount("");
            setDate("");
            setNote("");
            setToastMessage("Zapisano wydatek.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }

    const inputClass =
        "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm";

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    label="Tytuł"
                    error={errors.title}
                    className="sm:col-span-2"
                >
                    <input
                        className={inputClass}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormField>

                <FormField label="Kwota (zł)" error={errors.amount}>
                    <input
                        className={inputClass}
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </FormField>

                <FormField label="Kategoria">
                    <select
                        className={inputClass}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Data" error={errors.date}>
                    <input
                        className={inputClass}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </FormField>

                <FormField
                    label="Notatka (opcjonalnie)"
                    className="sm:col-span-2"
                >
                    <textarea
                        className={inputClass}
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </FormField>
            </div>

            {apiError && (
                <p
                    role="alert"
                    className="rounded-md bg-red-50 p-3 text-sm text-red-700"
                >
                    {apiError}
                </p>
            )}

            <div className="flex gap-2">
                <button
                    disabled={saving}
                    className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-navy disabled:opacity-60"
                >
                    {saving ? "Zapisywanie..." : "Zapisz"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-100"
                    >
                        Anuluj
                    </button>
                )}
            </div>

            <Toast message={toastMessage} show={showToast} />
        </form>
    );
}
