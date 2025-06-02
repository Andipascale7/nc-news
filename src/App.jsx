import HomePage from "./components/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleCard from "./components/ArticleCard";
import TopicArticles from "./components/TopicArticles";
import TopicsList from "./components/TopicsList";
import ErrorPage from "./components/ErrorPage";
import UserContext from "./components/UserContext";

function App() {
  return (
    <BrowserRouter>
    <UserContext.Provider value={{ loggedInUser: "jessjelly" }}></UserContext.Provider>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/articles/:article_id" element={<ArticleCard />} />
          <Route path="/topics" element={<TopicsList />} />
          <Route path="/topics/:topic_slug" element={<TopicArticles />} />
          <Route path="*"element={<ErrorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
