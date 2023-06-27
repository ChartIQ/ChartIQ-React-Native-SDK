import { TimeUnit, colorPickerColors } from '~/constants';

export const colorInitializer = (color: string | undefined, isDark: boolean) => {
  if (color === 'auto' || color === 'black') {
    return isDark ? colorPickerColors[4] : colorPickerColors[colorPickerColors.length - 1];
  }

  return color;
};

export const textOnColor = (color: string) => {
  const indexSeparator = 17;
  const index = colorPickerColors.indexOf(color);
  if (index < 0) return 'black';

  return index < indexSeparator ? 'black' : 'white';
};

export const formatStudyName = (name?: string | null) => {
  if (!name) return '';

  return name.split(' (')[0];
};

export function timeInitShortName(timeUnit: TimeUnit) {
  switch (timeUnit) {
    case TimeUnit.TICK:
      return 'T';
    case TimeUnit.SECOND:
      return 's';
    case TimeUnit.MINUTE:
      return 'm';
    case TimeUnit.HOUR:
      return 'H';
    case TimeUnit.DAY:
      return 'D';
    case TimeUnit.WEEK:
      return 'W';
    case TimeUnit.MONTH:
      return 'M';
    default:
      return 'D';
  }
}

export function getPeriodicityShortName({
  interval,
  periodicity,
  timeUnit,
}: {
  interval: string;
  periodicity: number;
  timeUnit: TimeUnit;
}) {
  let fullPeriodicity = Number(interval) * periodicity;
  if (timeUnit?.toLowerCase() === TimeUnit.HOUR.toLowerCase()) {
    fullPeriodicity /= 60;
  }
  return `${fullPeriodicity}${timeInitShortName(timeUnit)}`;
}
