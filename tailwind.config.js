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
            padding: {
                "safe-bottom": "env(safe-area-inset-bottom)",
            },
        },
    },

    plugins: [forms, flowbite.plugin()],
};
