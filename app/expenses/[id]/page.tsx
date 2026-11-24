import ExpenseDetails from "@/components/ExpenseDetails";

export default async function ExpensePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <>
            <h1 className="mb-6 text-2xl font-bold">Szczegóły wydatku</h1>
            <ExpenseDetails id={id} />
        </>
    );
}
