import {ChevronDownIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';
import Box from '../Box/Box';
import './Dropdown.less';

export type Option = {
  value: string;
  label: string;
  isClientSort?: boolean;
};

type DropdownProps = {
  value: string;
  options: Option[];
  onSelectChange: (value: string) => void;
};

const SELECT_ITEM_CLASSNAME = 'dropdown-select-item';

const Dropdown = ({options, onSelectChange, value}: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsDropdownOpen(false);
        return;
      }
    };

    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleOnChange = (selectedOptionValue: string) => {
    onSelectChange(selectedOptionValue);
    setIsDropdownOpen(false);
  };

  const renderOptions = () => {
    const optionItems = options.map(({label, value: optionValue}) => {
      return (
        <li
          className={classNames(SELECT_ITEM_CLASSNAME, {
            active: value === optionValue,
          })}
          key={label}
          onClick={() => handleOnChange(optionValue)}>
          {label}
        </li>
      );
    });

    return (
      <Box>
        <ul className="dropdown-list">{optionItems}</ul>
      </Box>
    );
  };

  const selectedOption = options.find(({value: optionValue}) => {
    return value === optionValue;
  });

  return (
    <div className="dropdown-container" ref={ref}>
      <button
        className="dropdown-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <Box justifyContent="space-between" alignItems="center">
          {selectedOption?.label}
          <ChevronDownIcon style={{width: 15}} />
        </Box>
      </button>
      {isDropdownOpen && renderOptions()}
    </div>
  );
};

export default Dropdown;
