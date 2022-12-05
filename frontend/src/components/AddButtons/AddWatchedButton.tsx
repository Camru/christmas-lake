import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {REACT_QUERY_API_KEYS, SearchResult} from '../../types/types';
import Button from '../Button/Button';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  isAlreadyAdded: boolean;
  item: SearchResult;
};

//TODO: [cam] prompts a modal to put DateWatched and Rating before adding to DB
const convertToMediaEntity = (item: SearchResult): CreateWatchedMediaParams => {
  return {
    title: item.Title,
    dateWatched: new Date().toISOString(),
    year: item.Year,
    mediaType: item.Type,
    thumbnail: item.Poster,
    imdbID: item.imdbID,
    rating: '8.0/10.0',
    watched: true,
  };
};

const AddWatchedButton = ({
  item,
  isAlreadyAdded,
  children,
}: AddWatchedButtonProps): JSX.Element => {
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] =
    useState<boolean>(false);
  const queryClient = useQueryClient();

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: async () => {
      setIsSuccessfullyAdded(true);

      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleAddToWatchList = () => {
    const mediaEntity = convertToMediaEntity(item);
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

  return (
    <Button
      onClick={handleAddToWatchList}
      disabled={isSuccessfullyAdded || isAlreadyAdded}>
      {renderButtonText()}
    </Button>
  );
};

export default AddWatchedButton;
