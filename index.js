const ETLogger = require("etlogger");

const {Logging} = require('@google-cloud/logging');

// See https://cloud.google.com/logging/docs/reference/libraries
class GcpHandler {
    constructor(opts) {
        this.cfg = Object.assign({
            projectId: null,
            keyFilename: null,

            structured: true,
            logName: "_Default",
            resourceType: "global", // if anything other than global then there will be specific label requirements
            labels: {}, // key/value pairs - you can't actually pass unexpected things here
        }, opts);

        let credentials = undefined;
        if (this.cfg.projectId && this.cfg.keyFilename) {
            credentials = {
                projectId: this.cfg.projectId,
                keyFilename: this.cfg.keyFilename,
            };
        } else {
            if (process.env.NODE_ENV !== "production" && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                ETLogger.logFromHandler(this, "GOOGLE_APPLICATION_CREDENTIALS is not set. Default credentials are probably missing.");
            }
        }

        // ETLogger.logFromHandler(this, "GcpLogger Config = ", this.cfg);
        // ETLogger.logFromHandler(this, "Credentials = ", credentials);

        this._logging = new Logging(credentials);
        this._log = this._logging.log(this.cfg.logName);

    }

    handleLog(logMsg) {
        const metadata = {
            resource: {
                type: this.cfg.resourceType,
                labels: this.cfg.labels,
            },
        }

        // TODO: Test the performance impact of a switch lookup table vs. a dictionary based one.
        metadata.severity = "DEFAULT";
        switch (logMsg.level) {
        case logMsg.logger.LEVEL_ERROR:
            metadata.severity = "ERROR";
            break;

        case logMsg.logger.LEVEL_WARN:
            metadata.severity = "WARNING";
            break;

        case logMsg.logger.LEVEL_INFO:
            metadata.severity = "INFO";
            break;

        case logMsg.logger.LEVEL_DEBUG:
            metadata.severity = "DEBUG";
            break;
        }


        // Learning about the timestamp value. Looks like adding it to the
        // metadata as a Date object really does work properly

        const msg = logMsg.getPlainMessage();
        // const msg = `${logMsg.getPlainMessage()} @ ${logMsg.date.toString()}`;

        metadata.timestamp = logMsg.date;
        // metadata.timestamp = new Date(logMsg.date.valueOf() + 10000);

        // TODO: Look into including flatten objects in the json data
        // At the moment it looks like we probably need to duplicate
        // a bunch of code from the formatters to duplicate the
        // flattenLastArg stuff...
        let entry;
        if (this.cfg.structured) {
            const data = {
                logText: msg,
                args: logMsg.args,
            };
            if (logMsg.flatten) {
                data.flatten = logMsg.flatten;
            }
            entry = this._log.entry(metadata, data);
        } else {
            // Unstructured, just the text
            entry = this._log.entry(metadata, msg);
        }

        this._log.write(entry);
        // ETLogger.logFromHandler(this, "GCP Wrote: ", entry);
    }
}


module.exports = GcpHandler;
