---
layout: post
title: 'angular学习笔记'
description: '「 Angular 4.0从入门到实战 打造股票管理网站」学习笔记'
date: 2018-09-16 21:53:56
tags:
  - angular
---

# init

```bash
# 使用 yarnpkg 只需要设置一次
ng config -g cli.packageManager yarn
#  新建项目         有路由, 无测试, scss
ng new $project --routing -S --style=scss

# 添加 material
yarnpkg add @angular/material @angular/cdk @angular/animations

# 生成 component
ng g c $name
```

# 模块

```ts
@NgModule({
  declarations: [
    组件,
    指令,
    管道
  ],
  imports: [
    依赖模块
  ],
  providers: [
    服务
  ],
  bootstrap: [
    主组件
  ]
})
```

# 组件

![component](/img/learn-angular/001.png)

# 路由

![route](/img/learn-angular/002.png)

## `app-routing.module.ts`

```ts
const routes: Routes = [
  // 路由重定向
  {
    path: '',
    redirectTo: '/home',
    pathMath: 'full',
  },
  // 基本路由配置
  {
    path: 'home',
    component: HomeComponent,
    data: [
      {
        isProd: true,
      },
    ],
  },
  {
    path: 'children',
    // 子路由
    children: [
      {
        path: '',
        component: Children1Component,
      },
      {
        path: 'xxx/:id',
        component: Children2Component,
      },
    ],
  },
  // 默认路由
  {
    path: '**',
    redirectTo: '',
  },
];
```

## html 中

```html
<!-- routerLink数组,   queryParams 对象 -->
<a [routerLink]="['/product', id]" [queryParams]="{debug: 1}">XXXX</a>

<!-- 在标签下面展示路由内容 -->
<router-outlet></router-outlet>
```

## component.ts

### 跳转

```ts
constructor(private router: Router){}

this.router.navigate(["/", id], {
  queryParams: {
    debug: 1
  }
})
```

### 获取

```ts
constructor(private routeInfo: ActivatedRoute) {
  routeInfo.params.subscribe((params: Params) => this.productId = params["id"]);
  routeInfo.queryParams.subscribe((params: Params) => this.test = params["test"]);

  this.id = routeInfo.snapshot.params['id'];

  // 路由中配置 data: [{isprod: true}]
  this.isProd = routeInfo.snapshot.data[0]['isProd'];
}
```

## 辅助路由

![aux](/img/learn-angular/003.png)

## 路由守卫

### routes

```ts
{
  path: 'product/:id',
  component: ProductComponent,
  // 在路由激活之前获取数据
  resolve: {
    product: ProductResolveGuard
  },
  // 处理导航到某个路由
  canActivate: [LoginGuard],
  // 处理从当前路由离开
  canDeactivate: [UnsavedGuard],
  data: [{
    isProd: true
  }],
}
```

### canActivate

```ts
export class LoginGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let loggedIn: boolean = Math.random() < 0.5;
    if (!loggedIn) {
      console.log('LoginGuard:用户未登录' + new Date());
    }
    return loggedIn;
  }
}
```

### CanDeactivate

```ts
export class UnsavedGuard implements CanDeactivate<ProductComponent> {
  canDeactivate() {
    return window.confirm('你还没有保存.确定要离开么?');
  }
}
```

### Resolve

```ts
@Injectable()
export class ProductResolveGuard implements Resolve<ProductComponent> {
  constructor(private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductComponent> | Promise<ProductComponent> | ProductComponent {
    let productId: number = route.params['id'];

    if (productId == 1) {
      return undefined;
    } else {
      this.router.navigate(['/home']);
      return undefined;
    }
  }
}
```

# 依赖注入

![DI](/img/learn-angular/004.png)

```ts
providers: [
  LoggerService,
  {
    provide: ProductService,
    // 单例, 只在第一次需要的时候初始化
    useFactory: (logger: LoggerService, appConfig) => {
      if (appConfig.isDev) {
        return new ProductService(logger);
      } else {
        return new AnotherProductService(logger);
      }
    },
    // 提供参数
    deps: [LoggerService, 'APP_CONFIG'],
  },
  {
    // 变量
    provide: 'APP_CONFIG',
    useValue: {
      isDev: false,
    },
  },
];
```

# 数据绑定

## 插值表达式

```html
<h1>{{title}}</h1>
```

## 属性表达式

```html
<img [src]="imgUrl">
```

## 事件绑定

![bind](/img/learn-angular/005.png)

# 响应式编程

[RxJS 学习笔记](/2018/08/30/lean-rxjs/)

# 管道

```ts
@Pipe({
  name: 'multiple',
})
export class MultiplePipe implements PipeTransform {
  transform(value: number, args?: number): any {
    if (!args) {
      args = 1;
    }
    return value * args;
  }
}
```

# 组件间通信

## 路由属性

[获取路由属性](#获取)

## 输入属性

```ts
// 子组件 component 中
@Input()
price: number;
```

```html
<!-- 父组件html中 -->
<child-component [price]="some-value"></child-componen>
```

## 输出属性

```ts
// 子组件
@Output('priceChange')
lastPrice:EventEmitter<number> = new EventEmitter();

// some trigger
this.lastPrice.emit(10);
```

```html
<!-- 父组件中 -->
<child-component (lastPrice)="priceHandle($event)"></child-component>
```

```ts
// 父组件中
priceHandle(event: number) {
  console.log('price: ', event)
}
```

## 中间人模式(有共同的父组件)

```ts
// child1 组件
@Output('priceChange')
lastPrice:EventEmitter<number> = new EventEmitter();

this.lastPrice.emit(10);
```

```html
<!-- 父组件 -->
<child1-component (lastPrice)="priceHandle($event)"></child1-component>
<child2-component [lastPrice]="lastPrice"></child2-component>
```

# 组件生命周期

![life](/img/learn-angular/006.png)

# 表单

## 数据模型

由 `angular/form`模块中特定的类(`FormControl`, `FormGroup`, `FormArray`)组成

## 两种表单比较

|                      | 模板式表单                            | 响应式表单                 |
| -------------------- | ------------------------------------- | -------------------------- |
| import               | `FormsModule`                         | `ReactiveFormsModule`      |
| 如何构造             | 通过组件模板中相关指令                | 通过编写 `typescript` 代码 |
| 数据模型创建         | 由 `angular` 基于模板中的指令隐式创建 | 编码明确创建数据模型       |
| 能否直接访问数据模型 | 不能                                  | 能                         |
| HTML                 | 直接生成                              | 自己编写绑定数据           |

## 模板式表单

- `NgFrom` 会自动添加到 `<form>` 表单上
- 手动添加 `NgFrom`: `<form #myForm="ngForm">`
- `<form>`表单的提交不会被触发
- 实现 `(ngSubmit)="onSubmit(myForm.value)"`
- 在 `NgForm` 元素下 寻找标记为 `NgModel` 属性的元素(需要指定`name`属性才能绑定)

## 响应式表单

- `formGroup` 和 `formControl` 需要属性绑定语法
- `formGroupName`, `formControlName`, `formArrayName` **不需要**属性绑定语法
- `formGroupName`, `formControlName`, `formArrayName` 只能用在 `formGroup` 指令覆盖的范围内

## 指令对照表

| 类名        | 模板式表单指令           | 响应式表单指令                   |
| ----------- | ------------------------ | -------------------------------- |
| FormGroup   | ngFrom <br> ngModelGroup | formGroup <br> formGroupName     |
| FormControl | ngModel                  | formControl <br> formControlName |
| FormArray   |                          | formArrayName                    |

## 校验

- `formControl` 校验器

```ts
function mobileValidator(control: FormControl): any {
  let value = (control.value || '') + '';
  var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  let valid = mobileReg.test(value);
  return valid ? null : { mobile: true };
}
```

- `formGroup` 校验器

```ts
function equalValidator(group: FormGroup): any {
  let password: FormControl = group.get('password') as FormControl;
  let pconfirm: FormControl = group.get('pconfirm') as FormControl;

  let valid: boolean = false;
  if (password && pconfirm) {
    valid = password.value === pconfirm.value;
  }

  return valid ? null : { equal: { description: '密码和确认密码不匹配!' } };
}
```

- 异步校验器 (返回 `observable`)

```ts
function mobileAsyncValidator(control: FormControl): any {
  return Observable.of(valid ? null : { mobile: true }).delay(5000);
}
```

- 在 响应式表单中 使用

```ts
constructor(fb: FormBuilder) {
  this.formModel = fb.group({
    //     初始值    同步校验器        异步校验器
    mobile: ['', mobileValidator, mobileAsyncValidator],
    //               多个同步校验器
    username: ['', [Validators.required, Validators.minLength(5)]],
    passwordsGroup: fb.group(
      {
        password: ['', Validators.minLength(6)],
        pconfirm: [''],
      },
      // formGroup 校验器
      { validator: equalValidator }
    ),
  })
}

onSubmit() {
  let isValid: boolean = this.formModel.get('username').valid;
  let errors: any = this.formModel.get('username').errors;

  if (this.formModel.valid) {
    console.log(this.formModel.value);
  }
}
```

```html
<form [formGroup]="formModel" (submit)="onSubmit()">
  <!-- 同步校验 -->
  <div [hidden]="formModel.get('username').valid || formModel.get('username').untouched">
    <!-- hasError的第一个参数是 校验器返回的对象的key, 不是校验器的名称 -->
    <div [hidden]="!formModel.hasError('required', 'username')">
      用户名是必填项
    </div>
    <div [hidden]="!formModel.hasError('minlength', 'username')">
      用户名最小长度是5
    </div>
  </div>

  <!-- 异步校验 -->
  <div>
      手机号:<input type="number" formControlName="mobile">
  </div>
  <div [hidden]="!formModel.get('mobile').pending">
    正在校验手机号合法性
  </div>
  <div [hidden]="formModel.get('mobile').valid || formModel.get('mobile').pristine">
    <div [hidden]="!formModel.hasError('mobile', 'mobile')">
      请输入正确的手机号
    </div>
  </div>

  <!-- formGroup 校验 -->
  <div formGroupName="passwordsGroup">
    <div>密码:<input type="password" formControlName="password"></div>
    <div [hidden]="!formModel.hasError('minlength', ['passwordsGroup','password'])">
      密码最小长度是6
    </div>
    <div>确认密码:<input type="password" formControlName="pconfirm"></div>
    <div [hidden]="!formModel.hasError('equal', 'passwordsGroup')">
      <!-- 从校验器中获取错误信息 -->
      {{formModel.getError('equal', 'passwordsGroup')?.description}}
    </div>
  </div>
</form>
```

- 在 模板式表单 使用

```ts
// 先封装成一个 指令
@Directive({
  //       中括号 括起来
  selector: '[mobile]',
  //            provide 是固定的        useValue 从 validator 引入    multi: true
  providers: [{ provide: NG_VALIDATORS, useValue: mobileValidator, multi: true }],
})
export class MobileValidatorDirective {
  constructor() {}
}
```

```ts
constructor() { }
ngOnInit() {}

onSubmit(value:any, valid:boolean){
  console.log(valid);
  console.log(value);
}

usernameValid:boolean = true;
usernameUntouched:boolean = true;

// 模板式表单获取 状态
onUsernameInput(form:NgForm) {
  if(form) {
    this.usernameValid = form.form.get("username").valid;
    this.usernameUntouched = form.form.get("username").untouched;
  }
}
```

```html
                                        <!-- 传递表单值      传递表单状态  -->
<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm.value, myForm.valid)" novalidate>
  <div>用户名:<input ngModel required minlength="6" name="username" type="text"
  (input)="onUsernameInput(myForm)">
  <!-- 模板式表单获取 状态 -->

  </div>
  <div [hidden]="usernameValid || usernameUntouched">
                    <!-- myForm.form -->
    <div [hidden]="!myForm.form.hasError('required','username')">
      用户名是必填项
    </div>
    <div [hidden]="!myForm.form.hasError('minlength','username')">
      用户名最小长度是6
    </div>
  </div>
</form>
```

# 和服务器通讯

`HttpClient`

# build

1. 添加环境配置(如 `staging`)
   编辑 `angular.json`, 仿照 `projects.architect.build.configurations.staging` 下添加环境变量

2. `build` 的时候加入 `--configuration`

```bash
#                使用哪个 config          输出路径
ng build --prod --configuration=${env} --output-path dist
```
