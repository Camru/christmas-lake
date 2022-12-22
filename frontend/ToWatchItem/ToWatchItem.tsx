import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../src/api/greenlightApi';
import omdbApi from '../src/api/omdbApi';
import {
  ButtonColor,
  MediaRating,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
  MediaEntity,
} from '../src/types/types';
import {ratioToPercentage} from '../src/helpers/utils';

import './ToWatchItem.less';

import AddWatchedButton from '../src/components/AddButtons/AddWatchedButton';
import Box from '../src/components/Shared/Box/Box';
import IconButton from '../src/components/Shared/Button/IconButton';
import Rating from '../src/components/Shared/Rating/Rating';

type ToWatchItemProps = {
  item: MediaEntity;
};

const ToWatchItem = ({item}: ToWatchItemProps): JSX.Element => {
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

  //TODO: [cam]
  // When at least 60% of reviews for a movie or TV show are positive, a red
  // tomato is displayed to indicate its Fresh status.

  // Green splat tomato When less than 60% of reviews for a movie or TV show are
  // positive, a green splat is displayed to indicate its Rotten status.

  // Faded tomato When there is no Tomatometer® score available, which could be
  // because the Title hasn’t released yet or there are not enough ratings to
  // generate a score

  const renderRatings = () => {
    if (isFetching) {
      return <p>loading ratings...</p>;
    }

    const ratings = data?.Ratings;

    const renderRating = (rating: MediaRating) => {
      const source = rating.Source as keyof typeof RatingSource;
      return (
        <li key={rating.Source} className="rating">
          {/* @ts-ignore */}
          <Rating value={rating.Value} source={source} />
        </li>
      );
    };

    return (
      <ul className="ratings-list">
        {ratings?.length ? ratings.map(renderRating) : <p>No Ratings</p>}
      </ul>
    );
  };

  const searchResult: SearchResult = {
    Poster: item.thumbnail,
    Title: item.title,
    Type: item.mediaType,
    Year: item.year,
    imdbID: item.imdbID,
  };

  return (
    <div key={item.imdbID} className="media-card">
      <div className="to-watch-item-header">
        <h1>{item.title}</h1>
      </div>
      <div className="to-watch-item-body">
        <img className="thumbnail" src={item.thumbnail} alt="media-thumbnail" />
        <div className="to-watch-item-extra-details">
          {renderExtraDetails()}
        </div>
        <div className="to-watch-item-ratings">{renderRatings()}</div>
      </div>
      <div className="to-watch-item-footer">
        <Box gap={10} alignItems="center">
          <AddWatchedButton
            item={searchResult}
            isAlreadyAdded={false}
            isIconButton
            onSuccess={() => handleDeleteMovie(item.id.toString())}>
            +
          </AddWatchedButton>

          <IconButton
            onClick={() => handleDeleteMovie(item.id.toString())}
            color={ButtonColor.DANGER}>
            x
          </IconButton>
        </Box>
      </div>
    </div>
  );
};

export default ToWatchItem;
