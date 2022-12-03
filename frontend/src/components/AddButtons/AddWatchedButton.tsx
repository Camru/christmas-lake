import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {REACT_QUERY_API_KEYS} from '../../types/types';
import Button from '../Button/Button';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  isAlreadyWatched: boolean;
  item: CreateWatchedMediaParams;
};

const AddWatchedButton = ({
  item,
  isAlreadyWatched,
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
    createWatchedMediaMutation.mutate(item);
  };

  const renderButtonText = () => {
    if (createWatchedMediaMutation.isLoading) {
      return 'Adding..';
    }

    if (isAlreadyWatched) {
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
      disabled={isSuccessfullyAdded || isAlreadyWatched}>
      {renderButtonText()}
    </Button>
  );
};

export default AddWatchedButton;
