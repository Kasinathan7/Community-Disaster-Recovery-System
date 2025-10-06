import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReliefCenters from "./components/ReliefCenters";
import Shelters from "./components/Shelters";
import MissingPeople from "./components/MissingPeople";
import Volunteers from "./components/Volunteers";
import HealthTips from "./components/HealthTips";
import MentalHealth from "./components/MentalHealth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/relief-centers" element={<ReliefCenters />} />
      <Route path="/shelters" element={<Shelters />} />
      <Route path="/missing-people" element={<MissingPeople />} />
      <Route path="/volunteers" element={<Volunteers />} />
      <Route path="/health-tips" element={<HealthTips />} />
      <Route path="/mental-health" element={<MentalHealth />} />
    </Routes>
  );
}

export default App;
