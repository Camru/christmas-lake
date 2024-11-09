import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';
import Modal from '../Shared/Modal/Modal';
import {TooltipPosition} from '../Shared/Tooltip/Tooltip';

import TmdbLogo from '../../images/tmdb_logo.svg';

import './Footer.less';

const Footer = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const renderAboutModal = () => {
    return (
      <Modal title="" onClose={() => setIsAboutModalOpen(false)}>
        <Box flexDirection="column" gap={20}>
          <img src={TmdbLogo} alt="tmdb-log" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </Box>
      </Modal>
    );
  };

  return (
    <Box justifyContent="end" className="footer" ml="auto">
      <IconButton
        onClick={() => setIsAboutModalOpen(true)}
        tooltip={{
          text: 'About',
          position: TooltipPosition.RIGHT,
        }}>
        <QuestionMarkCircleIcon className="button-icon" />
      </IconButton>
      {isAboutModalOpen && renderAboutModal()}
    </Box>
  );
};

export default Footer;
