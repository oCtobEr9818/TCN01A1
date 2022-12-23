import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/nav";
import Home from "./pages/home";
import { InstantAnalysis } from "./pages/instant_analysis";
import { HistoryAnalysis } from "./pages/history_analysis";

function App() {
  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Nav />

          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/instantAnalysis" element={<InstantAnalysis />} />
            <Route path="/historyAnalysis" element={<HistoryAnalysis />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
