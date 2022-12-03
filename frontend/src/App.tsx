import './App.css';
import {Link, Outlet} from 'react-router-dom';

function App() {
  return (
    <div className="container">
      <div className="navbar">
        <div className="navbar-links">
          <Link to="search">Search</Link>
          <Link to="watched">Watched</Link>
        </div>
      </div>
      <div className="contents">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
