import { useState, useEffect } from "react";
import getAllArticles from "../api";
import { Link } from "react-router-dom";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading articles</div>;
  }

  return (
    <div>
      {/* Browse Topics Button - Top Left */}
      <Link to="/topics" className="browse-topics-btn">
        Browse by Topic
      </Link>
      
      {/* Articles Grid - 4 columns */}
      <div className="articles-grid">
        {articles.map((article) => (
          <Link 
            key={article.article_id} 
            to={`/articles/${article.article_id}`}
            className="article-card-link"
          >
            <article className="article-card">
              <div className="article-image-wrapper">
                <img
                  src={article.article_img_url}
                  alt=""
                  className="article-card-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/f0f0f0/999999?text=NC+News';
                  }}
                />
                <div className="article-overlay">
                  <span className="article-topic">{article.topic}</span>
                </div>
              </div>
              
              <div className="article-content">
                <h3 className="article-title">
                  {article.title}
                </h3>
                
                <div className="article-meta">
                  <span className="article-author">{article.author}</span>
                  <span className="article-date">
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  
                  <div className="article-stats">
                    <div className="stat-item">
                      <span className="stat-value">{article.votes}</span>
                      <span>votes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{article.comment_count}</span>
                      <span>comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;


// import { useState, useEffect } from "react";
// import getAllArticles from "../api";
// import { Link } from "react-router-dom";

// function HomePage() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     getAllArticles().then((data) => {
//       setArticles(data);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading articles</div>;
//   }

//   return (
//     <div className="fade-in-up">
//       {/* Hero Section - New Yorker Style */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1 className="hero-title">The Latest</h1>
//           <p className="hero-subtitle">News, analysis, and commentary</p>
//           <Link to="/topics">
//             <button className="secondary">Browse by Topic</button>
//           </Link>
//         </div>
//       </section>

//       {/* Articles Grid */}
//       <section className="articles-section">
//         <div className="container">
//           <div className="articles-grid">
//             {articles.map((article) => (
//               <Link 
//                 key={article.article_id} 
//                 to={`/articles/${article.article_id}`}
//                 className="article-card-link"
//               >
//                 <article className="article-card">
//                   <div className="article-image-wrapper">
//                     <img
//                       src={article.article_img_url}
//                       alt=""
//                       className="article-card-image"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400x220/f0f0f0/999999?text=NC+News';
//                       }}
//                     />
//                     <div className="article-overlay">
//                       <span className="article-topic">{article.topic}</span>
//                     </div>
//                   </div>
                  
//                   <div className="article-content">
//                     <h3 className="article-title">
//                       {article.title}
//                     </h3>
                    
//                     <div className="article-meta">
//                       <span className="article-author">{article.author}</span>
//                       <span className="article-date">
//                         {new Date(article.created_at).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           year: 'numeric'
//                         })}
//                       </span>
//                     </div>

//                     <p className="article-excerpt">
//                       {article.body 
//                         ? article.body.substring(0, 140).replace(/\s+/g, ' ').trim() + '...'
//                         : 'Read the full article for more details.'
//                       }
//                     </p>
                    
//                     <div className="article-stats">
//                       <div className="stat-item">
//                         <span className="stat-value">{article.votes}</span>
//                         <span>votes</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-value">{article.comment_count}</span>
//                         <span>comments</span>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default HomePage;

// // import { useState, useEffect } from "react";
// // import getAllArticles from "../api";
// // import { Link } from "react-router-dom";

// // function HomePage() {
// //   const [articles, setArticles] = useState([]);
// //   useEffect(() => {
// //     getAllArticles().then((data) => {
// //       setArticles(data);
// //     });
// //   }, []);

// //   return (
// //     <div>
// //       <Link to="/topics">Browse Topics</Link>
// //       <h1>All Articles</h1>
// //       <ul>
// //         {articles.map((article) => (
// //           <li key={article.article_id}>
// //             <img
// //               src={article.article_img_url}
// //               alt={`Thumbnail for ${article.title}`}
// //             />
// //             <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default HomePage;
