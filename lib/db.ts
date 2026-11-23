import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { Expense, ExpenseInput } from "./validation";

// 1. Otwieramy plik bazy. Ścieżka jest w .env (DATABASE_PATH).
//    Plik leży na dysku, więc dane nie znikają po restarcie serwera.
const dbFile = process.env.DATABASE_PATH || "./data/expenses.db";
fs.mkdirSync(path.dirname(dbFile), { recursive: true }); // utwórz folder "data", jeśli go nie ma
const db = new Database(dbFile);

// 2. Tworzymy tabelę (tylko jeśli jeszcze nie istnieje).
db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        title    TEXT NOT NULL,
        amount   REAL NOT NULL,
        category TEXT NOT NULL,
        date     TEXT NOT NULL,
        note     TEXT
    )
`);

// Wszystkie wydatki, najnowsze pierwsze. Gdy podano kategorię – tylko z niej.
export function getExpenses(category: string | null, order: "asc" | "desc") {
    const expenses = db
        .prepare(
            `SELECT * FROM expenses
             WHERE ? IS NULL OR category = ?
             ORDER BY date DESC, id DESC`,
        )
        .all(category, category) as Expense[];

    return order === "asc" ? expenses.reverse() : expenses;
}

// Jeden wydatek po id (albo undefined, gdy go nie ma).
export function getExpense(id: number) {
    return db.prepare("SELECT * FROM expenses WHERE id = ?").get(id) as
        | Expense
        | undefined;
}

// Dodaje wydatek i zwraca go razem z nadanym id.
export function createExpense(data: ExpenseInput) {
    const result = db
        .prepare(
            `INSERT INTO expenses (title, amount, category, date, note)
             VALUES (@title, @amount, @category, @date, @note)`,
        )
        .run(data);
    return getExpense(Number(result.lastInsertRowid))!;
}

// Zmienia wydatek. Gdy nie ma takiego id – zwraca undefined.
export function updateExpense(id: number, data: ExpenseInput) {
    const result = db
        .prepare(
            `UPDATE expenses
             SET title = @title, amount = @amount, category = @category,
                 date = @date, note = @note
             WHERE id = @id`,
        )
        .run({ ...data, id });
    return result.changes === 0 ? undefined : getExpense(id);
}

// Usuwa wydatek. Zwraca true, jeśli coś usunięto.
export function deleteExpense(id: number) {
    return db.prepare("DELETE FROM expenses WHERE id = ?").run(id).changes > 0;
}
