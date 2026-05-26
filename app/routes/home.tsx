import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Card from "../src/components/card";
import ProductList from "../src/product/productList";
import SidePanel from "~/src/product/sidePanel";

export default function Home() {
  return (
    <Router>
      <Routes>
        <Route path="/card" element={<Card />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/productdetal" element={<SidePanel />} />
      </Routes>
    </Router>
  );
}
