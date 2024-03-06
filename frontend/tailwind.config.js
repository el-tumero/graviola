/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {

            transitionDuration: {
                "4000": "4000ms",
            },

            animation: {
                marquee: 'marquee 25s linear infinite',
                marquee2: 'marquee2 25s linear infinite',
            },


            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            },

            colors: {
                light: {
                    "text": "#000",
                    "bgPrimary": "#cae8d4",
                    "bgLight": "#bce8ca",
                    "bgDark": "#afdbbe",
                    "border": "#a3d1b3",
                },
                dark: {
                    "text": "#fff",
                    "bgPrimary": "#19241e",
                    "bgLight": "#2a3830",
                    "bgDark": "#151f19",
                    "border": "#414f47",
                }
            }

        },
    },
    plugins: [],
    darkMode: "class"
}

