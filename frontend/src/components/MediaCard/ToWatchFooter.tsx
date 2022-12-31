import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  capitalizeFirstChar,
  convertMinutesToHoursAndMinutes,
} from '../../helpers/utils';
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
import Modal from '../Shared/Box/Modal/Modal';
import Button from '../Shared/Button/Button';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';

const RatingSourceToKeyMap: Record<string, RatingSource> = {
  'Internet Movie Database': RatingSource.IMDB,
  'Rotten Tomatoes': RatingSource.ROTTEN_TOMATOES,
  Metacritic: RatingSource.METACRITIC,
};

type ToWatchFooter = {
  item: MediaEntity;
};

const ToWatchFooter = ({item}: ToWatchFooter): JSX.Element => {
  const queryClient = useQueryClient();
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] =
    useState<boolean>(false);
  const [isExtraDetailsModalOpen, setIsExtraDetailsModalOpen] =
    useState<boolean>(false);

  //TODO: [cam] Move this into ToWatchList so we can sort by the RT Rating
  const {data, isFetching} = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH_BY_ID, item.title],
    queryFn: () => omdbApi.searchByTitle(item.title),
  });

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.TO_WATCH]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

  const handleOpenDeleteItemModal = () => {
    setIsDeleteItemModalOpen(true);
  };

  const renderExtraDetails = () => {
    if (isFetching) {
      return <p>loading extra details...</p>;
    }

    // DEFINITE
    // Year: string;
    // Runtime: string;
    // Director: string;
    // Writer: string;
    // Country: string;

    // MAYBE
    // Genre: string;
    // Actors: string;
    // Plot: string;
    // totalSeasons: string;
    // Type: string;
    // Language: string;

    const details = [
      {
        label: 'Year',
        value: data?.Year,
      },
      {
        label: 'Type',
        value: capitalizeFirstChar(data?.Type),
      },
      {
        label: 'Total Seasons',
        value: data?.totalSeasons,
        isHidden: data?.Type === 'movie',
      },
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
        value: convertMinutesToHoursAndMinutes(data?.Runtime),
      },
      {
        label: 'Country',
        value: data?.Country,
      },
      {
        label: 'Language',
        value: data?.Language,
      },
      {
        label: 'Genre',
        value: data?.Genre,
      },
      {
        label: 'Plot',
        value: data?.Plot,
        style: {width: '200px', height: '120px', overflow: 'scroll'},
      },
    ];

    const labels = details.map(({label, isHidden}) => {
      if (isHidden) {
        return null;
      }
      return <label key={label}>{label}</label>;
    });

    const values = details.map(({value, label, isHidden, style = {}}) => {
      if (isHidden) {
        return null;
      }
      return (
        <p key={label} style={style}>
          {value ? value : 'N/A'}
        </p>
      );
    });

    return (
      <Box gap={30}>
        <Box flexDirection="column" gap={10}>
          {labels}
        </Box>
        <Box flexDirection="column" gap={10}>
          {values}
        </Box>
      </Box>
    );
  };

  const renderRatings = () => {
    if (isFetching) {
      return <p>loading ratings...</p>;
    }

    const ratings = data?.Ratings;

    const renderRating = (rating: MediaRating) => {
      return (
        <li key={rating.Source} className="rating">
          <Rating
            value={rating.Value}
            source={RatingSourceToKeyMap[rating.Source]}
          />
        </li>
      );
    };

    return (
      <Box className="ratings-list">
        {ratings?.length ? ratings.map(renderRating) : <p>No Ratings</p>}
      </Box>
    );
  };

  const renderDeleteItemModal = () => {
    return (
      <Modal
        title="Are you sure?"
        onClose={() => setIsDeleteItemModalOpen(false)}>
        <Box justifyContent="end">
          <Button
            onClick={() => {
              handleDeleteMovie(item.id.toString());
              setIsDeleteItemModalOpen(false);
            }}
            color={ButtonColor.DANGER}>
            Remove
          </Button>
        </Box>
      </Modal>
    );
  };

  const renderExtraDetailsModal = () => {
    return (
      <Modal
        className="dark"
        title={item.title}
        subtitle={renderRatings()}
        onClose={() => setIsExtraDetailsModalOpen(false)}>
        <Box flexDirection="column" gap={10}>
          {renderExtraDetails()}
        </Box>
      </Modal>
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
    <Box width="100%" gap={10} alignItems="center" flexDirection="column">
      <Box width="100%">{renderRatings()}</Box>
      <Box>
        <AddWatchedButton
          item={searchResult}
          isAlreadyAdded={false}
          isIconButton
          onSuccess={() => handleDeleteMovie(item.id.toString())}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </AddWatchedButton>

        <IconButton
          onClick={handleOpenDeleteItemModal}
          color={ButtonColor.DANGER}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </IconButton>
        <IconButton
          onClick={() => setIsExtraDetailsModalOpen(true)}
          color={ButtonColor.ACTION}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </IconButton>
      </Box>
      {isDeleteItemModalOpen && renderDeleteItemModal()}
      {isExtraDetailsModalOpen && renderExtraDetailsModal()}
    </Box>
  );
};

export default ToWatchFooter;
