import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import { DataProvider } from "./context/DataContext";
import { AuthProviderWrapper } from "./context/auth.context";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <AuthProviderWrapper>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProviderWrapper>
  </Router>,
);
