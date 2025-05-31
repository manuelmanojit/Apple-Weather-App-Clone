export function formatTime(timeString) {
  // 9:28 and PM
  const [time, period] = timeString.split(" ");
  // 9 and 28
  let [hour, minutes] = time.split(":").map((value) => Number(value));

  if (period === "AM" && hour === "12") hour = 0;
  if (period === "PM" && hour !== "12") hour += 12;
  //9 into 21 or 09 if AM
  return `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function getCurrentHour(forecastData) {
  const timezone = forecastData.cityTimezone;
  const currentDay = new Date();

  const options = { hour: "numeric", timeZone: timezone, hour12: false };
  // I need parseInt because Intl.DateTImeFormat returns a string
  const currentHour = parseInt(
    new Intl.DateTimeFormat("default", options).format(currentDay)
  );
  return currentHour;
}

export function getCurrentHourAndMinutes(forecastData) {
  const timezone = forecastData.cityTimezone;
  const currentDay = new Date();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    hour12: false,
  };
  // I need parseInt because Intl.DateTImeFormat returns a string
  const currentHour = new Intl.DateTimeFormat("default", options).format(
    currentDay
  );

  return currentHour;
}
