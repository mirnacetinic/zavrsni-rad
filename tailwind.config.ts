import { withUt } from "uploadthing/tw";
 
export default withUt({
    content: [
      "./src/**/*.{ts,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        backgroundImage:{
        },
      },
    },
    plugins: [],
});

