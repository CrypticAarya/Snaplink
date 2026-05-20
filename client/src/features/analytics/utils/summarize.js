export function summarizeClicks(stats = []) {
  if (!stats?.length) {
    return {
      total: 0,
      topDevice: null,
      topDeviceCount: 0,
      topCity: null,
      topCityCount: 0,
      countries: 0,
    };
  }

  const deviceCounts = {};
  const cityCounts = {};
  const countries = new Set();

  stats.forEach((row) => {
    deviceCounts[row.device] = (deviceCounts[row.device] || 0) + 1;
    cityCounts[row.city] = (cityCounts[row.city] || 0) + 1;
    if (row.country) countries.add(row.country);
  });

  const topEntry = (obj) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])[0] || [null, 0];

  const [topDevice, topDeviceCount] = topEntry(deviceCounts);
  const [topCity, topCityCount] = topEntry(cityCounts);

  return {
    total: stats.length,
    topDevice,
    topDeviceCount,
    topCity,
    topCityCount,
    countries: countries.size,
  };
}
