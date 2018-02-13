
var throng = require('throng');
var logSymbols = require('log-symbols');

var WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
    workers: WORKERS,
    master:  startMaster,
    start:   startWorker
});

function startMaster() {
  console.log(`${logSymbols.success} Started master`);
}

function startWorker(id) {
    require('./dist/index.js');
    console.log(`${logSymbols.success} Started worker ${id}`);
    process.on('SIGTERM', () => {
        console.log(`${logSymbols.success} Worker ${id} exiting...`);
        process.exit();
    });
}
