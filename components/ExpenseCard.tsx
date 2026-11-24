import Link from "next/link";
import CategoryBadge from "./CategoryBadge";
import { formatDate, formatMoney } from "@/lib/format";
import type { Expense } from "@/lib/validation";

export default function ExpenseCard({ expense }: { expense: Expense }) {
    return (
        <Link
            href={`/expenses/${expense.id}`}
            className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-sky"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold wrap-break-word">
                    {expense.title}
                </h3>
                <span className="font-semibold whitespace-nowrap">
                    {formatMoney(expense.amount)}
                </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <CategoryBadge category={expense.category} />
                {formatDate(expense.date)}
            </div>
            {expense.note && (
                <p className="mt-2 truncate text-sm text-zinc-500">
                    {expense.note}
                </p>
            )}
        </Link>
    );
}
