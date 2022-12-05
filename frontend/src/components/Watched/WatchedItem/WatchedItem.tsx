import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../../../api/greenlightApi';
import {
  REACT_QUERY_API_KEYS,
  WatchedMediaEntity,
} from '../../../types/types';
import {getFormattedDate} from '../../../helpers/utils';
import Button from '../../Button/Button';

import './WatchedItem.less';

type WatchedItemProps = {
  item: WatchedMediaEntity;
};

const WatchedItem = ({item}: WatchedItemProps): JSX.Element => {
  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

  const renderWatchedItemDetail = (label: string, detail: string | number) => {
    return (
      <div className="watched-item-detail">
        <label>{label}</label>
        <p>{detail}</p>
      </div>
    );
  };

  return (
    <div key={item.imdbID} className="watched-item">
      <div className="watched-item-header">
        <h1>{item.title}</h1>
      </div>
      <div className="watched-item-body">
        <img src={item.thumbnail} alt="media-thumbnail" />
        {renderWatchedItemDetail(
          'Date Watched',
          getFormattedDate(item.dateWatched)
        )}
        {renderWatchedItemDetail('Our Rating', item.rating)}
      </div>
      <div className="watched-item-footer">
        <Button onClick={() => handleDeleteMovie(item.id.toString())}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default WatchedItem;
