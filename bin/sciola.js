#!/usr/bin/env node

(function () {
    try {
        const argv = require("minimist")(process.argv.slice(2));
        if (argv["_"][0] === "install" && !argv["_"][1]) {
            return install();
        } else if (argv["_"][0] === "server" && !argv["_"][1]) {
            return server();
        }
    } catch (error) {
        console.log(error);
    }
})();

function install() {
    const fs = require("fs");
    if (!fs.existsSync("./sciola")) {
        console.clear();
        console.log("Installing packages...");
        const url     = "https://codeload.github.com/sciola-" +
                        "framework/sciola/zip/refs/heads/main";
        const https   = require("https");
        const file    = fs.createWriteStream("./sciola.zip");
        const request = https.get(url, response => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                const decompress = require("decompress");
                decompress("./sciola.zip", "./").then(files => {
                    fs.unlinkSync("./sciola.zip");
                    fs.rename("./sciola-main", "./sciola", error => {
                        if (error) {
                            throw error;
                        } else {
                            const exec = require("child_process").exec;
                            exec("npm install sciola",
                            {cwd: "./sciola/packages"},
                            (error, stdout, stderr) => {
                                console.clear();
                                console.log("Done!");
                            });
                        }
                    });
                });
            });
        });
    } else {
        console.log("A folder with that name already exists.");
    }
}

function server() {
    const fs   = require("fs");
    const ini  = require("ini");
    const exec = require("child_process").exec;
    const dev  = ini.parse(fs.readFileSync("./config/dev.ini", "utf-8")).SERVER;
    exec("php -S " + dev.host + ":" + dev.port + " -t public public/index.php",
    {cwd: "./"}, (error, stdout, stderr) => console.clear());
}
