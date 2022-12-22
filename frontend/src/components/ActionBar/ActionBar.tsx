import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {MEDIA_TYPE_PARAM} from '../../constants/url';
import {MediaType, Tab} from '../../types/types';
import Box from '../Shared/Box/Box';
import Tabs from '../Shared/Tabs/Tabs';

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
      searchParams.get(MEDIA_TYPE_PARAM) === null
    ) {
      setSearchParams({mediaType: activeTab.value});
    }
  }, [activeTab, searchParams]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab.value === MediaType.ALL) {
      setSearchParams();
    } else {
      setSearchParams({mediaType: tab.value});
    }
  };

  return (
    <Box p={33}>
      <Tabs
        activeTab={activeTab}
        tabs={FILTER_TABS}
        onChange={handleTabChange}
      />
    </Box>
  );
};

export default ActionBar;
