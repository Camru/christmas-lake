import {MediaEntity, SearchParam} from '../types/types';

export const convertGenresToArr = (str: string): string[] => {
  return [str];
};

//TODO: [cam]  why is this sometimes giving the previous day?
export const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', {month: 'short'});
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const getCurrentDateInputValue = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return yyyy + '-' + mm + '-' + dd;
};

export const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const ratioToPercentage = (ratio: string): string => {
  if (ratio.includes('%')) return ratio;
  // Split the ratio into the numerator and denominator.
  const [numerator, denominator] = ratio.split('/');

  // Convert the numerator and denominator to numbers.
  const numeratorAsNumber = parseFloat(numerator);
  const denominatorAsNumber = parseInt(denominator, 10);

  // Convert the ratio to a percentage.
  const percentage = (numeratorAsNumber / denominatorAsNumber) * 100;

  // Return the percentage as a string with a percent sign appended.
  return Math.round(percentage).toString() + '%';
};

export const floatToPercentage = (float: string): string => {
  return `${parseFloat(float) * 10}%`;
};

//TODO: [cam] how to make a type that only takes one primitive value from an
//object. I want to create a type that is only the string values of MediaEntity
type MediaEntityKey = string;

const SEARCHABLE_FIELDS: Partial<MediaEntityKey>[] = [
  'title',
  'dateWatched',
  'year',
];

const filterBySearch = (item: MediaEntity, searchParam: string): boolean => {
  if (!searchParam) {
    return true;
  }

  return SEARCHABLE_FIELDS.some((field: MediaEntityKey) => {
    const fieldValue = item[field as keyof MediaEntity].toString();
    return fieldValue.toLowerCase().includes(searchParam.toLowerCase());
  });
};

export const getFilteredMediaEntities = (
  items: MediaEntity[],
  searchParams: any
) => {
  return items.filter((item: MediaEntity) =>
    filterBySearch(item, searchParams.get(SearchParam.SEARCH))
  );
};

export const convertMinutesToHoursAndMinutes = (minutes?: string): string => {
  if (!minutes || minutes === 'N/A') return 'N/A';
  const numMinutes = parseInt(minutes, 10);
  const numHours = Math.floor(numMinutes / 60);
  const remainingMinutes = numMinutes % 60;

  if (numHours === 0) {
    return `${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'}`;
  }

  if (remainingMinutes === 0) {
    return `${numHours} hour${numHours === 1 ? '' : 's'}`;
  }

  return `${numHours} hour${
    numHours === 1 ? '' : 's'
  }, ${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'}`;
};

export const capitalizeFirstChar = (str?: string): string => {
  if (!str) {
    return '';
  }

  const firstChar = str.charAt(0);
  const capitalizedFirstChar = firstChar.toUpperCase();
  return str.replace(firstChar, capitalizedFirstChar);
};
