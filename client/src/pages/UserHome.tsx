import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as UserApi from "../network/user_api";

function UserHome() {
  const { username } = useParams();
  const navigate = useNavigate();

  async function checkUser() {
    const user = await UserApi.getLoggedInUser();
    if (user.username !== username) navigate("/login");
  }

  useEffect(() => {
    checkUser();
  }, []);

  return <div>{username}</div>;
}

export default UserHome;
