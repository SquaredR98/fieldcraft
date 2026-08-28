/**
 * Common IANA timezones grouped by region.
 * Curated subset of the most commonly used timezones.
 * Sorted by UTC offset within each region.
 * @since 1.8.0
 */

export interface Timezone {
  /** IANA timezone identifier (e.g., "America/New_York") */
  value: string;
  /** Human-readable label (e.g., "Eastern Time (New York)") */
  label: string;
  /** Standard (non-DST) UTC offset for display purposes (e.g., "UTC-05:00") */
  offset: string;
  /** Geographic region for grouping (e.g., "Americas", "Europe", "Asia", "Africa", "Pacific") */
  region: string;
}

export const TIMEZONES: Timezone[] = [
  // ── Americas ──────────────────────────────────────────────────
  { value: "Pacific/Honolulu", label: "Hawaii", offset: "UTC-10:00", region: "Americas" },
  { value: "America/Adak", label: "Aleutian Islands", offset: "UTC-10:00", region: "Americas" },
  { value: "America/Anchorage", label: "Alaska", offset: "UTC-09:00", region: "Americas" },
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)", offset: "UTC-08:00", region: "Americas" },
  { value: "America/Vancouver", label: "Pacific Time (Vancouver)", offset: "UTC-08:00", region: "Americas" },
  { value: "America/Tijuana", label: "Pacific Time (Tijuana)", offset: "UTC-08:00", region: "Americas" },
  { value: "America/Denver", label: "Mountain Time (Denver)", offset: "UTC-07:00", region: "Americas" },
  { value: "America/Phoenix", label: "Arizona (no DST)", offset: "UTC-07:00", region: "Americas" },
  { value: "America/Edmonton", label: "Mountain Time (Edmonton)", offset: "UTC-07:00", region: "Americas" },
  { value: "America/Chicago", label: "Central Time (Chicago)", offset: "UTC-06:00", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC-06:00", region: "Americas" },
  { value: "America/Winnipeg", label: "Central Time (Winnipeg)", offset: "UTC-06:00", region: "Americas" },
  { value: "America/Guatemala", label: "Guatemala", offset: "UTC-06:00", region: "Americas" },
  { value: "America/Costa_Rica", label: "Costa Rica", offset: "UTC-06:00", region: "Americas" },
  { value: "America/New_York", label: "Eastern Time (New York)", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Toronto", label: "Eastern Time (Toronto)", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Bogota", label: "Bogota", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Lima", label: "Lima", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Panama", label: "Panama", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Jamaica", label: "Jamaica", offset: "UTC-05:00", region: "Americas" },
  { value: "America/Caracas", label: "Caracas", offset: "UTC-04:00", region: "Americas" },
  { value: "America/Halifax", label: "Atlantic Time (Halifax)", offset: "UTC-04:00", region: "Americas" },
  { value: "America/Santiago", label: "Santiago", offset: "UTC-04:00", region: "Americas" },
  { value: "America/La_Paz", label: "La Paz", offset: "UTC-04:00", region: "Americas" },
  { value: "America/Asuncion", label: "Asuncion", offset: "UTC-04:00", region: "Americas" },
  { value: "America/St_Johns", label: "Newfoundland", offset: "UTC-03:30", region: "Americas" },
  { value: "America/Sao_Paulo", label: "Sao Paulo", offset: "UTC-03:00", region: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC-03:00", region: "Americas" },
  { value: "America/Montevideo", label: "Montevideo", offset: "UTC-03:00", region: "Americas" },

  // ── Europe ────────────────────────────────────────────────────
  { value: "Atlantic/Reykjavik", label: "Reykjavik (no DST)", offset: "UTC+00:00", region: "Europe" },
  { value: "Europe/London", label: "London (GMT)", offset: "UTC+00:00", region: "Europe" },
  { value: "Europe/Dublin", label: "Dublin", offset: "UTC+00:00", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+00:00", region: "Europe" },
  { value: "Europe/Paris", label: "Paris (CET)", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin (CET)", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Rome", label: "Rome", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Oslo", label: "Oslo", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Prague", label: "Prague", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Budapest", label: "Budapest", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Belgrade", label: "Belgrade", offset: "UTC+01:00", region: "Europe" },
  { value: "Europe/Athens", label: "Athens (EET)", offset: "UTC+02:00", region: "Europe" },
  { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+02:00", region: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+02:00", region: "Europe" },
  { value: "Europe/Kyiv", label: "Kyiv", offset: "UTC+02:00", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+03:00", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow", offset: "UTC+03:00", region: "Europe" },
  { value: "Europe/Minsk", label: "Minsk", offset: "UTC+03:00", region: "Europe" },

  // ── Africa ────────────────────────────────────────────────────
  { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+01:00", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "UTC+01:00", region: "Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)", offset: "UTC+02:00", region: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi (EAT)", offset: "UTC+03:00", region: "Africa" },
  { value: "Africa/Addis_Ababa", label: "Addis Ababa", offset: "UTC+03:00", region: "Africa" },
  { value: "Africa/Accra", label: "Accra", offset: "UTC+00:00", region: "Africa" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam", offset: "UTC+03:00", region: "Africa" },
  { value: "Africa/Khartoum", label: "Khartoum", offset: "UTC+02:00", region: "Africa" },

  // ── Asia ──────────────────────────────────────────────────────
  { value: "Asia/Beirut", label: "Beirut", offset: "UTC+02:00", region: "Asia" },
  { value: "Asia/Jerusalem", label: "Jerusalem", offset: "UTC+02:00", region: "Asia" },
  { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+03:00", region: "Asia" },
  { value: "Asia/Kuwait", label: "Kuwait", offset: "UTC+03:00", region: "Asia" },
  { value: "Asia/Baghdad", label: "Baghdad", offset: "UTC+03:00", region: "Asia" },
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+03:30", region: "Asia" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+04:00", region: "Asia" },
  { value: "Asia/Muscat", label: "Muscat", offset: "UTC+04:00", region: "Asia" },
  { value: "Asia/Baku", label: "Baku", offset: "UTC+04:00", region: "Asia" },
  { value: "Asia/Tbilisi", label: "Tbilisi", offset: "UTC+04:00", region: "Asia" },
  { value: "Asia/Yerevan", label: "Yerevan", offset: "UTC+04:00", region: "Asia" },
  { value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi (PKT)", offset: "UTC+05:00", region: "Asia" },
  { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+05:00", region: "Asia" },
  { value: "Asia/Kolkata", label: "India (IST)", offset: "UTC+05:30", region: "Asia" },
  { value: "Asia/Colombo", label: "Colombo", offset: "UTC+05:30", region: "Asia" },
  { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+05:45", region: "Asia" },
  { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+06:00", region: "Asia" },
  { value: "Asia/Almaty", label: "Almaty", offset: "UTC+06:00", region: "Asia" },
  { value: "Asia/Yangon", label: "Yangon", offset: "UTC+06:30", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", offset: "UTC+07:00", region: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta (WIB)", offset: "UTC+07:00", region: "Asia" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh City", offset: "UTC+07:00", region: "Asia" },
  { value: "Asia/Shanghai", label: "China (CST)", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Manila", label: "Manila", offset: "UTC+08:00", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul (KST)", offset: "UTC+09:00", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+09:00", region: "Asia" },

  // ── Pacific ───────────────────────────────────────────────────
  { value: "Australia/Perth", label: "Perth (AWST)", offset: "UTC+08:00", region: "Pacific" },
  { value: "Australia/Darwin", label: "Darwin (ACST)", offset: "UTC+09:30", region: "Pacific" },
  { value: "Australia/Adelaide", label: "Adelaide (ACDT)", offset: "UTC+09:30", region: "Pacific" },
  { value: "Australia/Sydney", label: "Sydney (AEST)", offset: "UTC+10:00", region: "Pacific" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST)", offset: "UTC+10:00", region: "Pacific" },
  { value: "Australia/Brisbane", label: "Brisbane (no DST)", offset: "UTC+10:00", region: "Pacific" },
  { value: "Australia/Hobart", label: "Hobart", offset: "UTC+10:00", region: "Pacific" },
  { value: "Pacific/Guam", label: "Guam (ChST)", offset: "UTC+10:00", region: "Pacific" },
  { value: "Pacific/Noumea", label: "Noumea", offset: "UTC+11:00", region: "Pacific" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)", offset: "UTC+12:00", region: "Pacific" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12:00", region: "Pacific" },
  { value: "Pacific/Tongatapu", label: "Tonga", offset: "UTC+13:00", region: "Pacific" },
  { value: "Pacific/Apia", label: "Apia (Samoa)", offset: "UTC+13:00", region: "Pacific" },

  // ── UTC ───────────────────────────────────────────────────────
  { value: "UTC", label: "Coordinated Universal Time", offset: "UTC+00:00", region: "UTC" },
];
