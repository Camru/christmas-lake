import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import {
  MediaEntity,
  CreateMovieKey,
  REACT_QUERY_API_KEYS,
} from '../../types/types';
import {convertGenresToArr} from '../../utils';
import Button from '../Button/Button';

const DEFAULT_CREATE_MOVIE_FORM: MediaEntity = {
  title: 'The Shining',
  year: "1979",
  runtime: '102 mins',
  genres: ['horror'],
};

type AddMovieFormProps = {
  onSubmit: () => void;
};

const AddMovieForm = ({onSubmit}: AddMovieFormProps): JSX.Element => {
  const queryClient = useQueryClient();
  const [createMovieForm, setCreateMovieForm] = useState<MediaEntity | null>(
    DEFAULT_CREATE_MOVIE_FORM
  );
  const createMovieMutation = useMutation({
    mutationFn: greenlightApi.createWatchedMedia,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });
  const handleCreateMovie = (e: any) => {
    e.preventDefault();

    if (!createMovieForm) {
      return;
    }

    onSubmit();
    // createMovieMutation.mutate(createMovieForm);
  };
  const handleFormChange = (key: string, value: string | number | string[]) => {
    // @ts-ignore
    setCreateMovieForm((prevCreateMovieForm) => {
      return {...prevCreateMovieForm, [key]: value};
    });
  };

  return (
    <form
      onSubmit={handleCreateMovie}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
      <input
        placeholder="title..."
        onChange={(e) => handleFormChange(CreateMovieKey.TITLE, e.target.value)}
        defaultValue={DEFAULT_CREATE_MOVIE_FORM.title}
      />
      <input
        placeholder="year..."
        type="number"
        defaultValue={DEFAULT_CREATE_MOVIE_FORM.year}
        onChange={(e) =>
          handleFormChange(CreateMovieKey.YEAR, Number(e.target.value))
        }
      />
      <input
        placeholder="runtime..."
        defaultValue={DEFAULT_CREATE_MOVIE_FORM.runtime}
        onChange={(e) =>
          handleFormChange(CreateMovieKey.RUNTIME, e.target.value)
        }
      />
      <input
        placeholder="genres..."
        defaultValue={'Horror'}
        onChange={(e) => {
          const genres = convertGenresToArr(e.target.value);
          handleFormChange(CreateMovieKey.GENRES, genres);
        }}
      />
      <Button
        onClick={handleCreateMovie}
        type="submit"
        onKeyDown={handleCreateMovie}
        style={{marginTop: '10px'}}>
        Add Movie
      </Button>
    </form>
  );
};

export default AddMovieForm;
