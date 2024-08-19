export const convertDateFormat = (dateString) => {
  // Define the month abbreviations
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  // Split the input date string
  const [day, monthAbbr, year] = dateString.split(" ");

  // Convert the month abbreviation to month number
  const month = months[monthAbbr];

  // Return the date in YYYY-MM-DD format
  return `${year}-${month}-${day.padStart(2, "0")}`;
};

// Example usage
const formattedDate = convertDateFormat("22 Dec 1991");
console.log(formattedDate); // Output: "1991-12-22"
