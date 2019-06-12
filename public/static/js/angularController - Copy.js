


var DEFSFdata111 = [{
    "SFname":"media playerrrrrrrrrrrrrrrrrrrrrrrr",
    "Quantity":5,
    "Price":100,
    "PriceType":"OTC"
},{
    "SFname":"Office",
    "Quantity":4,
    "Price":200,
    "PriceType":"/Month"
},{
    "SFname":"Notes",
    "Quantity":3,
    "Price":300,
    "PriceType":"/Month"
},{
    "SFname":"Files management",
    "Quantity":2,
    "Price":400,
    "PriceType":"OTC"
},{
    "SFname":"IE",
    "Quantity":1,
    "Price":500,
    "PriceType":"/Month"
}];

var ADISFdata = [{
    "SFname":"media player",
    "VersonRelease":["v1","v3","v6","v2","v4"],
    "Quantity":5,
    "Price":100,
    "PriceType":"OTC"
},{
    "SFname":"Office",
    "VersonRelease":["R1","R3","R6","R2","R4"],
    "Quantity":4,
    "Price":200,
    "PriceType":"/Month"
},{
    "SFname":"Notes",
    "VersonRelease":["M1","M3","M6","M2","M4"],
    "Quantity":3,
    "Price":300,
    "PriceType":"/Month"
},{
    "SFname":"Files management",
    "VersonRelease":["P1","P3","P6","P2","P4"],
    "Quantity":2,
    "Price":400,
    "PriceType":"OTC"
},{
    "SFname":"IE",
    "VersonRelease":["S1","S3","S6","S2","S4"],
    "Quantity":1,
    "Price":500,
    "PriceType":"/Month"
}];

var SAISFdata = [{
    "SFname":"media player",
    "Quantity":1,
    "Price":100,
    "PriceType":"OTC"
},{
    "SFname":"Office",
    "Quantity":1,
    "Price":200,
    "PriceType":"/Month"
},{
    "SFname":"Notes",
    "Quantity":1,
    "Price":300,
    "PriceType":"/Month"
},{
    "SFname":"Files management",
    "Quantity":1,
    "Price":400,
    "PriceType":"OTC"
},{
    "SFname":"IE",
    "Quantity":1,
    "Price":500,
    "PriceType":"/Month"
}];

var app = angular.module('myZRDP', ['ngRoute']);

app.constant('constantService', {
"currencySymbol":"$",
"PriceType_Month":"/Month",
"PriceType_OTC":"OTC",
})

app.factory('countCost', ['constantService', function(constantService){

function SFsectionOBJ(SFtype){
    this.SFtype=SFtype;
    this.SFprice_M = 0;
    this.SFprice_OTC = 0;
    this.SFtotalPrice = this.SFprice_M + this.SFprice_OTC;
    this.getSFprice_M = function(){
    return this.SFprice_M;
    };
    this.getSFprice_OTC = function(){
    return this.SFprice_OTC;
    }
    this.getSFtotalPrice = function(){
    return this.SFtotalPrice;
    }
}
var FixedSfOBJ = new SFsectionOBJ("Fixed");
var DEFsfOBJ = new SFsectionOBJ("DEF");
var ADIsfOBJ = new SFsectionOBJ("ADI");
var SAIsfOBJ = new SFsectionOBJ("SAI");

var getTotalMonthly = function(){
return FixedSfOBJ.getSFprice_M() + DEFsfOBJ.getSFprice_M() + ADIsfOBJ.getSFprice_M() + SAIsfOBJ.getSFprice_M();
};
var getTotalOTC = function(){
return FixedSfOBJ.getSFprice_OTC() + DEFsfOBJ.getSFprice_OTC() + ADIsfOBJ.getSFprice_OTC() + SAIsfOBJ.getSFprice_OTC();;
};
var countTotalCost = function(){
return getTotalOTC()+getTotalMonthly();
};

return {
    "FixedSfOBJ":FixedSfOBJ,
    "DEFsfOBJ":DEFsfOBJ,
    "ADIsfOBJ":ADIsfOBJ,
    "SAIsfOBJ":SAIsfOBJ,
    "getTotalMonthly":getTotalMonthly,
    "getTotalOTC":getTotalOTC,
    "countTotalCost":countTotalCost,
}
}])



//configuration µÄ¼¸¸ösection¶¼²»¸ôÀë scope = true
app.directive('directiveFixed', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
            scope: true, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
           // template: '<h2>Included with Monthly Charge:</h2><p><label for="">{{mainController.fixedSFobj.Name}} </label><span class="col_2">Quantity: {{mainController.fixedSFobj.Quantity}}</span><span class="col_3">{{mainController.fixedSFobj.currencySymbol+" "+mainController.fixedSFobj.Price+" "+mainController.fixedSFobj.PriceType}}</span></p>',
        templateUrl: '../Template/DT_fixedSF.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
$scope.directiveTestValue = "bbbbsssccc";
        }
    };
}]);

app.directive('directiveDefsf', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
            scope: {
                currencySymbol:"@",
                defsfdata:"=",//这个最好都用小写！！！！ 要不就得驼峰命名，容易出错
                action:"&",
                testfun:"&",
                testmyobj:'='
            }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
           // template: '<h2>Included with Monthly Charge:</h2><p><label for="">{{mainController.fixedSFobj.Name}} </label><span class="col_2">Quantity: {{mainController.fixedSFobj.Quantity}}</span><span class="col_3">{{mainController.fixedSFobj.currencySymbol+" "+mainController.fixedSFobj.Price+" "+mainController.fixedSFobj.PriceType}}</span></p>',
        templateUrl: '../Template/DT_DefSF.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
//$scope.defsfdata = DEFSFdata111  如果这里重复定义 defsfdata ， 在template里就会用这里定义的
        }
    };
}]);

app.directive('directiveAdisf', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
            scope: {
                currencySymbol:"@",
                adisfdata:"=",
                action:"&"
            }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
           // template: '<h2>Included with Monthly Charge:</h2><p><label for="">{{mainController.fixedSFobj.Name}} </label><span class="col_2">Quantity: {{mainController.fixedSFobj.Quantity}}</span><span class="col_3">{{mainController.fixedSFobj.currencySymbol+" "+mainController.fixedSFobj.Price+" "+mainController.fixedSFobj.PriceType}}</span></p>',
        templateUrl: '../Template/DT_AdiSF.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
//$scope.ADISFdata = ADISFdata
        }
    };
}]);

app.directive('directiveSaisf', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
            scope: {
                saisfdata:"=",
                calsaisfcontInput:"&",//注意这里的 key 名字，会自动被变
                calsaisfcontrb:"&"
            }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
           // template: '<h2>Included with Monthly Charge:</h2><p><label for="">{{mainController.fixedSFobj.Name}} </label><span class="col_2">Quantity: {{mainController.fixedSFobj.Quantity}}</span><span class="col_3">{{mainController.fixedSFobj.currencySymbol+" "+mainController.fixedSFobj.Price+" "+mainController.fixedSFobj.PriceType}}</span></p>',
        templateUrl: '../Template/DT_SaiSF.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
//$scope.SAISFdata = SAISFdata;
$scope.SAISFinputQuantity = 0;
$scope.SAISFinputPrice = 0;
$scope.SAISFinputPriceType = "/Month";
        }
    };
}]);


app.directive('directiveOverview', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
            scope: false, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
           // template: '<h2>Included with Monthly Charge:</h2><p><label for="">{{mainController.fixedSFobj.Name}} </label><span class="col_2">Quantity: {{mainController.fixedSFobj.Quantity}}</span><span class="col_3">{{mainController.fixedSFobj.currencySymbol+" "+mainController.fixedSFobj.Price+" "+mainController.fixedSFobj.PriceType}}</span></p>',
        templateUrl: '../Template/DT_overview.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
}]);


app.config(function ($routeProvider) {

    $routeProvider
        .when('/',{template:'Homepage'})
        .when('/SelectOS', {
        templateUrl: '../SelectOS.html',
        controller: 'MainController'
        })
        .when('/Configuration', {
        templateUrl: 'Configuration'
        })
        .when('/CustomerINFO',{template:'这是CustomerINFO'})
        .when('/ViewandSubmit',{template:'这是ViewandSubmit'})
        .otherwise({redirectTo:'/'});

})



app.controller('MainController', ['constantService','countCost','$http', function(constantService,countCost,$http){

this.testmyobj = {"mytestfield":"vvvvvvvvvvv"};


var self = this;//这里必须这么写，不然$http获取不到！！！！
    $http({
        method: 'GET',
        url: 'http://127.0.0.1:3000/searchData'
    }).then(function successCallback(response) {
            self.DEFSFdata = response.data[0].SFdata;
            console.log(self.mongodata);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("failed"+response);
    });


this.TestValue = "this is MainController";

this.currencySymbol = constantService.currencySymbol;

this.fixedSFobj = {
"Name":"Up to 30 WU of CPU usage, 10GB DASD Space",
"Quantity":"1",
"currencySymbol":constantService.currencySymbol,
"Price":400,
"PriceType":constantService.PriceType_Month
};


this.getDEFSFdata= function(){return self.DEFSFdata}

//self.DEFSFdata = self.mongodata;
this.ADISFdata = ADISFdata;
this.SAISFdata = SAISFdata;


countCost.FixedSfOBJ.SFprice_M = this.fixedSFobj.Price;
this.getcountCostFIXEDsfPrice_M = function(){
    return countCost.FixedSfOBJ.SFprice_M;
};


this.selectDefSF = function(DefSFitem){
var res = typeof(DefSFitem.checkedValue) == "undefined"?false:true;
DefSFitem.checkedValue = !DefSFitem.checkedValue;
this.calDefaultSFcont(DefSFitem.checkedValue,DefSFitem.Quantity,DefSFitem.Price,DefSFitem.PriceType)

}


this.getcountCostDEFsfPrice_M = function(){return countCost.DEFsfOBJ.SFprice_M};
this.calDefaultSFcont = function(checkbox,Quantity,price,type){
    //alert(checkbox+"@@"+Quantity+"@@"+price+"@@"+type);
    if(checkbox){//+
    if(type == "/Month"){
    countCost.DEFsfOBJ.SFprice_M = countCost.DEFsfOBJ.SFprice_M + price*Quantity;
    }else if(type == "OTC"){
    countCost.DEFsfOBJ.SFprice_OTC = countCost.DEFsfOBJ.SFprice_OTC + price*Quantity;
    }
    }else{//-
    if(type == "/Month"){
    countCost.DEFsfOBJ.SFprice_M = countCost.DEFsfOBJ.SFprice_M - price*Quantity;
    }else if(type == "OTC"){
    countCost.DEFsfOBJ.SFprice_OTC = countCost.DEFsfOBJ.SFprice_OTC - price*Quantity;
    }
    }
    //alert(checkbox);
}


function getCountResult(myarr , type){
            var CountResult = 0;
            //console.log("arr :"+myarr);
            for (var i = 0; i < myarr.length; i++) {
                var item = myarr[i];
                if (item.PriceType == type) {
                    CountResult += item.Quantity * item.Price;
                }
            }
return CountResult;
}


this.calADISFcont = function(Quantity, Price, PriceType) {
    if (PriceType == "/Month") {
            countCost.ADIsfOBJ.SFprice_M = getCountResult(this.ADISFdata,"/Month");
    } else if (PriceType == "OTC") {
        countCost.ADIsfOBJ.SFprice_OTC = getCountResult(this.ADISFdata,"OTC");
    }
}

this.getTotalMonthly = function(){return countCost.getTotalMonthly()};
this.getTotalOTC = function(){return countCost.getTotalOTC()};
this.countTotalCost = function(){return countCost.countTotalCost()};

//init Overview

countCost.ADIsfOBJ.SFprice_M = getCountResult(this.ADISFdata,"/Month");
countCost.ADIsfOBJ.SFprice_OTC = getCountResult(this.ADISFdata,"OTC");


this.SFprice_M_RB = 0;
this.SFprice_OTC_RB = 0;
this.SFprice_M_input = 0;
this.SFprice_OTC_input = 0;
this.SAISFinputQuantity=0;
this.SAISFinputPrice=0;
this.SAISFinputPriceType="/Month";

this.calSAISFcont_RB = function(index){
var selectedSF = this.SAISFdata[index];
var price = selectedSF.Price;
var PriceType = selectedSF.PriceType;
this.SFprice_M_RB = 0;
this.SFprice_OTC_RB = 0;
if(PriceType == "/Month")this.SFprice_M_RB = selectedSF.Quantity * selectedSF.Price;
if(PriceType == "OTC")this.SFprice_OTC_RB = selectedSF.Quantity * selectedSF.Price;
console.log(this.SFprice_M_RB+"\n"+this.SFprice_OTC_RB);
this.calSAISFcont();
}


this.calSAISFcont_input = function(inputQuantity,inputPrice,inputPriceType){

this.SFprice_M_input = 0;
this.SFprice_OTC_input = 0;
if(inputPriceType == "/Month")this.SFprice_M_input = inputQuantity * inputPrice;
if(inputPriceType == "OTC")this.SFprice_OTC_input = inputQuantity * inputPrice;
this.calSAISFcont();
}

this.calSAISFcont = function(){
countCost.SAIsfOBJ.SFprice_M = this.SFprice_M_input + this.SFprice_M_RB;
countCost.SAIsfOBJ.SFprice_OTC = this.SFprice_OTC_input + this.SFprice_OTC_RB;
}


//test

this.testfun = function(){

return true;

}

}])

app.controller('OverviewController', ['constantService','countCost', function(constantService,countCost){


this.OverviewCountOBJ = countCost;
this.OverviewConstantServiceOBJ = constantService;
this.currencySymbol = constantService.currencySymbol;
this.getcountCostFIXEDsfPrice_M = function(){
return countCost.FixedSfOBJ.SFprice_M;
};
this.getTotalCost = function(){

return countCost.countTotalCost();

}

}])