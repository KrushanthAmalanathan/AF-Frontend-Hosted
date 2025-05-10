// src/components/ProfileModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineCamera,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5559";

export default function ProfileModal({ onClose }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* ─── fetch profile once ─── */
  useEffect(() => {
    (async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const { data } = await axios.get(`${API}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─── skeleton guards ─── */
  if (loading) {
    return (
      <Backdrop>
        <div className="bg-white p-6 rounded shadow">Loading…</div>
      </Backdrop>
    );
  }
  if (error) {
    return (
      <Backdrop>
        <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
      </Backdrop>
    );
  }
  if (!profile) return null;

  /* ─── role flags ─── */
  const { role } = profile;
  const isTaxpayer   = role === "taxpayer";
  const isRestaurant = role === "restaurantOwner";
  const isCourier    = role === "deliveryPerson";
  const showRating   = isRestaurant || isCourier;
  const showDriverExtras = isCourier && profile.licenseNumber;

  /* ─── avatar upload ─── */
  const changePic = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("profilePicture", file);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const { data } = await axios.post(`${API}/users/upload-profile`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((p) => ({ ...p, profilePicture: data.url }));
    } catch {
      setError("Upload failed");
    }
  };

  /* ─── logout ─── */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ─── render ─── */
  return (
    <Backdrop onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* avatar */}
        <div className="relative w-24 h-24 mx-auto">
          <img
            src={profile.profilePicture || "/default-profile.png"}
            alt="avatar"
            className="w-full h-full rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full cursor-pointer shadow">
            <AiOutlineCamera />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={changePic}
            />
          </label>
        </div>

        {/* name */}
        <h3 className="text-2xl font-semibold text-center mt-4">
          {isRestaurant
            ? profile.restaurantName
            : `${profile.firstName} ${profile.lastName}`}
        </h3>

        {/* address / email / phone */}
        {isRestaurant && profile.address && (
          <p className="text-center text-gray-500 mt-1">{profile.address}</p>
        )}
        <p className="text-center text-gray-600">{profile.email}</p>
        {isCourier && profile.phone && (
          <p className="text-center text-gray-600">{profile.phone}</p>
        )}

        {/* misc fields */}
        {profile.registerNumber && (
          <p className="text-center text-sm text-gray-400">
            Reg #: {profile.registerNumber}
          </p>
        )}
        {isTaxpayer && profile.dateOfBirth && (
          <p className="text-center text-sm text-gray-400">
            DOB: {new Date(profile.dateOfBirth).toLocaleDateString()}
          </p>
        )}

        {/* driver extras */}
        {showDriverExtras && (
          <div className="mt-2 text-center text-sm text-gray-500 space-y-1">
            <p>Licence #: {profile.licenseNumber}</p>
            <p>Vehicle: {profile.vehicleType}</p>
            {profile.bankDetails?.bankName && (
              <p>
                Bank: {profile.bankDetails.bankName} (
                {profile.bankDetails.accountNumber})
              </p>
            )}
          </div>
        )}

        {/* rating */}
        {showRating && (
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((v) =>
              v <= Math.round(profile.rating || 0) ? (
                <AiFillStar key={v} className="text-yellow-500" />
              ) : (
                <AiOutlineStar key={v} className="text-gray-400" />
              )
            )}
            <span className="ml-2 text-sm text-gray-600">
              {(profile.rating || 0).toFixed(1)} /5
            </span>
          </div>
        )}

        {/* actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/profile/edit")}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <AiOutlineEdit className="mr-2" /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <AiOutlineLogout className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

/* simple backdrop component */
function Backdrop({ children, onClick }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
