// ============ Static Data for All API Endpoints ============
// Replaces external API calls with local static data

// ---------- Auth ----------
export const STATIC_USER = {
  email: "test@test.com",
  password: "test@123",
};

export const STATIC_LOGIN_RESPONSE = {
  token: "static-jwt-token-kloudspot-dashboard-2026",
  user: {
    id: "user-001",
    email: "test@test.com",
    name: "Test User",
  },
};

// ---------- Sites ----------
export const STATIC_SITES = [
  {
    id: "site-001",
    siteId: "site-001",
    name: "KloudSpot HQ - Main Building",
    timezone: "America/New_York",
  },
  {
    id: "site-002",
    siteId: "site-002",
    name: "Downtown Retail Store",
    timezone: "America/New_York",
  },
  {
    id: "site-003",
    siteId: "site-003",
    name: "Airport Terminal B",
    timezone: "America/Chicago",
  },
];

// ---------- Occupancy ----------
export const STATIC_OCCUPANCY = {
  liveOccupancy: 142,
  buckets: [
    { utc: 1707742800000, local: "2025-02-12 08:00:00", avg: 23 },
    { utc: 1707746400000, local: "2025-02-12 09:00:00", avg: 58 },
    { utc: 1707750000000, local: "2025-02-12 10:00:00", avg: 97 },
    { utc: 1707753600000, local: "2025-02-12 11:00:00", avg: 134 },
    { utc: 1707757200000, local: "2025-02-12 12:00:00", avg: 178 },
    { utc: 1707760800000, local: "2025-02-12 13:00:00", avg: 156 },
    { utc: 1707764400000, local: "2025-02-12 14:00:00", avg: 189 },
    { utc: 1707768000000, local: "2025-02-12 15:00:00", avg: 167 },
    { utc: 1707771600000, local: "2025-02-12 16:00:00", avg: 142 },
    { utc: 1707775200000, local: "2025-02-12 17:00:00", avg: 98 },
    { utc: 1707778800000, local: "2025-02-12 18:00:00", avg: 45 },
  ],
};

// ---------- Footfall ----------
export const STATIC_FOOTFALL = {
  footfall: 1247,
  totalFootfall: 1247,
};

// ---------- Dwell ----------
export const STATIC_DWELL = {
  avgDwellMinutes: 12.58,
  averageDwellTime: 12.58 * 60 * 1000,
};

// ---------- Demographics ----------
export const STATIC_DEMOGRAPHICS = {
  male: 687,
  female: 560,
  buckets: [
    { utc: 1707742800000, local: "2025-02-12 08:00:00", male: 12, female: 11 },
    { utc: 1707746400000, local: "2025-02-12 09:00:00", male: 34, female: 24 },
    { utc: 1707750000000, local: "2025-02-12 10:00:00", male: 56, female: 41 },
    { utc: 1707753600000, local: "2025-02-12 11:00:00", male: 78, female: 56 },
    { utc: 1707757200000, local: "2025-02-12 12:00:00", male: 102, female: 76 },
    { utc: 1707760800000, local: "2025-02-12 13:00:00", male: 89, female: 67 },
    { utc: 1707764400000, local: "2025-02-12 14:00:00", male: 95, female: 94 },
    { utc: 1707768000000, local: "2025-02-12 15:00:00", male: 83, female: 74 },
    { utc: 1707771600000, local: "2025-02-12 16:00:00", male: 72, female: 60 },
    { utc: 1707775200000, local: "2025-02-12 17:00:00", male: 42, female: 36 },
    { utc: 1707778800000, local: "2025-02-12 18:00:00", male: 24, female: 21 },
  ],
};

// ---------- Entry-Exit Records ----------
const STATIC_ENTRY_EXIT_ALL = [
  { personId: "P001", personName: "James Wilson", gender: "male", entryLocal: "12/02/2025 08:15:22", exitLocal: "12/02/2025 08:42:10", dwellMinutes: 27 },
  { personId: "P002", personName: "Sarah Mitchell", gender: "female", entryLocal: "12/02/2025 08:22:45", exitLocal: "12/02/2025 09:05:33", dwellMinutes: 43 },
  { personId: "P003", personName: "Robert Chen", gender: "male", entryLocal: "12/02/2025 08:35:10", exitLocal: "12/02/2025 08:58:47", dwellMinutes: 24 },
  { personId: "P004", personName: "Emily Parker", gender: "female", entryLocal: "12/02/2025 08:47:33", exitLocal: "12/02/2025 09:30:15", dwellMinutes: 43 },
  { personId: "P005", personName: "Michael Torres", gender: "male", entryLocal: "12/02/2025 09:02:18", exitLocal: "12/02/2025 09:18:44", dwellMinutes: 16 },
  { personId: "P006", personName: "Jessica Adams", gender: "female", entryLocal: "12/02/2025 09:10:55", exitLocal: "12/02/2025 09:45:22", dwellMinutes: 34 },
  { personId: "P007", personName: "David Kim", gender: "male", entryLocal: "12/02/2025 09:25:40", exitLocal: "12/02/2025 10:12:08", dwellMinutes: 47 },
  { personId: "P008", personName: "Amanda Foster", gender: "female", entryLocal: "12/02/2025 09:38:12", exitLocal: "12/02/2025 10:05:30", dwellMinutes: 27 },
  { personId: "P009", personName: "Christopher Lee", gender: "male", entryLocal: "12/02/2025 09:52:07", exitLocal: "12/02/2025 10:30:55", dwellMinutes: 39 },
  { personId: "P010", personName: "Olivia Brown", gender: "female", entryLocal: "12/02/2025 10:05:33", exitLocal: "12/02/2025 10:48:17", dwellMinutes: 43 },
  { personId: "P011", personName: "Daniel Martinez", gender: "male", entryLocal: "12/02/2025 10:12:45", exitLocal: "12/02/2025 10:35:22", dwellMinutes: 23 },
  { personId: "P012", personName: "Sophia Taylor", gender: "female", entryLocal: "12/02/2025 10:28:18", exitLocal: "12/02/2025 11:15:40", dwellMinutes: 47 },
  { personId: "P013", personName: "Andrew Johnson", gender: "male", entryLocal: "12/02/2025 10:40:55", exitLocal: "12/02/2025 11:02:33", dwellMinutes: 22 },
  { personId: "P014", personName: "Rachel Green", gender: "female", entryLocal: "12/02/2025 10:55:22", exitLocal: "12/02/2025 11:38:10", dwellMinutes: 43 },
  { personId: "P015", personName: "Nathan Wright", gender: "male", entryLocal: "12/02/2025 11:08:40", exitLocal: "12/02/2025 11:45:55", dwellMinutes: 37 },
  { personId: "P016", personName: "Isabella Scott", gender: "female", entryLocal: "12/02/2025 11:22:15", exitLocal: "12/02/2025 12:05:44", dwellMinutes: 43 },
  { personId: "P017", personName: "Kevin Patel", gender: "male", entryLocal: "12/02/2025 11:35:50", exitLocal: "12/02/2025 12:18:22", dwellMinutes: 43 },
  { personId: "P018", personName: "Lauren White", gender: "female", entryLocal: "12/02/2025 11:48:33", exitLocal: "12/02/2025 12:30:10", dwellMinutes: 42 },
  { personId: "P019", personName: "Thomas Garcia", gender: "male", entryLocal: "12/02/2025 12:05:18", exitLocal: "12/02/2025 12:52:45", dwellMinutes: 47 },
  { personId: "P020", personName: "Megan Clark", gender: "female", entryLocal: "12/02/2025 12:18:44", exitLocal: "12/02/2025 12:45:33", dwellMinutes: 27 },
  { personId: "P021", personName: "Brian Nguyen", gender: "male", entryLocal: "12/02/2025 12:32:10", exitLocal: "12/02/2025 13:15:22", dwellMinutes: 43 },
  { personId: "P022", personName: "Hannah Davis", gender: "female", entryLocal: "12/02/2025 12:45:55", exitLocal: "12/02/2025 13:28:40", dwellMinutes: 43 },
  { personId: "P023", personName: "Jason Miller", gender: "male", entryLocal: "12/02/2025 13:02:33", exitLocal: "12/02/2025 13:42:18", dwellMinutes: 40 },
  { personId: "P024", personName: "Victoria Hall", gender: "female", entryLocal: "12/02/2025 13:18:22", exitLocal: "12/02/2025 14:05:55", dwellMinutes: 48 },
  { personId: "P025", personName: "Ryan Thompson", gender: "male", entryLocal: "12/02/2025 13:30:45", exitLocal: "12/02/2025 14:12:10", dwellMinutes: 41 },
  { personId: "P026", personName: "Samantha Lewis", gender: "female", entryLocal: "12/02/2025 13:45:18", exitLocal: "12/02/2025 14:22:33", dwellMinutes: 37 },
  { personId: "P027", personName: "Marcus Robinson", gender: "male", entryLocal: "12/02/2025 14:02:55", exitLocal: "12/02/2025 14:38:44", dwellMinutes: 36 },
  { personId: "P028", personName: "Ashley Morgan", gender: "female", entryLocal: "12/02/2025 14:15:40", exitLocal: "12/02/2025 14:55:22", dwellMinutes: 40 },
  { personId: "P029", personName: "Eric Campbell", gender: "male", entryLocal: "12/02/2025 14:28:22", exitLocal: "12/02/2025 15:10:18", dwellMinutes: 42 },
  { personId: "P030", personName: "Natalie Rivera", gender: "female", entryLocal: "12/02/2025 14:42:10", exitLocal: "12/02/2025 15:25:55", dwellMinutes: 44 },
  { personId: "P031", personName: "Patrick Young", gender: "male", entryLocal: "12/02/2025 14:55:33", exitLocal: "12/02/2025 15:32:40", dwellMinutes: 37 },
  { personId: "P032", personName: "Christina Bell", gender: "female", entryLocal: "12/02/2025 15:08:18", exitLocal: "12/02/2025 15:48:10", dwellMinutes: 40 },
  { personId: "P033", personName: "Steven Harris", gender: "male", entryLocal: "12/02/2025 15:22:44", exitLocal: "12/02/2025 16:05:33", dwellMinutes: 43 },
  { personId: "P034", personName: "Diana Ross", gender: "female", entryLocal: "12/02/2025 15:35:10", exitLocal: "12/02/2025 16:18:22", dwellMinutes: 43 },
  { personId: "P035", personName: "Brandon Cooper", gender: "male", entryLocal: "12/02/2025 15:48:55", exitLocal: "12/02/2025 16:25:40", dwellMinutes: 37 },
  { personId: "P036", personName: "Monica Sanchez", gender: "female", entryLocal: "12/02/2025 16:02:33", exitLocal: "12/02/2025 16:42:18", dwellMinutes: 40 },
  { personId: "P037", personName: "Tyler Bennett", gender: "male", entryLocal: "12/02/2025 16:15:22", exitLocal: "12/02/2025 16:55:10", dwellMinutes: 40 },
  { personId: "P038", personName: "Julia Ramirez", gender: "female", entryLocal: "12/02/2025 16:28:40", exitLocal: "12/02/2025 17:08:55", dwellMinutes: 40 },
  { personId: "P039", personName: "Alex Washington", gender: "male", entryLocal: "12/02/2025 16:42:18", exitLocal: "12/02/2025 17:22:33", dwellMinutes: 40 },
  { personId: "P040", personName: "Chloe Hughes", gender: "female", entryLocal: "12/02/2025 16:55:55", exitLocal: "12/02/2025 17:35:10", dwellMinutes: 39 },
  { personId: "P041", personName: "Gregory Price", gender: "male", entryLocal: "12/02/2025 17:08:33", exitLocal: "12/02/2025 17:42:22", dwellMinutes: 34 },
  { personId: "P042", personName: "Kayla Murphy", gender: "female", entryLocal: "12/02/2025 17:22:18", exitLocal: "12/02/2025 17:55:40", dwellMinutes: 33 },
  { personId: "P043", personName: "Derek Evans", gender: "male", entryLocal: "12/02/2025 17:35:44", exitLocal: null, dwellMinutes: null },
  { personId: "P044", personName: "Nicole Peterson", gender: "female", entryLocal: "12/02/2025 17:48:10", exitLocal: null, dwellMinutes: null },
  { personId: "P045", personName: "Justin Collins", gender: "male", entryLocal: "12/02/2025 18:02:55", exitLocal: null, dwellMinutes: null },
];

export function getStaticEntryExitPage(pageNumber: number, pageSize: number) {
  const totalRecords = STATIC_ENTRY_EXIT_ALL.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  const records = STATIC_ENTRY_EXIT_ALL.slice(start, end);

  return {
    records,
    totalRecords,
    totalPages,
    pageNumber,
    pageSize,
  };
}

// ---------- Socket Simulation Data ----------
const ZONES = ["Main Entrance", "Lobby A", "Floor 2 - East Wing", "Cafeteria", "Parking Garage"];
const SEVERITIES = ["low", "medium", "high"];

export function generateRandomAlert(siteId: string, siteName: string) {
  const action = Math.random() > 0.5 ? "entry" : "exit";
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];

  return {
    action: action as "entry" | "exit",
    zone,
    site: siteName,
    siteId,
    severity,
    timestamp: Date.now(),
    message: `Person ${action === "entry" ? "entered" : "exited"} ${zone}`,
  };
}

export function generateRandomOccupancy(siteId: string, baseOccupancy: number) {
  const fluctuation = Math.floor(Math.random() * 20) - 10;
  return {
    siteId,
    zone: ZONES[Math.floor(Math.random() * ZONES.length)],
    occupancy: Math.max(0, baseOccupancy + fluctuation),
    count: Math.max(0, baseOccupancy + fluctuation),
    timestamp: Date.now(),
  };
}
