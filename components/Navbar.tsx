import Link from "next/link";

export default function Navbar() {
    return (
        <header className="bg-navy">
            <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 p-4">
                <Link href="/" className="text-lg font-bold text-white">
                    Wydatki domowe
                </Link>
                <div className="flex gap-4 text-sm font-medium text-ice">
                    <Link href="/" className="hover:text-white">
                        Pulpit
                    </Link>
                    <Link
                        href="/expenses/new"
                        className="hover:text-white"
                    >
                        Dodaj wydatek
                    </Link>
                </div>
            </nav>
        </header>
    );
}
