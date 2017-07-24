mirun.controller('hotCtrl',['$scope','$rootScope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicViewSwitcher','$ionicSlideBoxDelegate','$ionicBackdrop','mainService','pop','webSocket',function($scope,$rootScope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicViewSwitcher,$ionicSlideBoxDelegate,$ionicBackdrop,mainService,pop,webSocket){
	var pageHot = 0;//分页数量
	var isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	$scope.state={
		rankgood:true,//判断排名显示
		noneCon:false,//上啦加载没有更多内容
		hotLength:1,//总页数上啦加载的总页数
		headMesNoteState:false,//头部推送消息是否显示
	};
	$scope.matchList = [];
	pop.loading();
	$scope.$on('$ionicView.beforeLeave', function() {
	});
	function initRound(){
		if(localStorage.getItem('usertoken')&&mainService.hotCarousel.get()==null){
			webSocket.send({'cmd':10015});
		}else{
			var res = mainService.hotCarousel.get();
			if(res.result.result==1){
				$scope.picList = res.result.body.list;
				$ionicSlideBoxDelegate.update();
			}
		}
	};
	var MarmainQueeStop;
	//头部走马灯
	$scope.$on('upData-headRound',function(){//头部实时消息推送100005
		var res = mainService.headRound.get();
		if(res.result.result == 1){
			headraoundAction(res.result.body.info);
		}else{
			pop.drawWarn('走马灯获取信息失败',1500)
		}
	});
	function headraoundAction(infodata){
		window.cancelAnimationFrame(MarmainQueeStop)
		$scope.headMesNote = infodata;
		$scope.state.headMesNoteState = true;
		$timeout(function(){
			var oMesNote  = document.querySelector(".hot_main .mes_wrap");
			var oMesNote1 = document.querySelector(".hot_main .mes_note1");
			var oMesNote2 = document.querySelector(".hot_main .mes_note2");
			oMesNote2.innerHTML = oMesNote1.innerHTML;
			function MarmainQuee() {
				if(oMesNote.scrollLeft - oMesNote2.offsetWidth >= 0) {
					oMesNote.scrollLeft -= oMesNote2.offsetWidth;
				} else {
					oMesNote.scrollLeft++;
				}
				MarmainQueeStop = requestAnimationFrame(MarmainQuee)
			}
			MarmainQuee()
		})
	};
	//头部轮播
	$scope.$on('upData-hotCarousel',function(){
		var res = mainService.hotCarousel.get();
		if(res.result.result==1){
			$scope.picList = res.result.body.list;
			$ionicSlideBoxDelegate.update();
		}else{
			pop.drawWarn('轮播图获取信息失败',1500)
		}
	});
	$scope.$on('hot-Loadmore',function(){//判断连接成功
		initRound();
	});
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(true);
		if(mainService.headRound.get()){
			var res = mainService.headRound.get();
			headraoundAction(res.result.body.info);
		};
		$timeout(function(){
			if(localStorage.getItem('usertoken')){
				if(!$scope.matchList.length){
					$scope.state.noneCon = false;
					webSocket.send({'cmd':10007,"body":{"yeshu":0}});
					pageHot = 1;
				}
			}else{
				if(!$scope.matchList.length){
					pageHot = 1;
				}
			};
		});
	});
	
	$scope.$on('upData-homeHotList',function(){//10007
		getHotList();
	});
	function getHotList(){
		pop.loadHide();
		var res = mainService.homeHotList.get();
		if(res.result.result==255){
			pop.drawWarn('网络问题，请重新登录',1500);
			$scope.state.noneConHot = true;
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return false;
		}else{
			var newList = res.result.body;
			$scope.state.hotLength = newList.zy;
			if(newList.list.length){
				newList.list.forEach(function(v){
					v.rq = mainService.dateFormat('ymdhms',v.rq);
				});
				$interval.cancel($scope.timer);
				$scope.matchList = $scope.matchList.concat(newList.list);
				$scope.$broadcast("scroll.infiniteScrollComplete");
				$scope.nowTimes = new Date().getTime();
				timeCount($scope.matchList);
				matchListAction($scope.matchList);
			}else{
				$scope.$broadcast("scroll.infiniteScrollComplete");
			};
		}
	};
	//点击头部轮播跳转
	$scope.jumpCompete = function(item){
		if(item.type==1){
			$state.go('tabs.hotDetail',{itemId:item.id});
		}else if(item.type==2){
			$state.go('tabs.store');
		}else if(item.type==3){
			$state.go('activity',{src:item.tz});
			$ionicViewSwitcher.nextDirection("forward");
		}
	};
	//点击比赛列表跳转
	$scope.goDefault = function(item){
		$state.go('tabs.hotDetail',{itemId:item.id});
	};
	//点击红包领取签到奖励
	$scope.getPacket = function(){
		pop.alert_one('提示','您已经领取过当天奖励','','确定')
	};
	/*//下拉刷新
	$scope.doRefresh = function(){
		$interval.cancel($scope.timer);
		mainService.getMatchResulte('',function(res){
			$scope.matchList = res;
			$scope.nowTimes = new Date().getTime();
			timeCount(res)
			matchListAction(res)
		},function(e){
			console.log(e)
		});
		$scope.$broadcast("scroll.refreshComplete");
	}*/
	
	//上啦加载
	$scope.load_more = function(){
		if(pageHot>=$scope.state.hotLength){
			$timeout(function(){
				$scope.state.noneCon = true;
				$scope.$broadcast("scroll.infiniteScrollComplete");
			},1000)
		}else{
			pageHot++;
			webSocket.send({'cmd':10007,"body":{"yeshu":pageHot}});
		}
	};
	//下啦刷新
	$scope.doRefresh = function(){
		$interval.cancel($scope.timer);
		$scope.$broadcast('scroll.refreshComplete');
		pageHot = 0;
		$scope.matchList = [];
		$scope.state.hotLength = 1;
		$scope.state.noneCon = false;
		$scope.load_more();
	}
	
	function timeCount(res){
		$scope.nowTimes = $scope.nowTimes + 1000;
			if(res!=''){
				for(var i = 0; i < res.length; i++) {
					var arrTime = res[i].rq;
//					console.log(arrTime)
					if(isIos){
						arrTime = arrTime.replace(/-/g,'/');
					};
					var beginTime = new Date(arrTime);
					$scope.beginTimes = beginTime.getTime(); //得到毫秒数
					$scope.continues = ($scope.nowTimes - $scope.beginTimes)
					if(($scope.continues < -24 * 60 * 60 * 1000)) { //一天外未开始,显示日期;
						$scope.tipTime = (beginTime.getFullYear() + "-" + parseInt(beginTime.getMonth() + 1) + "-" + beginTime.getDate());
						$scope.matchList[i].Time = $scope.tipTime;
						$scope.matchList[i].time_State = true;
					} else if($scope.continues <= 0 && $scope.continues >= -24 * 60 * 60 * 1000) { //一天内未开始,显示时间;	  
						$scope.matchList[i].time_State = false;
						$scope.day = parseInt(Math.abs($scope.continues) / (1000 * 60 * 60 * 24));
						$scope.hours = parseInt(Math.abs($scope.continues) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
						$scope.minutes = parseInt(Math.abs($scope.continues) % (1000 * 60 * 60) / (1000 * 60));
						$scope.seconds = parseInt(Math.abs($scope.continues) % (1000 * 60) / (1000)); //							$scope.tipTime = ($scope.hours > 9 ? $scope.hours : "0" + $scope.hours) + ":" + ($scope.minutes > 9 ? $scope.minutes : "0" + $scope.minutes) + ":" + ($scope.seconds > 9 ? $scope.seconds : "0" + $scope.seconds);
						$scope.matchList[i].hours = ($scope.hours > 9 ? $scope.hours : "0" + $scope.hours);
						$scope.matchList[i].minutes = ($scope.minutes > 9 ? $scope.minutes : "0" + $scope.minutes);
						$scope.matchList[i].seconds = ($scope.seconds > 9 ? $scope.seconds : "0" + $scope.seconds); 
					} else if(res[i].state == 3){ //进行中；
						$scope.tipTime = '进行中';
						$scope.matchList[i].time_State = true;
						$scope.matchList[i].Time = $scope.tipTime;
					}else if(res[i].state == 4){ //进行中；
						$scope.tipTime = '比赛延期';
						$scope.matchList[i].time_State = true;
						$scope.matchList[i].Time = $scope.tipTime;
					}else if(res[i].state == 1){ //进行中；
						$scope.tipTime = '已结束';
						$scope.matchList[i].time_State = true;
						$scope.matchList[i].Time = $scope.tipTime;
					}else{
						$scope.tipTime = '进行中';
						$scope.matchList[i].time_State = true;
						$scope.matchList[i].Time = $scope.tipTime;
					}
				}
			}
	}
	function matchListAction(res){
		$scope.timer = $interval(function(){
			timeCount(res)
		},1000)
	}
}])
