import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}
const Button = styled.button`
  display: flrx;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 1rem;
  background-color: #d79d9d;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ff0000;
  }
  &:hover {
    svg {
      font-size: 1.4rem;
      color: red;
    }
  }
`;
