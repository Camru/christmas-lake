import {useMutation, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../../api/greenlightApi';
import {
  ButtonColor,
  RatingSource,
  REACT_QUERY_API_KEYS,
  MediaEntity,
} from '../../types/types';

import Box from '../Shared/Box/Box';
import {getFormattedDate} from '../../helpers/utils';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';

import './MediaCard.less';

type WatchedItemProps = {
  item: MediaEntity;
};

//TODO: [cam] Remove the delete button, instead just have an edit button that
// opens a modal to edit the rating/date watched and also has a delete button there
// if you really need to delete it

const MediaCard = ({item}: WatchedItemProps): JSX.Element => {
  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

  // Watched item display 
  //  title: string;
  //  dateWatched: string;
  //  mediaType: MediaType;  <--- tv / movie thumbnail
  //  thumbnail: string;
  //  rating: string;

  return (
    <Box key={item.imdbID} className="media-card" flexDirection="column">
      <Box className="media-card-header" justifyContent="space-between">
        <div>{item.title}</div>
        <div>{getFormattedDate(item.dateWatched)}</div>
      </Box>
      <img
        className="media-card-img"
        src={item.thumbnail}
        alt="media-thumbnail"
      />
      <Box
        className="media-card-footer"
        alignItems="center"
        justifyContent="space-between">
        <Rating
          value={item.rating}
          source={RatingSource.ROTTEN_TOMATOES}
          type="float"
        />
        <IconButton
          onClick={() => handleDeleteMovie(item.id.toString())}
          color={ButtonColor.DANGER}>
          Del
        </IconButton>
      </Box>
    </Box>
  );
};

export default MediaCard;
