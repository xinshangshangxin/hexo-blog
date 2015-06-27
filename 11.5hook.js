

var Beverrage = function() {

};

Beverrage.prototype.boilWater = function() {
    console.log('把水煮沸');
};

Beverrage.prototype.brew = function() {
    throw new Error('子类必须重写brew方法');
};

Beverrage.prototype.pourInCup = function() {
    throw new Error('子类必须重写pourIncup方法');
};

Beverrage.prototype.addCondiments = function() {
    throw new Error('子类必须重写addCpndiments方法');
};

Beverrage.prototype.customerWantsCondiments = function() {
    return true; //默认需要调料
};

Beverrage.prototype.init = function() {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
        this.addCondiments();
    }
};


var CoffeeWithHook = function() {
};

CoffeeWithHook.prototype = new Beverrage();

CoffeeWithHook.prototype.brew = function() {
    console.log('用沸水冲咖啡');
};

CoffeeWithHook.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子里面');
};

CoffeeWithHook.prototype.addCondiments = function() {
    console.log('加糖和牛奶');
};


CoffeeWithHook.prototype.customerWantsCondiments = function() {
    return window.confirm('请问需要添加调料吗?');
};


var coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();
/*
 把水煮沸
 用沸水冲咖啡
 把咖啡倒进杯子里面
 加糖和牛奶
 */