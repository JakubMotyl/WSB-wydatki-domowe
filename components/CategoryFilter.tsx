import { CATEGORIES } from "@/lib/validation";

export default function CategoryFilter({
    value,
    onChange,
}: {
    value: string;
    onChange: (category: string) => void;
}) {
    const options = ["", ...CATEGORIES];

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((category) => (
                <button
                    key={category}
                    type="button"
                    aria-pressed={value === category}
                    onClick={() => onChange(category)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                        value === category
                            ? "border-brand bg-brand text-white"
                            : "border-zinc-300 bg-white text-navy hover:bg-ice/40"
                    }`}
                >
                    {category || "Wszystkie"}
                </button>
            ))}
        </div>
    );
}
