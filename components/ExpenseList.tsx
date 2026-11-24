import Link from "next/link";
import ExpenseCard from "./ExpenseCard";
import type { Expense } from "@/lib/validation";

export default function ExpenseList({ expenses }: { expenses: Expense[] }) {
    if (expenses.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-zinc-500">
                Brak wydatków.{" "}
                <Link
                    href="/expenses/new"
                    className="text-brand hover:underline"
                >
                    Dodaj pierwszy
                </Link>
            </p>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {expenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
            ))}
        </div>
    );
}
