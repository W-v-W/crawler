var winston = require('winston');
var logger = new (winston.Logger)({
    transports:[
        new (winston.transports.File)({
            name:'info-file',
            filename:'logs/crawler-info.log',
            level:'info'
        }),
        new (winston.transports.File)({
            name:'error-file',
            filename:'logs/crawler-error.log',
            level:'error'
        })
    ]
});

module.exports = logger;
