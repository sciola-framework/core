#!/usr/bin/env node

(function () {
    try {
        const argv = require("minimist")(process.argv.slice(2));
        if (argv["_"][0] === "install" && !argv["_"][1]) {
            return install();
        } else if (argv["_"][0] === "install" && argv["_"][1]) { // Plugin
            return install(argv["_"][1], argv["d"]);
        } else if (argv["_"][0] === "start" && argv["_"][1]) { // Server
            return server(argv["_"][1], argv["d"]);
        }
    } catch (error) {
        console.log(error);
    }
})();

function install(plugin = "", directory = "./") {
    const fs   = require("fs");
    const path = require("path").resolve(directory);
    directory  = path + (plugin ? "/packages/node_modules/sciola/plugins" : "");
    const pack = url => {
        console.clear();
        console.log("Installing " + (plugin ? "plugin..." : "packages..."));
        const node = "/node_modules/@sciola/";
        const zip  = directory + (plugin ? node + plugin : "/sciola") + ".zip";
        const file = fs.createWriteStream(zip);
        require("https").get(url, response => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                const dir        = directory + (plugin ? node : "");
                const decompress = require("decompress");
                decompress(zip, dir).then(files => {
                file.name = (plugin ? "plugin." + plugin : "/sciola") + "-main";
                    fs.unlinkSync(zip);
                    fs.rename(dir + file.name, dir + (plugin || "/sciola"),
                    error => {
                        if (error) return console.log(error);
                        if (plugin) {
                            fs.readFile(directory + "/package.json", "utf8",
                            (error, data) => {
                                if (error) return console.log(error);
                                let name = "@sciola/" + plugin;
                                let json = JSON.parse(data);
                                json.dependencies[name] =
                                "file:./node_modules/" + name;
                                fs.writeFile(directory + "/package.json",
                                JSON.stringify(json), "utf8", error => {
                                    if (error) return console.log(error);
                                });
                            });
                        }
                        require("child_process")
                        .exec("npm install " + (plugin ? "" : "sciola"),
                        {cwd: plugin ? directory : path + "/sciola/packages"},
                        (error, stdout, stderr) => {
                            if (error) return console.log(error);
                            console.clear();
                            console.log("Done!");
                        });
                    });
                });
            });
        });
    };
    if (plugin) {
        let dir = directory + "/node_modules/@sciola";
        if (fs.existsSync(dir)) {
            return require("https")
            .get("https://raw.githubusercontent.com/" +
                 "sciola-framework/core/main/plugin.json", response => {
                response.on("data", data => {
                    let url = JSON.parse(data.toString());
                    return fs.existsSync(dir + "/" + plugin) ?
                    console.log(`The ${plugin} plugin is already installed.`) :
                    url[plugin] ? pack(url[plugin]) :
                    console.log("Plugin not found.");
                });
            });
        }
        return console.log("Application root directory not found.");
    }
    if (!fs.existsSync(path + "/sciola") &&
        !fs.existsSync(path + "/packages/node_modules/sciola")) {
        return pack("https://codeload.github.com/sciola-framework/sciola/zip/" +
                    "refs/heads/main");
    }
    return console.log("A folder with that name already exists.");
}

function server(interpreter, directory = "./") {
    const fs   = require("fs");
    const path = require("path").resolve(directory);
    const file = path + "/config/server.ini";
    const run  = cmd => {
        console.clear();
        console.log("Running server...");
        require("child_process").exec(cmd, {cwd: path},
        (error, stdout, stderr) => {
            console.clear();
        });
        process.on("SIGINT", () => {
            console.clear();
            console.log("Server stopped");
            process.exit();
        });
    };
    if (fs.existsSync(file)) {
        const ini = () => require("ini").parse(fs.readFileSync(file, "utf-8"));
        if (interpreter === "php") {
            let conf = ini();
            run("php -S " + conf["PHP"].host + ":" + conf["PHP"].port +
                " -c config/php.ini -t public public/index.php");
        } else {
            console.log("Invalid interpreter.");
        }
    } else {
        console.log("The application does not exist.");
    }
}
