import React, { useEffect, useState } from "react";

// const hostUrl = "http://localhost:5000";
const hostUrl = "https://trello-clone-server-snowy.vercel.app";

function App() {
  const [data, setData] = useState("no data");
  async function fetchData() {
    const response = await fetch(`${hostUrl}/helloworld`, {
      credentials: "include",
    });
    const data = await response.json();
    setData(data.msg);
  }
  async function sendData() {
    const response = await fetch(`${hostUrl}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: "test@test.com", password: "5212@qwe" }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const data = await response.json();
      console.log(data);
    }
  }

  useEffect(() => {
    sendData();
    fetchData();
  }, []);

  return <div className="text-4xl text-white bg-black">{data}</div>;
}

export default App;
