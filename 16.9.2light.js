var delegate = function(client, delegation) {
    return {
        // 将客户的操作委托给delegation对象
        buttonWasPressed: function() {
            return delegation.buttonWasPressed.apply(client, arguments);
        }
    }
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

var Light = function() {
    this.offState = delegate(this, FSM.off);
    this.onState = delegate(this, FSM.on);

    this.currState = this.offState;
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

var light = new Light();
light.init();
