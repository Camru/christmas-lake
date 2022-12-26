export type Option = {
  value: string;
  label: string;
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

  return (
    <select className="dropdown-select" onChange={handleOnChange} value={value}>
      {renderOptions()}
    </select>
  );
};

export default Dropdown;
