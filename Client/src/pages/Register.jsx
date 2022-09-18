import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/Logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      // console.log("in validation", registerRoute);
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(`chat-app-user`, JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 charachter.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 charachter.",
        toastOptions
      );
      return false;
    } else if (email.length < 3) {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  // console.log(values);
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Me Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit"> Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background:  #131324;
    .brand {
        display: flex;
        align-itmes: center;
        gap: 1rem;
        justify-content: center;
        img{
            height: 5rem;
            margin-top: -2rem;
        }
        h1{
            color: white;
            text-transform: uppercase;
        }
    }
    form{
        display: flex;
        flex-direction: column;
        gap 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input{
            width: 100%;
            border: 0.1rem solid #2f10cc;
            background-color: transparent;
            border-radius: 0.4rem;
            color:white;
            font-size: 1rem;
            padding: 1rem;
            &:focus {
                border:0.1rem solid #997af0;
                outline: none;
            }
        }
        button{
            background-color: #997af0;
            color:white;
            padding: 1rem 2rem;
            border: none;
            font-Weight: bold;
            cursor: pointer; 
            border-radius: 0.4rem;
            font-size: 1rem;
            text-trasform: uppercase;
            transition: 0.5s ease-in-out;
            &:hover{
                backgound-color: #4e0eff;
            }
        }
        span{
            color:white;
            text-transfrom: uppercase;
            a{
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;

            }
        }
    }
    `;
export default Register;
