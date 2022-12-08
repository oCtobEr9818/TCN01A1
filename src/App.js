import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav";
import { InstantAnalysis } from "./pages/instant_analysis";

function App() {
  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Nav />

          <Routes>
            <Route exact path="/" element="" />
            <Route path="/instantAnalysis" element={<InstantAnalysis />} />
            <Route path="/historyAnalysis" />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
