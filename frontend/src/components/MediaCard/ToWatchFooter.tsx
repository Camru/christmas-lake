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
import {TooltipPosition} from '../Shared/Tooltip/Tooltip';
import {ListBulletIcon, PlusIcon} from '@heroicons/react/24/solid';
import {TrashIcon} from '@heroicons/react/24/outline';

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
          <PlusIcon className="button-icon" />
        </AddWatchedButton>
        <IconButton
          onClick={() => setIsExtraDetailsModalOpen(true)}
          tooltip={{
            text: 'See details',
            position: TooltipPosition.LEFT,
          }}>
          <ListBulletIcon className="button-icon" />
        </IconButton>
        <IconButton
          tooltip={{
            text: 'Remove from To Watch list',
            position: TooltipPosition.RIGHT,
          }}
          onClick={handleOpenDeleteItemModal}
          style={{marginLeft: 'auto'}}>
          <TrashIcon className="button-icon" style={{width: 15}} />
        </IconButton>
      </Box>
      {isDeleteItemModalOpen && renderDeleteItemModal()}
      {isExtraDetailsModalOpen && renderExtraDetailsModal()}
    </Box>
  );
};

export default ToWatchFooter;
