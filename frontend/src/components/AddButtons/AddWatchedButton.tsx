import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {getCurrentDateInputValue} from '../../helpers/utils';
import {
  ButtonColor,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import Box from '../Shared/Box/Box';
import Button from '../Shared/Button/Button';
import Modal from '../Shared/Box/Modal/Modal';
import IconButton from '../Shared/Button/IconButton';
import WatchedFields from '../Shared/WatchedFields';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  isAlreadyAdded: boolean;
  isIconButton?: boolean;
  item: SearchResult;
  onSuccess?: () => void;
};

const convertToMediaEntity = (
  item: SearchResult,
  dateWatched: string,
  rating: string
): CreateWatchedMediaParams => {
  return {
    title: item.Title,
    dateWatched,
    year: item.Year,
    mediaType: item.Type,
    thumbnail: item.Poster,
    imdbID: item.imdbID,
    rating,
    watched: true,
  };
};

const AddWatchedButton = ({
  item,
  isAlreadyAdded,
  isIconButton,
  onSuccess,
  children,
}: AddWatchedButtonProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dateWatched, setDateWatched] = useState<string>(
    getCurrentDateInputValue()
  );
  const [userRating, setUserRating] = useState<string>('6.0');
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] =
    useState<boolean>(false);
  const queryClient = useQueryClient();

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: async () => {
      setIsSuccessfullyAdded(true);
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
      setIsModalOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleAddToWatchList = () => {
    const mediaEntity = convertToMediaEntity(item, dateWatched, userRating);
    createWatchedMediaMutation.mutate(mediaEntity);
  };

  const renderButtonText = () => {
    if (createWatchedMediaMutation.isLoading) {
      return 'Adding..';
    }

    if (isAlreadyAdded) {
      return 'Already Watched';
    }

    if (!isSuccessfullyAdded) {
      return children;
    }

    return 'Added';
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
          <Button onClick={handleAddToWatchList} color={ButtonColor.SUCCESS}>
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

  const ButtonComp = isIconButton ? IconButton : Button;

  return (
    <>
      <ButtonComp
        onClick={handleOpenModal}
        disabled={isSuccessfullyAdded || isAlreadyAdded}
        color={ButtonColor.SUCCESS}>
        {renderButtonText()}
      </ButtonComp>
      {isModalOpen && renderModal()}
    </>
  );
};

export default AddWatchedButton;
