import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";
import Post from "./Post";
import MyProfile from "./MyProfile";
import Pricing from "./Pricing";
import Upgrade from "./Upgrade";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post" element={<Post />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
