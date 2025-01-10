import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import {useNavigate} from "react-router-dom"
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if(!name){
      setError("Please enter your name to continue!");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address to get your travel book!");
      return;
    }

    if(!password)
    {
      setError("Please enter the password!");
      return;
    }

    setError("");
    

    // SIGNUP API CALL WILL BE THERE.
    try{
      const response = await axiosInstance.post("/create-account",{
        fullName:name,
        email:email,
        password:password,
      });

      if(response.data && response.data.accessToken)
      {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
      if(
        error.response && 
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else{
        setError("An unexpected error occurred in Travel Book's Backend, Please try again.")
      }
    }
  }

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">

      <div className="login-ui-box right-10 -top-40"/>
      <div className="login-ui-box "/>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"/>
      <div className="login-ui-box bg-cyan-200 bottom-0 left-0 absolute"/>
      <div className="login-ui-box bg-cyan-200 bottom-0 right-0 absolute"/>


      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div>
            <h4 className="text-5xl text-black  font-bold leading-[58px]"> 
              Join The <br /> Adventure
            </h4>
            <p className="text-[15px] text-black font-bold leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>  

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input type="text" placeholder="Please Enter Your Full Name" className="input-box" 
            value={name}
            onChange={({target})=>{
              setName(target.value);
            }}
            />

            <input type="text" placeholder="Please Enter Your Email Address" className="input-box" 
            value={email}
            onChange={({target})=>{
              setEmail(target.value);
            }}
            />

            <PasswordInput value={password}
            onChange={({target})=>{
              setPassword(target.value);
            }} /> 

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button type="submit" className="btn-primary btn-light" onClick={()=>{
              navigate("/login");
            }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;