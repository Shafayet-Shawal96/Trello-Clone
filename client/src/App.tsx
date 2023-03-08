import React, { useEffect } from "react";

function App() {
  async function fetchData() {
    const response = await fetch("http://localhost:5000/");
    const data = await response.json();
    console.log(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <div className="text-4xl text-white bg-black">Hello World</div>;
}

export default App;
