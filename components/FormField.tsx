export default function FormField({
    label,
    error,
    className = "",
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <label
            className={`block text-sm font-medium text-zinc-700 ${className}`}
        >
            {label}
            <div className="mt-1">{children}</div>
            {error && <span className="mt-1 block text-red-600">{error}</span>}
        </label>
    );
}
