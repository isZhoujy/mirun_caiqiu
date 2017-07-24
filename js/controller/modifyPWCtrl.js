mirun.controller('modifyPWCtrl',['$scope','$state','$stateParams','$interval','$timeout','$ionicTabsDelegate','$ionicViewSwitcher','mainService','pop','$rootScope',function($scope,$state,$stateParams,$interval,$timeout,$ionicTabsDelegate,$ionicViewSwitcher,mainService,pop,$rootScope){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false);
	});
	$scope.passwordData = {
		check:'',//验证码
		password:'',//密码
		againPassword:'',//再次
		checkNum:'发送验证码',
		check_toggle:false,
	};
	if(localStorage.getItem('userPhone')){
		var rsa = new JSEncrypt();
		rsa.setPrivateKey(mainService.loginKEY.privateKey);
		var userPhone = rsa.decrypt(localStorage.getItem('userPhone'));
	}else{
		$state.go('login');
		$ionicViewSwitcher.nextDirection("forward");
	}
	//发送验证码
	$scope.sendCheckNum = function(){
		pop.loadAuto('验证码已发送，请稍后',1000);
		var sendBtnChange = function() {
			$scope.passwordData.check_toggle = true;
			$scope.passwordData.checkNum = 60;
			var timer = null;
			timer = $interval(function() {
				if($scope.passwordData.checkNum > 1) {
					$scope.passwordData.checkNum--;
				} else {
					$scope.passwordData.check_toggle = false;
					$scope.passwordData.checkNum = "发送验证码";
					$interval.cancel(timer); //每次清除定时器，不然每点一次多开一个线程速度渐快；
				}
			}, 1000);
		}
		sendBtnChange();
		var params = {
			mobile : userPhone,
			type : 2
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
	};
	
	
	//提交修改过的密码
	$scope.submitPw = function(){
		var params = {
			mobile:userPhone,
			password:$scope.passwordData.password,
			yanzhengma:$scope.passwordData.check
		};
		if($scope.passwordData.password==''){
			pop.loadAuto('密码不能为空',1500);
			return false;
		}else if($scope.passwordData.check==''){
			pop.loadAuto('验证码不能为空',1500);
			return false;
		}else if($scope.passwordData.password!=$scope.passwordData.againPassword){
			pop.loadAuto('两次密码输入不一致',1500);
			return false;
		};
		mainService.changePwCheck(params,function(res){
			if(res.result=='ok'){
				pop.loadAuto(res.describe,1500);
				$timeout(function(){
					$state.go('tabs.hot');
					$ionicViewSwitcher.nextDirection("forward");
				},1500)
			}else{
				pop.loadAuto('网络错误',1500);
			}
		},function(e){
			console.log(e)
		})
	}
}])