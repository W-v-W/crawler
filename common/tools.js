var moment = require('moment');
moment.locale('zh-cn');

/*
 * 日间格式化
  */
exports.formatDate = function (date, friendly) {
	date = moment(date);
	if(friendly){
		return date.fromNow();
	}else{
	  	return date.format('YYYY-MM-DD HH:mm:ss SSS');
	}
};
