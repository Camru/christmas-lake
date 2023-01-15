import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  capitalizeFirstChar,
  convertMinutesToHoursAndMinutes,
  getFormattedDate,
} from '../../helpers/utils';
import {
  Colors,
  MediaEntity,
  MediaRating,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import Box from '../Shared/Box/Box';
import Modal from '../Shared/Modal/Modal';
import Button from '../Shared/Button/Button';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';
import AddWatchedButton from '../Shared/Button/AddWatchedButton';
import Tooltip, {TooltipPosition} from '../Shared/Tooltip/Tooltip';

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
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

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

    const details = [
      {
        label: 'Date Added',
        value: getFormattedDate(item.dateWatched),
      },
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
        label: 'Actors',
        value: data?.Actors,
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

    const ratings = JSON.parse(item.ratings) || [];

    return (
      <Box className="ratings-list">
        {ratings.length ? ratings.map(renderRating) : <p>No Ratings</p>}
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
            color={Colors.DANGER}>
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
      <Box width="100%" mt="10px">
        {renderRatings()}
      </Box>
      <Box width="100%" gap={5}>
        <AddWatchedButton
          item={searchResult}
          isIconButton
          onSuccess={() => handleDeleteMovie(item.id.toString())}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </AddWatchedButton>
        <IconButton onClick={() => setIsExtraDetailsModalOpen(true)}>
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
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </IconButton>
        <IconButton
          tooltip={{
            text: 'Remove from To Watch list',
            position: TooltipPosition.RIGHT,
          }}
          onClick={handleOpenDeleteItemModal}
          style={{marginLeft: 'auto'}}>
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
      </Box>
      {isDeleteItemModalOpen && renderDeleteItemModal()}
      {isExtraDetailsModalOpen && renderExtraDetailsModal()}
    </Box>
  );
};

export default ToWatchFooter;
