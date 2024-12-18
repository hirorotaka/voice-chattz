import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
        flowbite.content(),
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans JP"', "sans-serif"],
            },
            height: {
                "screen-safe": ["100vh", "100dvh", "-webkit-fill-available"],
            },
        },
    },

    plugins: [
        forms,
        flowbite.plugin(),
        function ({ addUtilities }) {
            addUtilities({
                ".p-safe": {
                    "padding-top": "var(--sat)",
                    "padding-right": "var(--sar)",
                    "padding-bottom": "var(--sab)",
                    "padding-left": "var(--sal)",
                },
                ".pt-safe": {
                    "padding-top": "var(--sat)",
                },
                ".pr-safe": {
                    "padding-right": "var(--sar)",
                },
                ".pb-safe": {
                    "padding-bottom": "var(--sab)",
                },
                ".pl-safe": {
                    "padding-left": "var(--sal)",
                },
            });
        },
    ],
};
