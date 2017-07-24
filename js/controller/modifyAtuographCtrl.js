mirun.controller('modifyAtuographCtrl',['$scope','$state','$stateParams','$ionicTabsDelegate','$ionicScrollDelegate','mainService','pop','webSocket',function($scope,$state,$stateParams,$ionicTabsDelegate,$ionicScrollDelegate,mainService,pop,webSocket){
	$scope.user = {};
	$scope.user.autoGraph = $stateParams.autoGraph?$stateParams.autoGraph:'';
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	$scope.changeAutoGraph = function(){
		pop.loading();
		webSocket.send({'cmd':10018,'body':{'type':4,'info':$scope.user.autoGraph}});
	};
	$scope.$on('upData-changeUserInfo',function(){
		var res = mainService.changeUserInfo.get();
		pop.loadHide();
		if(res.result.result==1){
			var userInfo = mainService.userInfoData.get();
			userInfo.autoGraph = res.result.body.qm;
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
}]);