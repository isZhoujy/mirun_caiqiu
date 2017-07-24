mirun.controller('modifyNameCtrl',['$scope','$state','$stateParams','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','mainService','pop','webSocket',function($scope,$state,$stateParams,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,mainService,pop,webSocket){
	$scope.nameCount = 0;
	$scope.name = {};
	$scope.name.midifyName = $stateParams.name?$stateParams.name:'';
	$scope.setNameAction = function(){
		pop.loading();
		webSocket.send({'cmd':10018,'body':{'type':2,'info':$scope.name.midifyName}});
	};
	$scope.$on('upData-changeUserInfo',function(){
		var res = mainService.changeUserInfo.get();
		pop.loadHide();
		if(res.result.result==1){
			var userInfo = mainService.userInfoData.get();
			userInfo.name = res.result.body.mc;
			mainService.userInfoData.set(userInfo);
			window.history.go(-1);
		}else if(res.result.result==2){
			if(res.result.body==1){
				pop.drawWarn('修改的内容包含屏蔽字!',1500);
			}else if(res.result.body==2){
				pop.drawWarn('更改内容太长!',1500);
			}else if(res.result.body==3){
				pop.drawWarn('更改的性别有误!',1500);
			}
		}else if(res.result.result==259){
			pop.drawWarn('网络错误请重试!',1500);
		}
	});
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
}])