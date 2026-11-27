import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    workers: 1, // testy współdzielą jedną bazę, więc nie mogą działać równolegle
    reporter: "list",
    use: {
        baseURL: "http://localhost:3100",
    },
    // Przed testami Playwright buduje i uruchamia wersję produkcyjną aplikacji
    // na osobnym porcie i z osobną bazą testową (dane z aplikacji zostają nietknięte).
    webServer: {
        command: "npm run build && npm run start -- -p 3100",
        url: "http://localhost:3100",
        timeout: 180000,
        env: { DATABASE_PATH: "./data/test.db" },
    },
});
