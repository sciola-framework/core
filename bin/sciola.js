#!/usr/bin/env node

class Sciola {

    /**
     * Class constructor.
     *
     * @access public
     */
    constructor() {
        const arg = require("minimist")(process.argv.slice(2));
        switch (arg["_"][0]) {
          case "install":
            this.install(arg);
            break;
          case "start":
            this.start(arg);
            break;
          default:
            console.log("Invalid parameter.");
        }
    }

    /**
     * Resolve path.
     *
     * @param {String} path
     * @access private
     */
    resolve(path) {
        return require("path").resolve(path);
    }

    /**
     * Check if the app exists.
     *
     * @param {String} path
     * @access private
     */
    checkAppExists(path) {
        path = this.resolve(path);
        if (!require("fs").existsSync(path + "/packages/node_modules/sciola")) {
            console.log("Application not found.");
            return false;
        }
        return true;
    }

    /**
     * Execute commands.
     *
     * @param {String} cmd
     * @param {String} path
     * @param {Function} callback
     * @access private
     */
    exec(cmd, path = "./", callback) {
        require("child_process").exec(cmd, {
          cwd: this.resolve(path)
        }, (error, stdout, stderr) => callback(error, stdout, stderr));
    }

    /**
     * Checks if the port is being listened to.
     *
     * @param {Number} base_port
     * @param {Function} callback
     * @access private
     */
    portfinder(base_port, callback) {
        const portfinder = require("portfinder");
        portfinder.basePort = base_port;
        portfinder.getPort((error, port) => {
            if (error) return console.log(error);
            return (port !== base_port) ? callback(true) : callback(false);
        });
    }

    /**
     * Unzip the .zip file.
     *
     * @param {String} file
     * @param {String} path
     * @param {Function} callback
     * @access private
     */
    decompress(file, path, callback) {
        const decompress = require("decompress");
        decompress(file, path).then(data => {
            require("fs").unlinkSync(file);
            return callback(data);
        });
    }

    /**
     * Rename file.
     *
     * @param {String} file
     * @param {String} output
     * @param {Function} callback
     * @access private
     */
    rename(file, output, callback) {
        require("fs").rename(file, output, error =>
        error ? callback(error) : callback(""));
    }

    /**
     * Get the zipped plugin.
     *
     * @param {String} name
     * @param {String} file
     * @param {Function} callback
     * @access private
     */
    getCompressedPlugin(name, file, callback) {
        this.getPluginURL(name, (error, url) => {
            if (error) return console.log(error);
            if (!url) return console.log("Plugin not found.");
            file = require("fs").createWriteStream(file);
            require("https").get(url, response => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    return callback();
                });
            });
        });
    }

    /**
     * Get the zipped file.
     *
     * @param {String} file
     * @param {Function} callback
     * @access private
     */
    getCompressedFile(file, callback) {
        file = require("fs").createWriteStream(file);
        require("https").get("https://codeload.github.com/sciola-framework" +
                             "/sciola/zip/refs/heads/main", response => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                return callback();
            });
        });
    }

    /**
     * Get plugin URL.
     *
     * @param {String} name
     * @param {Function} callback
     * @access private
     */
    getPluginURL(name, callback) {
        const https = require("https");
        https.get("https://raw.githubusercontent.com" +
                  "/sciola-framework/core/main/plugin.json", response => {
            var url = "";
            response.on("data", data => {
                url = JSON.parse(data)[name];
            });
            response.on("end", () => callback(false, url));
        }).on("error", error => callback(error.message, url));
    }

    /**
     * Add plugin in json file:
     * => path/packages/node_modules/sciola/plugins/composer.json
     * => path/packages/node_modules/sciola/plugins/package.json
     *
     * @param {String} name
     * @param {String} path
     * @param {Function} callback
     * @access private
     */
    addPluginJsonFile(name, path, callback) {
        const fs  = require("fs");
        const src = "./node_modules/@" + name;
        const add = (file, cb) => {
            fs.readFile(path + "/" + file + ".json", "utf8", (error, data) => {
                if (error) return console.log(error);
                data = JSON.parse(data);
                if (file === "composer") {
                    /* ---------------------------------------------------------
                       Checks if the object already exists in the composer.json
                       file to avoid duplication in data.repositories array.
                    */
                    let size = data.repositories.length;
                    for (let i=0; i<size; i++) {
                        if (data.repositories[i].url === src) return cb();
                    } // -------------------------------------------------------
                    data.repositories.push({
                      "type": "path",
                      "url": src,
                      "options": {
                        "symlink": true
                      }
                    });
                    data.require[name] = "@dev";
                } else {
                    data.dependencies["@" + name] = "file:" + src;
                }
                fs.writeFile(path + "/" + file + ".json", JSON.stringify(data),
                "utf8", error => {
                    if (error) return callback(error);
                    return cb();
                });
            });
        };
        add("package", () => add("composer", callback));
    }

    /**
     * Install plugins and packages.
     *
     * @param {Array} arg
     * @access private
     */
    install(arg) {
        const callback = (error, stdout, stderr) => {
            if (error) return console.log(error);
            console.clear();
            console.log("Done!");
        };
        if (arg["plugin"]) {
            const path = arg["plugin"];
            this.exec("npm install", path, (error, stdout, stderr) => {
                if (error) return console.log(error);
                this.exec("node " + path.split("/plugins")[0] +
                "/bin/composer.js install", path, callback);
            });
        } else if (arg["package"]) {
            const path = arg["package"];
            this.exec("npm install sciola", path, callback);
        } else {
            arg["_"][1] ?
            this.installPlugin(arg["_"][1], arg["d"]) :
            this.installPackage();
        }
    }

    /**
     * Start server.
     *
     * @param {Array} arg
     * @access private
     */
    start(arg) {
        arg["_"][1] ? this.server(arg["_"][1], arg["d"]) :
        console.log("Enter interpreter parameter. -> npx sciola start php");
    }

    /**
     * Install plugin.
     *
     * @param {String} name
     * @param {String} path
     * @access private
     */
    installPlugin(name, path = "./") {
        console.clear();
        if (!this.checkAppExists(path)) return;
        path = this.resolve(path) + "/packages/node_modules/sciola/plugins";
        const dir  = path + "/node_modules/@sciola/";
        const file = dir + name;
        if (require("fs").existsSync(file)) {
            return console.log("The " + name + " plugin is already installed.");
        }
        this.getCompressedPlugin(name, file + ".zip", () => {
            console.log("Installing plugin...");
            this.decompress(file + ".zip", dir, data => {
                this.rename(dir + "plugin." + name + "-main", file, error => {
                    if (error) return console.log(error);
                    this.addPluginJsonFile("sciola/" + name, path, error => {
                        if (error) return console.log(error);
                        this.install({
                          "plugin": path
                        });
                    });
                });
            });
        });
    }

    /**
     * Install package.
     *
     * @access private
     */
    installPackage() {
        console.clear();
        const path = this.resolve("./");
        const dir  = path + "/sciola";
        const file = path + "/sciola.zip";
        if (require("fs").existsSync(path + "/sciola")) {
            return console.log("A folder with that name already exists.");
        }
        console.log("Installing packages...");
        this.getCompressedFile(file, () => {
            this.decompress(file, path, data => {
                this.rename(dir + "-main", dir, error => {
                    if (error) return console.log(error);
                    this.install({
                      "package": dir + "/packages"
                    });
                });
            });
        });
    }

    /**
     * Web server.
     *
     * @param {String} interpreter
     * @param {String} path
     * @access private
     */
    server(interpreter, path = "./") {
        path = this.resolve(path);
        if (!this.checkAppExists(path)) return;
        const file = path + "/config/server.ini";
        const fs   = require("fs");
        const exec = (cmd, port) => {
            this.exec(cmd, path, (error, stdout, stderr) => {
                if (error) return console.log(error);
            });
            this.portfinder(port, listening => {
                console.clear();
                console.log(listening ? "Running server..." : "Offline server");
            });
            process.on("SIGINT", () => {
                console.clear();
                console.log("Server stopped");
                process.exit();
            });
        };
        if (fs.existsSync(file)) {
            const config = require("ini").parse(fs.readFileSync(file, "utf-8"));
            switch (interpreter) {
              case "php":
                exec("php -S " + config["PHP"].host + ":" + config["PHP"].port +
                     " -c config/php.ini -t public public/index.php",
                     config["PHP"].port);
                break;
              case "node":
                console.log("Features to be implemented in the future.");
                break;
              default:
                console.log("Invalid interpreter.");
            }
        } else {
            console.log("server.ini file not found.");
        }
    }
}

(function () {
    try {
        const sciola = new Sciola();
    } catch (error) {
        console.log(error);
    }
})();
