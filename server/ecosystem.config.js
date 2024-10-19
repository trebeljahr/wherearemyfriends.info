module.exports = {
  apps: [
    {
      name: "wamf",
      script: "./dist/index.js",
      node_args: "--harmony",
      env: {
        NODE_ENV: "production",
        NODE_VERSION: "20.18.0",
      },
    },
  ],
};
