import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {MediaType, SearchParam, Tab, URL_PATHS} from '../../types/types';
import Box from '../Shared/Box/Box';
import Dropdown, {Option} from '../Shared/Dropdown/Dropdown';
import Tabs from '../Shared/Tabs/Tabs';

import './ActionBar.less';

const FILTER_TABS: Tab[] = [
  {label: 'All', value: MediaType.ALL},
  {label: 'Movies', value: MediaType.MOVIE},
  {label: 'Series', value: MediaType.SERIES},
];

export const DEFAULT_SORT_OPTIONS = [{label: 'Title', value: 'title'}];
export const CLIENT_SORT_OPTIONS = [{label: 'RT Rating', value: 'rtRating'}];

const SORT_DIRECTION = {
  ASC: '',
  DESC: '-',
};

const getSortOptions = (pathname: string): Option[] => {
  if (pathname === `/${URL_PATHS.TO_WATCH}`) {
    return [
      {label: 'Title', value: 'title'},
      {label: 'Release Date', value: 'year'},
      {label: 'Date Added', value: 'datewatched'},
      ...CLIENT_SORT_OPTIONS,
    ];
  }

  if (pathname === `/${URL_PATHS.WATCHED}`) {
    return [
      {label: 'Title', value: 'title'},
      {label: 'Release Date', value: 'year'},
      {label: 'Date Watched', value: 'datewatched'},
      {label: 'Our Rating', value: 'rating'},
    ];
  }

  return DEFAULT_SORT_OPTIONS;
};

const ActionBar = () => {
  const {pathname, search} = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(FILTER_TABS[0]);

  const sortParam = searchParams.get(SearchParam.SORT);
  const sortOptions = getSortOptions(pathname);

  const updateSearchParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!sortParam) {
      updateSearchParams(SearchParam.SORT, '-datewatched');
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
      p={'10px 30px'}
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
        <input
          className="actionbar-search"
          placeholder="search"
          onChange={handleChangeSearch}
        />
      )}
    </Box>
  );
};

export default ActionBar;
