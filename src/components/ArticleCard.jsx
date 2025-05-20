import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


function ArticleCard() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`)
      .then((response) => {
        setArticle(response.data.article);
      })
      .catch((err) => {
        setError("Article not found, try again");
        console.error(err);
      });
  }, [article_id]);

  if (error) return <p>{error}</p>;
  if (!article) return <p>Loading article, please wait..</p>;

  return (
    <div>
      <h2>{article.title}</h2>
      <img
        src={article.article_img_url}
        alt={`Thumbnail for ${article.title}`}
      />
      <p>
        <strong>By:</strong> {article.author}
      </p>
      <p>{article.body}</p>
      <p>
        <strong>Votes:</strong> {article.votes}
      </p>
      <p>
        <strong>Comments:</strong>
        {article.comment_count}
      </p>
    </div>
  );
}

export default ArticleCard;
