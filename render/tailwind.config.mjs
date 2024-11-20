/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                title: ['"Noto Sans Mono"', "monospace"],
                content: ['"Public Sans"', "sans-serif"],
            },

            transitionDuration: {
                4000: "4000ms",
            },

            animation: {
                marquee: "marquee 25s linear infinite",
                marquee2: "marquee2 25s linear infinite",
                fadeIn: "fadeIn 1s linear",
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
                fadeIn: {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    },
                },
            },

            boxShadow: {
                card: "0px 0px 20px 6px",
            },

            colors: {
                accent: "#2cde59",
                accentDark: "#19b540",
                light: {
                    text: "#000",
                    textSecondary: "#1f1f1f",
                    bgPrimary: "#e6ede8",
                    bgLight: "#f7f7f7",
                    bgDark: "#d5dbd7",
                    border: "#bbbfbd",
                },
                dark: {
                    text: "#fff",
                    textSecondary: "#e3e3e3",
                    bgPrimary: "#0c0c0d",
                    bgLight: "#252625",
                    bgDark: "#000000",
                    border: "#2f2f2f",
                },
                rarity: {
                    common: "rgba(140, 140, 155, 0.8)",
                    uncommon: "rgba(54, 202, 108, 0.8)",
                    rare: "rgba(37, 99, 235, 0.8)",
                    veryRare: "rgba(147, 51, 234, 0.8)",
                    legendary: "rgba(239, 68, 68, 0.8)",
                },
            },
        },
    },
    plugins: [],
}
