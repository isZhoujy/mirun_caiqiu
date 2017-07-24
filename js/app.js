var mirun = angular.module('mirun', ['ionic','oc.lazyLoad','ngWebSocket']);
mirun.run(['$rootScope','$state','$stateParams','$window',function($rootScope,$state,$stateParams,$window){
	$rootScope.isWeiXin = function() { //是否微信
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}();
	$rootScope.isIOS= function() { //是否ios
		if($rootScope.isWeiXin&&ionic.Platform.isIOS()) {
			return true;
		} else if($rootScope.isWeiXin&&!ionic.Platform.isIOS()){
			return false;
		}
	}();
	//判断用户名是否登录
	$rootScope.getUserInfoState = localStorage.getItem('touristToken')?false:true;
    $rootScope.$on("$stateChangeSuccess",function(event, toState, toParams, fromState, fromParams) {  
//  	console.log(fromState.url)
//      if((fromState.url=='/login'||fromState.name=='tabs.userSignIn')&&toState.name=='tabs.hot'){
////      	if($rootScope.isWeiXin){
////			$window.location.reload()
////			$location.reload(true)
////      	}
//      }
    });  
}])
mirun.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$controllerProvider','$httpProvider',function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$controllerProvider,$httpProvider){
//	console.log($location.path())
	mirun.controller = $controllerProvider.register;
	//配置iOS和Android设备下的app风格
	$ionicConfigProvider.platform.ios.tabs.style('standard');
	$ionicConfigProvider.platform.ios.tabs.position('bottom');
	$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
	$ionicConfigProvider.platform.ios.views.transition('ios');
	
	$ionicConfigProvider.platform.android.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.position('bottom');
	$ionicConfigProvider.platform.android.navBar.alignTitle('center');
	$ionicConfigProvider.platform.android.views.transition('ios');
	//转化post请求传参-------------------------------------------------
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
	  	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	  	$httpProvider.defaults.transformRequest = [function(data) {
    	var param = function(obj) {
      	var query = '';
		var name, value, fullSubName, subName, subValue, innerObj, i;
		for(name in obj) {
			value = obj[name];
			if(value instanceof Array) {
				for(i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value !== undefined && value !== null) {
				query += encodeURIComponent(name) + '=' +
					encodeURIComponent(value) + '&';
			}
		}
		return query.length ? query.substr(0, query.length - 1) : query;
		};
	    return angular.isObject(data) && String(data) !== '[object File]'
	        ? param(data)
	        : data;
	  	}];
   //转化post请求传参----
	//禁用所有缓存  
//  $ionicConfigProvider.views.maxCache(0);  
    
//  路由
	$stateProvider
    .state('tabs', {//tabs主结构，项目的外层结构
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller:'tabsCtrl',
      resolve:{
	        deps:["$ocLazyLoad",function($ocLazyLoad){
	            return $ocLazyLoad.load("js/controller/tabsCtrl.js");
	        }]
    	}
    })
    .state('tabs.hot', {//首页模块
      url: "/hot",
//    cache:false,
      views: {
        'hot-tab': {
	        templateUrl: "templates/hot.html",
	        controller:'hotCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/hotCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.hotDetail', {//比赛详情页面，押注页面
      url: "/hotDetail/:itemId",
      cache:false,
      views: {
        'hot-tab': {
	        templateUrl: "templates/hotDetail.html",
	        controller:'hotDetailCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/hotDetailCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.playShow', {//比赛详情内的玩法介绍页面
      url: "/playShow",
      cache:false,
      views: {
        'hot-tab': {
	        templateUrl: "templates/playShow.html",
	        controller:'playShowCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/playShowCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.playShowCom', {//比赛详情内的玩法介绍页面
      url: "/playShowCom",
      cache:false,
      views: {
        'competition-tab': {
	        templateUrl: "templates/playShow.html",
	        controller:'playShowCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/playShowCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.guessRecord', {//比赛详情内的成交记录
        url: "/guessRecord/:id",
        cache:false,
         views: {
        'hot-tab': {
		    templateUrl: "templates/guessRecord.html",
		    controller:'recordCtrl',
		    resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/recordCtrl.js");
		        }]
			}
	    }
      }
    })
    .state('tabs.guessRecordcom', {//比赛详情内的成交记录
        url: "/guessRecordcom/:id",
        cache:false,
         views: {
        'competition-tab': {
		    templateUrl: "templates/guessRecord.html",
		    controller:'recordCtrl',
		    resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/recordCtrl.js");
		        }]
			}
	    }
      }
    })
    .state('tabs.competition', {//赛事模块
      url: "/competition",
      views: {
        'competition-tab': {
          templateUrl: "templates/competition.html",
          controller:'competeCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/competeCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.competitDetail', {//赛事模块的比赛详情
      url: "/competitDetail/:itemId",
      cache:false,
      views: {
        'competition-tab': {
          templateUrl: "templates/hotDetail.html",
          controller:'hotDetailCtrl',
	        resolve:{
		        deps:["$ocLazyLoad",function($ocLazyLoad){
		            return $ocLazyLoad.load("js/controller/hotDetailCtrl.js");
		        }]
        	}
        }
      }
    })
    .state('tabs.competionResPage', {//赛事详情的赛果模块
      url: "/competionResPage",
      params:{
      	id:null
      },
      views: {
        'competition-tab': {
          templateUrl: "templates/competionResPage.html",
          controller:'comResCtrl',
          resolve:{
	        deps:["$ocLazyLoad",function($ocLazyLoad){
	            return $ocLazyLoad.load("js/controller/comResCtrl.js");
	        }]
    	  }
        }
      }
    })
    .state('tabs.rankings', {//排行榜模块
      url: "/rankings",
      views: {
        'rankings-tab': {
          templateUrl: "templates/rankings.html",
          controller:'rankingCtrl',
          resolve:{
	        deps:["$ocLazyLoad",function($ocLazyLoad){
	            return $ocLazyLoad.load("js/controller/rankingCtrl.js");
	        }]
    	  }
        }
      }
    })
  /*  .state('tabs.rankResPage', {
      url: "/rankResPage",
      views: {
        'rankings-tab': {
          templateUrl: "templates/competionResPage.html",
          controller:'comResCtrl',
          resolve:{
	        deps:["$ocLazyLoad",function($ocLazyLoad){
	            return $ocLazyLoad.load("js/controller/comResCtrl.js");
	        }]
    	  }
        }
      }
    })*/
    .state('tabs.userInfo', {//排行榜内的个人信息页面
      url: "/userInfo/:id",
      cache:false,
      views: {
        'rankings-tab': {
          templateUrl: "templates/userInfo.html",
          controller:'userInfoCtrl',
          resolve:{
	        deps:["$ocLazyLoad",function($ocLazyLoad){
	            return $ocLazyLoad.load("js/controller/userInfoCtrl.js");
	        }]
    	  }
        }
      }
    })
    .state('tabs.store',{//商城模块
    	url:'/store',
    	views:{
    		'store-tab':{
    			templateUrl:'templates/store.html',
    			controller:'storeCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/storeCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('tabs.storeDraw',{//商城物品金豆兑换页
    	url:'/storeDraw/:goodsId',
    	cache:false,
    	views:{
    		'store-tab':{
    			templateUrl:'templates/storeDraw.html',
    			controller:'storeDrawCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/storeDrawCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('tabs.goodsDetail',{//商城物品详情信息页
    	url:'/goodsDetail/:goodsId',
    	cache:false,
    	views:{
    		'store-tab':{
    			templateUrl:'templates/goodsDetail.html',
    			controller:'goodsDetailCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/goodsDetailCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('tabs.storeLottery',{//商城内兑换记录页
    	url:'/storeLottery',
    	views:{
    		'store-tab':{
    			templateUrl:'templates/storeLottery.html',
    			controller:'storeLotteryCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/storeLotteryCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('tabs.personPrize',{//商城内领奖填写信息页
    	url:'/personPrize',
    	views:{
    		'store-tab':{
    			templateUrl:'templates/personPrize.html',
    			controller:'personPrizeCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/personPrizeCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('tabs.self',{//我的模块
    	url:'/self',
    	cache:false,
    	views:{
    		'self-tab':{
    			templateUrl:'templates/self.html',
    			controller:'selfCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/selfCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
    .state('login',{//登录页面
    	url:'/login',
    	cache:false,
//  	views:{
//  		'self-tab':{
    			templateUrl:'templates/login.html',
    			controller:'loginCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/loginCtrl.js");
		        	}]
	    	  	}
//  		}
//  	}
    })
	.state('userSignIn', {//注册页面
        url: "/userSignIn",
        cache:false,
//      views: {
//          'self-tab': {
	            templateUrl: "templates/userSignIn.html",
	            controller:'userSignInCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/userSignInCtrl.js");
		        	}]
	    	  	}
//      	}
//      }
    })
	.state('tabs.userAgreement', {//注册时的用户注册协议页
        url: "/userAgreement",
        views: {
            'self-tab': {
	            templateUrl: "templates/userAgreement.html",
	            controller:'userAgressCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/userAgressCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.beanDetailed', {//个人金豆明细页
        url: "/beanDetailed",
        views: {
            'self-tab': {
	            templateUrl: "templates/beanDetailed.html",
	            controller:'beanDetailedCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/beanDetailedCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.goldDetailed', {//个人金币明细页
        url: "/goldDetailed",
        views: {
            'self-tab': {
	            templateUrl: "templates/goldDetailed.html",
	            controller:'goldDetailedCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/goldDetailedCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.allRecord', {//个人竞猜记录列表页
        url: "/allRecord",
        cache:false,
        views: {
            'self-tab': {
	            templateUrl: "templates/allRecord.html",
	            controller:'allRecordCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/allRecordCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.RecordDetail', {//个人竞猜记录详情页
        url: "/RecordDetail",
        cache:false,
        views: {
            'self-tab': {
	            templateUrl: "templates/guessRecord.html",
	            controller:'recordCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/recordCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.payCenter', {//金币购买中心
        url: "/payCenter",
        cache:false,
        views: {
            'self-tab': {
	            templateUrl: "templates/payCenter.html",
	            controller:'payCenterCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/payCenterCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.payCenterH', {//金币购买中心
        url: "/payCenterH",
        cache:false,
        views: {
            'hot-tab': {
	            templateUrl: "templates/payCenter.html",
	            controller:'payCenterCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/payCenterCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.payCenterC', {//金币购买中心
        url: "/payCenterC",
        cache:false,
        views: {
            'competition-tab': {
	            templateUrl: "templates/payCenter.html",
	            controller:'payCenterCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/payCenterCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.beanPayCenter', {//金豆兑换中心
        url: "/beanPayCenter",
        views: {
            'self-tab': {
	            templateUrl: "templates/beanPayCenter.html",
	            controller:'beanPayCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/beanPayCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('selfUerInfo', {//用户个人信息页
        url: "/selfUerInfo",
        cache:false,
//      views: {
//          'self-tab': {
	            templateUrl: "templates/selfUerInfo.html",
	            controller:'selfUerInfoCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/selfUerInfoCtrl.js");
		        	}]
	    	  	}
//      	}
//      }
    })
	.state('tabs.modifyName', {//修改昵称
        url: "/modifyName",
        cache:false,
        params:{
        	name:null
        },
        views: {
            'self-tab': {
	            templateUrl: "templates/modifyUserName.html",
	            controller:'modifyNameCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/modifyNameCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('tabs.modifyAtuograph', {//修改个人签名
        url: "/modifyAtuograph",
        cache:false,
        params:{
        	autoGraph:null
        },
        views: {
            'self-tab': {
	            templateUrl: "templates/modifyAtuograph.html",
	            controller:'modifyAtuographCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/modifyAtuographCtrl.js");
		        	}]
	    	  	}
        	}
        }
    })
	.state('modifyPw', {//修改密码
        url: "/modifyPw",
         cache:false,
//      views: {
//          'self-tab': {
	            templateUrl: "templates/modifyPassword.html",
	            controller:'modifyPWCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/modifyPWCtrl.js");
		        	}]
	    	  	}
//      	}
//      }
    })
	 .state('tabs.mesCenter',{//消息中心
    	url:'/mesCenter',
    	cache:false,
    	views:{
    		'self-tab':{
    			templateUrl:'templates/mesCenter.html',
    			controller:'mesCenterCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/mesCenterCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
	 .state('tabs.mesDetail',{//消息中心详情
    	url:'/mesDetail/:tabs',
    	cache:false,
    	views:{
    		'self-tab':{
    			templateUrl:'templates/mesDetail.html',
    			controller:'mesDetailCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/mesDetailCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
	 .state('tabs.shareCode',{//分享二维码
    	url:'/shareCode',
    	views:{
    		'self-tab':{
    			templateUrl:'templates/shareCode.html',
    			controller:'shareCodeCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/shareCodeCtrl.js");
		        	}]
	    	  	}
    		}
    	}
    })
	 .state('activity', {//活动页面
        url: "/activity/:src",
         cache:false,
//      views: {
//          'self-tab': {
	            templateUrl: "templates/activity.html",
	            controller:'activityCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/activityCtrl.js");
		        	}]
	    	  	}
//      	}
//      }
    })
	 .state('payPage', {//内嵌支付宝跳转页
        url: "/payPage/:type/:src",
         cache:false,
//      views: {
//          'self-tab': {
	            templateUrl: "templates/payPage.html",
	            controller:'payPageCtrl',
	            resolve:{
	          		deps:["$ocLazyLoad",function($ocLazyLoad){
		            	return $ocLazyLoad.load("js/controller/payPageCtrl.js");
		        	}]
	    	  	}
//      	}
//      }
    })
   $urlRouterProvider.otherwise("/tab/hot");
	
	
}]);



mirun.directive('headAnyMes',function(){
	return {
		restrict:'E',
		template:'<div class="head_mes_note"><img src="img/headMes.png"/><div class="mes_wrap"><div style="width:1000000px; height:30px;"><div class="mes_note1" style="float: left;"><span class="mes_content" ng-bind="headMesNote"></span></div><div class="mes_note2" style="float: left;"></div></div></div></div>',
		relace:true,
		scope:{
			content:'=content'
		},
		link:function(scope){
			scope.$watch('content',function(n,o){
				scope.headMesNote = n;
			})
		}
	}
});
mirun.filter('formatNum',function(){
	return function(data){
		var dataN = ''
		switch(data){
			case 1:
				dataN = '一'
			break;
			case 2:
				dataN = '二'
			break;
			case 3:
				dataN = '三'
			break;
			case 4:
				dataN = '四'
			break;
			case 5:
				dataN = '五'
			break;
			case 6:
				dataN = '六'
			break;
			case 7:
				dataN = '七'
			break;
		}
		return dataN
	}
});
//图片加载失败替换
mirun.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
mirun.filter('imgPathFilter',function(){
	return function(img){
		var length = img.toString().length;
		var imgpath = '';
		switch(length){
			case 1:
				imgpath = '0000'+img;
			break;
			case 2:
				imgpath = '000'+img;
			break;
			case 3:
				imgpath = '00'+img;
			break;
			case 4:
				imgpath = '0'+img;
			break;
			case 5:
				imgpath = img;
			break;
		}
		return  imgpath;
	}
})
