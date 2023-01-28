import {MediaType} from '../../../types/types';

type EmptyDataProps = {
  mediaTypeParam: string;
};

const EmptyData = ({mediaTypeParam}: EmptyDataProps) => {
  const getMediaTypeLabel = () => {
    if (!mediaTypeParam) {
      return 'items';
    }

    return mediaTypeParam === MediaType.MOVIE ? 'movies' : 'series';
  };

  return (
    <h1 style={{whiteSpace: 'nowrap'}}>No {getMediaTypeLabel()} found.</h1>
  );
};

export default EmptyData;
