export function ConvertToTimeZone(date: Date, tz: string) {
  const newDate = new Date(date);
  return {
    date: newDate.toLocaleDateString("en-US", {
      timeZone: tz,
    }),
    time: newDate.toLocaleTimeString("en-US", {
      timeZone: tz,
    }),
    datetime: newDate.toLocaleString("en-US", {
      timeZone: tz,
    }),
  };
}

export function ConvertToNicaraguaTime(date: Date) {
  return ConvertToTimeZone(date, "America/Costa_Rica");
}
