import classNames from 'classnames';
import {useEffect, useState} from 'react';
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

  //TODO: [cam] handle Click outside
  // const handleClickOutside = (e: any) => {
  //   setIsDropdownOpen(false);
  // };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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

  //TODO: [cam] update styling for dropdown list and selected option
  return (
    <div className="dropdown-container">
      <button
        className="dropdown-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <Box justifyContent="space-between">
          {selectedOption?.label}
          <svg
            width={17}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 dropdown-select-icon">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </Box>
      </button>
      {isDropdownOpen && renderOptions()}
    </div>
  );
};

export default Dropdown;
