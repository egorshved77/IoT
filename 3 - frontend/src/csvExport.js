export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = ["Device", "Sensor", "Temperature", "Humidity", "Timestamp"];
  const rows = data.map(item => [
    item.device,
    item.sensor,
    item.payload?.temperature || "N/A",
    item.payload?.humidity || "N/A",
    item.received_at,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
