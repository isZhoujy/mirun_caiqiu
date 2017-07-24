mirun.controller('selfCtrl',['$scope','$rootScope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicViewSwitcher','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$rootScope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicViewSwitcher,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	$scope.selfUserData = {
		selfBean:'',//金豆数量
		goldNumber:'',//金币数量
		userName:'',//用户名称
		autoGraph:'',//个人签名
		userIcon:'',
		mesShow:false,
	};
	$scope.selfUserData.mesShow = localStorage.getItem('mesShow')?JSON.parse(localStorage.getItem('mesShow')):false;
	$scope.state = {
		loginUserState:'',//是否登陆
	};
	init();
	function init(){
		if(localStorage.getItem('usertoken')){
			if(mainService.userInfoData.get()){
				var userInfo = mainService.userInfoData.get();
				$scope.selfUserData.selfBean = userInfo.selfBean;
				$scope.selfUserData.goldNumber = userInfo.goldNumber;
				$scope.selfUserData.userName = userInfo.name;
				$scope.selfUserData.autoGraph = userInfo.autoGraph;
				$scope.selfUserData.userIcon = userInfo.userIcon;
			}else{
				webSocket.send({'cmd':10016});
				pop.loading();
			}
		}
	};
	$scope.$on('upData-userInfo',function(){
		$scope.state.loginUserState = localStorage.getItem('touristToken')?false:true;
		if($scope.state.loginUserState){
			$timeout(function(){
				var domTabs = document.querySelector("#mainTabs");
				var dom = domTabs.getElementsByClassName('col5');
				if($scope.sign_arr.loginState){
					dom[1].className ='col5 tab-item tab-item-active loginEnd';
				};
			});
		}else{
			$timeout(function(){
				var domTabs = document.querySelector("#mainTabs");
				var dom = domTabs.getElementsByClassName('col5');
				dom[1].className = 'col5 tab-item tab-item-active';
				$rootScope.getUserInfoState = false;
			})
		}
		var res = mainService.userInfo.get();
		pop.loadHide();
		if(res.result.result==1){
			$scope.selfUserData.selfBean = res.result.body.jd;
			$scope.selfUserData.goldNumber = res.result.body.jb;
			$scope.selfUserData.userName = res.result.body.mc;
			$scope.selfUserData.autoGraph = res.result.body.qm;
			$scope.selfUserData.userIcon = res.result.body.tx;
			var userInfo = {
				name:res.result.body.mc,
				gender:res.result.body.xb,
				autoGraph:res.result.body.qm,
				birthday:res.result.body.sr,
				selfBean:res.result.body.jd,
				goldNumber:res.result.body.jb,
				selfYl:res.result.body.yl,
				selfYlL:res.result.body.yll,
				userIcon:res.result.body.tx
			};
			mainService.userInfoData.set(userInfo);
		}else if(res.result.result==259){
			pop.drawWarn('个人信息获取失败',1500);
		};
	});
	$scope.$on('goldNumberChange',function(){//监听金币变化
		var res = mainService.goldNumberChange.get();
		if(res.result.result==1){
			$scope.selfUserData.goldNumber = res.result.body.sl;
			var userInfo = mainService.userInfoData.get();
			userInfo.goldNumber = res.result.body.sl;
			mainService.userInfoData.set(userInfo);
		}
	})
	$scope.jumpSignInpage = function(){
		$state.go('userSignIn');
		$ionicViewSwitcher.nextDirection("forward");
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(true);
		if(localStorage.getItem('touristToken')){
			$scope.state.loginUserState =false;
		}else{
			$scope.state.loginUserState =true;
			var domTabs = document.querySelector("#mainTabs");
			var dom = domTabs.getElementsByClassName('col5');
			dom[1].className ='col5 tab-item loginEnd tab-item-active';
		}
	});
	$scope.jumpUserDetail = function(){
		$state.go('selfUerInfo');
		$ionicViewSwitcher.nextDirection("forward");
	};
	//跳转登录
	$scope.jumpLogin = function(){
		$state.go('login');
		$ionicViewSwitcher.nextDirection("forward");
	};
	$scope.jumpPayCenter = function(){
		$state.go('tabs.payCenter');
	};
	//新的赛事消息
	$scope.$on('matchNewMessage',function(){
		var res = mainService.matchNewMessage.get();
		if(res.result.result==1){
			$scope.selfUserData.mesShow = true;
			localStorage.setItem('mesShow','true');
		}
	})
	//新的系统消息
	$scope.$on('systemNewMessage',function(){
		var res = mainService.systemNewMessage.get();
		if(res.result.result==1){
			$scope.selfUserData.mesShow = true;
			localStorage.setItem('mesShow','true');
		}
	})
}])