mirun.controller('mesCenterCtrl',['$scope','$state','$timeout','$ionicTabsDelegate','mainService','pop','webSocket',function($scope,$state,$timeout,$ionicTabsDelegate,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	pop.loading();
	mesInit();
	function mesInit(){
		if(localStorage.getItem('usertoken')){
			webSocket.send({'cmd':10022});
		}
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false);
		if(localStorage.getItem('mesShow')){
			localStorage.setItem('mesShow','false');
		}
	});
	$scope.$on('userMessage',function(){
		pop.loadHide();
		var res = mainService.userMessage.get();
		if(res.result.result==1){
			var mesList = res.result.body;
			if(!mesList.salist.length){
				$scope.matchMesData = '当前没有消息记录';
			}else{
				$scope.matchMesData = mesList.salist[0].biaoti;
			};
			if(!mesList.xtlist.length){
				$scope.systemMesData = '当前没有消息记录';
			}else{
				$scope.systemMesData = mesList.xtlist[0].biaoti;
			}
			sessionStorage.setItem('mesList',JSON.stringify(mesList))
		}else{
			pop.drawWarn('参数错误',1500)
		}
	});
	$scope.matchMes = function(state){
		$state.go('tabs.mesDetail',{tabs:state});
	}
}])