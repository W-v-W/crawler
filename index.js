var config = require('./config');

var express = require('express');
var app = express();
var favicon = require('serve-favicon');

var superagent = require('superagent');
var cheerio = require('cheerio');

var eventproxy = require('eventproxy');
var async = require('async');

var url = require('url');

var cnodeUrl = 'https://cnodejs.org';

app.use(favicon(__dirname + '/public/images/favicon.ico'));


// ----------------------------
app.get('/topics', function(req, res){
	
	superagent.get(cnodeUrl)
	.end(function(err, sres){
		if(err){
			return next(err);
		}
		
		var $ = cheerio.load(sres.text);
		var items = [];
		$('#topic_list .topic_title').each(function(idx, element){
			var $ele = $(element);
			/*
			items.push({
				title:$ele.attr('title'),
				href:$ele.attr('href')
			});
			*/
			var href = url.resolve(cnodeUrl, $ele.attr('href'));
			items.push(href);
		});
// 		res.send(items);
		/*
		var ep = new eventproxy();	
		ep.after('topic_html', items.length, function(topics){
			console.log(topics);
			topics = topics.map(function(topic){
				var topicUrl = topic[0];
				var topicHtml = topic[1];
				var $ = cheerio.load(topicHtml);
				return{
					title:$('.topic_full_title').text().trim(),
					href:topicUrl,
					comment1:$('.reply_content').eq(0).text().trim()
				};
			});
			
			res.send(topics);
		});
		
		items.forEach(function(item){
			superagent.get(item)
			.end(function(err, res){
				console.log('Fetch '+item+' successful');
				ep.emit('topic_html', [item, res.text]);
			});
		});
		*/
		
		var startDate = new Date();
		console.log('item count :' + items.length);

		async.mapLimit(items, 10, function(item, callback){

			superagent.get(item)
			.end(function(err, res){
				if(err){
					console.log('Error:' + item);
					//return callback(err);// 如果传入err,则进入结果回调。			
					return callback();
				}

				console.log('GET:' + item);
				var $ = cheerio.load(res.text);
				var title = $('.topic_full_title').eq(0).text().trim();
				var content = $('.markdown-text').eq(0).text().trim();
				var replies = $('.reply_content').map(function(){
					return $(this).text().trim();
				}).get();
				callback(null, {title:title,/*content:content,*/replies:replies});		
			});
		}, function(err, result){
			result = result.filter(n => n);
			console.log('complete:' + result.length 
			+ '\nduration:' + (new Date() - startDate) + 'ms');
			var str = JSON.stringify(result,null,4);
			res
				.set({
					'content-type':'text/json'
				})
				.send(str);
		})
		
	});
});

function fibonacci(n){
	
	if(typeof n != 'number' || isNaN(n)){
		throw new Error('n should be a Number');
	}
	if(n < 0){
		throw new Error('n should >= 0');
	}
	if(n > 30){
		throw new Error('n should <= 30');
	}
	if(n === 0){
		return 0;
	}
	if(n === 1){
		return 1;
	}
	return fibonacci(n-1) + fibonacci(n-2);
	
}

app.get('/fib', function(req, res){
	var n = +(req.query.n);
	try{
		res.send('fib('+n+'):' + fibonacci(n))			
	}catch(e){
		res
		.status(500)
		.send(e.message);
	}
});

app.listen(config.port, function(){
	console.log('App listening on port '+config.port);
});

exports.app = app;
exports.fibonacci = fibonacci;
