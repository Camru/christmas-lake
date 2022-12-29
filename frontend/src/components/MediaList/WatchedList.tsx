import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import greenlightApi from '../../api/greenlightApi';
import {
  getCurrentDateInputValue,
  getFilteredMediaEntities,
  getFormattedDate,
} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  RatingSource,
  SearchParam,
  ButtonColor,
} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';
import Box from '../Shared/Box/Box';
import Modal from '../Shared/Box/Modal/Modal';
import Button from '../Shared/Button/Button';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';
import WatchedFields from '../Shared/WatchedFields';

import './MediaList.less';

const WatchedList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const [editModalId, setEditModalId] = useState<string>('');
  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(SearchParam.MEDIA_TYPE) as MediaType;
  const sortParam = searchParams.get(SearchParam.SORT);

  const [dateWatched, setDateWatched] = useState<string>('');
  const [userRating, setUserRating] = useState<string>('');

  const fetchWatchedMediaQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED, mediaTypeParam, sortParam],
    queryFn: () => {
      return greenlightApi.fetchWatchedMedia({
        mediaType: mediaTypeParam,
        sort: sortParam,
      });
    },
    retry: false,
  });

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

  const renderWatchedList = () => {
    if (fetchWatchedMediaQuery.isInitialLoading) {
      return <h1>loading...</h1>;
    }

    if (fetchWatchedMediaQuery.isError) {
      return <h1 style={{color: 'red'}}>Error fetching movies</h1>;
    }

    if (
      fetchWatchedMediaQuery.isSuccess &&
      !fetchWatchedMediaQuery.data.length
    ) {
      return <h1>No movies found</h1>;
    }

    const filteredItems = (): MediaEntity[] => {
      if (!fetchWatchedMediaQuery.data) {
        return [];
      }

      return getFilteredMediaEntities(
        fetchWatchedMediaQuery.data,
        searchParams
      );
    };

    const handleOpenEditModal = (itemId: string) => {
      setDateWatched('');
      setUserRating('');
      setEditModalId(itemId);
    };

    const handleSelectDateWatched = (dateWatched: string) => {
      setDateWatched(dateWatched);
    };

    const handleChangeRating = (userRating: string) => {
      setUserRating(userRating);
    };

    //TODO: [cam] Remove the delete button, instead just have an edit button that
    // opens a modal to edit the rating/date watched and also has a delete button there
    // if you really need to delete it

    const renderModal = (item: MediaEntity) => {
      return (
        <Modal title="" onClose={() => setEditModalId('')}>
          <Box flexDirection="column" gap={20}>
            <WatchedFields
              userRating={userRating ? userRating : item.rating}
              dateWatched={dateWatched ? dateWatched : item.dateWatched}
              dateChangeHandler={handleSelectDateWatched}
              ratingChangeHandler={handleChangeRating}
            />
            <Box gap={10}>
              <Button
                onClick={() => handleDeleteMovie(editModalId)}
                color={ButtonColor.DANGER}>
                <svg
                  width={15}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Remove
              </Button>
              <Button
                onClick={() => {}}
                color={ButtonColor.ACTION}
                disabled={!userRating && !dateWatched}>
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      );
    };

    //TODO: [cam]
    //  handleDeleteMovie(item.id.toString())

    return filteredItems().map((item: MediaEntity) => {
      return (
        <MediaCard key={item.imdbID + item.dateWatched} item={item}>
          <Box justifyContent="space-between" alignItems="center" width="100%">
            {editModalId === item.id && renderModal(item)}

            {item.watched && getFormattedDate(item.dateWatched)}
            <Rating
              value={item.rating}
              source={RatingSource.ROTTEN_TOMATOES}
              type="float"
            />

            <IconButton onClick={() => handleOpenEditModal(item.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </IconButton>
          </Box>
        </MediaCard>
      );
    });
  };

  return <div className="media-card-list">{renderWatchedList()}</div>;
};

export default WatchedList;
