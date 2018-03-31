import $ from 'jquery';    

/**
 * @param {string}
 */
class Mock{
    // 获取
    getOmit(issue){
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/omit',
                data: {
                    issue: issue
                },
                dataType: 'json',
                success: function(res){
                    self.setOmit(res.data);
                    resolve.call(self, res);
                },
                error: function(err){
                    reject.call(err);
                }
            })
        })
    }
    /**
     * 
     * @param {string} issue 
     */
    getOpenCode(issue){
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/opencode',
                data: {
                    issue: issue
                },
                dataType: 'json',
                success: function(res) {
                    self.setOpenCode(res.data);
                    resolve.call(self, res);
                },
                error: function(err){
                    reject.call(err);
                }
            })
        })
    }
    /**
     * 
     * @param {sting} issue 
     */
    getState(issue) {
        let self = this;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/get/state',
                data: {
                    issue: issue
                },
                dataType: 'json',
                success: function(res) {
                    resolve.call(self, res);
                },
                error: function(err){
                    reject.call(err);
                }
            })
        })
    }
}

export default Mock;