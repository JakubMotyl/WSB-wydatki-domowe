import ExpenseForm from "@/components/ExpenseForm";

export default function NewExpensePage() {
    return (
        <>
            <h1 className="mb-6 text-2xl font-bold">Nowy wydatek</h1>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                <ExpenseForm />
            </div>
        </>
    );
}
