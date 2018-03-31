var express = require('express');
var router = express.Router();
var mockjs = require('mockjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: 'Express' 
  });
});
// 生成期号
var makeIssue = function(){
  // 获取当前时间
  var date = new Date();
  // 设置当天第1期结束时间 
	var first_issue_date = new Date();
	first_issue_date.setHours(9);
	first_issue_date.setMinutes(10);
  first_issue_date.setSeconds(0);
  // 设置当天最后1期结束时间
	var end_issue_date = new Date(first_issue_date.getTime() + 77 * 10 * 60 * 1000);

  var cur_issue, end_time, state;
  // 这里应该是21:58之前
	if(date.getTime() - first_issue_date.getTime() > 0 && date.getTime() - end_issue_date.getTime() < 0){
		// 正常销售
		var cur_issue_date = new Date();
		cur_issue_date.setHours(9);
		cur_issue_date.setMinutes(0);
    cur_issue_date.setSeconds(0);
    // 获取当前距开始时间
    var minus_time = date.getTime() - cur_issue_date.getTime();
    // 获取当前期号
    var h = Math.ceil(minus_time / 1000 / 60 / 10);
    // 获取当前期号结束时间
    var end_date = new Date(cur_issue_date.getTime() + 1000 * 60 * 10 * h);
    end_time = end_date.getTime();
    //  设置期号            年                         月(截取后两位,兼顾10 11 12)                        日                                  期
		cur_issue = [end_date.getFullYear(), ('0' + (end_date.getMonth() + 1)).slice(-2), ('0' + end_date.getDate()).slice(-2), ('0' + h).slice(-2)].join('')
	} else {
    // 今天销售已截止
    // 设置当日结束时间
		var today_end = new Date();
		today_end.setHours(23);
		today_end.setMinutes(59);
    today_end.setSeconds(59);
    // 如果如果过了22点
		if(today_end.getTime() - date.getTime() < 2 * 60 * 60 * 1000){
      // 把时间设置为第二天9点
			first_issue_date.setDate(date.getDate() + 1);
		}
    end_time = first_issue_date.getTime();
    // 设置为第二天01期                         年                         月                                                      日                 期
		cur_issue = [first_issue_date.getFullYear(),('0' + (first_issue_date.getMonth() + 1)).slice(-2),('0' + first_issue_date.getDate()).slice(-2), '01'].join('')
	}
  var cur_date = new Date();
  // 离结束还有两分钟
	if(end_time - cur_date.getTime() > 1000 * 60 * 2){
		state = '正在销售';
	}else{
		state = '开奖中';
	}
	return {
    // 期号字符串
    issue: cur_issue,
    // 是否开奖
    state: state,
    // 当期结束时间 
		end_time: end_time
	}
}

// 获取遗留数据
router.get('/get/omit', function(req, res, next){
  var data = mockjs.mock({
		'data|11': [/[1-9]{1,3}|0/],// 随机生成11个数组 0 － 999
		'issue': /[1-9]{8}/ // 1 - 99999999
  })
  console.log(data);
	res.json(data);
})

// 获取开奖号码
router.get('/get/opencode',function(req,res,next){
	var issue = makeIssue().issue;
	var data = mockjs.mock({
    // 随机生成开奖号码
		'data':[/[1-3]/,/[4-5]/,/[6-7]/,/[8-9]/,/1[0-1]/]
  }).data;
  
	res.json({
		issue: issue,
		data: data
	})
})
// 获取当前期号信息
router.get('/get/state/',function(req,res,next){
  var state = makeIssue();
	res.json(state);
})

module.exports = router;
