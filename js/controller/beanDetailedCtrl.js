mirun.controller('beanDetailedCtrl',['$scope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$location','mainService','pop','webSocket',function($scope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$location,mainService,pop,webSocket){
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	var pageAdd = 0;
	var pageReduce = 0;
	$scope.state = {
		hasAddContent:true,//是否有金豆增加的数据
		hasReduceContent:true,//是否有金豆减少的数据
		btnChange:0,//头部切换
		noneInCon:false,//加载是否有内容
		noneOutCon:false,//加载是否有内容
		addLength:1,//金豆增加明细的总页数
		reduceLength:1,//金豆减少明细的总页数
		selfBeanNum:mainService.userInfoData.get().selfBean
	};
	$scope.beanAddlist = [];
	$scope.beanreducelist = [];
	$scope.$on('upData-beanDetail',function(){
		var res = mainService.beanDetail.get();
		if(res.result.result==255){
			pop.drawWarn('参数错误',1500);
			$scope.state.noneInCon = true;
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return false;
		}else if(res.result.body.bizhong==2){//金豆明细
			if(res.result.body.leixing==1){//金豆增加
				var newlist = res.result.body;
				$scope.state.addLength = newlist.zys;
				newlist.list.forEach(function(v){
					v.rqt = mainService.dateFormat('ymdhms-timert',v.rq);
					v.rqb = mainService.dateFormat('ymdhms-timerb',v.rq);
				});
				$scope.beanAddlist = $scope.beanAddlist.concat(newlist.list);
				if(!$scope.beanAddlist.length){
					$scope.state.hasAddContent = false
				};
				$scope.$broadcast("scroll.infiniteScrollComplete");
			}else if(res.result.body.leixing==2){//金豆减少
				var newList = res.result.body;
				$scope.state.reduceLength = newList.zys;
				newList.list.forEach(function(v){
					v.rqt = mainService.dateFormat('ymdhms-timert',v.rq);
					v.rqb = mainService.dateFormat('ymdhms-timerb',v.rq);
				});
				$scope.beanreducelist = $scope.beanreducelist.concat(newList.list);
				if(!$scope.beanreducelist.length){
					$scope.state.hasReduceContent = false
				};
				$scope.$broadcast("scroll.infiniteScrollComplete");
			}
		}
	});
	//点击上方金豆余额跳转购买金豆
	$scope.beanJumpPay = function(){
		$state.go('tabs.beanPayCenter');
	}
	
	//上啦加载更多
	$scope.load_more = function(){
		if($scope.state.btnChange==0){
			if(pageAdd>=$scope.state.addLength){
				$timeout(function(){
					$scope.state.noneInCon = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageAdd++;
				webSocket.send({'cmd':10008,'body':{'bizhong':2,'leixing':1,'yeshu':pageAdd}});
			};
		}else if($scope.state.btnChange==1){
			if(pageReduce>=$scope.state.reduceLength){
				$timeout(function(){
					$scope.state.noneOutCon = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageReduce++;
				webSocket.send({'cmd':10008,'body':{'bizhong':2,'leixing':2,'yeshu':pageReduce}});
			};
		}
		
	}
}])