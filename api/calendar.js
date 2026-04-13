export default async function handler(req, res) {
  const AIRBNB_URL = "https://www.airbnb.co.kr/calendar/ical/1449092803394676993.ics?t=ae54c99940fb41e998f0b0b30f34e0ea";
  try {
    const response = await fetch(AIRBNB_URL);
    const data = await response.text();
    const lines = data.split(/\r?\n/);
    let checkoutDates = [];
    let currentEvent = {};
    lines.forEach(line => {
      if (line.startsWith("BEGIN:VEVENT")) currentEvent = {};
      if (line.startsWith("DTEND")) {
        const match = line.match(/\d{8}/);
        if (match) {
          const s = match[0];
          currentEvent.end = `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
        }
      }
      if (line.startsWith("END:VEVENT") && currentEvent.end) {
        checkoutDates.push(currentEvent.end);
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json([...new Set(checkoutDates)]);
  } catch (error) {
    res.status(500).json([]);
  }
}
