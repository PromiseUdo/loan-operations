import moment from "moment";

export const addMonthsToDate = (
  initialDate: Date,
  numberOfMonthsToAdd: number
): string => {
  const date = moment(initialDate);
  const newDate = date.add(numberOfMonthsToAdd, "months");
  return newDate.format("MMMM DD, YYYY");
};
