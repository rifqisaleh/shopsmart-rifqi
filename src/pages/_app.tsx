import { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import CartProvider from "@/context/CartContext";
import Layout from "@/component/layout";

import "@/styles/globals.css";
import "@/config/fontAwesomeConfig";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Google Fonts using Next.js optimized loader
import { Philosopher, Plus_Jakarta_Sans, Poppins, Roboto } from "next/font/google";

// Load fonts with automatic optimization
const philosopher = Philosopher({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-philosopher" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["200", "400", "600", "800"], variable: "--font-jakarta" });
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-poppins" });
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-roboto" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${philosopher.variable} ${jakarta.variable} ${poppins.variable} ${roboto.variable}`}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </main>
  );
}

export default MyApp;
