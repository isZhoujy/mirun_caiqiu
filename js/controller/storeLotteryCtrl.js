mirun.controller('storeLotteryCtrl',['$scope','$state','$timeout','$ionicTabsDelegate','$ionicBackdrop','mainService','pop','webSocket',function($scope,$state,$timeout,$ionicTabsDelegate,$ionicBackdrop,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	webSocket.send({"cmd":10011});
	$scope.$on('upData-exchangeGoods',function(){
		var res = mainService.exchangeGoods.get();
		if(res.result.result==1){
			$scope.exChangeList = res.result.body.list;
			$scope.exChangeList.forEach(function(v){
				var timer = v.sj;
				v.sj = mainService.dateFormat('ymdhms-timerb',timer)+' '+mainService.dateFormat('ymdhms-timert',timer);
			})
		}else{
			pop.drawWarn('获取信息失败',1500)
		}
	});
	$scope.jumpDetail = function(item){
		var items = JSON.stringify(item);
		sessionStorage.setItem('storeGoods',items);		
		$state.go('tabs.goodsDetail',{goodsId:item.id})
	};
	
}])