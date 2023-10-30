import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";

function App() {
  const isUserSignedIn = !!localStorage.getItem("token");
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isUserSignedIn && <Route path="/account" element={<Account />} />}
      </Routes>
    </div>
  );
}

export default App;
