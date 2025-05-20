function ArticleList({ articles, setArticleToFocus }) {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.article_id}>
          <button onClick={() => setArticleToFocus(article)}>
            {article.title}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;