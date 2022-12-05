import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import greenlightApi from '../../../api/greenlightApi';
import omdbApi from '../../../api/omdbApi';
import {
  MediaRating,
  REACT_QUERY_API_KEYS,
  WatchedMediaEntity,
} from '../../../types/types';
import {getFormattedDate, ratioToPercentage} from '../../../helpers/utils';
import Button from '../../Button/Button';

import './ToWatchItem.less';

import TomatoSVG from '../../../images/tomato.svg';
import SplatSVG from '../../../images/splat.svg';
import ImdbPNG from '../../../images/imdb.png';
import MetacriticPNG from '../../../images/metacritic.png';

type ToWatchItemProps = {
  item: WatchedMediaEntity;
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

  const renderToWatchItemDetail = (label: string, detail: string | number) => {
    return (
      <div className="to-watch-item-detail">
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

  //TODO: [cam]
  // When at least 60% of reviews for a movie or TV show are positive, a red
  // tomato is displayed to indicate its Fresh status.

  // Green splat tomato When less than 60% of reviews for a movie or TV show are
  // positive, a green splat is displayed to indicate its Rotten status.

  // Faded tomato When there is no Tomatometer® score available, which could be
  // because the Title hasn’t released yet or there are not enough ratings to
  // generate a score

  enum RatingSource {
    ROTTEN_TOMATOES = 'Rotten Tomatoes',
    IMDB = 'Internet Movie Database',
    METACRITIC = 'Metacritic',
  }

  const renderRottenTomatosRating = (rating: string) => {
    if (parseInt(rating) >= 60) {
      return <img src={TomatoSVG} alt="tomato" />;
    }

    if (parseInt(rating) < 60) {
      return <img src={SplatSVG} alt="splat" />;
    }
  };

  const renderRatings = () => {
    if (isFetching) {
      return <p>loading ratings...</p>;
    }

    const ratings = data?.Ratings;

    const renderRating = (rating: MediaRating) => {
      const imgStyle = {height: '16px', width: '16px'};
      const RATING_ICONS = {
        [RatingSource.ROTTEN_TOMATOES]: renderRottenTomatosRating(rating.Value),
        [RatingSource.IMDB]: <img src={ImdbPNG} alt="imdb" {...imgStyle} />,
        [RatingSource.METACRITIC]: (
          <img src={MetacriticPNG} alt="metacritic" {...imgStyle} />
        ),
      };

      return (
        <li key={rating.Source} className="rating">
          <span className="rating-source">{rating.Source} :</span>
          <div className="rating-value">
            {RATING_ICONS[rating.Source as keyof typeof RATING_ICONS]}{' '}
            {ratioToPercentage(rating.Value)}
          </div>
        </li>
      );
    };

    return <ul className="ratings-list">{ratings?.map(renderRating)}</ul>;
  };

  return (
    <div key={item.imdbID} className="to-watch-item">
      <div className="to-watch-item-header">
        <h1>{item.title}</h1>
      </div>
      <div className="to-watch-item-body">
        <img className="thumbnail" src={item.thumbnail} alt="media-thumbnail" />
        {renderToWatchItemDetail(
          'Date Watched',
          getFormattedDate(item.dateWatched)
        )}
        {renderToWatchItemDetail('Rating', item.rating)}
        <div className="to-watch-item-extra-details">
          {renderExtraDetails()}
        </div>
        <div className="to-watch-item-ratings">{renderRatings()}</div>
      </div>
      <div className="to-watch-item-footer">
        <Button onClick={() => handleDeleteMovie(item.id.toString())}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ToWatchItem;
