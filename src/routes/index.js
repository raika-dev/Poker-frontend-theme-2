import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "../pages/Game";
import Table from "../pages/Table";

const RouteComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Table></Table>}></Route>;
        <Route path="/game" element={<Game></Game>}></Route>;
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;
