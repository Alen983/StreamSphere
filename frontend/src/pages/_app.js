import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Layout from "@/components/common/Layout";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Layout>
    </AuthProvider>
  );
}
