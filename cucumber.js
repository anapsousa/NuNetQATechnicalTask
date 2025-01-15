module.exports = {
    default: [
      "--require-module ts-node/register",
      "--require ./features/steps/**/*.ts", // Path to step definitions
      "./features/**/*.feature" // Path to feature files
    ].join(" "),
  };
  