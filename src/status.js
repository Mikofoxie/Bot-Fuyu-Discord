require("dotenv/config");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [{ name: `Staring at you and /help` }],
      status: "idle",
    });
  },
};
