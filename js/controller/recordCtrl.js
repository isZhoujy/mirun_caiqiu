mirun.controller('recordCtrl',['$scope','$state','$stateParams','$timeout','$location','$ionicTabsDelegate','$ionicSlideBoxDelegate','mainService','pop','webSocket',function($scope,$state,$stateParams,$timeout,$location,$ionicTabsDelegate,$ionicSlideBoxDelegate,mainService,pop,webSocket){
	$scope.recordState = {
		tabChange:1,
		guessStauts:true,//判断是否在竞猜中
		bailResStatus:0,//委托记录是否有数据
		bargainResStatus:1,//成交记录是否有数据
	};
	$scope.orderList = {
		kid:0,
		zid:0
	};
	$scope.recordData = {
		guessRes:'',//竞猜的结果是否大于0
	};
	$scope.getBailData = function(state){
		$scope.recordState.tabChange = state;
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		console.log($location.path())
		if($location.path()=='/tab/RecordDetail'){//比赛列表的详情
			var res = JSON.parse(sessionStorage.getItem('record'))
			$scope.orderList = res;
			$scope.orderList.kjq = $scope.orderList.kjq == ''?0:$scope.orderList.kjq;
			$scope.orderList.zjq = $scope.orderList.zjq == ''?0:$scope.orderList.zjq;
			$scope.orderList.RequestAmount = 0;
			$scope.orderList.list.forEach(function(v){
				v.sj = mainService.dateFormat('ymdhms-timert',v.sj);
				if(v.zt==1||v.zt==0){
					v.fh = '竞猜中';
				}
				$scope.orderList.RequestAmount += v.ze;
			});
			if($scope.orderList.state!=1){
				$scope.orderList.NetReturnMoney = '-';
			}else{
				$scope.orderList.NetReturnMoney = $scope.orderList.RequestAmount + $scope.orderList.yl;
			};
			
		}else{//竞猜记录的详情
			webSocket.send({'cmd':10017,"body":{"id":$stateParams.id}});
		};
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	$scope.$on('upData-guessRecordData',function(){
		var res = mainService.guessRecordData.get();
		if(res.result.result==1){
			$scope.orderList = res.result.body;
			$scope.orderList.kjq = $scope.orderList.kjq == ''?0:$scope.orderList.kjq;
			$scope.orderList.zjq = $scope.orderList.zjq == ''?0:$scope.orderList.zjq;
			$scope.orderList.sj = mainService.dateFormat('ymdhms',$scope.orderList.sj);
			$scope.orderList.RequestAmount = 0;
			$scope.orderList.list.forEach(function(v){
				v.sj = mainService.dateFormat('ymdhms-timert',v.sj);
				if(v.zt==1||v.zt==0){
					v.fh = '竞猜中';
				};
				$scope.orderList.RequestAmount += v.ze;
			});
			if($scope.orderList.state!=1){
				$scope.orderList.NetReturnMoney = '-';
			}else{
				$scope.orderList.NetReturnMoney = $scope.orderList.RequestAmount + $scope.orderList.yl;
			};
		}
	})
	/*mainService.getRecordOrderList('',function(res){
		$scope.orderList = res;
		$scope.recordData.guessRes = $scope.orderList.NetReturnMoney-$scope.orderList.RequestAmount
	},function(e){
		console.log(e)
	})*/
}])