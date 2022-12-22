import './App.less';
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ActionBar from './components/ActionBar/ActionBar';
import Box from './components/Shared/Box/Box';

function App() {
  return (
    <div className="container">
      <Box
        className="header"
        justifyContent="space-between"
        alignItems="center">
        <Navbar />
        <ActionBar />
      </Box>
      <div className="contents">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
