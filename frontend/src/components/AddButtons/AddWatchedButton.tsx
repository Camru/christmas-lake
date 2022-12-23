import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {floatToPercentage, getCurrentDateInputValue} from '../../helpers/utils';
import {
  ButtonColor,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import Box from '../Shared/Box/Box';
import Button from '../Shared/Button/Button';
import Modal from '../Shared/Box/Modal/Modal';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';

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

  const handleSelectDateWatched = (e: any) => {
    setDateWatched(e.target.value);
  };

  const handleChangeRating = (e: any) => {
    console.log('[cam] e.target.value', e.target.value);
    setUserRating(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const renderModal = () => {
    return (
      <Modal title="Add to Watched list" onClose={() => setIsModalOpen(false)}>
        <Box flexDirection="column" alignItems="end" gap={10}>
          <Box flexDirection="column" gap={10} width="100%">
            <input
              type="date"
              onChange={handleSelectDateWatched}
              value={dateWatched}
            />
            <Box justifyContent="space-between" width="100%" gap={10}>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={userRating}
                onChange={handleChangeRating}
                style={{width: '100%'}}
              />
              <div
                style={{
                  width: '30px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Rating
                  value={userRating}
                  source={RatingSource.ROTTEN_TOMATOES}
                  type="float"
                />
              </div>
            </Box>
          </Box>
          <Button onClick={handleAddToWatchList} color={ButtonColor.SUCCESS}>
            Add
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
