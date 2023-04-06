require("dotenv/config");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [{ name: `Arcaea and /help` }],
      status: "idle",
    });
  },
};
