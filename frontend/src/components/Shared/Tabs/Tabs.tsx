import {Tab} from '../../../types/types';
import Box from '../Box/Box';
import cx from 'classnames';

import './Tabs.less';

type TabsProps = {
  activeTab: Tab;
  tabs: Tab[];
  onChange: (tab: Tab) => void;
};

const Tabs = ({activeTab, tabs, onChange}: TabsProps): JSX.Element => {
  const handleTabClick = (tab: Tab) => {
    onChange(tab);
  };

  const renderTab = ({label, value}: Tab) => {
    return (
      <button
        key={label}
        className={cx('tab', {active: activeTab.value === value})}
        onClick={() => handleTabClick({label, value})}>
        {value}
      </button>
    );
  };

  const renderTabs = () => {
    return tabs.map(renderTab);
  };

  return <Box gap={10}>{renderTabs()}</Box>;
};

export default Tabs;
