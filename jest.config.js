const { defaults } = require("jest-config");

module.exports = {
    testEnvironment: "node",
    transform: {},
    moduleFileExtensions: [...defaults.moduleFileExtensions],
    testMatch: ["**/*.spec.ts"],
    coveragePathIgnorePatterns: ["/node_modules/"],
    verbose: true,
    preset: "ts-jest",
    extensionsToTreatAsEsm: [".ts"]
};
