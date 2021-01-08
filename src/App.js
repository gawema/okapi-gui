import React, { useState } from "react"
import Login from "./components/login/Login"
import Dashboard from "./components/dashboard/Dashboard"
import Editor from "./components/editor/Editor"
import PrivateRoute from "./PrivateRoute"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthContext } from "./context/auth";


const App = () => {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    if (data) {
    // user login
    localStorage.setItem("tokens", JSON.stringify(data));
    } else {
    // user logout
    localStorage.removeItem("tokens");
    }
    setAuthTokens(data);
  };


  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute path="/editor" component={Editor} />
        <Route path="/login" component={Login} />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;