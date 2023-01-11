import {useMutation, useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {useState} from 'react';
import greenlightApi, {
  CreateWatchedMediaParams,
} from '../../../api/greenlightApi';
import {getCurrentDateInputValue} from '../../../helpers/utils';
import {
  Colors,
  Notifications,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../../types/types';
import Box from '../Box/Box';
import Modal from '../Modal/Modal';
import Notification from '../Notification/Notification';
import Tooltip from '../Tooltip/Tooltip';
import WatchedFields from '../WatchedFields';
import Button from './Button';
import IconButton from './IconButton';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  isAlreadyAdded: boolean;
  isAlreadyAddedToWatchList: boolean;
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
  return {
    title: item.Title,
    dateWatched: dateWatched,
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
  isAlreadyAdded,
  isAlreadyAddedToWatchList,
  onSuccess,
  children,
}: AddWatchedButtonProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [dateWatched, setDateWatched] = useState<string>(
    getCurrentDateInputValue()
  );
  const [userRating, setUserRating] = useState<string>('6.0');
  const [notification, setNotification] = useState<Notifications>(
    Notifications.NONE
  );
  const queryClient = useQueryClient();

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: async () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
      setIsModalOpen(false);
      setNotification(Notifications.ADDED);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

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

  const handleDeleteFromToWatchList = (mediaEntityId: string) => {
    deleteFromToWatchListMutation.mutate(mediaEntityId);
  };

  const handleAddToWatchList = () => {
    if (isAlreadyAddedToWatchList) {
      
    }
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
    if (isAlreadyAdded && createWatchedMediaMutation.data?.id) {
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

  const renderTooltip = () => {
    if (isAlreadyAdded && !createWatchedMediaMutation.data) {
      return;
    }

    const tooltipText = isAlreadyAdded
      ? 'Remove from Watched list'
      : 'Add to Watched list';

    return <Tooltip text={tooltipText} />;
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
        className={classNames(className, {'added-watched': isAlreadyAdded})}
        onPointerEnter={() => setIsTooltipOpen(true)}
        onPointerLeave={() => setIsTooltipOpen(false)}
        onClick={handleClick}
        disabled={isAlreadyAdded && !createWatchedMediaMutation.data}>
        {children}
      </IconButton>
      {isModalOpen && renderModal()}
      {isTooltipOpen && renderTooltip()}
    </div>
  );
};

export default AddWatchedButton;
