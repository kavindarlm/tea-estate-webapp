import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

export default function App({ Component, pageProps }) {
  return (
    <div className="bg-white">
      <main>
        <Sidebar />
        <Component {...pageProps} />
      </main>
    </div>
  )
}
