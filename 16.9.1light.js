var Light = function() {
    this.currState = FSM.off; // 设置当前状态
    this.button = null;
};

Light.prototype.init = function() {
    var button = document.createElement('button');
    var _this = this;

    button.innerHTML = '已关灯';
    this.button = document.body.appendChild(button);

    this.button.onclick = function() {
        _this.currState.buttonWasPressed.call(_this); // 把请求委托给FSM状态机
    };
};

var FSM = {
    off: {
        buttonWasPressed: function() {
            console.log('关灯');
            this.button.innerHTML = '下一次按我开灯';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed: function() {
            console.log('开灯');
            this.button.innerHTML = '下一次按我关灯';
            this.currState = FSM.off;
        }
    }
};

var light = new Light();
light.init();