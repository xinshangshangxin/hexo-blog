var Beverage = function(param) {
    var boilWater = function() {
        console.log('把水煮沸');
    };

    var brew = param.brew || function() {
            throw new Error('子类必须重写brew方法');
        };

    var pourInCup = param.pourInCup || function() {
            throw new Error('子类必须重写pourIncup方法');
        };

    var addCondiments = param.addCondiments || function() {
            throw new Error('子类必须重写addCpndiments方法');
        };

    var F = function() {
    };

    F.prototype.init = function() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };

    return F;
};

var Coffee = Beverage({
    brew: function() {
        console.log('用沸水冲咖啡');
    },
    pourInCup: function() {
        console.log('把咖啡倒进杯子里面');
    },
    addCondiments: function() {
        console.log('加糖和牛奶');
    }
});

var Tea = Beverage({
    brew: function() {
        console.log('用沸水泡茶水');
    },
    pourInCup: function() {
        console.log('把茶倒进杯子里面');
    },
    addCondiments: function() {
        console.log('加柠檬');
    }
});

var coffee = new Coffee();
coffee.init();
/*
 把水煮沸
 用沸水冲咖啡
 把咖啡倒进杯子里面
 加糖和牛奶
 */
var tea = new Tea();
tea.init();
/*
 把水煮沸
 用沸水泡茶水
 把茶倒进杯子里面
 加柠檬
 */