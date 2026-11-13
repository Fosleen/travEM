"use client";

import { DateTime } from "luxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { hrHR } from "@mui/x-date-pickers/locales";
import { getArticleScheduleHoursError, ZAGREB_TIME_ZONE } from "@/utils/articleSchedule";

type Props = {
  value: string;
  timeZone: string;
  onChange: (value: string) => void;
};

// Check every minute when disabling an entire hour: some zones have offsets
// of 30 or 45 minutes, so an hour can be only partly available.
export const isSchedulePickerTimeDisabled = (date: DateTime, view: "hours" | "minutes" | "seconds") => {
  const allowed = (candidate: DateTime) => {
    const zagreb = candidate.setZone(ZAGREB_TIME_ZONE);
    return zagreb.isValid && zagreb.hour >= 6 && zagreb.hour < 22;
  };
  if (!date.isValid) return true;
  if (view === "hours") {
    for (let minute = 0; minute < 60; minute++) {
      if (allowed(date.set({ minute, second: 0, millisecond: 0 }))) return false;
    }
    return true;
  }
  return !allowed(date);
};

export default function ArticleSchedulePicker({ value, timeZone, onChange }: Props) {
  const selected = value ? DateTime.fromISO(value, { zone: timeZone }) : null;
  const error = getArticleScheduleHoursError(value, timeZone);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="hr"
      localeText={hrHR.components.MuiLocalizationProvider.defaultProps.localeText}>
      <DateTimePicker
        label="Datum i vrijeme"
        value={selected?.isValid ? selected : null}
        timezone={timeZone}
        onChange={(next) => onChange(next?.isValid ? next.setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm") : "")}
        ampm={false}
        format="dd.MM.yyyy. HH:mm"
        disablePast
        timeSteps={{ minutes: 1 }}
        thresholdToRenderTimeInASingleColumn={0}
        shouldDisableTime={isSchedulePickerTimeDisabled}
        slotProps={{
          textField: {
            size: "small", fullWidth: true,
            error: Boolean(error),
            helperText: error || "Dopušteno 06:00 - 21:59 po Zagrebu. Prikaz u odabranoj vremenskoj zoni.",
          },
          actionBar: { actions: ["cancel", "accept"] },
        }}
        sx={{
          fontFamily: "inherit",
          minWidth: 0,
          "& .MuiInputLabel-root": {
            position: "static", transform: "none", maxWidth: "none",
            fontFamily: "inherit", fontSize: 14, fontWeight: 700,
            lineHeight: "20px", marginBottom: "8px",
          },
          "& .MuiPickersInputBase-root": {
            borderRadius: "8px", height: 44, boxSizing: "border-box", fontFamily: "inherit",
          },
          "& .MuiPickersOutlinedInput-notchedOutline": { top: 0 },
          "& .MuiPickersOutlinedInput-notchedOutline legend": { display: "none" },
        }}
      />
    </LocalizationProvider>
  );
}
