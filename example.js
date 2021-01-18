const Log = require("etlogger");

const GcpHandler = require("./index.js");

const handler = new GcpHandler({
    resourceType: "generic_node",

    // The labels can only be ones specific to the resourceType
    labels: {
        node_id: "chori",
    },

    // projectId: "rimbaud-dev0",
    // keyFilename: "/Users/tseago/.rb/logging-dev0.json",
});

Log.addLogHandler(handler);

Log.debug("This is a %s message", "debug");
Log.info("This is a %s message", "info");
Log.warn("This is a %s message", "warn");
Log.error("This is a %s message", "error");

const obj = {
    a: 1,
    b: [ 1, 2, 3],
    c: {
        sub: "value",
    }
};

Log.infoi("An inspected complex object ", obj);
Log.info("A printed complex object %o", obj);

Log.msg({level:"debug", args:["An object >>>%o<<<<", obj], flatten: obj });
