module.exports = ({ env }) => ({
  websocket: {
    enabled: true,
    config: {
      path: '/ws',
      serveClient: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
      }
    }
  }
});
