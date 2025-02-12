// Step1.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Step1({ nextStep, handleChange, formData, handleRegistration, loading }) {
  // Local validation state
  const [errors, setErrors] = useState({
    usernameOrEmail: "",
    phoneNumber: "",
    password: ""
  });

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Handle local validation before submission
  const handleSubmit = async () => {
    // Reset errors
    const newErrors = {
      usernameOrEmail: "",
      phoneNumber: "",
      password: ""
    };

    // Validate email/username
    if (!formData.usernameOrEmail) {
      newErrors.usernameOrEmail = "This field is required";
    } else if (formData.usernameOrEmail.includes("@") && !validateEmail(formData.usernameOrEmail)) {
      newErrors.usernameOrEmail = "Invalid email format";
    }

    // Validate phone
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "This field is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "This field is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    // If no errors, proceed with registration
    if (!Object.values(newErrors).some(error => error)) {
      await handleRegistration();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70">
      <div className="w-[520px] h-auto p-5 bg-[#fbfcff] rounded-2xl border border-[#888888] flex-col justify-start items-center gap-6 inline-flex">
        {/* Header */}
        <div className="self-stretch px-3 pt-1 pb-4 border-b border-[#e7e7e7] justify-between items-start inline-flex">
          <div className="w-[448px] flex-col justify-center items-start gap-2 inline-flex">
            <div className="w-full justify-between items-center gap-1 inline-flex">
              <div className="text-[#2957a5] text-[32px] font-normal font-['Futura Hv BT'] leading-[48px]">
                Sign Up
              </div>
              <Link to="/" className="text-[#2957a5] text-[32px] font-normal font-['Futura Hv BT'] leading-[48px]">
                X
              </Link>
            </div>
            <div className="self-stretch text-[#565656] text-base font-normal font-['Futura Bk BT'] leading-tight">
              Welcome! Sign up to upload, organize, and manage your product images effortlessly!
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
          {/* Email/Username Field */}
          <div className="self-stretch flex-col justify-start items-start gap-1 flex">
            <div className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] flex-col justify-start items-start gap-2.5 flex">
              <input
                type="text"
                name="usernameOrEmail"
                placeholder="Enter Username or Email ID"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="self-stretch text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
              />
            </div>
            {errors.usernameOrEmail && (
              <span className="text-red-500 text-sm">{errors.usernameOrEmail}</span>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="self-stretch flex-col justify-start items-start gap-1 flex">
            <div className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] flex-col justify-start items-start gap-2.5 flex">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="self-stretch text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="self-stretch flex-col justify-start items-start gap-1 flex">
            <div className="text-[#565656] text-base font-normal font-['Futura Md BT'] leading-normal">
              Create Password
            </div>
            <div className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] justify-start items-center gap-2.5 inline-flex">
              <input
                type="password"
                name="password"
                placeholder="e.g : OR5O2hz4"
                value={formData.password}
                onChange={handleChange}
                className="grow shrink basis-0 self-stretch text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
            <div className="text-right text-[#2a2f31] text-xs font-normal font-['Inter']">
              *Password must be at least 8 characters.
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`self-stretch px-4 py-2 ${
            loading ? 'bg-gray-400' : 'bg-[#008dcf]'
          } rounded-lg justify-center items-center gap-2.5 inline-flex`}
        >
          <div className="text-[#fbfcff] text-lg font-normal font-['Futura Md BT'] leading-relaxed">
            {loading ? 'Signing up...' : 'Sign up'}
          </div>
        </button>

        {/* Divider */}
        <div className="self-stretch justify-start items-center gap-4 inline-flex">
          <div className="grow shrink basis-0 h-[0px] border border-[#d1d1d1]"></div>
          <div className="text-[#d1d1d1] text-base font-normal font-['Futura Md BT'] leading-normal">
            OR
          </div>
          <div className="grow shrink basis-0 h-[0px] border border-[#d1d1d1]"></div>
        </div>

        {/* Social Sign-up Buttons */}
        <div className="self-stretch h-[92px] flex-col justify-start items-start gap-2 flex">
          <button className="self-stretch px-4 py-2 rounded-lg border border-[#4f4f4f] justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#4f4f4f] text-lg font-normal font-['Futura Md BT'] leading-relaxed">
              Sign up with Google
            </div>
          </button>
          <button className="self-stretch px-4 py-2 rounded-lg border border-[#4f4f4f] justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#4f4f4f] text-lg font-normal font-['Futura Md BT'] leading-relaxed">
              Sign up with Outlook
            </div>
          </button>
        </div>

        {/* Login Link */}
        <div>
          <span className="text-[#001011] text-lg font-normal font-['Futura Bk BT'] leading-relaxed">
            Already have an Account?{" "}
          </span>
          <Link
            to="/login"
            className="text-[#2957a5] text-lg font-normal font-['Futura Hv BT'] leading-relaxed"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

