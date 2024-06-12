/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                title: ['"Noto Sans Mono"', 'monospace'],
                content: ['"Public Sans"', 'sans-serif']
            },

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
                accent: "#2cde59",
                light: {
                    text: "#000",
                    textSecondary: "#1f1f1f",
                    bgPrimary: "#e6ede8",
                    bgLight: "#ffffff",
                    bgDark: "#d5dbd7",
                    border: "#cbd1cd",
                },
                dark: {
                    text: "#fff",
                    textSecondary: "#e3e3e3",
                    bgPrimary: "#0c0c0d",
                    bgLight: "#252625",
                    bgDark: "#000000",
                    border: "#1e1e1e",
                },
            },
        },
    },
    plugins: [],
    darkMode: "class",
}
