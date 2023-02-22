import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NotFoundPage, HomeScreen } from "./pages/Index";
import "./index.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
