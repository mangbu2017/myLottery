import 'babel-polyfill';
import $ from 'jquery';
import Base from './base.js';
import Calculate from './calculate.js';
import Timer from './timer.js';
import Mock from './mock.js';

// es6 mixin 实现可序列化
// 深度拷贝
const deepCopy = function(target, source) { 
    // 可以返回 Sybmol类型
    for(let key of Reflect.ownKeys(source)){
        // 构造器不要 原型不要 name属性不要 
        if(key !== 'constructor' && key !== 'prototype' && key !== 'name'){
            let desc = Object.getOwnPropertyDescriptor(source, key);
            // 获取并设置属性描述对象
            Object.defineProperty(target, key, desc);
        }
    }
}

// 多重继承
const mix = function(...mixins) {
    class Mix{}
    for(let mixin of mixins){
        deepCopy(Mix, mixin);
        deepCopy(Mix.prototype, mixin.prototype);
    }
    return Mix;
}

class Lottery extends mix(Base, Calculate, Mock, Timer) {
    constructor(name = 'syy',cname = '11选5', issue = '**', state = "**"){
        super();
        this.name = name; // 也基本上没用
        this.cname = cname; // 根本没用上
        // 彩票名称
        this.issue = issue;
        // 当前期数字符串
        this.state = state;
        // 是否开奖
        this.el = '';// 然而根本没用上
        this.omit = new Map();
        // 遗留号码 数值对应每个number
        this.open_code = new Set();
        // 开奖号码
        this.open_code_list = new Set(); // 根本没用上
        // 开奖历史纪录
        this.play_list = new Map();
        // 玩法列表
        this.number = new Set();
        // 选号区数据
        this.issue_el = '#curr_issue';
        // 期号挂载
        this.countdown_el = '#countdown';
        // 计时器挂载元素
        this.state_el = '.state_el';
        // 是否开奖挂载元素
        this.cart_el = '.codelist';
        // 购物车挂载函数
        this.omit_el = '';
        // 遗留号码挂载元素
        this.cur_play = 'r5';
        // 当前玩法挂载元素
        this.initPlayList();
        // 初始化玩法列表
        this.initNumber();
        // 初始化号码列表
        this.updateState();
        // 更新时间信息函数启动
        this.initEvent();
        // 初始化所有事件
    }
    
    // 更新时间信息函数

    updateState(){
        let self = this;
        this.getState()// 获取最新的 期数字符串 是否开奖 以及本期结束时间
            .then(function(res){
                // 将数据赋值到this对象上
                self.issue = res.issue;
                self.end_time = res.end_time;
                self.state = res.state;
                $(self.issue_el).text(res.issue);
                // countDown 传入三个参数 本期结束时间 本期未结束回调 本期结束回调
                self.countDown(res.end_time, function(time){
                    $(self.countdown_el).html(time);
                }, function(){
                    // 传入的进入下一期时触发的函数
                    setTimeout(function () {
                        // 间隔500毫秒重新触发 更新时间信息函数
                        self.updateState();
                        self.getOmit(self.issue).then(function(res){
                            console.log(res);
                            console.log(111);
                        });
                        self.getOpenCode(self.issue).then(function(res){

                        })
                    }, 500);
                })
            })
    }

    // 初始化监听函数
    initEvent(){
        let self = this;
        // 我们事件是绑定在ul上 委托是委托在li上
        $('#plays').on('click', 'li', self.changePlayNav.bind(self));
        // 选号区列表  div.boll-list ul li em.btn-boll span  
        $('.boll-list').on('click', '.btn-boll', self.toggleCodeActive.bind(self));
        // 绑定确认选号事件
        $('#confirm_sel_code').on('click', self.addCode.bind(self));
        // 操作区 ul.dxjo li a 
        $('.dxjo').on('click', 'li', self.assistHandle.bind(self));
        // 机选   div.qkmethod ul li a.btn-middle 
        $('.qkmethod').on('click', '.btn-middle', self.getRandomCode.bind(self));
    }
}

const lottery = new Lottery();

