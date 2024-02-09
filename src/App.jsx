import { BrowserRouter, Routes, Route } from "react-router-dom";
import SharedLayout from "./pages/SharedLayout";
import Home from "./pages/Home";
import CardOpen from "./components/CardOpen";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<SharedLayout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/detail/:tripId" element={<CardOpen />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};
export default App;
