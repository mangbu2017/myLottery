class Timer{
    /**
     * 
     * @param {number} end [当前期结束时间]
     * @param {function} update [更新计时器函数]
     * @param {function} handle []
     */
    countDown(end, update, handle) {
        // 获取
        const now = new Date().getTime();
        const self = this;
        // 本期结束 进入下一期
        if(now - end > 0) {
            handle.call(self);
        } else {
            // 本期剩余毫秒数
            let last_time = end - now;
            // day hour minute second 转换
            const px_d = 1000 * 60 * 60 * 24;
            const px_h = 1000 * 60 * 60;
            const px_m = 1000 * 60;
            const px_s = 1000;
            let d = Math.floor(last_time / px_d);
            let h = Math.floor((last_time - d * px_d) / px_h);
            let m = Math.floor((last_time - d * px_d - h * px_h) / px_m);
            let s = Math.floor((last_time - d * px_d - h * px_h - m * px_m) / px_s);
            let r = [];
            if(d > 0){
                r.push(`<em>${d}</em>天`);
            }
            // r有length只可能是d>0 只要有天就肯定有 时分秒 
            // 但是floor可能导致 h m s === 0
            // 因为h必须和day一起出现
            if(r.length || h > 0){
                r.push(`<em>${h}</em>时`);
            }
            // 为零的话 不能作为头部
            if(r.length || m > 0){
                r.push(`<em>${m}</em>分`);
            }
            if(r.length || s > 0){
                r.push(`<em>${s}</em>秒`);
            }
            // 合并成为字符串
            self.last_time = r.join('');
            // 调用传入的用于更新计时器的函数
            update.call(self, r.join(''));
            // 每隔1秒调用该函数一次
            setTimeout(function () {
                self.countDown(end, update, handle);
            }, 1000);
        }
    }
}

export default Timer;