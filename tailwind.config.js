/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,jsx,css}"],
	theme: {
		extend: {
			colors: {
				main: "#0d1117",
				second: "#f6f8fa",
				third: "#6d8fc1",
				fourth: "#3d506c",
				hyperlink: "#009CFF",
			},

			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
			},
		},
	},
	plugins: [],
	important: true,
};
