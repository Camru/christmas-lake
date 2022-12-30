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

const Dropdown = ({options, onSelectChange, value}: DropdownProps) => {
  const handleOnChange = (e: any) => {
    onSelectChange(e.target.value);
  };

  const renderOptions = () => {
    return options.map(({label, value}) => {
      return (
        <option key={label} value={value}>
          {label}
        </option>
      );
    });
  };

  //TODO: [cam] build a custom select
  return (
    <Box position="relative">
      <select
        className="dropdown-select"
        onChange={handleOnChange}
        value={value}>
        {renderOptions()}
      </select>
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
  );
};

export default Dropdown;
