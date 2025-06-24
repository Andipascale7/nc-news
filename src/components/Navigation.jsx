import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();


  const showBackButton = location.pathname !== '/';

  return (
    <>
      {showBackButton && (
        <Link to="/" className="back-to-home-btn">
          ← Back to Home
        </Link>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-title-link">
            <h1 className="app-title">NC News</h1>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Navigation;