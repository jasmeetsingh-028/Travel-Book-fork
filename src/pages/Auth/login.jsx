import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address to get your travel book!");
      return;
    }

    if (!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(
          "An unexpected error occurred in Travel Book's Backend, Please try again."
        );
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative flex items-center justify-center">
      <div className="container h-screen flex flex-col sm:flex-row items-center justify-center px-5 sm:px-10 lg:px-20 mx-auto">
        
        {/* Image section with a class to hide it on mobile */}
        <div className="image-section w-full sm:w-2/4 lg:w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-[58px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm sm:text-base text-white leading-6 pr-7 mt-4">
              Record your travel experiences and memories in your personal
              travel journey.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-2/4 lg:w-2/4 bg-white rounded-r-lg p-5 sm:p-10 lg:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7 text-center">Sign In to Continue</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box w-full"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary w-full">
              LOGIN
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => {
                navigate("/signUp");
              }}
            >
              CREATE ACCOUNT
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
            Kindly remember your password!
          </p>
            
          </form>
        </div>
      </div>

      {/* CSS for responsive design */}
      <style jsx>{`
        @media (max-width: 600px) {
          .image-section {
            display: none;
          }
          .container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
