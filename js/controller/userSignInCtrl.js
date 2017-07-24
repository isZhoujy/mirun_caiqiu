mirun.controller('userSignInCtrl',['$scope','$rootScope','$state','$timeout','$interval','$ionicTabsDelegate','$location','$ionicViewSwitcher','mainService','pop','webSocket',function($scope,$rootScope,$state,$timeout,$interval,$ionicTabsDelegate,$location,$ionicViewSwitcher,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	/*$scope.$on('$stateChangeSuccess',function(e,t,tp,f){
		if((f.url=='/hot'||f.url=='/competition'||f.url=='/rankings'||f.url=='/store')&&t.url=='/userSignIn'){
			$state.go('tabs.self')
 			$ionicViewSwitcher.nextDirection("foerward");
		}
	});*/
	//跳转登录
	$scope.jumpLogin = function(){
		$state.go('login');
		$ionicViewSwitcher.nextDirection("forward");
	};
	//跳转用户注册提示
	$scope.jumpAgreement = function(){
		$state.go('tabs.userAgreement')
		$ionicViewSwitcher.nextDirection("forward");
	};
	$scope.state = {
		tel_toggle : false,//验证码是否可以点击的状态
		btn_tip:'发送验证码',//验证码
	};
	var reg = /^1[3|4|5|7|8][0-9]{9}$/;//手机号正则
	$scope.signInData = {
		telPhone:'',//账号
		checkNum:'',//验证码
		passwordNum:'',//密码
		inviteNum:'',//邀请码
	};
	//手机号输入获取焦点事件
	$scope.phoneFocus = function(){
		if(!reg.test($scope.signInData.telPhone)){
			$scope.signInData.telPhone = '';
		}
	};
	//手机号输入失去焦点事件
	$scope.phoneBlur = function(){
		if(!reg.test($scope.signInData.telPhone)){
			pop.loadAuto('手机号码输入错误',1000);
			$scope.signInData.telPhone = '请输入正确的手机号码';
		}
	};
	//发送验证码
	$scope.sendCheckNum = function(){
		if(!reg.test($scope.signInData.telPhone)){
			pop.loadAuto('手机号码输入错误',1000);
			$scope.signInData.telPhone = '请输入正确的手机号码';
		}else{
			sendBtnChange();
			var params = {
				mobile : $scope.signInData.telPhone,
				type : 1
			};
			//发送验证码
			mainService.userSignInCheckCode(params,function(res){
				if(res.result=='ok'){
					pop.loadAuto('验证码已发送，请稍后',1000);
				}else if(res.result=='fail'){
					pop.loadAuto(res.describe,1000);
				}
			},function(e){
				pop.loadAuto('网络问题，请重试',1000);
			});
			function sendBtnChange() {
				$scope.state.tel_toggle = true;
				$scope.state.btn_tip = 60;
				var timer = null;
				timer = $interval(function() {
					if($scope.state.btn_tip > 1) {
						$scope.state.btn_tip--;
					} else {
						$scope.state.tel_toggle = false;
						$scope.state.btn_tip = "发送验证码";
						$interval.cancel(timer); //每次清除定时器，不然每点一次多开一个线程速度渐快；
					}
				}, 1000);
			}
			
		}
	};
	var rsa = new JSEncrypt();
	//密码匹配
	$scope.passwordBlur = function(){
		if($scope.signInData.passwordNum.length<6||$scope.signInData.passwordNum.length>20){
			pop.loadAuto('密码不符合规则，请重新输入',1500);
			$scope.signInData.passwordNum = ''
		};
	};
	//密码出去空格
	$scope.passInpAction = function(){
		$scope.signInData.passwordNum = $scope.signInData.passwordNum.replace(/ /g,'');
	};
	//保存用户的账号密码
	$scope.saveAccount = function(){
		var params = {
			mobile:$scope.signInData.telPhone,
			password:$scope.signInData.passwordNum,
			yanzhengma:$scope.signInData.checkNum
		};
		if($scope.signInData.telPhone=='请输入正确的手机号码'||$scope.signInData.telPhone==''){
			pop.loadAuto('手机号码不能为空',1500);
			return false;
		}else if($scope.signInData.passwordNum==''){
			pop.loadAuto('密码不能为空',1500);
			return false;
		}else if($scope.signInData.checkNum==''){
			pop.loadAuto('验证码不能为空',1500);
			return false;
		};
		pop.Autoloading('注册中');
		webSocket.send({'cmd':10021,"body":{"mobile":params.mobile,"password":params.password,"yanzhengma":params.yanzhengma}});
		/*mainService.userSignIn(params,function(res){
			if(res.result=='fail'){
				pop.loadAuto(res.describe,1500);
				return false;
			}else if(res.result=='ok'){
				var subParams = {
					yanzhengma : res.uuid
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
						var userPhoneNum = rsa.encrypt(params.mobile);
						localStorage.setItem('userPhone',JSON.stringify(userPhoneNum));
						 $ionicViewSwitcher.nextDirection("forward");
						var domTabs = document.querySelector("#mainTabs");
						var dom = domTabs.getElementsByClassName('col5');
						$rootScope.getUserInfoState = true;
						dom[1].className+=' loginEnd';
						$state.go('tabs.hot');
					}
				},function(e){
					pop.loadAuto('网络错误',1500);
					console.log(e)
				})
			};
		},function(e){
			pop.loadAuto('网络错误',1500);
			console.log(e)
		});*/
	};
	$scope.$on('bindTourist',function(){
		var res = mainService.bindTourist.get();
		pop.loadHide();
		if(res.result.result==1){
			localStorage.removeItem('touristToken');
		 	pop.drawWarn('绑定成功！',1500);
		 	$timeout(function(){
		 		window.history.go(-1)
		 	},1000)
		}else if(res.result.result==2){
			if(res.result.body==1){
				pop.drawWarn('非游客用户不能绑定',1500);
			}else if(res.result.body==2){
				pop.drawWarn('绑定失败',1500);
			}
		}
	})
}]);