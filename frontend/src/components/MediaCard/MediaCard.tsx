import {MediaEntity} from '../../types/types';

import Box from '../Shared/Box/Box';

import './MediaCard.less';
import React from 'react';

type WatchedItemProps = {
  children?: React.ReactElement;
  id: string;
  thumbnail: string;
  title: string;
};

const MediaCard = ({
  id,
  thumbnail,
  title,
  children,
}: WatchedItemProps): JSX.Element => {
  return (
    <Box key={id} className="media-card" flexDirection="column">
      <img className="media-card-img" src={thumbnail} />
      <Box className="media-card-contents" flexDirection="column">
        <Box className="media-card-header" justifyContent="space-between">
          <div>{title}</div>
        </Box>
        <Box className="media-card-footer">{children}</Box>
      </Box>
    </Box>
  );
};

export default MediaCard;
