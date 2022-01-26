import React, { useEffect } from "react";
import "./App.css";
import Layout from "./containers/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import M from "materialize-css";

function App() {
  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
