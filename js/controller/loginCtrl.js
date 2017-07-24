mirun.controller('loginCtrl',['$scope','$rootScope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','$ionicViewSwitcher','mainService','pop',function($scope,$rootScope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,$ionicViewSwitcher,mainService,pop){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false);
	});
	/*$scope.$on('$stateChangeSuccess',function(e,t,tp,f){
		if((f.url=='/hot'||f.url=='/competition'||f.url=='/rankings'||f.url=='/store')&&t.url=='/login'){
			$state.go('tabs.self')
   			$ionicViewSwitcher.nextDirection("foerward");
		}
	});*/
	//跳转注册页面
	$scope.jumpSignIn = function(){
		$state.go('userSignIn')
		$ionicViewSwitcher.nextDirection("forward");
	}
	$scope.loginData = {
		telPhone:'',//账号
		checkNum:'',//验证码
		passwordNum:'',//密码
		//checkToggle:'使用验证码登录',//验证码和密码登录切换
		checkStateToggle:true,//密码验证码状态切换
		btn_tip:'发送验证码',
		tel_toggle : false,//发送验证码的disabled
	};
	var reg = /^1[3|4|5|7|8][0-9]{9}$/;//手机号正则
	//手机获取焦点
	$scope.phoneFocus = function(){
		if(!reg.test($scope.loginData.telPhone)){
			$scope.loginData.telPhone = '';
		}
	};
	//手机失去焦点
	$scope.phoneBlur = function(){
		if(!reg.test($scope.loginData.telPhone)){
			pop.loadAuto('手机号码输入错误',1000);
			$scope.loginData.telPhone = '请输入正确的手机号码';
		}
	};
	//忘记密码
	$scope.changeCheckState = function(){
		$state.go('modifyPw');
		$ionicViewSwitcher.nextDirection("forward");
	};
	//发送验证码
	$scope.sendCheckNum = function(){
		if(!reg.test($scope.loginData.telPhone)){
			pop.loadAuto('手机号码输入错误',1000);
			$scope.loginData.telPhone = '请输入正确的手机号码';
		}else{
			pop.loadAuto('验证码已发送，请稍后',1000);
			var sendBtnChange = function() {
				$scope.loginData.tel_toggle = true;
				$scope.loginData.btn_tip = 10;
				var timer = null;
				timer = $interval(function() {
					if($scope.loginData.btn_tip > 1) {
						$scope.loginData.btn_tip--;
					} else {
						$scope.loginData.tel_toggle = false;
						$scope.loginData.btn_tip = "发送验证码";
						$interval.cancel(timer); //每次清除定时器，不然每点一次多开一个线程速度渐快；
					}
				}, 1000);
			}
			sendBtnChange()
		}
	};
	var rsa = new JSEncrypt();
	//登陆事件
	$scope.loginAction = function(){
		if($scope.loginData.telPhone=='请输入正确的手机号码'||$scope.loginData.telPhone==''){
			pop.loadAuto('手机号码不能为空',1500);
			return false;
		}else if($scope.loginData.passwordNum==''){
			pop.loadAuto('密码不能为空',1500);
			return false;
		};
		var params = {
			mobile:$scope.loginData.telPhone,
			password : $scope.loginData.passwordNum,
		};
		pop.Autoloading('正在登陆');
		mainService.userLogin(params,function(res){
			if(res.result=='ok'){
				var subParams = {
					yanzhengma:res.uuid,
					type:1
				};
				mainService.userRequestUuid(subParams,function(res){
					if(res.result=='ok'){
						pop.loadHide();
						var usertoken = {
							serverCode:res.serverCode,
							userId:res.userid
						};
						usertoken = JSON.stringify(usertoken);
						localStorage.setItem('usertoken',usertoken);
						rsa.setPublicKey(mainService.loginKEY.privateKey);
						localStorage.removeItem('touristToken');
						mainService.userInfoData.set(null);
						var userPhoneNum = rsa.encrypt(params.mobile);
						localStorage.setItem('userPhone',JSON.stringify(userPhoneNum));
						$timeout(function(){
							var domTabs = document.querySelector("#mainTabs");
							var dom = domTabs.getElementsByClassName('col5');
							$rootScope.getUserInfoState = true;
							dom[1].className+=' loginEnd';
						})
						$state.go('tabs.hot',null,{reload:true})
					 	$ionicViewSwitcher.nextDirection("forward");
					}
				},function(e){
					pop.loadAuto('网络错误',1500);
					console.log(e)
				})
			}else if(res.result=='fail'){
				pop.loadAuto(res.describe,1500);
			}
		},function(e){
			pop.loadAuto('网络错误',1500);
			console.log(e)
		});
	}
}]);