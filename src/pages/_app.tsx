import { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import CartProvider from "@/context/CartContext";
import Layout from "@/component/layout";

import "@/styles/globals.css";
import "@/config/fontAwesomeConfig";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
