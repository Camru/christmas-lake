import {useMutation, useQueryClient} from '@tanstack/react-query';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import {REACT_QUERY_API_KEYS} from '../../types/types';
import Button from '../Button/Button';

type AddWatchedButtonProps = {
  children: React.ReactNode;
  item: CreateWatchedMediaParams;
};

const AddWatchedButton = ({
  item,
  children,
}: AddWatchedButtonProps): JSX.Element => {
  console.log('[cam] item to add', item);
  const queryClient = useQueryClient();

  const createWatchedMediaMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleAddToWatchList = () => {
    createWatchedMediaMutation.mutate(item);
  };
  return <Button onClick={handleAddToWatchList}>{children}</Button>;
};

export default AddWatchedButton;
