import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Výlety</h1>} />
        <Route path="/detail" element={<h1>Detail</h1>} />
        <Route path="/new" element={<h1>Nový</h1>} />
       
      </Routes>
    </BrowserRouter>
  );
};
export default App;
