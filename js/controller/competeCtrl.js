mirun.controller('competeCtrl',['$scope','$rootScope','$state','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','$ionicViewSwitcher','$location','mainService','pop','webSocket',function($scope,$rootScope,$state,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,$ionicViewSwitcher,$location,mainService,pop,webSocket){
	pop.loading();
	var titleListDom = null;//获取吸顶dom元素
	var tipTopArr = [];//获取每个list头部距顶部的距离       塞前
	var handTopArr = [];//获取每个hand据顶部的距离            滚球
	var pageHot = 0;//热门page
	var pageBefore = 0;//赛前page
	var pageAfter = 0;//赛果page
	$scope.competionList = [];//赛事列表
	$scope.competionHand = [];//赛事列表
	$scope.competionRes = [];//赛事列表
	$scope.buttonBarTitle = ['热门','全部','赛果'];
	$scope.state = {
		buttonBarActive:0,//头部button-bar的切换标识
		anginState:false,//判断是否再次进入
		hotInfiniteState:true,//热门页面是否进入就上啦加载
		noneConHot:false,//下下拉加载没有更多内容
		noneConMatch:false,//下下拉加载没有更多内容
		noneConRes:false,//下下拉加载没有更多内容
		HotLength:1,//总页数下拉刷新的总页数
		beforeLength:1,//总页数下拉刷新的总页数
		afterLength:1,//总页数下拉刷新的总页数
	};
	if($rootScope.isWeiXin||ionic.Platform.isIOS()){
		document.querySelector(".bar-subheader").style.top=0+'px';
	};
	//判断是否登陆
	function getHotList(){
		pop.loadHide();
		var res = mainService.playMethodhot.get();
		if(res.result.result==255){
			pop.drawWarn('网络问题，请重新登录',1500);
			$scope.state.noneConHot = true;
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return false;
		}else{
			var newList = res.result.body;
			$scope.state.HotLength = newList.zy;
//			$scope.state.anginState = true;
			if(!newList.list.length){
				$scope.$broadcast("scroll.infiniteScrollComplete");
				return false;
			};
			tipTopArr = [];
			if(typeof newList.list[0].rq == 'number'){
				newList.list.forEach(function(v){
					v.rq = mainService.dateFormat('ymdhms',v.rq);
				});
			};
			$scope.competionList.push(newList);
			$timeout(function(){
				var listDom = document.querySelectorAll(".compete_list");
				titleListDom = document.querySelectorAll(".list_title");
				for(var i=0;i<listDom.length;i++){
					tipTopArr.push(listDom[i].offsetTop);
				};
			});
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}
	}
	$scope.$on('upData-playMethodhot',function(){//热门
		getHotList()
	});
	$scope.showData = {
		tipTitle:{
			center:'',
			right:''
		},
	};
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(true);
		$timeout(function(){
			if(!$scope.competionList.length&&localStorage.getItem('usertoken')){
				$scope.state.noneConHot = false;
				webSocket.send({'cmd':10007,"body":{"yeshu":0}});
				pageHot = 1;
			}else if(!$scope.competionList.length&&!localStorage.getItem('usertoken')){
				pageHot = 1;
			}
		})
		/*if(!mainService.homeHotList.get()){
			pageHot = 0;
			$scope.state.noneConHot = false;
			$scope.load_more();
			$scope.$on('upData-homeHotList',function(){
				if(!$scope.state.anginState){
					getHotList()
				}
			});
		}*/
	});
	//10002;赛前
	$scope.$on('upData-playHotList',function(){
		var res = mainService.playHotList.get();
		var newList = res.result.body;
		$scope.state.beforeLength = newList.zy;
		handTopArr = [];
		if(!newList.list.length){
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return false;
		};
		newList.list.forEach(function(v){
			v.rq = mainService.dateFormat('ymdhms',v.rq);
		});
		$scope.competionHand.push(newList);
		$timeout(function(){
			var listDom = document.querySelectorAll(".competionHand .compete_list");
			titleListDom = document.querySelectorAll(".competionHand .list_title");
			for(var i=0;i<listDom.length;i++){
				handTopArr.push(listDom[i].offsetTop);
			};
		});
		$scope.$broadcast("scroll.infiniteScrollComplete");
	});
	//10013赛果
	$scope.$on('upData-matchResult',function(){
		var res = mainService.matchResult.get();
		if(res.result.result==255){
			pop.drawWarn('网络问题，请重新登录',1500);
			$scope.state.noneConHot = true;
			$scope.$broadcast("scroll.infiniteScrollComplete");
			return false;
		}else{
			var newList = res.result.body;
			$scope.state.afterLength = newList.zys;
			newList.list.forEach(function(v){
				v.sj = mainService.dateFormat('ymdhms',v.sj);
			});
			$scope.competionRes = $scope.competionRes.concat(newList.list);
			$scope.$broadcast("scroll.infiniteScrollComplete");
		}
	})
	
	//上拉加载
	$scope.load_more = function(){
		console.log(pageHot)
		if($scope.state.buttonBarActive==0){
			if(pageHot>=$scope.state.HotLength){
				$timeout(function(){
					$scope.state.noneConHot = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageHot++;
				webSocket.send({'cmd':10007,"body":{"yeshu":pageHot}});
			};
		}else if($scope.state.buttonBarActive==1){
			if(pageBefore>=$scope.state.beforeLength){
				$timeout(function(){
					$scope.state.noneConMatch = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageBefore++;
				webSocket.send({'cmd':10002,"body":{"yeshu":pageBefore}});
			}
		}else if($scope.state.buttonBarActive==2){
			if(pageAfter>=$scope.state.afterLength){
				$timeout(function(){
					$scope.state.noneConRes = true;
					$scope.$broadcast("scroll.infiniteScrollComplete");
				},1000)
			}else{
				pageAfter++;
				webSocket.send({'cmd':10013,"body":{"yeshu":pageAfter}});
			}
		}
	};
	//点击头部button切换
	$scope.barBtnAction = function(index){
		$scope.state.buttonBarActive=index;
		switch(index){
			case 0:
				tipTopArr = [];
				$timeout(function(){
					var listDom = document.querySelectorAll(".competionList .compete_list");
					titleListDom = document.querySelectorAll(".competionList .list_title");
					for(var i=0;i<listDom.length;i++){
						tipTopArr.push(listDom[i].offsetTop);
					};
				});
				if(!pageHot){
					$scope.load_more();
				}
			break;
			case 1:
				handTopArr = [];
				$timeout(function(){
					var listDom = document.querySelectorAll(".competionHand .compete_list");
					titleListDom = document.querySelectorAll(".competionHand .list_title");
					for(var i=0;i<listDom.length;i++){
						handTopArr.push(listDom[i].offsetTop);
					};
				});
				if(!pageBefore){
					$scope.load_more();
				}
			break;
			case 2:
//				mainService.getCompetionResult('',function(res){
//					$scope.competionResult = res;
//					$scope.competionResult.forEach(function(v){
//						v.Events.forEach(function(v){
//							var tipTimeDate = mainService.dateSwitch(v.EventDate);
//							var amPm = parseInt(tipTimeDate.getHours() > 9 ? tipTimeDate.getHours() : "0" + tipTimeDate.getHours());
//							if(amPm>12){
//								amPm = '下午'+(amPm-12);
//							}else{
//								amPm = '上午'+amPm;
//							};
//							v.EventDate = tipTimeDate.getFullYear()+'/'+(tipTimeDate.getMonth()+1)+'/'+tipTimeDate.getDate()+' '+amPm + ":" + (tipTimeDate.getMinutes() > 9 ? tipTimeDate.getMinutes() : "0" + tipTimeDate.getMinutes())+':00';
//						});
//					});
//				},function(e){
//					console.log(e)
//				})
				if(!pageAfter){
					$scope.load_more();
				};
			break;
		}
		
	};
	$scope.doRefresh = function(){
		tipTopArr = [];//获取每个list头部距顶部的距离       塞前
		handTopArr = [];//获取每个hand据顶部的距离            滚球
		$scope.state.noneConHot = false;
		$scope.state.noneConMatch = false;
		$scope.state.noneConRes = false;
		$scope.state.HotLength = 1;
		$scope.state.beforeLength = 1;
		$scope.state.afterLength = 1;
		pageHot = 0;//热门page
		pageBefore = 0;//赛前page
		pageAfter = 0;//赛果page
		$scope.competionList = [];//赛事列表
		$scope.competionHand = [];//赛事列表
		$scope.competionRes = [];//赛事列表
		$scope.$broadcast('scroll.refreshComplete');
		$timeout(function(){
			$scope.load_more();
		},1000)
	};
	//滚动时候吸顶
	var tipsDom = document.querySelector(".tips_title");
	$scope.scrollAction = function(){
		if($scope.state.buttonBarActive!=2){
			var contentTop = $ionicScrollDelegate.$getByHandle('competeContent').getScrollPosition().top-58;
			if($scope.state.buttonBarActive==0){
				if(contentTop>=tipTopArr[0]){
					tipsDom.style.display = 'block';
					tipsDom.innerHTML = titleListDom[0].innerHTML;
					for(var i=1;i<=tipTopArr.length;i++){
						if(contentTop>=tipTopArr[i]){
							tipsDom.innerHTML = titleListDom[i].innerHTML;
						}else if(contentTop<=tipTopArr[i]&&contentTop>=tipTopArr[i-1]){
							tipsDom.innerHTML = titleListDom[i-1].innerHTML;
						}
					}
				}else{
					tipsDom.style.display = 'none'
				}
			}else if($scope.state.buttonBarActive==1){
				if(contentTop>=handTopArr[0]){
					tipsDom.style.display = 'block';
					tipsDom.innerHTML = titleListDom[0].innerHTML;
					for(var i=1;i<=handTopArr.length;i++){
						if(contentTop>=handTopArr[i]){
							tipsDom.innerHTML = titleListDom[i].innerHTML;
						}else if(contentTop<=handTopArr[i]&&contentTop>=handTopArr[i-1]){
							tipsDom.innerHTML = titleListDom[i-1].innerHTML;
						}
					}
				}else{
					tipsDom.style.display = 'none';
				}
			}
		}
	};
	
	//赛果跳转
	$scope.jumpPages = function(item){
		var items = JSON.stringify(item);
		sessionStorage.setItem('competeItem',items);
		$state.go('tabs.competionResPage');
	};
	//热门跳转
	$scope.jumpStake = function(item){
		$state.go('tabs.competitDetail',{itemId:item.id});
	}
}])