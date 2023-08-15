import "./App.css";
import Home from "./componants/Home";
import Navbar from "./componants/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./componants/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./componants/Alert";
import Signup from "./componants/Signup";
import Login from "./componants/Login";
import { useState } from "react";

function App() {
  const [alert, setAlert]= useState(null);
  
  const showAlert = (message,type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 2000);
  } 
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
          <Routes>
            <Route exact path="/" element={<Home showAlert={showAlert}/>} />
            <Route exact path="/about" element={<About/>} />
            <Route exact path="/login" element={<Login showAlert={showAlert}/>} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert}/>} />
          </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
