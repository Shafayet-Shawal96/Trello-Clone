import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("no data");
  async function fetchData() {
    const response = await fetch("http://localhost:5000/");
    const data = await response.json();
    setData(data.msg);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <div className="text-4xl text-white bg-black">{data}</div>;
}

export default App;
