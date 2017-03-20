var tools = require('./tools');
var winston = require('winston');
var logger = new (winston.Logger)({
    transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name:'info-file',
            filename:'logs/crawler-info.log',
            level:'info',
            maxsize:1024*1024*10,
            timestamp:tools.formatDate,
            colorize:true
        }),
        new (winston.transports.File)({
            name:'error-file',
            filename:'logs/crawler-error.log',
            level:'error'
        })
    ]
});

module.exports = logger;
