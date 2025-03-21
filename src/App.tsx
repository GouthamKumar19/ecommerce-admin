import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ActionProvider } from "./context/ActionContext";
import "./App.css";

function App() {
  return (
    <ActionProvider>
      <RouterProvider router={router} />
    </ActionProvider>
  );
}

export default App;
