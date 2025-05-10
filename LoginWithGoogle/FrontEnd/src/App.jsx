import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; // Import the custom hook
import { Navigate } from "react-router-dom";

/* ───── Common Pages ───── */

/* ───── Auth Pages ───── */
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import IndexProfile from "./pages/auth/IndexProfile.jsx";
import Profile from "./pages/auth/Profile.jsx";
import AuthSuccess from "./pages/auth/AuthSuccess.jsx";
import EditProfile from "./pages/auth/EditProfile.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";

import Home from "./pages/Home";
import CountryDetails from "./pages/CountryDetails";
import Favorites from "./pages/Favorites";

import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}




/* ───── Demo Post ───── */
import postData from "./data/post.json";
import StudyPostCard from "./components/StudyPostCard.jsx";

export default function App() {
  return (
    <Routes>
      {/* ─── Public Routes ─── */}
      <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetails />} />
          <Route path="/favorites" element={<Favorites />} />
     

      {/* ─── Authentication ─── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profileIndex" element={<IndexProfile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />

      {/* ─── Study Demo ─── */}
      <Route
        path="/study-post"
        element={
          <StudyPostCard
            profileImage={postData.profileImage}
            heading={postData.heading}
            progressItems={postData.progressItems}
          />
        }
      />

      {/* ─── Fallback 404 ─── */}
      <Route
        path="*"
        element={<h1 className="p-10 text-center text-2xl">404 – Page Not Found</h1>}
      />
    </Routes>
  );
}
