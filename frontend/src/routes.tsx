import WatchedList from './components/WatchedList/WatchedList';
import Search from './components/Search/Search';
import {URL_PATHS} from './types/types';

const routes = [
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
