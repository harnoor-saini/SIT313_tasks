import './App.css'
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import Footer from "./Footer";
import Login from "./Login";
import Signup from "./Signup";
import Post from './Post';

function App() {
  return (
    <>
      <NavigationBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/post" element={<Post/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App