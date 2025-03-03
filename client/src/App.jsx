import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import LandingPage from "./pages/LangingPage";
import Congratulations from "./pages/Congragulations";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/congratulations" element={<Congratulations />} />

        <Route
          path="/landing"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
