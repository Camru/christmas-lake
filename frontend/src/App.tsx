import './App.less';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ActionBar from './components/ActionBar/ActionBar';
import Box from './components/Shared/Box/Box';
import {useEffect} from 'react';
import {URL_PATHS} from './types/types';
import Footer from './components/Footer/Footer';

function App() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/') {
      navigate(URL_PATHS.TO_WATCH);
    }
  }, [pathname]);

  return (
    <div className="container">
      <Box
        className="header"
        justifyContent="space-between"
        alignItems="center">
        <Navbar />
      </Box>
      <ActionBar />
      <div className="contents">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default App;
