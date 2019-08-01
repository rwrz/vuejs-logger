"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_levels_1 = require("./enum/log-levels");
var VueLogger = /** @class */ (function () {
    function VueLogger() {
        this.errorMessage = "Provided options for vuejs-logger are not valid.";
        this.logLevels = Object.keys(log_levels_1.LogLevels).map(function (l) { return l.toLowerCase(); });
    }
    VueLogger.prototype.install = function (Vue, options) {
        options = Object.assign(this.getDefaultOptions(), options);
        if (this.isValidOptions(options, this.logLevels)) {
            Vue.$log = this.initLoggerInstance(options, this.logLevels);
            Vue.prototype.$log = Vue.$log;
        }
        else {
            throw new Error(this.errorMessage);
        }
    };
    VueLogger.prototype.isValidOptions = function (options, logLevels) {
        if (!(options.logLevel && typeof options.logLevel === "string" && logLevels.indexOf(options.logLevel) > -1)) {
            return false;
        }
        if (options.stringifyArguments && typeof options.stringifyArguments !== "boolean") {
            return false;
        }
        if (options.showLogLevel && typeof options.showLogLevel !== "boolean") {
            return false;
        }
        if (options.showConsoleColors && typeof options.showConsoleColors !== "boolean") {
            return false;
        }
        if (options.separator && (typeof options.separator !== "string" || (typeof options.separator === "string" && options.separator.length > 3))) {
            return false;
        }
        if (typeof options.isEnabled !== "boolean") {
            return false;
        }
        if (options.printLogOnConsole && (typeof options.printLogOnConsole !== "boolean")) {
            return false;
        }
        if (options.customPrintLogMessage && (typeof options.customPrintLogMessage !== "function")) {
            return false;
        }
        return !(options.showMethodName && typeof options.showMethodName !== "boolean");
    };
    VueLogger.prototype.getMethodName = function () {
        var error = {};
        try {
            throw new Error("");
        }
        catch (e) {
            error = e;
        }
        // IE9 does not have .stack property
        if (error.stack === undefined) {
            return "";
        }
        var stackTrace = error.stack.split("\n")[3];
        if (/ /.test(stackTrace)) {
            stackTrace = stackTrace.trim().split(" ")[1];
        }
        if (stackTrace && stackTrace.indexOf(".") > -1) {
            stackTrace = stackTrace.split(".")[1];
        }
        return stackTrace;
    };
    VueLogger.prototype.initLoggerInstance = function (options, logLevels) {
        var _this = this;
        var logger = {};
        logLevels.forEach(function (logLevel) {
            if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel) && options.isEnabled) {
                logger[logLevel] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var methodName = _this.getMethodName();
                    var methodNamePrefix = options.showMethodName ? methodName + (" " + options.separator + " ") : "";
                    var logLevelPrefix = options.showLogLevel ? logLevel + (" " + options.separator + " ") : "";
                    var formattedArguments = options.stringifyArguments ? args.map(function (a) { return JSON.stringify(a); }) : args;
                    var logMessage = logLevelPrefix + " " + methodNamePrefix;
                    if (options.customPrintLogMessage) {
                        options.customPrintLogMessage(logLevel, logMessage, options.showConsoleColors, formattedArguments);
                    }
                    if (options.printLogOnConsole) {
                        _this.printLogMessage(logLevel, logMessage, options.showConsoleColors, formattedArguments);
                    }
                    return logMessage + " " + formattedArguments.toString();
                };
            }
            else {
                logger[logLevel] = function () { return undefined; };
            }
        });
        return logger;
    };
    VueLogger.prototype.printLogMessage = function (logLevel, logMessage, showConsoleColors, formattedArguments) {
        if (showConsoleColors && (logLevel === "warn" || logLevel === "error" || logLevel === "fatal")) {
            console[logLevel === "fatal" ? "error" : logLevel].apply(console, [logMessage].concat(formattedArguments));
        }
        else {
            console.log.apply(console, [logMessage].concat(formattedArguments));
        }
    };
    VueLogger.prototype.getDefaultOptions = function () {
        return {
            isEnabled: true,
            logLevel: log_levels_1.LogLevels.DEBUG,
            separator: "|",
            showConsoleColors: false,
            showLogLevel: false,
            showMethodName: false,
            stringifyArguments: false,
            printLogOnConsole: true,
            customPrintLogMessage: null
        };
    };
    return VueLogger;
}());
exports.default = new VueLogger();
//# sourceMappingURL=vue-logger.js.map