import { format } from 'date-fns';
import isThisYear from 'date-fns/isThisYear';

const formatDate = date => {
  // format date & show year in date if not current year
  const formatted = isThisYear(new Date(date)) ?
  format(new Date(date), `MMM d 'at' h:mm aa`) :
  format(new Date(date), `MMM d, yyyy 'at' h:mm aa`);

  return formatted;
};

export const formatDateLong = date => {
  return format(new Date(date), 'PPPp');
};

export default formatDate;
