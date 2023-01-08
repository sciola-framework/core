#!/usr/bin/env node
/**
 * Class Sciola
 *
 * @version 1.0.0
 */
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
        path = this.resolve(path) + "/packages/node_modules/sciola";
        if (!require("fs").existsSync(path)) {
            console.clear();
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
     * Message box.
     *
     * @param {String} text
     * @param {String} type
     * @param {String} path
     * @param {Function} callback
     * @access private
     */
    messageBox(text, type, path, callback) {
        path = path + "/packages/node_modules/sciola/bin";
        this.exec("bash msgbox.sh '" + text + "' --" + type, path,
        (error, stdout, stderr) => callback(stdout));
    }

    /**
     * Server status. [online || offline]
     *
     * @param {Number} port
     * @param {String} status
     * @param {String} path
     * @param {Function} callback
     * @access private
     */
    serverStatus(port, status, path, callback) {
        path = path + "/packages/node_modules/sciola/bin";
        this.exec("bash status.sh " + port + " --" + status, path,
        (error, stdout, stderr) => callback(stdout));
    }

    /**
     * Checks if the port is being listened to.
     *
     * @param {Number} base_port
     * @param {Function} callback
     * @access private
     */
    detectPort(port, callback) {
        const detect = require("detect-port");
        detect(port).then(_port => {
            if (port == _port) {
                return callback(false);
            }
            return callback(true);
        }).catch(error => console.log(error));
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
            this.messageBox("Done!", "success",
            (arg["plugin"] || arg["package"]).split("/packages")[0],
            message => console.info(message));
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
            this.messageBox("The " + name + " plugin is already installed.",
            "danger", path.split("/packages")[0],
            message => console.info(message));
            return;
        }
        this.getCompressedPlugin(name, file + ".zip", () => {
            this.messageBox("Installing plugin...", "info",
            path.split("/packages")[0], message => console.info(message));
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
            this.detectPort(port, busy => {
                if (!busy) {
                    this.exec(cmd, path, () => null);
                    this.serverStatus(port, "online", path,
                    message => console.info(message));
                    process.on("SIGINT", () => {
                        this.serverStatus(port, "offline", path, message => {
                            console.info(message);
                            process.exit();
                        });
                    });
                } else {
                    this.messageBox("Port " + port + " is busy", "danger", path,
                    message => console.info(message));
                }
            });
        };
        if (fs.existsSync(file)) {
            const config = require("ini").parse(fs.readFileSync(file, "utf-8"));
            switch (interpreter) {
              case "php":
                exec("php -q -S " +
                     config["PHP"].host + ":" + config["PHP"].port +
                     " -c config/php.ini -t public public/index.php",
                     config["PHP"].port);
                break;
              case "node":
                this.messageBox("Features to be implemented in the future.",
                "info", path, message => console.info(message));
                break;
              default:
                this.messageBox("Invalid interpreter.", "danger", path,
                message => console.info(message));
            }
        } else {
            this.messageBox("server.ini file not found.", "danger", path,
            message => console.info(message));
        }
    }
}

(function () {
    try {
        const sciola = new Sciola();
    } catch (error) {
        return console.log(error);
    }
})();
