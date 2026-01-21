/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                brand: {
                    orange: "#FF7E33",
                    blue: "#3366FF",
                    slate: "#F8FAFC",
                },
                primary: {
                    DEFAULT: "#FF7E33",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#3366FF",
                    foreground: "#FFFFFF",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#F8FAFC",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "#3366FF",
                    foreground: "#FFFFFF",
                },
                popover: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                fadeIn: {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                glow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(255, 126, 51, 0.1)" },
                    "50%": { boxShadow: "0 0 40px rgba(255, 126, 51, 0.3)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                fadeIn: "fadeIn 0.5s ease-out forwards",
                glow: "glow 3s infinite ease-in-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
