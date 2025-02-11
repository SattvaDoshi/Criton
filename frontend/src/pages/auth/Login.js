import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // Import UserContext
import { api } from "../../const";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Access UserContext
  const { setIsAuthenticated, setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const loading = toast.loading("Logging in...");

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { tenantId, user, token } = response.data;

        // Save data in localStorage
        localStorage.setItem("tenantId", tenantId);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        // Update context
        setIsAuthenticated(true);
        setUser(user);

        // Clear form inputs
        setEmail("");
        setPassword("");

        toast.success("Login successful", { id: loading });
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "user") {
          navigate("/");
        }
      }
    } catch (err) {
      toast.dismiss(loading);

      const errorMessage =
        err.response?.data?.message ||
        {
          401: "Invalid email or password",
          429: "Too many attempts. Please try again later",
          503: "Service temporarily unavailable. Please try again later",
          403: "Account is pending verification. Please contact administrator.",
        }[err.response?.status] ||
        "An unexpected error occurred.";

      toast.error(errorMessage);

      console.error("Login error details:", {
        timestamp: new Date().toISOString(),
        errorMessage: err.message,
        status: err.response?.status,
        email,
      });
    }
    finally{
      toast.dismiss(loading);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70">
      <div className="w-full max-w-[1440px] p-2.5 flex-col justify-center items-center gap-2.5 inline-flex">
        <div className="w-full max-w-[588px] p-5 bg-[#fbfcff] rounded-2xl border border-[#888888] flex-col justify-start items-center gap-6 flex">
          <div className="self-stretch px-3 pt-1 pb-4 border-b border-[#e7e7e7] justify-between items-start inline-flex">
            <div className="w-full flex-col justify-center items-start gap-2 inline-flex">
              <div className="w-full justify-between items-center gap-1 inline-flex">
                <div className="text-[#2957a5] text-[32px] font-normal font-['Futura Hv BT'] leading-[48px]">
                  Login
                </div>
                <Link
                  to="/"
                  className="text-[#2957a5] text-[32px] font-normal font-['Futura Hv BT'] leading-[48px]"
                >
                  X
                </Link>
              </div>
              <div className="self-stretch text-[#565656] text-base font-normal font-['Futura Bk BT'] leading-tight">
                Welcome! Log in to upload, organize, and manage your product
                images effortlessly!
              </div>
            </div>
          </div>
          <form
            className="self-stretch flex-col justify-start items-start gap-4 flex"
            onSubmit={handleLogin}
          >
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
                required
              />
            </div>
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="self-stretch h-11 px-4 py-2 rounded-lg border border-[#888888] text-[#6d6d6d] text-base font-normal font-['Inter'] bg-transparent outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="self-stretch px-4 py-2 bg-[#008dcf] rounded-lg justify-center items-center gap-2.5 inline-flex text-[#fbfcff] text-lg font-normal font-['Futura Md BT'] leading-relaxed cursor-pointer"
            >
              Login
            </button>
          </form>
          <div className="self-stretch justify-start items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 h-[0px] border border-[#d1d1d1]"></div>
            <div className="text-[#d1d1d1] text-base font-normal font-['Futura Md BT'] leading-normal">
              OR
            </div>
            <div className="grow shrink basis-0 h-[0px] border border-[#d1d1d1]"></div>
          </div>
          <button className="self-stretch px-4 py-2 rounded-lg border border-[#4f4f4f] justify-center items-center gap-2.5 inline-flex text-[#4f4f4f] text-lg font-normal font-['Futura Md BT'] leading-relaxed cursor-pointer">
            Login with Google
          </button>
          <button className="self-stretch px-4 py-2 rounded-lg border border-[#4f4f4f] justify-center items-center gap-2.5 inline-flex text-[#4f4f4f] text-lg font-normal font-['Futura Md BT'] leading-relaxed cursor-pointer">
            Login with Outlook
          </button>
          <div>
            <span className="text-[#001011] text-lg font-normal font-['Futura Bk BT'] leading-relaxed">
              Don't have an Account?{" "}
            </span>
            <Link
              to="/signup"
              className="text-[#2957a5] text-lg font-normal font-['Futura Hv BT'] leading-relaxed"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
