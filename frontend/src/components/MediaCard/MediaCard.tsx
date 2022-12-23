import {MediaEntity} from '../../types/types';

import Box from '../Shared/Box/Box';
import {getFormattedDate} from '../../helpers/utils';

import './MediaCard.less';
import React from 'react';

type WatchedItemProps = {
  children?: React.ReactElement;
  item: MediaEntity;
};

//TODO: [cam] Remove the delete button, instead just have an edit button that
// opens a modal to edit the rating/date watched and also has a delete button there
// if you really need to delete it

// Watched item display
//  title: string;
//  dateWatched: string;
//  mediaType: MediaType;  <--- tv / movie thumbnail
//  thumbnail: string;
//  rating: string;

const MediaCard = ({item, children}: WatchedItemProps): JSX.Element => {
  return (
    <Box key={item.imdbID} className="media-card" flexDirection="column">
      <img
        className="media-card-img"
        src={item.thumbnail}
        alt="media-thumbnail"
      />
      <Box className="media-card-contents" flexDirection="column">
        <Box className="media-card-header" justifyContent="space-between">
          <div>{item.title}</div>
          <div>{item.watched && getFormattedDate(item.dateWatched)}</div>
        </Box>
        <Box className="media-card-footer">{children}</Box>
      </Box>
    </Box>
  );
};

export default MediaCard;
