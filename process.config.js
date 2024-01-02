module.exports = {
  apps: [
    {
      name: "KIDS_STORE",
      cwd: "./",
      script: "./server.js",
      watch: true,
      ignore_watch: ["uploads"],
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
