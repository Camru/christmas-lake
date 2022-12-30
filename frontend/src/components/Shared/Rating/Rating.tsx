import TomatoSVG from '../../../images/tomato.svg';
import SplatSVG from '../../../images/splat.svg';
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

//TODO: [cam] make a rating source that is user rating (since we are currently
// using RT for user rating)and displays the RT popcorn icons instead of
// tomatoes

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

    if (source === RatingSource.IMDB) {
      return <img src={ImdbPNG} alt="imdb" {...imgStyle} />;
    }

    if (source === RatingSource.METACRITIC) {
      return <img src={MetacriticPNG} alt="metacritic" {...imgStyle} />;
    }

    <img src={MetacriticPNG} alt="metacritic" {...imgStyle} />;
  };

  return (
    <Box alignItems="center" gap={5}>
      {getRatingSourceIcon()} {getDisplayValue()}
    </Box>
  );
};

export default Rating;
