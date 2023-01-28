import {ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';
import Box from '../Box/Box';
import './Dropdown.less';
import Tag from '../Tags/Tag';

Tag;

export type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  value: Option[];
  options: Option[];
  onChange: (value: Option[]) => void;
  placeholder: string;
};

const SELECT_ITEM_CLASSNAME = 'dropdown-select-item';

const MultiSelect = ({
  options,
  onChange,
  value,
  placeholder,
}: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const selectedValues = value.sort((optA, optB) =>
    optA.value.localeCompare(optB.value)
  );

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

  const handleOnChange = (selectedOptionValue: Option) => {
    onChange([...selectedValues, selectedOptionValue]);
    setIsDropdownOpen(false);
  };

  const handleClearClick = (e: any) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleRemoveOption = (e: any, optionValue: string) => {
    e.stopPropagation();

    const withOptionRemoved = selectedValues.filter(({value}) => {
      return value !== optionValue;
    });

    onChange(withOptionRemoved);
  };

  const renderOptions = () => {
    const selectedValueStrings = selectedValues.map(({value}) => value);

    const remainingOptions = options
      .sort((optA, optB) => {
        return optA.value.localeCompare(optB.value);
      })
      .filter(({value: optionValue}) => {
        return !selectedValueStrings.includes(
          optionValue as keyof typeof Option
        );
      });

    const optionItems = remainingOptions.map(({label, value: optionValue}) => {
      return (
        <li
          className={classNames(SELECT_ITEM_CLASSNAME)}
          key={label}
          onClick={() => handleOnChange({label, value: optionValue})}>
          {label}
        </li>
      );
    });

    return (
      <Box>
        <ul className="dropdown-list">
          {optionItems.length ? (
            optionItems
          ) : (
            <span className="no-options">No Options</span>
          )}
        </ul>
      </Box>
    );
  };

  const renderSelectedOptions = () => {
    if (!value.length) {
      return placeholder;
    }

    return value
      .sort((optA, optB) => optA.value.localeCompare(optB.value))
      .map((option: Option) => {
        return (
          <Box className="selected-option" key={option.value} gap={10}>
            {option.label}
            <XMarkIcon
              width={12}
              onClick={(e: any) => handleRemoveOption(e, option.value)}
            />
          </Box>
        );
      });
  };

  return (
    <div className="multi-select" ref={ref}>
      <button
        className="dropdown-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <Box justifyContent="space-between" alignItems="center">
          <Box gap={5} flexWrap="wrap">
            {renderSelectedOptions()}
          </Box>
          <Box>
            <XMarkIcon style={{width: 15}} onClick={handleClearClick} />
            <div className="input-divider" />
            <ChevronDownIcon style={{width: 15}} />
          </Box>
        </Box>
      </button>
      {isDropdownOpen && renderOptions()}
    </div>
  );
};

export default MultiSelect;
