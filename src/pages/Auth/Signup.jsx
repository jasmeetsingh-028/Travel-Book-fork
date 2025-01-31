import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import logo from "../../assets/images/logo.png";
import { toast } from "sonner"; 
import { Helmet } from "react-helmet"; // Import react-helmet

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name to continue!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address to get your travel book!");
      return;
    }

    if (!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");
    setLoading(true);  // Start loading when form is submitted

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Account created successfully! Welcome to Travel Book.");
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
    } finally {
      setLoading(false);  // Stop loading after the request is completed
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
       <Helmet>
        <title>Create Account | Travel Book</title>
        </Helmet>
      <div className="container h-screen flex items-center justify-center px-5 sm:px-10 lg:px-20 mx-auto">
        <div className="image-section w-full sm:w-2/4 lg:w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-3xl sm:text-4xl lg:text-5xl text-black font-bold leading-[58px]">
              Join The <br /> Adventure
            </h4>
            <p className="text-sm sm:text-base text-black font-bold leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-2/4 lg:w-2/4 h-[75vh] rounded-r-lg relative p-5 sm:p-10 lg:p-16 shadow-lg shadow-cyan-200/20">
          <div className="flex justify-center mb-6">
            <a href="https://travelbook.sahilportfolio.me/">
              <img src={logo} alt="Logo" className="h-24" />
            </a>
          </div>

          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7 text-center">
              Register Now to Document Your Travels
            </h4>

            <input
              type="text"
              placeholder="Please enter your full name"
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <input
              type="text"
              placeholder="Please enter your email address"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                "Creating your account..."
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="custom-loader"></div>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center my-4">Or</p>

          <button
            type="button"
            className="btn-primary btn-light w-full"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Kindly remember your password!
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          .image-section {
            display: none;
          }
          .container {
            flex-direction: column;
          }
        }

        .custom-loader {
          border: 4px solid #f3f3f3; /* Light grey */
          border-top: 4px solid #00bcd4; /* Cyan */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
