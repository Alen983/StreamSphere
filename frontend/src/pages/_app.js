// src/pages/_app.js
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Layout from "@/components/common/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
