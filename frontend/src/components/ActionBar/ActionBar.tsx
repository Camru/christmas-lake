import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {MediaType, SearchParam, Tab} from '../../types/types';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';
import Dropdown, {Option} from '../Shared/Dropdown/Dropdown';
import Tabs from '../Shared/Tabs/Tabs';

import './ActionBar.less';

const FILTER_TABS: Tab[] = [
  {label: 'All', value: MediaType.ALL},
  {label: 'Movies', value: MediaType.MOVIE},
  {label: 'Series', value: MediaType.SERIES},
];

const SORT_OPTIONS: Option[] = [
  {label: 'Title', value: 'title'},
  {label: 'Release Date', value: 'year'},
  {label: 'Date Watched', value: 'datewatched'},
];

const SORT_DIRECTION = {
  ASC: '',
  DESC: '-',
};

const ActionBar = () => {
  const {pathname, search} = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(FILTER_TABS[0]);

  const sortParam = searchParams.get(SearchParam.SORT);

  const updateSearchParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!sortParam) {
      updateSearchParams(SearchParam.SORT, 'title');
      return;
    }
  }, [sortParam, pathname, search]);

  useEffect(() => {
    if (
      activeTab.value !== MediaType.ALL &&
      searchParams.get(SearchParam.MEDIA_TYPE) === null
    ) {
      updateSearchParams(SearchParam.MEDIA_TYPE, activeTab.value);
    }
  }, [activeTab, searchParams]);

  const deleteSearchParam = (key: string) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab.value === MediaType.ALL) {
      deleteSearchParam(SearchParam.MEDIA_TYPE);
    } else {
      updateSearchParams(SearchParam.MEDIA_TYPE, tab.value);
    }
  };

  const getIsSortedDesc = () => {
    const sortParam = searchParams.get('sort') || '';

    return sortParam[0] === SORT_DIRECTION.DESC;
  };

  const handleSortByChange = (sortBy: string) => {
    updateSearchParams(SearchParam.SORT, sortBy);
  };

  const handleChangeSortDirection = () => {
    const sortBy = searchParams.get('sort') || '';

    const isSortedDesc = getIsSortedDesc();

    if (isSortedDesc) {
      updateSearchParams(SearchParam.SORT, sortBy.substring(1));
    } else {
      updateSearchParams(SearchParam.SORT, `-${sortBy}`);
    }
  };

  const handleChangeSearch = (e: any) => {
    const searchText = e.target.value;
    if (!searchText) {
      deleteSearchParam(SearchParam.SEARCH);
    } else {
      updateSearchParams(SearchParam.SEARCH, searchText);
    }
  };

  const sortValueForDropdown = (sortParam || '').replace('-', '');

  return (
    <Box p={10} justifyContent="space-between">
      <Tabs
        activeTab={activeTab}
        tabs={FILTER_TABS}
        onChange={handleTabChange}
      />
      <Box>
        <label>Sort By</label>
        <Dropdown
          options={SORT_OPTIONS}
          value={sortValueForDropdown}
          onSelectChange={handleSortByChange}
        />
        <IconButton onClick={handleChangeSortDirection}>
          {getIsSortedDesc() ? 'v' : '^'}
        </IconButton>
      </Box>

      <input
        className="actionbar-search"
        placeholder="search"
        onChange={handleChangeSearch}
      />
    </Box>
  );
};

export default ActionBar;
