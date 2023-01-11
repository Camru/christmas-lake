import {useMutation, useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {useState} from 'react';
import greenlightApi, {
  CreateWatchedMediaParams,
  Rating,
} from '../../../api/greenlightApi';
import {
  Colors,
  Notifications,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../../types/types';
import IconButton from './IconButton';
import Notification from '../Notification/Notification';
import Tooltip from '../Tooltip/Tooltip';

type AddToWatchButtonProps = {
  children: React.ReactNode;
  isAlreadyAdded: boolean;
  isAlreadyWatched: boolean;
  isIconButton: boolean;
  item: SearchResult;
  ratings: Rating[];
  className?: string;
};

const convertToMediaEntity = (
  item: SearchResult,
  ratings: Rating[]
): CreateWatchedMediaParams => {
  return {
    title: item.Title,
    dateWatched: new Date().toISOString(),
    year: item.Year,
    mediaType: item.Type,
    thumbnail: item.Poster,
    imdbID: item.imdbID,
    rating: 0,
    ratings: JSON.stringify(ratings),
    watched: false,
  };
};

const AddToWatchButton = ({
  className,
  item,
  isAlreadyAdded,
  isAlreadyWatched,
  ratings,
  children,
}: AddToWatchButtonProps): JSX.Element => {
  console.log('[cam] item', item);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notifications>(
    Notifications.NONE
  );
  const queryClient = useQueryClient();

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: async () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
      setNotification(Notifications.ADDED);
    },
  });

  const deleteMediaEntityMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
      setNotification(Notifications.REMOVED);
    },
  });

  const handleAddToWatchList = () => {
    const mediaEntity = convertToMediaEntity(item, ratings);
    createWatchedMediaMutation.mutate(mediaEntity);
  };

  const handleClick = () => {
    if (isAlreadyAdded && createWatchedMediaMutation.data?.id) {
      deleteMediaEntityMutation.mutate(createWatchedMediaMutation.data.id);
    } else {
      handleAddToWatchList();
    }
  };

  const getNotificationText = () => {
    return {
      ADDED: (
        <span>
          Added to <strong>To Watch</strong> list
        </span>
      ),
      REMOVED: (
        <span>
          Removed from <strong>To Watch</strong> list
        </span>
      ),
      NONE: null,
    }[notification];
  };

  const renderTooltip = () => {
    if (isAlreadyAdded && !createWatchedMediaMutation.data) {
      return;
    }

    if (isAlreadyWatched) {
      return <Tooltip text="Already watched" />;
    }

    const tooltipText = isAlreadyAdded
      ? 'Remove from To Watch list'
      : 'Add to To Watch list';

    return <Tooltip text={tooltipText} />;
  };

  return (
    <div key={item.imdbID} style={{position: 'relative'}}>
      {notification !== Notifications.NONE && (
        <Notification
          onClose={() => setNotification(Notifications.NONE)}
          color={Colors.TO_WATCH}>
          {getNotificationText()}
        </Notification>
      )}
      <IconButton
        className={classNames(className, {'added-to-watch': isAlreadyAdded})}
        onPointerEnter={() => setIsTooltipOpen(true)}
        onPointerLeave={() => setIsTooltipOpen(false)}
        onClick={handleClick}
        disabled={
          (isAlreadyAdded && !createWatchedMediaMutation.data) ||
          isAlreadyWatched
        }>
        {children}
      </IconButton>
      {isTooltipOpen && renderTooltip()}
    </div>
  );
};

export default AddToWatchButton;
