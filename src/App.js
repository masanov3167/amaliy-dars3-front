import React from "react";
import {  Routes, Route } from "react-router-dom";
import AdminPage from "./components/admin";
import CoursePanel from "./components/courses";
import Main from "./components/home/main";
import Login from "./components/login/login";
import Register from "./components/login/register";

function App() {  
  return (
    <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CoursePanel />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
  );
}

export default App;
