import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { Nav } from "./components/nav";
import { InstantAnalysis } from "./pages/instant_analysis";
import { HistoryAnalysis } from "./pages/history_analysis";
import { ReadCSV } from "./pages/read_csv";

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
            <Route path="/readCSV" element={<ReadCSV />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
