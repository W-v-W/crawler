var tools = require('./tools');
var winston = require('winston');
var path = require('path');

var logger = new (winston.Logger)({
    transports:[
        new (winston.transports.Console)({
            name:'console',
            timestamp:tools.formatDate,
            level:'debug',
            colorize:true
        }),
        new (winston.transports.File)({
            name:'info-file',
            filename: path.resolve(__dirname, '../logs/crawler-info.log'),
            level:'info',
            maxsize:1024*1024*10,
            timestamp:tools.formatDate
        }),
        new (winston.transports.File)({
            name:'error-file',
            filename: path.resolve(__dirname, '../logs/crawler-error.log'),
            level:'error',
            maxsize:1024*1024*10,
            timestamp:tools.formatDate
        })
    ]
});

module.exports = logger;
