import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function TopicsList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios
      .get("https://nc-news-api-f09o.onrender.com/api/topics")
      .then(({ data }) => {
        setTopics(data.topics);
      })
      .catch((err) => {
        console.error("Failed to fetch topics", err);
      });
  }, []);

  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link to={`/topics/${topic.slug}`}>{topic.slug}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicsList;
