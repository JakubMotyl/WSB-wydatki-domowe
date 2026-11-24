export async function api(url: string, method = "GET", body?: object) {
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body && JSON.stringify(body),
            cache: "no-store",
        });
        const data = res.status === 204 ? null : await res.json();

        if (!res.ok) return { data: null, error: data.error as string };
        return { data, error: "" };
    } catch {
        return { data: null, error: "Nie można połączyć się z serwerem." };
    }
}
