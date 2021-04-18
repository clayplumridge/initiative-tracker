const path = require("path");

module.exports = {
    // Build Mode
    mode: "development",
    // Electron Entrypoint
    entry: "./src/main.ts",
    target: "electron-main",
    resolve: {
        // Allows impots in the form of @/render/... etc.
        alias: {
            ["@"]: path.resolve(__dirname, "src")
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: "ts-loader" }]
            }
        ]
    },
    output: {
        path: __dirname + "/dist",
        filename: "main.js"
    }
};
