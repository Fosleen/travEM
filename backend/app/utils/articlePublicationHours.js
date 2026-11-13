export const isArticlePublicationTime = (value = new Date()) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return false;
  const hour = Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zagreb', hour: '2-digit', hourCycle: 'h23',
  }).format(date));
  return hour >= 6 && hour < 22;
};

export const publicationHoursError = 'Objava je dopuštena od 06:00 do 21:59 prema vremenu u Zagrebu.';
