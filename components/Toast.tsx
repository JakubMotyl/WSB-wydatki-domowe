export default function Toast({
    message,
    show,
}: {
    message: string;
    show: boolean;
}) {
    return (
        <div
            role="status"
            className={`fixed right-4 bottom-4 left-4 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 sm:left-auto ${
                show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
        >
            {message}
        </div>
    );
}
