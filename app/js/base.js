import $ from 'jquery';
class Base {
    /**
     * [初始化奖金和玩法及说明] Map
     */
    initPlayList(){
        this.play_list.set('r2', {
            bonus: 6,
            tip: '从01～11中任选2个或多个号码，所选号码与开奖号码相同，即中奖6元',
            name: '任二'
        })
        .set('r3', {
            bonus: 19,
            tip: '从01～11中任选3个或多个号码，所选号码与开奖号码相同，即中奖19元',
            name: '任三'
        })
        .set('r4', {
            bonus: 78,
            tip: '从01～11中任选4个或多个号码，所选号码与开奖号码相同，即中奖78元',
            name: '任四'
        })
        .set('r5', {
            bonus: 540,
            tip: '从01～11中任选5个或多个号码，所选号码与开奖号码相同，即中奖540元',
            name: '任五'
        })
        .set('r6', {
            bonus: 90,
            tip: '从01～11中任选6个或多个号码，所选号码与开奖号码相同，即中奖90元',
            name: '任六'
        })
        .set('r7', {
            bonus: 26,
            tip: '从01～11中任选7个或多个号码，所选号码与开奖号码相同，即中奖26元',
            name: '任七'
        })
        .set('r8', {
            bonus: 9,
            tip: '从01～11中任选8个或多个号码，所选号码与开奖号码相同，即中奖9元',
            name: '任八'
        })
    }
    /**
     * [设置选号区数据] Set
     */
    initNumber(){
        for(let i = 1; i < 12; i ++) {
            // 十分符合set数据结构
            this.number.add(('' + i).padStart(2, '0'));
        }
    }
    /**
     * [设置遗漏数据]
     * @param {map} omit 
     */
    setOmit(omit) {
        let self = this;
        // 清空原来的遗留数据
        self.omit.clear();
        // 设置新的遗留数据
        for(let [index, value] of omit.entries()) {
            self.omit.set(index, value);
        }
        // 更新相应挂载点
        $(self.omit_el).each(function(index, item) {
            $(item).text(self.omit(get(index)));
        })
    }
    /**
     * [设置开奖号码]
     * @param {array} code 
     */
    setOpenCode(code) {
        let self = this;
        self.open_code.clear();
        for(let item of code.values()) {
            self.open_code.add(item);
        }
        // 调用更新开奖号码函数
        self.updateOpenCode && self.updateOpenCode.call(self, code);
    }
    
    // 切换号码列表选中样式 
    toggleCodeActive(e) {
        let self = this;
        let $cur = $(e.currentTarget);
        $cur.toggleClass('btn-boll-active');
        // 存在添加 不存在删除
        self.getCount();
    }

    // 切换玩法列表 
    changePlayNav(e) {
        let self = this;
        let $cur = $(e.currentTarget);
        // 样式
        $cur.addClass('active').siblings().removeClass('active');
        // 当前玩法设置更新
        self.cur_play = $cur.attr('desc').toLocaleLowerCase();
        // 玩法提示挂载点更新
        $('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
        // 选号区样式清除
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        // 更新选号区注数金额
        self.getCount();
    }

    // 切换操作区列表
    assistHandle(e){
        e.preventDefault();
        // 取消a标签的默认事件
        let self = this;
        let $cur = $(e.currentTarget);
        let index = $cur.index();
        // 当前dom的index
        $('.boll-list .btn-boll').removeClass('btn-boll-active');

        if( index === 0) {
            $('.boll-list .btn-boll').each(function(index, item) {
                $(item).addClass('btn-boll-active');
            })
        }
        if( index === 1) {
            $('.boll-list .btn-boll').each(function(index, item) {
                if(item.textContent - 5 > 0) {
                    $(item).addClass('btn-boll-active');
                }
            })
        }
        if( index === 2) {
            $('.boll-list .btn-boll').each(function(index, item) {
                if(item.textContent - 6 < 0) {
                    $(item).addClass('btn-boll-active');
                }
            })
        }
        if( index === 3) {
            $('.boll-list .btn-boll').each(function(index, item) {
                if(item.textContent % 2 === 1) {
                    $(item).addClass('btn-boll-active');
                }
            })
        }
        if( index === 4) {
            $('.boll-list .btn-boll').each(function(index, item) {
                if(item.textContent % 2 === 0) {
                    $(item).addClass('btn-boll-active');
                }
            })
        }
    }
    // 获取当前彩票名称
    getName(){
        return this.name;
    }

    // 添加至
    addCode(){
        let self = this;
        // 把激活号码选出
        let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
        // 选中号码数
        let active = $active ? $active.length : 0;
        // 计算注数
        let count = self.computeCount(active, self.cur_play);
        // 如果注数大于0 传入(空格间隔的 选中号码 字符串) (玩法) (玩法名称) (注数)
        // 加入购物车
        if(count > 0) {
            self.addCodeItem($active.join(' '), self.cur_play, self.play_list.get(self.cur_play).name, count);
        }
    }
    /**
     * addCodeItem [添加号码进入购物车]
     * @param {string} code[选中号码字符串]
     * @param {string} type [玩法] 
     * @param {string} typeName [玩法名称]
     * @param {number} count [购买数量]
     */
    addCodeItem(code, type, typeName, count) {
        let self = this;
        const tpl = `
            <li codes="${type}|${code}" bonus="${count + 2}" count="${count}">
                <div class="code">
                    <b>${typeName}${count > 1 ? '复式' : '单式'}</b>
                    <b class="em">${code}</b>
                    [${count}注, <em class="code-list-money">${count * 2}</em>元]
                </div>
            </li>
        `;
        $(self.cart_el).append(tpl);
        self.getTotal();
        // 更新
        // 每次加入之后重新计算购物车总金额
    }

    // 更新选号区注数金额(根据选中列表的长度)
    getCount() {
        let self = this;
        // 获取选中列表
        let active = $('.boll-list .btn-boll-active').length;
        // 计算注数
        let count = self.computeCount(active, self.cur_play);
        // 计算奖金范围
        let range = self.computeBonus(active, self.cur_play);

        // 1注2块钱
        let money = count * 2;
        // 最少赢钱数
        let win1 = range[0] - money;
        // 最多赢钱数
        let win2 = range[1] - money;
        let tpl;
        let c1 = (win1 < 0 && win2 < 0) ? Math.abs(win1) : win1;
        let c2 = (win1 < 0 && win2 < 0) ? Math.abs(win2) : win2;
        // 没选
        if (count === 0) {
            tpl = `您选了 <b class="red">${count}</b> 注, 共 <b class="red">${count * 2}</b> 元`
        } else if (range[0] === range[1]) {// 无范围
            tpl = `您选了 <b>${count}</b> 注, 共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
			    <strong class="red">${range[0]}</strong> 元，
			    您将${win1 >= 0 ? '盈利' : '亏损'}
			    <strong class="${win1 >= 0 ? 'red' : 'green'}">${Math.abs(win1)} </strong> 元</em>`
        } else {// 有范围
            tpl = `您选了 <b>${count}</b> 注，共 <b>${count * 2}</b> 元  <em>若中奖，奖金：
                <strong class="red">${range[0]}</strong> 至 <strong class="red">${range[1]}</strong> 元，
                您将${(win1 < 0 && win2 < 0) ? '亏损 ': '盈利'}
                <strong class="${win1 >= 0 ? 'red' : 'green'}">${c1} </strong>
                至 <strong class="${win2 >= 0 ? 'red' : 'green'}"> ${c2} </strong>
                元</em>`
        }
        $('.sel_info').html(tpl);
    }
    /**
     * [计算购物车总金额]
     */
    getTotal() {
        let count = 0;
        // 我们在addCodeItem 中设置了count属性
        $('.codelist li').each(function(index, item){
            count += $(item).attr('count') * 1;
        })
        // 更新
        $('#count').text(count);
        $('#money').text(count * 2);
    }
    /**
     * [生成机选号码字符串]
     * @param {number} num 
     * @return {string} 
     */
    getRandom(num) {
        let arr = [], index;
        let number = Array.from(this.number);
        // 把选号区数据(Set)转化为一个数组
        while(num --) {             // .xxx - 10.xxx
            index = Number.parseInt(Math.random() * number.length);
            arr.push(number[index]);
            // 取出该数后删除
            number.splice(index, 1);
        }
        return arr.join(' ');
        // 返回number中的 num个不重复的数组成的字符串
    }

    // 机选区事件
    getRandomCode(e) {
        e.preventDefault();
        // 获取机选注数
        let num = e.currentTarget.getAttribute('count');
        // 获取玩法
        let play = this.cur_play.match(/\d+/g);
        // 一组字符串数字
        let self = this;
        if(num === '0') {
            $(self.cart_el).html('')
        }else {
            for(let i = 0; i < num; i ++){
                self.addCodeItem(self.getRandom(play), self.cur_play, self.play_list.get(self.cur_play).name, 1);
            }
        }
    }
}

export default Base;