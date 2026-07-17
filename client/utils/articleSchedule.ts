export const ZAGREB_TIME_ZONE = "Europe/Zagreb";

export const ARTICLE_SCHEDULE_TIME_ZONES = [
  { value: "Etc/GMT+12", label: "Baker Island" },
  { value: "Pacific/Pago_Pago", label: "Pago Pago" },
  { value: "Pacific/Honolulu", label: "Honolulu" },
  { value: "America/Anchorage", label: "Anchorage" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Denver", label: "Denver" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Halifax", label: "Halifax" },
  { value: "America/Sao_Paulo", label: "Sao Paulo" },
  { value: "America/Noronha", label: "Fernando de Noronha" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/Zagreb", label: "Zagreb" },
  { value: "Europe/Athens", label: "Athens" },
  { value: "Europe/Moscow", label: "Moscow" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Karachi", label: "Karachi" },
  { value: "Asia/Dhaka", label: "Dhaka" },
  { value: "Asia/Bangkok", label: "Bangkok" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Pacific/Noumea", label: "Noumea" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "Pacific/Tongatapu", label: "Tongatapu" },
  { value: "Pacific/Kiritimati", label: "Kiritimati" },
];

const getTimeZoneParts = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
  };
};

const pad = (value: number) => value.toString().padStart(2, "0");

export const formatDateTimeInTimeZone = (
  value: string | Date | null | undefined,
  timeZone: string
) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("hr-HR", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const getUtcOffsetLabel = (
  timeZone: string,
  value: string | Date = new Date()
) => {
  const date = new Date(value);
  const timeZoneParts = getTimeZoneParts(date, timeZone);
  const timeZoneDateAsUtc = Date.UTC(
    timeZoneParts.year,
    timeZoneParts.month - 1,
    timeZoneParts.day,
    timeZoneParts.hour,
    timeZoneParts.minute
  );
  const offsetHours = Math.round((timeZoneDateAsUtc - date.getTime()) / 3600000);

  if (offsetHours === 0) {
    return "UTC";
  }

  return `UTC${offsetHours > 0 ? "+" : ""}${offsetHours}`;
};

export const formatDateTimeLocalInput = (
  value: string | Date | null | undefined,
  timeZone: string
) => {
  if (!value) return "";

  const parts = getTimeZoneParts(new Date(value), timeZone);

  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(
    parts.hour
  )}:${pad(parts.minute)}`;
};

export const zonedDateTimeLocalToUtcIso = (
  localDateTime: string,
  timeZone: string
) => {
  if (!localDateTime) return null;

  const [datePart, timePart] = localDateTime.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const timeZoneParts = getTimeZoneParts(utcGuess, timeZone);
  const desiredUtcMs = Date.UTC(year, month - 1, day, hour, minute);
  const actualUtcMs = Date.UTC(
    timeZoneParts.year,
    timeZoneParts.month - 1,
    timeZoneParts.day,
    timeZoneParts.hour,
    timeZoneParts.minute
  );

  return new Date(utcGuess.getTime() + desiredUtcMs - actualUtcMs).toISOString();
};

export const getBrowserTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || ZAGREB_TIME_ZONE;
};

export const getArticleScheduleTimeZoneOptions = (selectedTimeZone: string) => {
  const hasSelectedTimeZone = ARTICLE_SCHEDULE_TIME_ZONES.some(
    (timeZone) => timeZone.value === selectedTimeZone
  );

  const options = ARTICLE_SCHEDULE_TIME_ZONES.map((timeZone) => ({
    ...timeZone,
    label: `${getUtcOffsetLabel(timeZone.value)} - ${timeZone.label}`,
  }));

  if (hasSelectedTimeZone || !selectedTimeZone) {
    return options;
  }

  return [
    {
      value: selectedTimeZone,
      label: `${getUtcOffsetLabel(selectedTimeZone)} - ${selectedTimeZone}`,
    },
    ...options,
  ];
};

export const getScheduleStatus = (article: any) => {
  const schedule = article?.article_schedule;

  if (!schedule?.publish_at) {
    return {
      label: "Objavljeno",
      className: "published",
      date: null,
    };
  }

  const publishAt = new Date(schedule.publish_at);
  const isScheduled = publishAt.getTime() > Date.now();

  return {
    label: isScheduled ? "Zakazano" : "Objavljeno",
    className: isScheduled ? "scheduled" : "published",
    date: isScheduled ? schedule.publish_at : null,
  };
};
