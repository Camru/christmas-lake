import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import greenlightApi, {UpdateMediaEntityParams} from '../../api/greenlightApi';
import {getFilteredMediaEntities, getFormattedDate} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  RatingSource,
  SearchParam,
  Colors,
  Notifications,
  Tags,
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
import {EllipsisVerticalIcon} from '@heroicons/react/24/solid';
import {ArrowPathIcon, TrashIcon} from '@heroicons/react/24/outline';
import TagsButton from '../Shared/Tags/TagsButton';
import {TooltipPosition} from '../Shared/Tooltip/Tooltip';
import Tag from '../Shared/Tags/Tag';

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
    const params: UpdateMediaEntityParams = {
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

  const handleUpdateTags = (updatedTags: Tags[], mediaEntityId: string) => {
    const params: UpdateMediaEntityParams = {
      tags: updatedTags,
    };
    updateMediaEntityMutation.mutate({mediaEntityId, params});
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

    const renderTags = (itemTags: Tags[]) => {
      return (
        <Box gap={10}>
          {itemTags.map((itemTag) => {
            return <Tag key={itemTag}>{itemTag}</Tag>;
          })}
        </Box>
      );
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
            {renderTags(item.tags)}
            <Box gap={10} justifyContent="space-between">
              <Box>
                <TagsButton
                  onSubmit={(updatedTags) =>
                    handleUpdateTags(updatedTags, item.id)
                  }
                  itemTags={item.tags}
                />
                <IconButton
                  onClick={() => setIsDeleteItemModalOpen(true)}
                  tooltip={{
                    text: 'Remove from Watched list',
                    position: TooltipPosition.LEFT,
                  }}>
                  <TrashIcon className="button-icon" />
                </IconButton>
              </Box>
              <Button
                onClick={() => handleUpdateMediaEntity(item)}
                color={Colors.ACTION}
                disabled={
                  !userRating &&
                  !dateWatched &&
                  !dateWatchedSeasons.length &&
                  item.mediaType === MediaType.SERIES
                }>
                <ArrowPathIcon className="button-icon" />
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
              <EllipsisVerticalIcon className="button-icon" />
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
