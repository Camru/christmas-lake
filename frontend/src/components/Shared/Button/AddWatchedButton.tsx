import {PlusIcon} from '@heroicons/react/24/solid';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import greenlightApi, {
  CreateWatchedMediaParams,
} from '../../../api/greenlightApi';
import {getCurrentDateInputValue} from '../../../helpers/utils';
import {
  Colors,
  MediaType,
  Notifications,
  REACT_QUERY_API_KEYS,
  SearchResult,
  URL_PATHS,
} from '../../../types/types';
import Box from '../Box/Box';
import Modal from '../Modal/Modal';
import Notification from '../Notification/Notification';
import {TooltipPosition} from '../Tooltip/Tooltip';
import WatchedFields from '../WatchedFields';
import Button from './Button';
import IconButton from './IconButton';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  watchedMediaEntityId?: string | undefined;
  toWatchMediaEntityId?: string | undefined;
  isIconButton?: boolean;
  item: SearchResult;
  onSuccess?: () => void;
  className?: string;
};

const convertToMediaEntity = (
  item: SearchResult,
  dateWatched: string,
  rating: number
): CreateWatchedMediaParams => {
  if (item.Type === MediaType.SERIES) {
    return {
      title: item.Title,
      dateWatched: dateWatched,
      dateWatchedSeasons: [dateWatched],
      tags: item.tags || [],
      year: item.Year,
      mediaType: item.Type,
      thumbnail: item.Poster,
      imdbID: item.imdbID,
      rating,
      ratings: '',
      watched: true,
    };
  }

  return {
    title: item.Title,
    dateWatched,
    dateWatchedSeasons: [],
    tags: item.tags || [],
    year: item.Year,
    mediaType: item.Type,
    thumbnail: item.Poster,
    imdbID: item.imdbID,
    rating,
    ratings: '',
    watched: true,
  };
};

const AddWatchedButton = ({
  className,
  item,
  watchedMediaEntityId,
  toWatchMediaEntityId,
  onSuccess,
  children,
}: AddWatchedButtonProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dateWatched, setDateWatched] = useState<string>(
    getCurrentDateInputValue()
  );
  const [userRating, setUserRating] = useState<string>('6.0');
  const [notification, setNotification] = useState<Notifications>(
    Notifications.NONE
  );
  const queryClient = useQueryClient();

  const deleteMediaEntityMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
      setNotification(Notifications.REMOVED);
    },
  });

  const deleteFromToWatchListMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
    },
  });

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: async () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
      if (toWatchMediaEntityId) {
        deleteFromToWatchListMutation.mutate(toWatchMediaEntityId);
      }
      setIsModalOpen(false);
      setNotification(Notifications.ADDED);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleAddToWatchList = () => {
    const mediaEntity = convertToMediaEntity(
      item,
      dateWatched,
      Number(userRating)
    );
    createWatchedMediaMutation.mutate(mediaEntity);
  };

  const handleSelectDateWatched = (dateWatched: string) => {
    setDateWatched(dateWatched);
  };

  const handleChangeRating = (userRating: string) => {
    setUserRating(userRating);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    if (watchedMediaEntityId && createWatchedMediaMutation.data?.id) {
      deleteMediaEntityMutation.mutate(createWatchedMediaMutation.data.id);
    } else {
      handleOpenModal();
    }
  };

  const getNotificationText = () => {
    return {
      ADDED: (
        <Link to={`/${URL_PATHS.WATCHED}`}>
          Added to <strong>Watched</strong> list
        </Link>
      ),
      REMOVED: (
        <Link to={`/${URL_PATHS.WATCHED}`}>
          Removed from <strong>Watched</strong> list
        </Link>
      ),
      NONE: null,
    }[notification];
  };

  const getTooltipText = () => {
    if (watchedMediaEntityId && !createWatchedMediaMutation.data) {
      return '';
    }

    return watchedMediaEntityId
      ? 'Remove from Watched list'
      : 'Add to Watched list';
  };

  const renderModal = () => {
    return (
      <Modal title="Add to Watched list" onClose={() => setIsModalOpen(false)}>
        <Box flexDirection="column" alignItems="end" gap={40}>
          <WatchedFields
            userRating={userRating}
            dateWatched={dateWatched}
            ratingChangeHandler={handleChangeRating}
            dateChangeHandler={handleSelectDateWatched}
          />
          <Button onClick={handleAddToWatchList} color={Colors.WATCHED}>
            <Box gap={5}>
              <PlusIcon width={17} />
              Add
            </Box>
          </Button>
        </Box>
      </Modal>
    );
  };

  return (
    <div key={item.imdbID} style={{position: 'relative'}}>
      {notification !== Notifications.NONE && (
        <Notification
          onClose={() => setNotification(Notifications.NONE)}
          color={Colors.WATCHED}>
          {getNotificationText()}
        </Notification>
      )}
      <IconButton
        tooltip={{text: getTooltipText(), position: TooltipPosition.LEFT}}
        className={classNames(className, {
          'added-watched': !!watchedMediaEntityId,
        })}
        onClick={handleClick}
        disabled={!!watchedMediaEntityId && !createWatchedMediaMutation.data}>
        {children}
      </IconButton>
      {isModalOpen && renderModal()}
    </div>
  );
};

export default AddWatchedButton;
