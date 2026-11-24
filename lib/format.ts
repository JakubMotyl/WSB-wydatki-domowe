export function formatMoney(amount: number) {
    return amount.toLocaleString("pl-PL", {
        style: "currency",
        currency: "PLN",
    });
}

export function formatDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}
