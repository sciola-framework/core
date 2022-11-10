function sciola () {

(function () {



try {
    module.exports = {
        sciola: require("./node_modules/sciola")
    };
} catch (error) {
    module.exports = {
        sciola: () => {
            if (error.code === "MODULE_NOT_FOUND") {
                console.clear();
                console.log("Installing packages...");
                /*const exec = require("child_process").exec;
                exec("npm install sciola", {
                        cwd: __dirname
                    }, (error, stdout, stderr) => {
                    console.clear();
                    console.log(stdout);
                });*/
            }
        }
    };
}





    /*
    | --------------------------------------------------------------------------
    | Console message
    | --------------------------------------------------------------------------
    */
    const shell = require("./shell");
    shell.msgbox("Server starting...", "info");
    /*
    | --------------------------------------------------------------------------
    | Paths
    | --------------------------------------------------------------------------
    */
    const caller = () => {
        var original_func = Error.prepareStackTrace;
        var caller_file;
        try {
            var err = new Error();
            var current_file;
            Error.prepareStackTrace = function (err, stack) { return stack; };
            current_file = err.stack.shift().getFileName();
            while (err.stack.length) {
                caller_file = err.stack.shift().getFileName();
                if(current_file !== caller_file) break;
            }
        } catch (e) {}
        Error.prepareStackTrace = original_func; 
        return caller_file;
    };
    const path            = require("path");
    global.APP_PATH       = path.dirname(caller());
    global.MOD_PATH       = APP_PATH + "/modules";
    global.CACHE_PATH     = APP_PATH + "/writable/cache";
    process.env.NODE_PATH = MOD_PATH + "/global/packages/node_modules";
    const init_paths      = require("module").Module._initPaths();
    const module_alias    = require("module-alias");
    module_alias.addPath(MOD_PATH + "/global/packages");
    /*
    | --------------------------------------------------------------------------
    | Wrapper
    | --------------------------------------------------------------------------
    */
    (function () {
        var $_ = [];
        $_["http"]      = require("./http");
        $_["directory"] = require("./directory");
        $_["file"]      = require("./file");
        $_["symlink"]   = require("./symlink");
        $_["time"]      = require("./time");
        global.$ = fnc => {
            return $_[fnc];
        };
    })();
    /*
    | --------------------------------------------------------------------------
    | Configuration
    | --------------------------------------------------------------------------
    */
    const config = $("file").include_yaml(APP_PATH + "/config.yaml");
    /*
    | --------------------------------------------------------------------------
    | Template
    | --------------------------------------------------------------------------
    */
    const ejs = require("ejs");
    /*
    | --------------------------------------------------------------------------
    | Cache
    | --------------------------------------------------------------------------
    */
    (function () {
        const lru_cache = require("lru-cache");
        global.cache    = new lru_cache(100);
        ejs.cache       = new lru_cache(100);
        if (config.application.dev_mode === true) {
            cache.reset();
            ejs.cache.reset();
            ejs.clearCache();
            $("directory").remove(APP_PATH + "/writable/temp");
            $("directory").create(APP_PATH + "/writable/temp");
            $("directory").remove(CACHE_PATH);
            $("directory").create(CACHE_PATH);
        }
    })();
    /*
    | --------------------------------------------------------------------------
    | Create menu.json file in cache
    | --------------------------------------------------------------------------
    */
    (function () {
        var menu = {};
        $("directory").read(MOD_PATH).forEach(name => {
            if (name !== "global") {
                let path = MOD_PATH + "/" + name + "/config.yaml";
                if ($("file").exists(path)) {
                    menu[name] = $("file").include_yaml(path).title || name;
                }
            }
        });
        $("file").create(CACHE_PATH + "/menu.json", JSON.stringify(menu));
    })();
    /*
    | --------------------------------------------------------------------------
    | Create symbolic link
    | --------------------------------------------------------------------------
    */
    (function () {
        const PACKS_PATH = MOD_PATH + "/global/packages";
        // Remove broken symbolic link.
        $("directory").read(PACKS_PATH).forEach(name => {
            if ($("symlink").broken(PACKS_PATH + "/" + name)) {
                $("symlink").remove(PACKS_PATH + "/" + name);
            }
        });
        $("directory").read(MOD_PATH).forEach(name => {
            if (name !== "global") {
                if (!$("symlink").exists(PACKS_PATH + "/@" + name)) {
                    $("symlink").create(MOD_PATH + "/" + name + "/packages",
                                        PACKS_PATH + "/@" + name);
                }
            }
        });
        // Create symbolic link of public packages.
        const public_packages = dir => {
            let path = APP_PATH + "/public/packages",
                json = PACKS_PATH;
            if (dir === "system") {
                dir   = "";
                json += "/node_modules/jnex/public.json";
            } else if (dir === "global") {
                dir   = "";
                json += "/public.json";
            } else {
                path += "/" + dir;
                json += "/" + dir + "/public.json";
            }
            if ($("file").exists(json)) {
                let dependencies = require(json).dependencies;
                if (Object.values(dependencies).length > 0) {
                    Object.values(dependencies).forEach(name => {
                        if (!$("symlink").exists(path + "/" + name)) {
                            let pack = PACKS_PATH + "/" + dir + "/" + name;
                            if (!$("file").exists(pack)) {
                                pack = PACKS_PATH + "/" + dir +
                                       "/node_modules/" + name;
                            }
                            if ($("file").exists(pack)) {
                                if (name.charAt(0) === "@") {
                                    $("directory").create(path + "/" +
                                                          name.split("/")[0]);
                                }
                                $("symlink").create(pack, path + "/" + name);
                            }
                        }
                    });
                }
            }
        };
        public_packages("system");
        public_packages("global");
        $("directory").read(PACKS_PATH).forEach(dir => {
            if (dir.charAt(0) === "@") {
                public_packages(dir);
            }
        });
    })();
    /*
    | --------------------------------------------------------------------------
    | Generates cached translation file and includes
    | --------------------------------------------------------------------------
    */
    function language(module) {
        const language = config.application.language;
        if (language !== null) {
            let lang_cache = CACHE_PATH + "/languages/" + module,
                json_file  = "",
                generate   = () => {
                    let path = MOD_PATH + "/" +
                               module + "/languages/" + language;
                    if ($("directory").exists(path)) {
                        let list = $("directory").require(path, {
                                     noCache: true
                                   }),
                            data = {};
                        Object.values(list).forEach(result => {
                            data = Object.assign(data, result);
                        });
                        $("directory").create(lang_cache);
                        $("file").create(json_file, JSON.stringify(data));
                        return true;
                    }
                    return false;
                };
            json_file = lang_cache + "/" + language + ".json";
            if ($("file").exists(json_file)) {
                if (config.application.dev_mode === true) {
                    $("file").remove(json_file);
                } else {
                    return require(json_file);
                }
            }
            if (generate()) {
                return require(json_file);
            }
        }
        return {};
    }
    (function () {
        let lang = config.application.language,
            path = __dirname + "/languages/" + lang;
        if ($("directory").exists(path)) {
            let list = $("directory").require(path, {
                         noCache: true
                       }),
                data = {};
            Object.values(list).forEach(result => {
                data = Object.assign(data, result);
            });
            // The global translation file is shared with all modules.
            data = Object.assign(data, language("global"))
            cache.set("global_language", data);
        }
    })();
    /*
    | --------------------------------------------------------------------------
    | Connection
    | --------------------------------------------------------------------------
    */
    global.connection = type => {
        if (config.connection.database !== null && type === "sequelize") {
            global.Sequelize = require("sequelize");
            return new Sequelize(
              config.connection.database,
              config.connection.username,
              config.connection.password, {
                host: config.connection.host,
                port: config.connection.port,
                dialect: config.connection.driver,
                storage: APP_PATH + "/writable/database/" +
                         config.connection.database + ".sqlite",
                logging: false,
                define: {
                  charset: config.connection.charset,
                  collate: config.connection.collate,
                  timestamps: true,
                  underscored: true
                }
            });
        }
        if (config.connection.mongodb.database !== null && type === "mongodb") {
            if (config.connection.mongodb.port === null) {
                config.connection.mongodb.port = 27017;
            }
            let mongojs  = require("mongojs"),
                _config  = "mongodb://";
                _config += config.connection.mongodb.username + ":";
                _config += config.connection.mongodb.password + "@";
                _config += config.connection.mongodb.host + ":";
                _config += config.connection.mongodb.port + "/";
                _config += config.connection.mongodb.database;
                return mongojs(_config);
        }
    };
    /*
    | --------------------------------------------------------------------------
    | Check port
    | --------------------------------------------------------------------------
    */
    const portfinder = require("portfinder");
    if (config.server.port === null) {
        config.server.port = 3000;
    }
    portfinder.basePort = config.server.port;
    portfinder.getPort((err, port) => {
        if (port !== config.server.port) {
            shell.msgbox("Port " + config.server.port + " is busy!", "danger");
            process.exit();
        }
    });
    /*
    | --------------------------------------------------------------------------
    | Server
    | --------------------------------------------------------------------------
    */
    const mvc         = require("./mvc");
    const cors        = require("cors");
    const helmet      = require("helmet");
    const express     = require("express");
    const body_parser = require("body-parser");
    const server      = express();
    server.use(helmet());
    server.use(cors());
    server.use(body_parser.urlencoded({extended: false}));
    server.use(body_parser.json());
    server.disable("x-powered-by");
    server.engine("ejs", ejs.renderFile);
    server.set("view engine", "ejs");
    if (config.server.public_dir === true) {
        const ecstatic = require("ecstatic");
        server.use("/", ecstatic({root: APP_PATH + "/public", showdir: false}));
    }
    server.use((req, res, next) => {
        if (config.application.dev_mode === true) {
            res.setHeader("Cache-Control",
                          "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
        }
        res.data          = {};
        res.data.language = config.application.language   || "en";
        res.data.charset  = config.application.charset    || "UTF-8";
        res.data.title    = config.application.title      || "Jnex";
        res.data.module   = req.originalUrl.split("/")[1] || "global";
        res.data.styles   = __dirname + "/templates/includes/styles.ejs";
        res.data.scripts  = __dirname + "/templates/includes/scripts.ejs";
        res.data.menu     = require(CACHE_PATH + "/menu.json");
        res.locals        = mvc.view.functions;
        server.response   = res;
        next();
    });
    if (config.application.dev_mode === true) {
        server.use(require("express-status-monitor")({
          title: "Status",
          path: "/system/information/status"
        }));
        server.disable("view cache");
    }
    server.listen(config.server.port, "localhost", function () {
        shell.status(this.address().port, "online");
        process.on("SIGINT", () => {
            shell.status(this.address().port, "offline");
            process.exit();
        });
    });
    /*
    | --------------------------------------------------------------------------
    | MVC
    | --------------------------------------------------------------------------
    */
    const include = (module, layer, file) => {
        file = MOD_PATH + "/" + module + "/layers/" + layer + "/" + file;
        if (layer === "Views") {
            return file;
        }
        var $Class = require(file);
        return new $Class;
    };
    global.model = file => {
        return include(server.response.data.module, "Models", file);
    };
    global.view = (file, data = {}) => {
        if (file === "@json") {
            server.response.setHeader("content-type", "application/json");
            return server.response.send(data);
        }
        if (file === "@text") {
            server.response.setHeader("content-type", "text/plain");
            return server.response.send(data);
        }
        if (file === "@html") {
            server.response.setHeader("content-type", "text/html");
            return server.response.send(data);
        }
        file = include(server.response.data.module, "Views", file);
        return server.response.render(file, data);
    };
    global.controller = file => {
        if (server.response.data.module !== "global") {
            cache.set("module_language", language(server.response.data.module));
        }
        return include(server.response.data.module, "Controllers", file);
    };
    global.Model      = mvc.model;
    global.Controller = mvc.controller;
    /*
    | --------------------------------------------------------------------------
    | Routes
    | --------------------------------------------------------------------------
    */
    global.Route = null;
    $("directory").read(MOD_PATH).forEach(module => {
        Route = express.Router();
        if ($("directory").exists(MOD_PATH + "/" + module + "/routes")) {
            $("directory").require(MOD_PATH + "/" + module + "/routes", {
                noCache: config.application.dev_mode
            });
            Route.stack.forEach(function (r) {
                if (module === "global" && r.route.path === "/") {
                    server.get("/", r.route.stack[0].handle);
                }
            });
            server.use("/" + module, Route);
        }
    });
    Route = express.Router();
    require(__dirname + "/routes");
    server.use("/system", Route);
    /*
    | --------------------------------------------------------------------------
    | Errors
    | --------------------------------------------------------------------------
    */
    server.use((req, res, next) => {
        res.status(404).render(__dirname + "/templates/information/errors", {
          code: 404,
          title: "Not Found",
          message: "Unable to find the requested resource.",
          url: req.originalUrl
        });
    });
})();

}
