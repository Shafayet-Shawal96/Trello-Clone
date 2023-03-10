import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../network/user_api";
import * as UserApi from "../network/user_api";
import { UnauthorizedError } from "../errors/http_errors";
import LoginSignUpPageBackground from "../components/LoginSignUpPageBackground";

function LoginPage() {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await UserApi.login(credentials);
      console.log(user);
      setErrorText(null);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.log(error);
    }
  }

  return (
    <LoginSignUpPageBackground title="Log in to Trello">
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorText && <p className="text-center text-red-400">{errorText}</p>}
        <input
          className="w-full rounded-[3px] focus:border-[#4c9aff] border-2 outline-none p-[7px] text-[14px]"
          type="email"
          placeholder="Enter email"
          {...register("email", { required: "Email is required" })}
        />
        <input
          className="mt-4 w-full rounded-[3px] focus:border-[#4c9aff] border-2 outline-none p-[7px] text-[14px]"
          type="password"
          placeholder="Enter password"
          {...register("password", { required: "Password is required" })}
        />
        <button
          className="text-white bg-[#5aac44] w-full py-2 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          Log In
        </button>
        <h3 className="text-center my-4 opacity-60">OR</h3>
        <div className="flex justify-center items-center space-x-2 bg-white login-button-shadow rounded-[3px] w-[99%] h-[39px] mb-3 font-semibold text-[#5e6c84]">
          <FcGoogle size={18} />
          <h3>Continue with Google</h3>
        </div>
      </form>
    </LoginSignUpPageBackground>
  );
}

export default LoginPage;
