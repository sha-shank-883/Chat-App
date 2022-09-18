import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/Logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
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
      // console.log("in validation", loginRoute);
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
    const { password, username } = values;
    if (password === "") {
      toast.error("Email and passwrod is required.", toastOptions);
      return false;
    } else if (username.length === "") {
      toast.error("Email and passwrod is required.", toastOptions);
      return false;
    }
    return true;
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  //   console.log(values);
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
            min="3"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            min="8"
          />

          <button type="submit"> Login User</button>
          <span>
            Don't have an account ? <Link to="/register">Register</Link>
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
export default Login;
