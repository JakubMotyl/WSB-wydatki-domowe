"use client";
import { useEffect, useState } from "react";

const CATEGORIES = ["Jedzenie", "Transport", "Rachunki", "Rozrywka", "Inne"];

interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
    note: string | null;
}

const emptyForm = {
    title: "",
    amount: "",
    category: "Jedzenie",
    date: "",
    note: "",
};

export default function ApiTesterPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filter, setFilter] = useState("");
    const [order, setOrder] = useState("desc");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState(""); // komunikat błędu z API

    // Wysyła żądanie do API; przy błędzie zapamiętuje komunikat do wyświetlenia.
    async function call(method: string, url: string, body?: object) {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });
        const data = res.status === 204 ? null : await res.json();
        setError(
            res.ok
                ? ""
                : Object.values(data.details ?? { error: data.error }).join(
                      " ",
                  ),
        );
        return { ok: res.ok, data };
    }

    // Pobiera listę z uwzględnieniem filtra i sortowania.
    async function load() {
        const params = new URLSearchParams({ order });
        if (filter) params.set("category", filter);
        const { ok, data } = await call("GET", `/api/expenses?${params}`);
        if (ok) setExpenses(data);
    }

    // Pobierz listę po wejściu na stronę i przy zmianie filtra/sortowania.
    useEffect(() => {
        load();
    }, [filter, order]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...form,
            amount: form.amount === "" ? null : Number(form.amount),
        };
        const { ok } = editingId
            ? await call("PUT", `/api/expenses/${editingId}`, payload)
            : await call("POST", "/api/expenses", payload);
        if (ok) {
            setForm(emptyForm);
            setEditingId(null);
            load();
        }
    }

    function startEdit(x: Expense) {
        setEditingId(x.id);
        setForm({ ...x, amount: String(x.amount), note: x.note ?? "" });
    }

    async function remove(id: number) {
        if (!confirm(`Usunąć wydatek #${id}?`)) return;
        const { ok } = await call("DELETE", `/api/expenses/${id}`);
        if (ok) load();
    }

    const input =
        "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm";
    const btn =
        "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700";
    const card = "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm";
    const label = "block space-y-1 text-sm font-medium text-zinc-700";

    return (
        <main className="mx-auto max-w-4xl space-y-6 p-4 text-zinc-900 sm:p-6">
            <h1 className="text-2xl font-bold">
                Tester API – wydatki (strona tymczasowa)
            </h1>

            {/* Formularz POST / PUT */}
            <form onSubmit={submit} className={`${card} space-y-4`}>
                <h2 className="font-semibold">
                    {editingId
                        ? `Edycja wydatku #${editingId} (PUT)`
                        : "Nowy wydatek (POST)"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className={label}>
                        Tytuł
                        <input
                            className={input}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </label>
                    <label className={label}>
                        Kwota (zł)
                        <input
                            className={input}
                            type="number"
                            step="any"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                        />
                    </label>
                    <label className={label}>
                        Kategoria
                        <select
                            className={input}
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                            <option>Nieistniejaca (test błędu)</option>
                        </select>
                    </label>
                    <label className={label}>
                        Data
                        <input
                            className={input}
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                        />
                    </label>
                    <label className={`${label} sm:col-span-2`}>
                        Notatka (opcjonalnie)
                        <input
                            className={input}
                            value={form.note}
                            onChange={(e) =>
                                setForm({ ...form, note: e.target.value })
                            }
                        />
                    </label>
                </div>
                <div className="flex gap-2">
                    <button className={btn}>
                        {editingId ? "Zapisz (PUT)" : "Dodaj (POST)"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                        >
                            Anuluj
                        </button>
                    )}
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </form>

            {/* Filtr, sortowanie i suma */}
            <div className={`${card} flex flex-wrap items-end gap-4`}>
                <label className={`${label} w-44`}>
                    Kategoria
                    <select
                        className={input}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">wszystkie</option>
                        {CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </label>
                <label className={`${label} w-44`}>
                    Sortowanie po dacie
                    <select
                        className={input}
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <option value="desc">malejąco</option>
                        <option value="asc">rosnąco</option>
                    </select>
                </label>
                <span className="ml-auto text-lg font-semibold">
                    Suma:{" "}
                    {expenses.reduce((sum, x) => sum + x.amount, 0).toFixed(2)}{" "}
                    zł ({expenses.length})
                </span>
            </div>

            {/* Lista wydatków */}
            <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white shadow-sm">
                {expenses.length === 0 && (
                    <li className="p-4 text-zinc-500">Brak wydatków.</li>
                )}
                {expenses.map((x) => (
                    <li
                        key={x.id}
                        className="flex flex-wrap items-center gap-3 p-4"
                    >
                        <span className="w-10 text-zinc-500">#{x.id}</span>
                        <span className="min-w-40 flex-1">
                            <b>{x.title}</b>{" "}
                            <span className="text-sm text-zinc-500">
                                {x.category} · {x.date}
                            </span>
                            {x.note && (
                                <div className="text-sm text-zinc-500">
                                    {x.note}
                                </div>
                            )}
                        </span>
                        <span className="font-mono">
                            {x.amount.toFixed(2)} zł
                        </span>
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => startEdit(x)}
                        >
                            edytuj
                        </button>
                        <button
                            className="text-sm text-red-600 hover:underline"
                            onClick={() => remove(x.id)}
                        >
                            usuń
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
