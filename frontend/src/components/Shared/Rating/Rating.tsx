import TomatoSVG from '../../../images/tomato.svg';
import SplatSVG from '../../../images/splat.svg';
import PopcornTomatoSVG from '../../../images/popcorn_tomato.svg';
import PopcornSplatSVG from '../../../images/popcorn_splat.svg';
import NoRatingSVG from '../../../images/norating.svg';
import ImdbPNG from '../../../images/imdb.png';
import MetacriticPNG from '../../../images/metacritic.png';
import {RatingSource} from '../../../types/types';
import {floatToPercentage, ratioToPercentage} from '../../../helpers/utils';
import Box from '../Box/Box';

import './Rating.less';

type RatingProps = {
  value: string;
  source: RatingSource;
  type?: 'ratio' | 'float';
};

const imgStyle = {height: '16px', width: '16px'};

const Rating = ({value, source, type}: RatingProps): JSX.Element => {
  const getDisplayValue = () => {
    if (type === 'float') {
      return floatToPercentage(value);
    }

    return ratioToPercentage(value);
  };

  const getRatingSourceIcon = () => {
    if (source === RatingSource.ROTTEN_TOMATOES) {
      if (!value) {
        return <img src={NoRatingSVG} alt="no rating" />;
      }

      if (type === 'float') {
        if (parseInt(value) >= 6.0) {
          return <img src={TomatoSVG} alt="tomato" />;
        }

        return <img src={SplatSVG} alt="splat" />;
      }

      if (parseInt(value) >= 60) {
        return <img src={TomatoSVG} alt="tomato" />;
      }

      return <img src={SplatSVG} alt="splat" />;
    }

    if (source === RatingSource.USER_RATING) {
      if (!value) {
        return <img src={NoRatingSVG} alt="no rating" />;
      }

      if (parseInt(value) >= 6.0) {
        return <img src={PopcornTomatoSVG} alt="tomato" />;
      }

      return <img src={PopcornSplatSVG} alt="splat" />;
    }

    if (source === RatingSource.IMDB) {
      return <img src={ImdbPNG} alt="imdb" {...imgStyle} />;
    }

    if (source === RatingSource.METACRITIC) {
      return <img src={MetacriticPNG} alt="metacritic" {...imgStyle} />;
    }

    <img src={MetacriticPNG} alt="metacritic" {...imgStyle} />;
  };

  return (
    <Box className="rating" alignItems="center" gap={4}>
      {getRatingSourceIcon()} {getDisplayValue()}
    </Box>
  );
};

export default Rating;
