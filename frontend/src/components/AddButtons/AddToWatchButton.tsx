import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {REACT_QUERY_API_KEYS, SearchResult} from '../../types/types';
import Button from '../Shared/Button/Button';

type AddToWatchButtonProps = {
  children: React.ReactNode;
  isAlreadyAdded: boolean;
  item: SearchResult;
};

const convertToMediaEntity = (item: SearchResult): CreateWatchedMediaParams => {
  return {
    title: item.Title,
    dateWatched: new Date().toISOString(),
    year: item.Year,
    mediaType: item.Type,
    thumbnail: item.Poster,
    imdbID: item.imdbID,
    rating: '8.0/10.0',
    watched: false,
  };
};

const AddToWatchButton = ({
  item,
  isAlreadyAdded,
  children,
}: AddToWatchButtonProps): JSX.Element => {
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
      return 'Already added';
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

export default AddToWatchButton;
