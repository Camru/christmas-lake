import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import greenlightApi, {UpdateWatchedMediaParams} from '../../api/greenlightApi';
import {getFilteredMediaEntities, getFormattedDate} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  RatingSource,
  SearchParam,
  Colors,
  Notifications,
} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';
import Box from '../Shared/Box/Box';
import Modal from '../Shared/Modal/Modal';
import Button from '../Shared/Button/Button';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';
import WatchedFields from '../Shared/WatchedFields';

import './MediaList.less';
import Notification from '../Shared/Notification/Notification';
import Badge from '../Shared/Badge/Badge';
import {BeakerIcon} from '@heroicons/react/24/solid';

const WatchedList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const [editModalId, setEditModalId] = useState<string>('');
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] =
    useState<boolean>(false);
  const [dateWatched, setDateWatched] = useState<string>('');
  const [dateWatchedSeasons, setDateWatchedSeasons] = useState<string[]>([]);
  const [userRating, setUserRating] = useState<string>('');
  const [notification, setNotification] = useState<Notifications>(
    Notifications.NONE
  );

  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(SearchParam.MEDIA_TYPE) as MediaType;
  const sortParam = searchParams.get(SearchParam.SORT);
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

  const deleteMediaEntityMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const updateMediaEntityMutation = useMutation({
    mutationFn: greenlightApi.updateWatchedMedia,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
      setNotification(Notifications.ADDED);
    },
  });

  const handleCloseEditModal = () => {
    setDateWatched('');
    setDateWatchedSeasons([]);
    setEditModalId('');
  };

  const handleDeleteMediaEntity = (mediaEntityId: string) => {
    deleteMediaEntityMutation.mutate(mediaEntityId);
  };

  //TODO: [cam]  consider updating dateWatched to the date of the last season
  //watched
  const handleUpdateMediaEntity = (mediaEntity: MediaEntity) => {
    const params: UpdateWatchedMediaParams = {
      dateWatched: dateWatched
        ? dateWatched
        : dateWatchedSeasons[dateWatchedSeasons.length - 1],
      dateWatchedSeasons: dateWatchedSeasons.length
        ? dateWatchedSeasons
        : mediaEntity.dateWatchedSeasons,
      rating: userRating ? Number(userRating) : mediaEntity.rating,
    };
    updateMediaEntityMutation.mutate({mediaEntityId: mediaEntity.id, params});
    handleCloseEditModal();
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

    const getFilteredItems = (): MediaEntity[] => {
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

    const handleSelectDateWatchedSeason = (
      dateWatched: string | null,
      seasonNumber: number
    ) => {
      if (dateWatched === null) {
        setDateWatchedSeasons(dateWatchedSeasons.slice(0, -1));
      } else {
        setDateWatchedSeasons((prevDateWatchedSeasons) => {
          prevDateWatchedSeasons[seasonNumber] = dateWatched;
          return [...prevDateWatchedSeasons];
        });
      }
    };

    const handleChangeRating = (userRating: string) => {
      setUserRating(userRating);
    };

    const renderDeleteModal = () => {
      return (
        <Modal
          title="Are you sure?"
          onClose={() => setIsDeleteItemModalOpen(false)}>
          <Box justifyContent="end">
            <Button
              onClick={() => {
                handleDeleteMediaEntity(editModalId);
                setIsDeleteItemModalOpen(false);
              }}
              color={Colors.DANGER}>
              Remove
            </Button>
          </Box>
        </Modal>
      );
    };

    //TODO: [cam]  maybe try a map?
    const renderEditModal = (item: MediaEntity) => {
      return (
        <Modal title={item.title} onClose={handleCloseEditModal}>
          <Box flexDirection="column" gap={20}>
            <WatchedFields
              isSeries={item.mediaType === MediaType.SERIES}
              dateWatchedSeasons={
                dateWatchedSeasons.length
                  ? dateWatchedSeasons
                  : item.dateWatchedSeasons
              }
              userRating={userRating ? userRating : item.rating.toString()}
              dateWatched={dateWatched ? dateWatched : item.dateWatched}
              dateChangeHandler={handleSelectDateWatched}
              seasonDateChangeHandler={handleSelectDateWatchedSeason}
              ratingChangeHandler={handleChangeRating}
            />
            <Box gap={10} justifyContent="end">
              <Button
                onClick={() => setIsDeleteItemModalOpen(true)}
                color={Colors.DANGER}>
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
              </Button>
              <Button
                onClick={() => handleUpdateMediaEntity(item)}
                color={Colors.ACTION}
                disabled={
                  !userRating &&
                  !dateWatched &&
                  !dateWatchedSeasons.length &&
                  item.mediaType === MediaType.SERIES
                }>
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      );
    };

    const filteredItems = getFilteredItems();

    if (!filteredItems.length) {
      return <h1>No items found.</h1>;
    }

    return filteredItems.map((item: MediaEntity) => {
      return (
        <MediaCard
          key={item.id}
          id={item.id}
          title={item.title}
          thumbnail={item.thumbnail}>
          <Box justifyContent="space-between" alignItems="center" width="100%">
            {editModalId === item.id && renderEditModal(item)}
            {isDeleteItemModalOpen && renderDeleteModal()}
            <Box gap={5} alignItems="center">
              {item.watched && getFormattedDate(item.dateWatched)}
              {item.mediaType === MediaType.SERIES && (
                <Badge number={item.dateWatchedSeasons.length} />
              )}
            </Box>
            <Rating
              value={item.rating.toString()}
              source={RatingSource.USER_RATING}
              type="float"
            />

            <IconButton onClick={() => handleOpenEditModal(item.id)}>
              <svg
                width="30px"
                height="30px"
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
  const getNotificationText = () => {
    return {
      ADDED: <span>Successfully Updated</span>,
      REMOVED: null,
      NONE: null,
    }[notification];
  };

  return (
    <div className="media-card-list">
      {renderWatchedList()}
      {notification !== Notifications.NONE && (
        <Notification
          onClose={() => setNotification(Notifications.NONE)}
          color={Colors.WATCHED}>
          {getNotificationText()}
        </Notification>
      )}
    </div>
  );
};

export default WatchedList;
