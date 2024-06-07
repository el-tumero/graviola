/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            transitionDuration: {
                4000: "4000ms",
            },

            animation: {
                marquee: "marquee 25s linear infinite",
                marquee2: "marquee2 25s linear infinite",
            },

            keyframes: {
                marquee: {
                    "0%": {
                        transform: "translateX(0%)",
                    },
                    "100%": {
                        transform: "translateX(-100%)",
                    },
                },
                marquee2: {
                    "0%": {
                        transform: "translateX(100%)",
                    },
                    "100%": {
                        transform: "translateX(0%)",
                    },
                },
            },

            colors: {
                accent: "#21bf55",
                light: {
                    text: "#000",
                    textSecondary: "#1f1f1f",
                    bgPrimary: "#cae8d4",
                    bgLight: "#bce8ca",
                    bgDark: "#afdbbe",
                    border: "#a3d1b3",
                },
                dark: {
                    text: "#fff",
                    textSecondary: "#e3e3e3",
                    bgPrimary: "#101713",
                    bgLight: "#1f2b24",
                    bgDark: "#080d0a",
                    border: "#303632",
                },
            },
        },
    },
    plugins: [],
    darkMode: "class",
}
