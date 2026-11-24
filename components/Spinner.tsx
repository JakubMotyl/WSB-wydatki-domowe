export default function Spinner({ text = "Ładowanie..." }: { text?: string }) {
    return (
        <div role="status" className="flex items-center gap-3 text-zinc-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-brand" />
            {text}
        </div>
    );
}
