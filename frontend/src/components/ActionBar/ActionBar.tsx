import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {MediaType, SearchParam, Tab} from '../../types/types';
import Box from '../Shared/Box/Box';
import Tabs from '../Shared/Tabs/Tabs';

import './ActionBar.less';

const FILTER_TABS: Tab[] = [
  {label: 'All', value: MediaType.ALL},
  {label: 'Movies', value: MediaType.MOVIE},
  {label: 'Series', value: MediaType.SERIES},
];

const ActionBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(FILTER_TABS[0]);

  useEffect(() => {
    if (
      activeTab.value !== MediaType.ALL &&
      searchParams.get(SearchParam.MEDIA_TYPE) === null
    ) {
      updateSearchParams(SearchParam.MEDIA_TYPE, activeTab.value);
    }
  }, [activeTab, searchParams]);

  const updateSearchParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

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

  const handleChangeSearch = (e: any) => {
    const searchText = e.target.value;
    if (!searchText) {
      deleteSearchParam(SearchParam.SEARCH);
    } else {
      updateSearchParams(SearchParam.SEARCH, searchText);
    }
  };

  return (
    <Box p={10} justifyContent="space-between">
      <Tabs
        activeTab={activeTab}
        tabs={FILTER_TABS}
        onChange={handleTabChange}
      />
      <input
        className="actionbar-search"
        placeholder="search"
        onChange={handleChangeSearch}
      />
    </Box>
  );
};

export default ActionBar;
