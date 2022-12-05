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
  return percentage.toString() + '%';
};
