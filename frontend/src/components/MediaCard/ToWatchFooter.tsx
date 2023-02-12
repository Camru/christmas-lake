import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useRef, useState} from 'react';
import greenlightApi, {UpdateMediaEntityParams} from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  capitalizeFirstChar,
  convertMinutesToHoursAndMinutes,
  getFormattedDate,
} from '../../helpers/utils';
import {
  Colors,
  MediaEntity,
  MediaRating,
  Notifications,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
  Tags,
} from '../../types/types';
import Box from '../Shared/Box/Box';
import Modal from '../Shared/Modal/Modal';
import Button from '../Shared/Button/Button';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';
import AddWatchedButton from '../Shared/Button/AddWatchedButton';
import {TooltipPosition} from '../Shared/Tooltip/Tooltip';
import {ListBulletIcon, PlusIcon} from '@heroicons/react/24/solid';
import {TrashIcon} from '@heroicons/react/24/outline';
import TagsButton from '../Shared/Tags/TagsButton';
import Notification from '../Shared/Notification/Notification';

const RatingSourceToKeyMap: Record<string, RatingSource> = {
  'Internet Movie Database': RatingSource.IMDB,
  'Rotten Tomatoes': RatingSource.ROTTEN_TOMATOES,
  Metacritic: RatingSource.METACRITIC,
};

type ToWatchFooter = {
  item: MediaEntity;
};

const ToWatchFooter = ({item}: ToWatchFooter): JSX.Element => {
  const queryClient = useQueryClient();
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] =
    useState<boolean>(false);
  const [isExtraDetailsModalOpen, setIsExtraDetailsModalOpen] =
    useState<boolean>(false);
  const [notification, setNotification] = useState<Notifications>(
    Notifications.NONE
  );
  const viewportSize = useRef([window.innerWidth, window.innerHeight]);
  const [viewportWidth] = viewportSize.current;

  const {data, isFetching} = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH_BY_ID, item.title],
    queryFn: () => omdbApi.searchByTitle(item.title),
  });

  const updateMediaEntityMutation = useMutation({
    mutationFn: greenlightApi.updateWatchedMedia,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
      setNotification(Notifications.ADDED);
    },
  });

  const handleUpdateMediaEntity = (mediaEntity: MediaEntity, tags: Tags[]) => {
    const params: UpdateMediaEntityParams = {
      tags,
    };
    updateMediaEntityMutation.mutate({mediaEntityId: mediaEntity.id, params});
  };

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

  const handleOpenDeleteItemModal = () => {
    setIsDeleteItemModalOpen(true);
  };

  const handleUpdateTags = (updatedTags: Tags[]) => {
    handleUpdateMediaEntity(item, updatedTags);
  };

  const getNotificationText = () => {
    return {
      ADDED: <span>Tags updated</span>,
      REMOVED: null,
      NONE: null,
    }[notification];
  };

  const renderExtraDetails = () => {
    if (isFetching) {
      return <p>loading extra details...</p>;
    }

    const details = [
      {
        label: 'Date Added',
        value: getFormattedDate(item.dateWatched),
      },
      {
        label: 'Year',
        value: data?.Year,
      },
      {
        label: 'Type',
        value: capitalizeFirstChar(data?.Type),
      },
      {
        label: 'Total Seasons',
        value: data?.totalSeasons,
        isHidden: data?.Type === 'movie',
      },
      {
        label: 'Actors',
        value: data?.Actors,
      },
      {
        label: 'Writer',
        value: data?.Writer,
      },
      {
        label: 'Director',
        value: data?.Director,
      },
      {
        label: 'Runtime',
        value: convertMinutesToHoursAndMinutes(data?.Runtime),
      },
      {
        label: 'Country',
        value: data?.Country,
      },
      {
        label: 'Language',
        value: data?.Language,
      },
      {
        label: 'Genre',
        value: data?.Genre,
      },
      {
        label: 'Plot',
        value: data?.Plot,
        style: {width: '200px', height: '120px', overflow: 'scroll'},
      },
    ];

    return details.map(({label, value, isHidden}) => {
      if (isHidden) {
        return null;
      }
      return (
        <div className="extra-detail-row" key={label}>
          <label>{label} </label>
          <p>{value}</p>
        </div>
      );
    });
  };

  const renderRating = (rating: MediaRating) => {
    return (
      <li key={rating.Source} className="rating-list-item">
        <Rating
          value={rating.Value}
          source={RatingSourceToKeyMap[rating.Source]}
        />
      </li>
    );
  };

  const renderRatings = () => {
    const ratings = JSON.parse(item.ratings) || [];
    const visibleRatings = viewportWidth <= 415 ? ratings.slice(0, 2) : ratings;

    return (
      <Box className="ratings-list">
        {ratings.length ? visibleRatings.map(renderRating) : <p>No Ratings</p>}
      </Box>
    );
  };

  const renderDeleteItemModal = () => {
    return (
      <Modal
        title="Are you sure?"
        onClose={() => setIsDeleteItemModalOpen(false)}>
        <Box justifyContent="end">
          <Button
            onClick={() => {
              handleDeleteMovie(item.id.toString());
              setIsDeleteItemModalOpen(false);
            }}
            color={Colors.DANGER}>
            Remove
          </Button>
        </Box>
      </Modal>
    );
  };

  const renderExtraDetailsModal = () => {
    return (
      <Modal
        className="dark"
        title={item.title}
        subtitle={renderRatings()}
        onClose={() => setIsExtraDetailsModalOpen(false)}>
        <Box flexDirection="column" gap={10}>
          {renderExtraDetails()}
        </Box>
      </Modal>
    );
  };

  const searchResult: SearchResult = {
    Poster: item.thumbnail,
    Title: item.title,
    Type: item.mediaType,
    Year: item.year,
    imdbID: item.imdbID,
    tags: item.tags,
  };

  return (
    <Box width="100%" gap={10} alignItems="center" flexDirection="column">
      <Box width="100%" mt="10px">
        {renderRatings()}
      </Box>
      <Box width="100%" gap={5}>
        <AddWatchedButton
          item={searchResult}
          isIconButton
          onSuccess={() => handleDeleteMovie(item.id.toString())}>
          <PlusIcon className="button-icon" />
        </AddWatchedButton>
        <IconButton
          onClick={() => setIsExtraDetailsModalOpen(true)}
          tooltip={{
            text: 'See details',
            position: TooltipPosition.LEFT,
          }}>
          <ListBulletIcon className="button-icon" />
        </IconButton>
        <TagsButton onSubmit={handleUpdateTags} itemTags={item.tags} />
        <IconButton
          tooltip={{
            text: 'Remove from To Watch list',
            position: TooltipPosition.RIGHT,
          }}
          onClick={handleOpenDeleteItemModal}
          style={{marginLeft: 'auto'}}>
          <TrashIcon className="button-icon" style={{width: 15}} />
        </IconButton>
      </Box>
      {isDeleteItemModalOpen && renderDeleteItemModal()}
      {isExtraDetailsModalOpen && renderExtraDetailsModal()}
      {notification !== Notifications.NONE && (
        <Notification
          onClose={() => setNotification(Notifications.NONE)}
          color={Colors.TO_WATCH}>
          {getNotificationText()}
        </Notification>
      )}
    </Box>
  );
};

export default ToWatchFooter;
