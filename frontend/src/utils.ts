export const convertGenresToArr = (str: string): string[] => {
  return [str];
};

export const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', {month: 'short'});
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};
