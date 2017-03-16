var config = require('./config');

var express = require('express');
var app = express();

var superagent = require('superagent');
var cheerio = require('cheerio');

var eventproxy = require('eventproxy');

var url = require('url');

var async = require('async');

var cnodeUrl = 'https://cnodejs.org';
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
		
		var concurrencyCount = 0;
		console.log('total count :' + items.length);
		async.mapLimit(items, 5, function(item, callback){
			concurrencyCount ++;
			var startDate = new Date();
			superagent.get(item)
			.end(function(err, res){
				if(err){
					return console.log(err);
				}
				var duration = new Date() - startDate;
				console.log("并发数：" + concurrencyCount + '　耗时：' + duration);
				var $ = cheerio.load(res.text);
				var title = $('.topic_full_title').eq(0).text().trim();
				var content = $('.markdown-text').eq(0).text().trim();
				var replies = $('.reply_content').map(function(){
					return $(this).text().trim();
				}).get();
				callback(null, {title:title,/*content:content,*/replies:replies});		
				concurrencyCount --;		
			});
		}, function(err, result){
			console.log('Final!');
			var str = JSON.stringify(result,null,4);
			res
				.set({
					'content-type':'text/json'
				})
				.send('<pre>'+str+'</pre>');
		})
		
	});
});



app.listen(config.port, function(){
	console.log('App listening on port '+config.port);
});
