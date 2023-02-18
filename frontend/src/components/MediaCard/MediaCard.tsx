import {MediaEntity, MediaType, REACT_QUERY_API_KEYS} from '../../types/types';

import Box from '../Shared/Box/Box';

import './MediaCard.less';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import moviedbApi from '../../api/moviedbApi';

type WatchedItemProps = {
  children?: React.ReactElement;
  id: string;
  imdbId: string;
  mediaType: MediaType;
  thumbnail: string;
  title: string;
};

const MediaCard = ({
  id,
  imdbId,
  mediaType,
  thumbnail,
  title,
  children,
}: WatchedItemProps): JSX.Element => {
  const fetchItemByType = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.MOVIE_DB_FIND_BY_ID, imdbId],
    queryFn: () => {
      const apiFn =
        mediaType === MediaType.MOVIE
          ? moviedbApi.findMovieById
          : moviedbApi.findSeriesById;
      return apiFn(imdbId);
    },
    retry: false,
  });

  const result = fetchItemByType.data;

  const getThumbnail = () => {
    if (fetchItemByType.isLoading || !result?.poster_path) {
      return thumbnail;
    }

    return `https://image.tmdb.org/t/p/w300${result.poster_path}`;
  };

  return (
    <Box key={id} className="media-card" flexDirection="column">
      {fetchItemByType.isLoading ? (
        <Box className="media-card-img" />
      ) : (
        <img className="media-card-img" src={getThumbnail()} />
      )}

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
