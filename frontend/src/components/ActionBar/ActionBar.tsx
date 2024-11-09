import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import {MagnifyingGlassIcon, XMarkIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {
  Colors,
  MediaType,
  SearchParam,
  Tab,
  Tags,
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

const DEFAULT_SORT_DIRECTION = SORT_DIRECTION.DESC;

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

export const FILTER_OPTIONS: Option[] = [
  {label: 'All', value: Tags.ALL},
  {label: 'Nonseasonal', value: Tags.NONSEASONAL},
  {label: '🎄 Christmas', value: Tags.CHRISTMAS, isTag: true},
  {label: '🎃 Halloween', value: Tags.HALLOWEEN, isTag: true},
];

const ActionBar = () => {
  const {pathname, search} = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(FILTER_TABS[0]);
  const [searchText, setSearchText] = useState<string>(
    searchParams.get(SearchParam.SEARCH) || ''
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const sortParam = searchParams.get(SearchParam.SORT);
  const sortOptions = getSortOptions(pathname);
  const filterParam = searchParams.get(SearchParam.FILTER);

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
      return;
    }

    if (searchText && searchParams.get(SearchParam.SEARCH) === '') {
      setSearchText('');
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
    updateSearchParams(SearchParam.SORT, `${DEFAULT_SORT_DIRECTION}${sortBy}`);
  };

  const handleFilterByChange = (filterBy: Tags) => {
    if (filterBy === Tags.ALL) {
      deleteSearchParam(SearchParam.FILTER);
    } else {
      updateSearchParams(SearchParam.FILTER, filterBy);
    }
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

  const handleCollapseActionBar = () => {
    setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed);
  };

  const sortValueForDropdown = (sortParam || '').replace('-', '');
  const filterValueForDropdown = (filterParam || 'all').replace('-', '');

  const renderSortIcon = () => {
    const isSortedDesc = getIsSortedDesc();

    const SortIcon = (props: any) => {
      return isSortedDesc ? (
        <ArrowDownCircleIcon className="sort-icon" {...props} />
      ) : (
        <ArrowUpCircleIcon className="sort-icon" {...props} />
      );
    };

    return <SortIcon onClick={handleChangeSortDirection} width="25px" />;
  };

  if (pathname.includes(URL_PATHS.SEARCH)) {
    return null;
  }

  const isFiltersApplied = searchText.length || filterParam;

  return (
    <Box className="action-bar" alignItems="center" flexWrap="wrap" gap={30}>
      <Box className="action-bar-tabs-container" mr="auto">
        <Tabs
          activeTab={activeTab}
          tabs={FILTER_TABS}
          onChange={handleTabChange}
        />
        <div style={{position: 'relative'}}>
          <IconButton
            className="collapse-button"
            onClick={handleCollapseActionBar}>
            <FunnelIcon className="button-icon" />
          </IconButton>
          {isFiltersApplied && <span className="indicator" />}
        </div>
      </Box>
      <Box
        className={classNames('action-bar-collapsible', {
          hidden: isCollapsed,
        })}
        gap={40}
        flexWrap="nowrap">
        <Box
          className="action-bar-dropdown-container"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          gap={40}>
          <Box className="action-bar-dropdown" alignItems="center" gap={6}>
            <label className="sort-dropdown-label">Filter By</label>
            <Box position="relative">
              <Dropdown
                options={FILTER_OPTIONS}
                value={filterValueForDropdown}
                onSelectChange={handleFilterByChange}
              />
              {filterValueForDropdown !== Tags.ALL && (
                <IconButton
                  onClick={() => handleFilterByChange(Tags.ALL)}
                  style={{position: 'absolute', right: -33}}>
                  <XMarkIcon className="button-icon" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Box className="action-bar-dropdown" alignItems="center" gap={6}>
            <label className="sort-dropdown-label">Sort By</label>
            <Box gap={6}>
              <Dropdown
                options={sortOptions}
                value={sortValueForDropdown}
                onSelectChange={handleSortByChange}
              />
              {renderSortIcon()}
            </Box>
          </Box>
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
                color={Colors.LIGHT}
                style={{
                  position: 'absolute',
                  right: 0,
                }}>
                <XMarkIcon className="button-icon" />
              </IconButton>
            ) : (
              <MagnifyingGlassIcon
                className="search-input-icon"
                style={{width: 15}}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ActionBar;
