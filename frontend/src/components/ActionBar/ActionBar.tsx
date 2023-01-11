import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {
  Colors,
  MediaType,
  SearchParam,
  Tab,
  URL_PATHS,
} from '../../types/types';
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

export const DEFAULT_SORT_OPTIONS = [{label: 'Title', value: 'title'}];
export const CLIENT_SORT_OPTIONS = [
  {label: 'RT Rating', value: 'rtRating'},
  {label: 'IMDb Rating', value: 'imdbRating'},
];

const SORT_DIRECTION = {
  ASC: '',
  DESC: '-',
};

const getSortOptions = (pathname: string): Option[] => {
  if (pathname === `/${URL_PATHS.TO_WATCH}`) {
    return [
      {label: 'Title', value: 'title'},
      {label: 'Release Date', value: 'year'},
      {label: 'Date Added', value: 'dateWatched'},
      ...CLIENT_SORT_OPTIONS,
    ];
  }

  if (pathname === `/${URL_PATHS.WATCHED}`) {
    return [
      {label: 'Title', value: 'title'},
      {label: 'Release Date', value: 'year'},
      {label: 'Date Watched', value: 'dateWatched'},
      {label: 'Our Rating', value: 'rating'},
    ];
  }

  return DEFAULT_SORT_OPTIONS;
};

const ActionBar = () => {
  const {pathname, search} = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(FILTER_TABS[0]);
  const [searchText, setSearchText] = useState<string>('');

  const sortParam = searchParams.get(SearchParam.SORT);
  const sortOptions = getSortOptions(pathname);

  const updateSearchParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!sortParam) {
      updateSearchParams(SearchParam.SORT, '-dateWatched');
      return;
    }
  }, [sortParam, pathname, search]);

  useEffect(() => {
    if (searchText && searchParams.get(SearchParam.SEARCH) === null) {
      updateSearchParams(SearchParam.SEARCH, searchText);
    }
  }, [searchText, searchParams]);

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

  const updateSearchParam = (searchText: string) => {
    setSearchText(searchText);
    if (!searchText) {
      deleteSearchParam(SearchParam.SEARCH);
    } else {
      updateSearchParams(SearchParam.SEARCH, searchText);
    }
  };

  const handleChangeSearch = (e: any) => {
    const searchText = e.target.value;
    updateSearchParam(searchText);
  };

  const handleKeyDownSearch = (e: any) => {
    if (e.key === 'Escape') {
      updateSearchParam('');
    }
  };

  const sortValueForDropdown = (sortParam || '').replace('-', '');

  const renderSortIcon = () => {
    const isSortedDesc = getIsSortedDesc();

    const SortIcon = (props: any) => {
      return isSortedDesc ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 sort-icon"
          {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 sort-icon"
          {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    };

    return <SortIcon onClick={handleChangeSortDirection} width="25px" />;
  };

  if (pathname.includes(URL_PATHS.SEARCH)) {
    return null;
  }

  return (
    <Box
      p="20px 30px 25px 30px"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={30}>
      <Box mr="auto">
        <Tabs
          activeTab={activeTab}
          tabs={FILTER_TABS}
          onChange={handleTabChange}
        />
      </Box>
      <Box alignItems="center" gap={6}>
        <label className="sort-dropdown-label">Sort By</label>
        <Dropdown
          options={sortOptions}
          value={sortValueForDropdown}
          onSelectChange={handleSortByChange}
        />
        {renderSortIcon()}
      </Box>

      {!pathname.includes(URL_PATHS.SEARCH) && (
        <Box className="search-input" alignItems="center" position="relative">
          <input
            className="actionbar-search"
            placeholder="Search"
            onChange={handleChangeSearch}
            onKeyDown={handleKeyDownSearch}
            value={searchText}
          />

          {searchText.length !== 0 ? (
            <IconButton
              onClick={() => updateSearchParam('')}
              color={Colors.LIGHT}>
              <svg
                width="15px"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          ) : (
            <svg
              width="13px"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 action-bar-search-icon">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ActionBar;
