import { Spinner } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import Input from "./InputComponent";
import React, { useEffect, useState } from "react";

const ForgotPasswordPopUp = () => {
  const [emailInputValue, setEmailInputValue] = useState();
  const [response, setResponse] = useState(null);
  const { isLoading, error, performFetch } = useFetch(
    "/auth/forgotpassword",
    (response) => {
      setResponse(response);
    }
  );

  const sendRequest = (email) => {
    performFetch({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
  };

  useEffect(() => {
    const btn = document.getElementById("popup-submit-btn");
    if (btn) {
      const handleClick = () => {
        sendRequest(emailInputValue);
      };
      btn.addEventListener("click", handleClick);
      return () => {
        btn.removeEventListener("click", handleClick);
      };
    }
  }, [emailInputValue]);

  useEffect(() => {
    const btn = document.getElementById("popup-submit-btn");
    const body = document.getElementById("forgot-password-input-block");
    if (response) {
      btn.style.display = "none";
      body.style.display = "none";
    }
  }, [response]);

  return (
    <div className="forgot-password-popup-body">
      {isLoading ? (
        <Spinner
          as="div"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : response && response.success === true ? (
        <p>
          We have sent instructions to {emailInputValue}, check your mailbox.
        </p>
      ) : (
        <p style={{ color: "red", fontSize: "12px" }}>
          {error && error.toString()}
        </p>
      )}
      <div id="forgot-password-input-block">
        <p>
          Enter your email address and you will receive an email with
          instructions
        </p>
        <Input
          id={"forgot-password-input"}
          type={"email"}
          label={"E-mail"}
          text={"E-mail"}
          cb={(e) => {
            setEmailInputValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPopUp;
