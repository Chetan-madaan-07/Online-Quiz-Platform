import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
import StatsSection from "./components/statsSection";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <StatsSection />
            </>
          }
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;









