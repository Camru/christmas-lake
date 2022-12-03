import './App.less';
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="container">
      <Navbar />
      <div className="contents">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
