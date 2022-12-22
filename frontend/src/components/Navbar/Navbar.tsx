import {NavLink} from 'react-router-dom';
import {URL_PATHS} from '../../types/types';
import Box from '../Shared/Box/Box';

import './Navbar.less';

type NavLink = {
  label: string;
  url: string;
};

const NAV_LINKS: NavLink[] = [
  {label: 'To Watch', url: URL_PATHS.TO_WATCH},
  {label: 'Watched', url: URL_PATHS.WATCHED},
  {label: 'Search', url: URL_PATHS.SEARCH},
];

const Navbar = () => {
  const renderNavLink = ({label, url}: NavLink) => {
    return (
      <NavLink
        key={label}
        to={url}
        className={({isActive}) => (isActive ? 'selected' : undefined)}>
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
