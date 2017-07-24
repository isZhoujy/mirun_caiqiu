mirun.controller('allRecordCtrl',['$scope','$state','$timeout','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$timeout,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	var pageRecord = 0;
	$scope.state = {
		classActive:0,//button切换
		noneCon:false,
		recordLength:1,
		pageShow:true,
	};
	$scope.beanRecordData = [];
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
	});
	$scope.$on('upData-allRecord',function(){
		var res = mainService.allRecord.get();
		if(res.result.result==1){
			var newList = res.result.body.list;
			$scope.state.beforeLength = res.result.body.zys;
			newList.forEach(function(v){
				v.sj = mainService.dateFormat('ymdhms',v.sj);
				v.kjq = v.kjq?v.kjq:0;
				v.zjq = v.zjq?v.zjq:0;
			});
			$scope.beanRecordData = $scope.beanRecordData.concat(newList);
			if(!$scope.beanRecordData.length){
				$scope.state.pageShow = false;
			}
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}
	});
	$scope.load_more = function(){
		if($scope.state.classActive==0){
			if(pageRecord>=$scope.state.recordLength){
				$timeout(function(){
					$scope.state.noneCon = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageRecord++;
				webSocket.send({'cmd':10014,"body":{"yeshu":pageRecord}});
			};
		}
	};
	$scope.jumpRecordDetail = function(item){
		var recordDetail = JSON.stringify(item);
		sessionStorage.setItem('record',recordDetail);
		$state.go('tabs.RecordDetail');
	}
	//获取竞猜记录
	/*mainService.getBeanRecordList('',function(res){
		$scope.beanRecordData = res;
		$scope.beanRecordData.forEach(function(v){
			var timer = mainService.dateSwitch(v.EventDate);
			v.EventDate = timer.getFullYear()+'-'+((timer.getMonth()+1)>9?(timer.getMonth()+1):'0'+(timer.getMonth()+1))+'-'+(timer.getDate()>9?timer.getDate():'0'+timer.getDate())+' '+(timer.getHours()>9?timer.getHours():"0"+timer.getHours())+":"+(timer.getMinutes()>9?timer.getMinutes():"0"+timer.getMinutes());
		})
	},function(e){
		console.log(e)
	})*/
}])