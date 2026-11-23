// Tailwind CSS v4 jako wtyczka PostCSS – Next.js sam wczytuje ten plik
// i dzięki niemu klasy z globals.css (@import "tailwindcss") są generowane.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
