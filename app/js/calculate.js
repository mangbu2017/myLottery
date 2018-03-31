// 彩票玩法相关计算
class Calculate{
    /**
     * [计算注数]
     * @param {number} active [玩家选择的号码]
     * @param {string} play_name [玩家选择的玩法]
     */
    computeCount(active, play_name) {
        // 我们选了5个 玩法是任2
        // 5个中选2个的组合
        let count = 0;
        const exist = this.play_list.has(play_name);
        const arr = new Array(active).fill('0');
        // 组合玩法
        if(exist && play_name.at(0) === 'r') {
            // 这里不需要具体组合列表 只需要组合的种类数
            count = Calculate.combine(arr, play_name.split('')[1]).length;
        }
        return count;
    }
    /**
     * [奖金范围预测]
     * @param {number} active [玩家选择的号码列表]
     * @param {string} play_name 
     * @return {array} 
     */
    computeBonus(active, play_name) {
        const play = play_name.split('');
        const self = this;
        let arr = new Array(play[1]*1).fill(0);
        let min, max;
        if (play[0] === 'r') {
            // 定义最小命中数 
            // 11个数 中奖的是5个
            // 5减去我们没选的 剩的就是 肯定中的
            let min_ative = 5 - (11 - active);
            if (min_ative > 0) {
                if(min_ative - play[1] >= 0) {
                    arr = new Array(min_ative).fill(0);
                    min = Calculate.combine(arr, play[1]).length;
                }else {
                    if(play[1] - 5 > 0 && active - play[1] >= 0) {
                        // 5钟全都中了 我们只需要组合出 多余的 玩法 在 多余的 已选中 的排列就行
                        arr = new Array(active - 5).fill(0);
                        min = Calculate.combine(arr, play[1] - 5).length;
                    } else {
                        // 抛除上面的情况 选中的如果和玩法一样 或者多于玩法 那么就设置为1 不然为0
                        min = active - play[1] > -1 ? 1 : 0;
                    }
                }
            }else{
                min = active - play[1] > -1 ? 1 : 0;
            }

            let max_active = Math.min(active, 5);
            if(play[1] - 5 > 0) {
                if(active - play[1] >= 0) {
                    arr = new Array(active - 5).fill(0);
                    max = Calculate.combine(arr, play[1] - 5).length;
                }else {
                    max = 0;
                }
            }else if (play[1] - 5 < 0) {
                arr = new Array(Math.min(active, 5)).fill(0);
                max = Calculate.combine(arr, play[1]).length;
            }else {
                max = 1;
            }
        }
        return [min, max].map(item => item * self.play_list.get(play_name).bonus);
    }
    /**
     * [计算组合种类]
     * @param {array} arr 
     * @param {number} state 
     * @return {number} 
     */
    // 递归起到一个组合的作用
    // for循环起到一个向后移位的作用
    static combine(arr, state) {
        let allResult = [];
        let n = 1;
        // 该函数的功能是 传入 两个array 一个number
        (function f(arr, size, result){
            let arrLen = arr.length;
            // 无法组合 返回 空数组
            if(size > arrLen){
                return;
            }
            // 底数和基数相同
            if(size === arrLen) {
                // 把新数组和传入的结果相连
                allResult.push([].concat(result, arr));
            }else {
                // 对数组进行一次循环    
                for(let i = 0; i < arrLen; i ++) {
                    let newResult = [].concat(result);
                    newResult.push(arr[i]);
                    if(size === 1){
                        allResult.push(newResult);
                    }else {
                        let newArr = [].concat(arr);
                        newArr.splice(0, i + 1);
                        f(newArr, size - 1, newResult);
                    }
                }
            }
        })(arr, state, []);

        return allResult;
    }
}

export default Calculate;