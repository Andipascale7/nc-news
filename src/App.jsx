import HomePage from "./components/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleCard from "./components/ArticleCard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/articles/:article_id" element={<ArticleCard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
