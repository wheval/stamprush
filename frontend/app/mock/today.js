// Mock data for today's stamp
const todayStamp = {
  name: "Community Stamp",
  description: "This stamp is a special edition for our community members. Claim it before it's gone!",
  location: "Community Center",
  initialTimeLeft: {
    hours: 12,
    minutes: 34,
    seconds: 56,
  },
  initialClaimsRemaining: 123,
  totalClaimed: 456,
  stampType: "special",
  recentClaims: [
    { user: "Alice", time: "2 min ago" },
    { user: "Bob", time: "5 min ago" },
    { user: "Charlie", time: "8 min ago" },
    { user: "Diana", time: "12 min ago" }
  ]
}

export default todayStamp 