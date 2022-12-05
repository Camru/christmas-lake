import WatchedList from './components/Watched/WatchedList/WatchedList';
import Search from './components/Search/Search';
import {URL_PATHS} from './types/types';
import ToWatchList from './components/ToWatch/ToWatchList/ToWatchList';

const routes = [
  {
    path: URL_PATHS.TO_WATCH,
    element: <ToWatchList />,
  },
  {
    path: URL_PATHS.WATCHED,
    element: <WatchedList />,
  },
  {
    path: URL_PATHS.SEARCH,
    element: <Search />,
  },
];

export default routes;
