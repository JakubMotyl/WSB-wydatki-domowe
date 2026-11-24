const colors: Record<string, string> = {
    Jedzenie: "bg-green-100 text-green-800",
    Transport: "bg-ice/60 text-navy",
    Rachunki: "bg-amber-100 text-amber-800",
    Rozrywka: "bg-purple-100 text-purple-800",
    Inne: "bg-zinc-200 text-zinc-800",
};

export default function CategoryBadge({ category }: { category: string }) {
    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[category] ?? colors.Inne}`}
        >
            {category}
        </span>
    );
}
