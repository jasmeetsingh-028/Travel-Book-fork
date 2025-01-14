import { ClerkProvider, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/home/Home";
import Hero from "./pages/hero/Hero";

const App = () => {
  const frontendApi = "pk_test_dml0YWwtdmlwZXItNjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

  return (
    <ClerkProvider publishableKey="pk_test_dml0YWwtdmlwZXItNjQuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <Router>
        <Routes>
          <Route path="/" exact element={<Hero />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
