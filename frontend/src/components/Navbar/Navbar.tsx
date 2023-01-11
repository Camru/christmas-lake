import classNames from 'classnames';
import {NavLink} from 'react-router-dom';
import {URL_PATHS} from '../../types/types';
import Box from '../Shared/Box/Box';

import './Navbar.less';

type NavLink = {
  label: string;
  url: string;
  className: string;
};

const NAV_LINKS: NavLink[] = [
  {label: 'To Watch', url: URL_PATHS.TO_WATCH, className: 'to-watch'},
  {label: 'Watched', url: URL_PATHS.WATCHED, className: 'watched'},
  {label: 'Search', url: URL_PATHS.SEARCH, className: 'search'},
];

const Navbar = () => {
  const renderNavLink = ({label, url, className}: NavLink) => {
    return (
      <NavLink
        key={label}
        to={url}
        className={({isActive}) => classNames({[className]: isActive})}>
        {label}
      </NavLink>
    );
  };

  return (
    <Box className="navbar" flexDirection="column" gap={10}>
      <div className="navbar-links">{NAV_LINKS.map(renderNavLink)}</div>
    </Box>
  );
};

export default Navbar;
