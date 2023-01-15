import {useMutation, useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {useState} from 'react';
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

//TODO: [cam] convert rating to a number so we can sort easier

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
        <span>
          Added to <strong>Watched</strong> list
        </span>
      ),
      REMOVED: (
        <span>
          Removed from <strong>Watched</strong> list
        </span>
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
        <Box flexDirection="column" alignItems="end" gap={10}>
          <WatchedFields
            userRating={userRating}
            dateWatched={dateWatched}
            ratingChangeHandler={handleChangeRating}
            dateChangeHandler={handleSelectDateWatched}
          />
          <Button onClick={handleAddToWatchList} color={Colors.WATCHED}>
            <Box gap={5}>
              <svg
                width="17px"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
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
