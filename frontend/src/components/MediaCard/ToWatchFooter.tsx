import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  ButtonColor,
  MediaEntity,
  MediaRating,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import AddWatchedButton from '../AddButtons/AddWatchedButton';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';

type ToWatchFooter = {
  item: MediaEntity;
};

const ToWatchFooter = ({item}: ToWatchFooter): JSX.Element => {
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
      <ul className="ratings-list" style={{padding: 0}}>
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
    <Box gap={10} alignItems="center">
      {/* <div className="to-watch-item-extra-details">{renderExtraDetails()}</div> */}
      <div className="to-watch-item-ratings">{renderRatings()}</div>
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
  );
};

export default ToWatchFooter;
