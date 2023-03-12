import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as UserApi from "../network/user_api";

function HomePage() {
  const navigate = useNavigate();

  async function checkUser() {
    const user = await UserApi.getLoggedInUser();
    if (user) {
      navigate(`/u/${user.username}/boards`);
    } else {
      navigate("/login");
    }
  }

  useEffect(() => {
    checkUser();
  }, []);
  return <div>HomePage</div>;
}

export default HomePage;
