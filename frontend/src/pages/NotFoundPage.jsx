import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NotFoundPage() {
  const { user } = useSelector((state) => state.auth);

  const getProfilePath = () => {
    if (user?.userType === "ADMIN") return "/auth/admin";
    if (user?.userType === "COUNSELOR") return "/auth/counselor";
    return "/auth/profile";
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f5f5fb] bg-[radial-gradient(#c9c9d9_1.2px,transparent_1.2px)] bg-[length:22px_22px]"
    >
      <div className="relative w-full max-w-md bg-white rounded-[28px] border-[3px] border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] px-8 py-10 sm:px-10 sm:py-12 overflow-hidden">

        {/* corner ribbon */}
        <div className="absolute -top-1 -right-14 rotate-45 bg-amber-700 text-white text-[10px] font-bold tracking-wider px-14 py-1.5 shadow-md">
          STUDENT PORTAL
        </div>

        {/* badge */}
        <div className="flex justify-center mb-6">
          <span className="bg-amber-400 border-2 border-slate-900 text-slate-900 font-bold text-sm tracking-wide px-4 py-1.5 rounded-full">
            OOPS!
          </span>
        </div>

        {/* 404 icon block */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-md bg-amber-400 border-2 border-slate-900">
            <span className="font-extrabold text-slate-900 text-2xl">?</span>
          </div>
        </div>

        {/* heading */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">
          404
        </h1>
        <h2 className="text-center text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          Page Not <span className="text-amber-600">Found</span>
        </h2>
        <p className="text-center text-slate-500 text-sm sm:text-base mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* actions */}
        <div className="flex flex-col gap-3 mb-8">
          <Link
            to={user ? getProfilePath() : "/"}
            className="w-full text-center bg-amber-400 hover:bg-amber-500 transition-colors border-2 border-slate-900 rounded-full py-3 font-extrabold text-slate-900 tracking-wide"
          >
            {user ? "GO TO USER PROFILE →" : "GO TO HOME →"}
          </Link>
          <Link
            to={user ? getProfilePath() : "/login"}
            className="w-full text-center bg-sky-100 hover:bg-sky-200 transition-colors border-2 border-slate-900 rounded-full py-3 font-bold text-slate-900"
          >
            {user ? "Back to User Profile" : "Back to Login"}
          </Link>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-600">
            Need help?{" "}
            <a href="/support" className="font-bold text-amber-700 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}