module.exports = {
  apps: [
    {
      name: "wamf",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
      },
      interpreter: "/usr/bin/node",
      //   interpreter: "node@20.18.0",
    },
  ],
};
