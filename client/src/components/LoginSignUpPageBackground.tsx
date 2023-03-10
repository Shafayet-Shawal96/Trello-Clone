import React, { ReactNode } from "react";
import { ReactComponent as LeftAnimation } from "./../assets/svg/leftanimation.svg";
import { ReactComponent as RightAnimation } from "./../assets/svg/rightanimation.svg";
import { ReactComponent as Logo } from "./../assets/svg/trello-logo-blue.svg";
import { ReactComponent as AtlaLogo } from "./../assets/svg/atlassian-logo.svg";
import { IoIosArrowUp } from "react-icons/io";

interface Props {
  title: string;
  children: ReactNode;
}

function LoginSignUpPageBackground({ title, children }: Props) {
  return (
    <div>
      {/* background */}
      <div>
        <Logo className="mx-auto my-10" height="43px" />
      </div>
      <div className="mx-auto max-w-[400px]">
        <div className="bg-white py-[25px] px-10 login-shadow rounded-[3px]">
          <h1 className="text-center font-semibold text-[#5e6c84] mt-[10px] mb-[25px]">
            {title}
          </h1>
          {children}
          <div className="w-full h-[1px] bg-black my-[25px] opacity-10"></div>
          <div className="text-[#4c9aff] flex justify-center items-center space-x-2">
            <span>Can't log in?</span>
            <span className="inline-block h-1 w-1 bg-black rounded-full opacity-50"></span>
            <span>Sign up for an account</span>
          </div>
        </div>
        <div className="text-[#4c9aff] text-[14px] flex justify-center items-center space-x-2 mt-4">
          <span>Privacy Policy</span>
          <span className="inline-block h-1 w-1 bg-black rounded-full opacity-50"></span>
          <span>Terms of Services</span>
        </div>
        <div className="w-[160px] mx-auto flex justify-between items-center mt-12 border-2 opacity-60">
          <h4 className="pl-1">English</h4>
          <div className="bg-[#f6f6f6]">
            <IoIosArrowUp className="rotate-180" size={25} />
          </div>
        </div>
        <div className="w-full h-[1px] bg-black my-[25px] opacity-10"></div>
        <AtlaLogo className="mx-auto mb-[25px]" width="150px" />
      </div>
      <div className="mb-[25px] text-[14px] text-[#5e6c84] flex justify-center space-x-3">
        <p>Templates</p>
        <p>Pricing</p>
        <p>Apps</p>
        <p>Jobs</p>
        <p>Blog</p>
        <p>Developers</p>
        <p>About</p>
        <p>Help</p>
        <p>Cookie Settings</p>
      </div>
      {/* left animation */}
      <div className="fixed left-0 bottom-0 w-1/3 z-[-1]">
        <LeftAnimation width="100%" height="100%" />
      </div>
      {/* right animation */}
      <div className="fixed right-0 bottom-0 w-1/3 z-[-1]">
        <RightAnimation width="100%" height="100%" />
      </div>
    </div>
  );
}

export default LoginSignUpPageBackground;
