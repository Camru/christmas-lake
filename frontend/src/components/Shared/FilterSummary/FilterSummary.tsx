import {XMarkIcon} from '@heroicons/react/24/outline';
import {useSearchParams} from 'react-router-dom';
import {Colors, MediaType, SearchParam} from '../../../types/types';
import Box from '../Box/Box';
import Button from '../Button/Button';

import './FilterSummary.less';

type FilterSummaryProps = {
  totalFilteredItems: number;
  totalItems: number;
};
const FilterSummary = ({
  totalFilteredItems,
  totalItems,
}: FilterSummaryProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(SearchParam.MEDIA_TYPE);
  const searchTextParam = searchParams.get(SearchParam.SEARCH);
  const filterByParam = searchParams.get(SearchParam.FILTER);

  const getItemLabel = () => {
    if (!mediaTypeParam) {
      return 'items';
    }

    return mediaTypeParam === MediaType.MOVIE
      ? `${mediaTypeParam}s`
      : mediaTypeParam;
  };

  const handleClearFilters = () => {
    searchParams.set(SearchParam.SEARCH, '');
    searchParams.set(SearchParam.FILTER, '');
    setSearchParams(searchParams);
  };

  const isFiltersApplied = filterByParam || searchTextParam;

  return (
    <Box className="filter-summary" gap={10} alignItems="center" height="41px">
      Showing {totalFilteredItems} out of {totalItems} {getItemLabel()}
      {isFiltersApplied && (
        <Button
          className="clear-filters-button"
          onClick={handleClearFilters}
          color={Colors.NONE}
          Icon={XMarkIcon}>
          Clear Filters
        </Button>
      )}
    </Box>
  );
};

export default FilterSummary;
