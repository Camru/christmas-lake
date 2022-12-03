import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  MediaRating,
  REACT_QUERY_API_KEYS,
  WatchedMediaEntity,
} from '../../types/types';
import {getFormattedDate} from '../../helpers/utils';
import Button from '../Button/Button';

import './WatchedItem.less';

type WatchedItemProps = {
  item: WatchedMediaEntity;
};

const WatchedItem = ({item}: WatchedItemProps): JSX.Element => {
  const queryClient = useQueryClient();

  const {data, isFetching} = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH_BY_ID, item.title],
    queryFn: () => omdbApi.searchByTitle(item.title),
  });

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

  const renderExtraDetails = () => {
    if (isFetching) {
      return <p>loading extra details...</p>;
    }

    const details = [
      {
        label: 'Writer',
        value: data?.Writer,
      },
      {
        label: 'Director',
        value: data?.Director,
      },
      {
        label: 'Runtime',
        value: data?.Runtime,
      },
      {
        label: 'Country',
        value: data?.Country,
      },
      {
        label: 'IMDB Rating',
        value: data?.imdbRating,
      },
    ];

    return details.map(({label, value}) => {
      return (
        <div key={label}>
          <label>{label}</label>
          <p>{value}</p>
        </div>
      );
    });
  };

  const renderRatings = () => {
    if (isFetching) {
      return <p>loading ratings...</p>;
    }

    const ratings = data?.Ratings;

    const renderRating = (rating: MediaRating) => {
      return (
        <li key={rating.Source}>
          {rating.Source} : {rating.Value}
        </li>
      );
    };

    return <ul>{ratings?.map(renderRating)}</ul>;
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
        {renderWatchedItemDetail('Rating', item.rating)}
        <div className="watched-item-extra-details">{renderExtraDetails()}</div>
        <div className="watched-item-ratings">{renderRatings()}</div>
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
