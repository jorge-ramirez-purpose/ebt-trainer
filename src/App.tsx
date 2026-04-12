import { Routes, Route, Navigate } from "react-router";
import { HomeRoute } from "./routes/HomeRoute";
import { QuizRoute } from "./routes/QuizRoute";
import { StudyRoute } from "./routes/StudyRoute";
import { MarkedRoute } from "./routes/MarkedRoute";

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRoute />} />
    <Route path="/markiert" element={<MarkedRoute />} />
    <Route path="/tag/:day/lernen" element={<StudyRoute />} />
    <Route path="/tag/:day/:modeSlug" element={<QuizRoute />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
