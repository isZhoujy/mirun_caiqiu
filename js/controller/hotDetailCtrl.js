mirun.controller('hotDetailCtrl',['$scope','$state','$stateParams','$timeout','$interval','$ionicTabsDelegate','$location','$ionicSlideBoxDelegate','$ionicViewSwitcher','mainService','pop','webSocket',function($scope,$state,$stateParams,$timeout,$interval,$ionicTabsDelegate,$location,$ionicSlideBoxDelegate,$ionicViewSwitcher,mainService,pop,webSocket){
	pop.loading();
	var canvasTimes;
	var itemId = $stateParams.itemId;
	var matchData = [
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"进球",statsId:90000,statsType:90000,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"角球",statsId:90001,statsType:90001,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"黄牌",statsId:90002,statsType:90002,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"红牌",statsId:90003,statsType:90003,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"点球",statsId:90004,statsType:90004,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"任意球",statsId:90005,statsType:90005,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"威胁任意球",statsId:90006,statsType:90006,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"射正",statsId:90007,statsType:90007,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"进攻",statsId:90008,statsType:90008,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"威胁进攻",statsId:90009,statsType:90009,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"犯规",statsId:90010,statsType:90010,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"越位",statsId:90011,statsType:90011,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"射偏",statsId:90012,statsType:90012,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"射中门框",statsId:90013,statsType:90013,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"两黄变一红",statsId:90015,statsType:90015,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"界外球",statsId:90016,statsType:90016,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"球门球",statsId:90017,statsType:90017,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"射门",statsId:90018,statsType:90018,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"换人",statsId:90019,statsType:90019,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"威胁射门",statsId:90020,statsType:90020,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"扑救",statsId:90021,statsType:90021,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"封堵射门",statsId:90022,statsType:90022,styleL:{'width':0},styleR:{'width':0}},
		{awayTeamValue:"0",homeTeamValue:"0",stateName:"突破",statsId:90023,statsType:90023,styleL:{'width':0},styleR:{'width':0}},
	];
	
	$scope.playMeathod = {
		title:['全场赛果胜平负 全场90min(含伤停补时)的比赛结果','入球数单双 全场90min(含伤停补时)的进球单双','准确进球总数 全场90min(含伤停补时)的进球数','下一个进球 猜下个进球的队伍','正确比分 全场90min(含伤停补时)的比分结果'],
		title2:['全场赛果胜平负 ','入球数单双 ','准确进球总数','下一个进球','正确比分'],
		detail:{//比赛玩法详情
			kid:0,
			zid:0,
		},
	};
	$scope.guessState = {
		checked:0,//切换竞猜 实况 分析
		slideChange:0,//轮播与全部转换
		selectShow:0,//投注模拟select
		liveState:0,//实况模块标识
		analysisState:0,//分析模块切换标识
		liveData:true,//实时赛况是否数据
		liveNowData:false,//本场数据是否有数据
		analyDataHistory:false,//历史战绩是否有数据
		analyDataNow:false,//近期战绩是否有数据
		analyDataFutrue:false,//未来战机是否有数据
		guessCountSlide:0,//轮播——猜比分选项
		stakeHoldeState:{},//投注后显示右上角等待图标
		headMesNoteState:false,//判断头部推送是否现实
	};
	$scope.stakeData = {
		stateToggle:true,//判断是否超出上下限
		showSelectCon:10,//select的每注
		showStakeDou:10,//加减号的每注，
		showSelectAll:0,//自己的最高金豆
		showSelectMax:9000,//设置投注的最高上限
		showStakeGain:'',//猜中盈利
		stakeChecked:'',//判断五种玩法的每个小选项哪个选中
		changeSlide:0,//轮播五种玩法的索引
		showStakeBtn:false,//是否显示下方的投注按钮,
		slideTitle:'全场赛果胜平负',//判断轮播头部的标题
		showStakeSure:0,//是否显示下方的投注成功按钮
		showOddsNum:'',//盈利赔率
		bettingNum:'',//投注次数
		selfBeanNum:'',//本金
		selfProfit:'',//盈利金额
		caseTypeList :[],//实时赛况列表
	};
	$scope.canvas = {
		colorY:0,//0为白色，1为红色，2位蓝色
		color:'blue',
		tipTime:'',//开赛的时间
	};
	if(localStorage.getItem('usertoken')){
		webSocket.send({'cmd':10003,"body":{"id":itemId}});
	};
	selfBean();
	function selfBean(){
		if(localStorage.getItem('usertoken')){
			if(mainService.userInfoData.get()){
				var userInfo = mainService.userInfoData.get();
				$scope.stakeData.showSelectAll = userInfo.selfBean;
			}else{
				webSocket.send({'cmd':10016});
			}
		}
		
	};
	$scope.$on('upData-userInfo',function(){//个人信息
		var res = mainService.userInfo.get();
		if(res.result.result==1){
			$scope.stakeData.showSelectAll = res.result.body.jd;
			var userInfo = {
				name:res.result.body.mc,
				gender:res.result.body.xb,
				autoGraph:res.result.body.qm,
				birthday:res.result.body.sr,
				selfBean:res.result.body.jd,
				goldNumber:res.result.body.jb,
				selfYl:res.result.body.yl,
				selfYlL:res.result.body.yll,
				userIcon:res.result.body.tx
			};
			mainService.userInfoData.set(userInfo);
		}else if(res.result.result==259){
			pop.drawWarn('个人信息获取失败',1500);
		};;
	});
	$scope.$on('$ionicView.beforeEnter', function() {
		$interval.cancel(canvasTimes);
		canvasTimes = $interval(intervalDraw, 50);
		$ionicTabsDelegate.$getByHandle('myTabs').showBar(false);
		if(angular.isFunction(MarmainQuee)){
			window.cancelAnimationFrame(MarmainQueeStop);
			window.requestAnimationFrame(MarmainQuee);
		};
	});
	$scope.$on('$ionicView.beforeLeave', function() {
		$interval.cancel(canvasTimes);
		window.cancelAnimationFrame(MarmainQueeStop);
		webSocket.send({'cmd':10006,"body":{"id":itemId}});
	});
	function init(){
		pop.loadHide();
		var res = mainService.playMeathod.get();
		var mainDataTj = res.tj;
		$scope.playMeathod.detail = mainService.playMeathod.get();
		var rqtimer = mainService.dateFormat('ymdhms',$scope.playMeathod.detail.kcsj).split(' ');
		$scope.playMeathod.detail.rqTime = rqtimer[0].split('-')[1]+'月'+rqtimer[0].split('-')[2]+'日'+rqtimer[1]+'开赛';
		$scope.playMeathod.detail.zscore = 0;
		$scope.playMeathod.detail.kscore = 0;
		$scope.playMeathod.detail.canvasState = '未开赛';
		$scope.playMeathod.detail.matchIcon = -100;
		$scope.playMeathod.detail.startState = '未开赛';
		$scope.playMeathod.detail.cs.forEach(function(v,i){
			if(v.caseType==101025||v.caseType==101028||v.caseType==101029||v.caseType==101030||v.caseType==101031||v.caseType==101032||v.caseType==101034||v.caseType==102049||v.caseType==102052||v.caseType==102053||v.caseType==102054||v.caseType==102055||v.caseType==102056||v.caseType==102058){
				switch(v.caseType){
					case 101024:
						v.caseName = '主队进攻';
					break;
					case 101025:
						v.caseName = '主队角球';
					break;
					case 101026:
						v.caseName = '主队危险进攻';
					break;
					case 101027:
						v.caseName = '主队危险任意球';
					break;
					case 101028:
						v.caseName = '主队任意球';
					break;
					case 101029:
						v.caseName = '主队进球 ';
					break;
					case 101030:
						v.caseName = '主队进球取消';
					break;
					case 101031:
						v.caseName = '主队点球';
					break;
					case 101032:
						v.caseName = '主队红牌';
					break;
					case 101033:
						v.caseName = '主队射门';
					break;
					case 101034:
						v.caseName = '主队黄牌';
					break;
					case 102048:
						v.caseName = '客队进攻';
					break;
					case 102049:
						v.caseName = '客队角球';
					break;
					case 102050:
						v.caseName = '客队危险进攻';
					break;
					case 102051:
						v.caseName = '客队危险任意球';
					break;
					case 102052:
						v.caseName = '客队任意球';
					break;
					case 102053:
						v.caseName = '客队进球';
					break;
					case 102054:
						v.caseName = '客队进球取消';
					break;
					case 102055:
						v.caseName = '客队点球';
					break;
					case 102056:
						v.caseName = '客队红牌';
					break;
					case 102057:
						v.caseName = '客队射门';
					break;
					case 102058:
						v.caseName = '客队黄牌';
					break;
					default:
						v.caseName = '状态无记录';
					break;
				}
				$scope.stakeData.caseTypeList.push(v);
			}else{
				switch(v.caseType){
					case 101024:
						v.caseName = '主队进攻';
					break;
					case 101025:
						v.caseName = '主队角球';
					break;
					case 101026:
						v.caseName = '主队危险进攻';
					break;
					case 101027:
						v.caseName = '主队危险任意球';
					break;
					case 101028:
						v.caseName = '主队任意球';
					break;
					case 101029:
						v.caseName = '主队进球 ';
					break;
					case 101030:
						v.caseName = '主队进球取消';
					break;
					case 101031:
						v.caseName = '主队点球';
					break;
					case 101032:
						v.caseName = '主队红牌';
					break;
					case 101033:
						v.caseName = '主队射门';
					break;
					case 101034:
						v.caseName = '主队黄牌';
					break;
					case 102048:
						v.caseName = '客队进攻';
					break;
					case 102049:
						v.caseName = '客队角球';
					break;
					case 102050:
						v.caseName = '客队危险进攻';
					break;
					case 102051:
						v.caseName = '客队危险任意球';
					break;
					case 102052:
						v.caseName = '客队任意球';
					break;
					case 102053:
						v.caseName = '客队进球';
					break;
					case 102054:
						v.caseName = '客队进球取消';
					break;
					case 102055:
						v.caseName = '客队点球';
					break;
					case 102056:
						v.caseName = '客队红牌';
					break;
					case 102057:
						v.caseName = '客队射门';
					break;
					case 102058:
						v.caseName = '客队黄牌';
					break;
					default:
						v.caseName = '状态无记录';
					break;
				}
			}
		});
		if($scope.playMeathod.detail.state==1){
			$scope.playMeathod.detail.startState = '结束';
			$scope.playMeathod.detail.canvasState = '结束';
			$scope.playMeathod.detail.rqTime = '比赛已结束';
			$scope.playMeathod.detail.matchIcon=  -200;
		}else if($scope.playMeathod.detail.state==2){
			$scope.playMeathod.detail.startState = '数据取消';
			$scope.playMeathod.detail.canvasState = '数据取消';
			$scope.playMeathod.detail.rqTime = '比赛数据取消';
			$scope.playMeathod.detail.matchIcon=  -200;
		}else if($scope.playMeathod.detail.state==5){
			$scope.playMeathod.detail.startState = '比赛废弃';
			$scope.playMeathod.detail.canvasState = '比赛废弃';
			$scope.playMeathod.detail.rqTime = '比赛废弃';
			$scope.playMeathod.detail.matchIcon=  -200;
		}else if($scope.playMeathod.detail.state==3){
			var arrCs = $scope.playMeathod.detail.cs;
			$scope.playMeathod.detail.startState = arrCs[arrCs.length-1].caseMinutes+'`';
			if($scope.playMeathod.detail.stage==2){
				$scope.playMeathod.detail.canvasState = '上半场';
			}else if($scope.playMeathod.detail.stage==4){
				$scope.playMeathod.detail.canvasState = '中场休息';
				$scope.playMeathod.detail.startState = '中场';
			}else if($scope.playMeathod.detail.stage==8){
				$scope.playMeathod.detail.canvasState = '下半场';
			}else if($scope.playMeathod.detail.stage==16){
				$scope.playMeathod.detail.canvasState = '比赛结束';
//				$scope.playMeathod.detail.startState = '结束';
			}else if($scope.playMeathod.detail.stage==32){
				$scope.playMeathod.detail.canvasState = '比赛常规时间结束';
			}else if($scope.playMeathod.detail.stage==64){
				$scope.playMeathod.detail.canvasState = '比赛加时赛上半场';
			}else if($scope.playMeathod.detail.stage==128){
				$scope.playMeathod.detail.canvasState = '比赛加时赛中场休息';
			}else if($scope.playMeathod.detail.stage==256){
				$scope.playMeathod.detail.canvasState = '比赛加时赛下半场';
			}else if($scope.playMeathod.detail.stage==512){
				$scope.playMeathod.detail.canvasState = '比赛加时赛上半场';
			}else if($scope.playMeathod.detail.stage==1024){
				$scope.playMeathod.detail.canvasState = '比赛点球大战';
			};
			$scope.playMeathod.detail.rqTime = arrCs[arrCs.length-1].caseName;
			$scope.playMeathod.detail.matchIcon= arrCs[arrCs.length-1].caseType;
		};
		$scope.stakeData.caseTypeList.sort(function(a,b){
			return b.caseMinutes-a.caseMinutes
		});
		$scope.playMeathod.detail.tj = matchData;
		$scope.playMeathod.detail.tj.forEach(function(vWrap,i){
			mainDataTj.forEach(function(v){
				v.styleL = {
					'width':parseInt(parseInt(v.homeTeamValue)/(parseInt(v.homeTeamValue)+parseInt(v.awayTeamValue))*36)+'vw'
				};
				v.styleR = {
					'width':parseInt(parseInt(v.awayTeamValue)/(parseInt(v.homeTeamValue)+parseInt(v.awayTeamValue))*36)+'vw'
				};
				if(vWrap.statsType==v.statsType){
					vWrap.styleL = v.styleL;
					vWrap.styleR = v.styleR;
					vWrap.homeTeamValue = v.homeTeamValue;
					vWrap.awayTeamValue = v.awayTeamValue;
				};
			});
			if(vWrap.statsType==90000){
				$scope.playMeathod.detail.zscore = vWrap.homeTeamValue;
				$scope.playMeathod.detail.kscore = vWrap.awayTeamValue;
			};
		});
		$scope.stakeData.caseTypeList.forEach(function(v,i){
			if(v.caseType.toString().substr(0,3)==101){
				v.TeamID=1;
			}else{
				v.TeamID=2;
			}
		});
		var minArr = [];
		var sameArr = [];
		var maxArr = [];
		$scope.playMeathod.detail.bf.list.forEach(function(v){
			var msArr = v.ms.split(':');
			if(msArr[0]==msArr[1]){
				sameArr.push(v);
			}else if(msArr[0]>msArr[1]){
				maxArr.push(v);
			}else if(msArr[0]<msArr[1]){
				minArr.push(v);
			};
		});
		switchFn($scope.playMeathod.detail.bf.zt,$scope.playMeathod.detail.bf.list);
		switchFn($scope.playMeathod.detail.ds.zt,$scope.playMeathod.detail.ds.list);
		switchFn($scope.playMeathod.detail.sf.zt,$scope.playMeathod.detail.sf.list);
		switchFn($scope.playMeathod.detail.xjq.zt,$scope.playMeathod.detail.xjq.list);
		switchFn($scope.playMeathod.detail.zqjq.zt,$scope.playMeathod.detail.zqjq.list);
		$scope.playMeathod.detail.bf.list = maxArr.concat(sameArr.concat(minArr));
	};
	function switchFn(state,list){//判断是否可以押注
		switch(state){
			case 0:
				list.forEach(function(v){
					v.zt = 3;
				})
			break;
		}
	};
	$scope.$on('upData-matchStageIng',function(){//100008比赛时候的stage
		var res = mainService.matchStageIng.get();
		if(res.id==itemId){
			if(res.stage==2){
				$scope.playMeathod.detail.canvasState = '上半场';
			}else if(res.stage==4){
				$scope.playMeathod.detail.canvasState = '中场休息';
			}else if(res.stage==8){
				$scope.playMeathod.detail.canvasState = '下半场';
			}else if(res.stage==16){
				$scope.playMeathod.detail.canvasState = '比赛结束';
			}else if(res.stage==32){
				$scope.playMeathod.detail.canvasState = '比赛常规时间结束';
			}else if(res.stage==64){
				$scope.playMeathod.detail.canvasState = '比赛加时赛上半场';
			}else if(res.stage==128){
				$scope.playMeathod.detail.canvasState = '比赛加时赛中场休息';
			}else if(res.stage==256){
				$scope.playMeathod.detail.canvasState = '比赛加时赛下半场';
			}else if(res.stage==512){
				$scope.playMeathod.detail.canvasState = '比赛加时赛上半场';
			}else if(res.stage==1024){
				$scope.playMeathod.detail.canvasState = '比赛点球大战';
			};
			$scope.playMeathod.detail.zscore = res.zjq;
			$scope.playMeathod.detail.kscore = res.kjq;
		}
	})
	$scope.$on('upData-caseTypeData',function(){//100004
		var res = mainService.caseTypeData.get();
		if(res.result.body.id==itemId){
			var resultData = res.result.body.list[0];
			$scope.playMeathod.detail.matchIcon = resultData.caseType;
			$scope.playMeathod.detail.startState = resultData.caseMinutes+'`';
			switch(resultData.caseType){
				case 101024:
					resultData.caseName = '主队进攻';
				break;
				case 101025:
					resultData.caseName = '主队角球';
				break;
				case 101026:
					resultData.caseName = '主队危险进攻';
				break;
				case 101027:
					resultData.caseName = '主队危险任意球';
				break;
				case 101028:
					resultData.caseName = '主队任意球';
				break;
				case 101029:
					resultData.caseName = '主队进球 ';
				break;
				case 101030:
					resultData.caseName = '主队进球取消';
				break;
				case 101031:
					resultData.caseName = '主队点球';
				break;
				case 101032:
					resultData.caseName = '主队红牌';
				break;
				case 101033:
					resultData.caseName = '主队射门';
				break;
				case 101034:
					resultData.caseName = '主队黄牌';
				break;
				case 102048:
					resultData.caseName = '客队进攻';
				break;
				case 102049:
					resultData.caseName = '客队角球';
				break;
				case 102050:
					resultData.caseName = '客队危险进攻';
				break;
				case 102051:
					resultData.caseName = '客队危险任意球';
				break;
				case 102052:
					resultData.caseName = '客队任意球';
				break;
				case 102053:
					resultData.caseName = '客队进球';
				break;
				case 102054:
					resultData.caseName = '客队进球取消';
				break;
				case 102055:
					resultData.caseName = '客队点球';
				break;
				case 102056:
					resultData.caseName = '客队红牌';
				break;
				case 102057:
					resultData.caseName = '客队射门';
				break;
				case 102058:
					resultData.caseName = '客队黄牌';
				break;
				case 100000:
					resultData.caseName = '上半场开始';
					$scope.playMeathod.detail.canvasState = '上半场';
				break;
				case 100001:
					resultData.caseName = '上半场结束';
					$scope.playMeathod.detail.canvasState = '中场休息';
				break;
				case 100002:
					resultData.caseName = '下半场开始';
					$scope.playMeathod.detail.canvasState = '下半场';
				break;
				case 1240464:
					resultData.caseName = '比赛已结束';
					$scope.playMeathod.detail.canvasState = '结束';
					$scope.playMeathod.detail.matchIcon = -200;
				break;
				default:
					resultData.caseName = '状态无记录';
				break;
			}
			$scope.playMeathod.detail.rqTime = resultData.caseName;
			if(resultData.caseType.toString().substr(0,3)==101){
				resultData.TeamID = 1;
			}else{
				resultData.TeamID = 2;
			};
			if(resultData.caseType==101025||resultData.caseType==101028||resultData.caseType==101029||resultData.caseType==101030||resultData.caseType==101031||resultData.caseType==101032||resultData.caseType==101034||resultData.caseType==102049||resultData.caseType==102052||resultData.caseType==102053||resultData.caseType==102054||resultData.caseType==102055||resultData.caseType==102056||resultData.caseType==102058){
			$scope.stakeData.caseTypeList.unshift(resultData);	
			}
		}
		
	})
	$scope.$on('upData-playMeathod',function(){//10003
		init();
	});
	$scope.$on('upData-stakeMethod',function(){//10004
		pop.loadHide();
		var res = mainService.stakeMethod.get();
		var objIndex = JSON.parse(sessionStorage.getItem('indexObj'));
		var pIndex = objIndex.pIndex;
		var cIndex = objIndex.cIndex;
		if(res.result.result==1){
			pop.drawWarn('成功投注',1000);
		}else if(res.result.result==2){
			$scope.stakeData.showStakeSure = 0;
			$scope.playMeathod.detail[pIndex].list[cIndex].zt = 0;
			if(res.result.body==1){
				pop.drawWarn('押注失败市场信息不存在',1500)
			}else if(res.result.body==2){
				pop.drawWarn('押注失败已停止押注',1500)
			}else if(res.result.body==3){
				pop.drawWarn('押注失败超出限额',1500)
			}else if(res.result.body==4){
				pop.drawWarn('押注失败金豆不足',1500)
			}else if(res.result.body==5){
				pop.drawWarn('押注创建订单失败',1500)
			}
		}else if(res.result.result==259){
			pop.drawWarn('比赛失效，押注失败',1500)
		}
	});
	$scope.$on('upData-stakeThen',function(){//100001
		var res = mainService.stakeThen.get();
		if(res.result.result==1){
			var item = res.result.body;
			var pIndex1,cIndex1;
			for(var i in $scope.playMeathod.detail){
				if($scope.playMeathod.detail[i].id==item.id){
					pIndex1 = i;
					$scope.playMeathod.detail[i].list.some(function(v,i){
						cIndex1 = i;
						return v.zid==item.zid;
					})
				}
			};
			var selectKey = $scope.playMeathod.detail[pIndex1].list[cIndex1].zid+'&'+$scope.playMeathod.detail[pIndex1].id;
			if($scope.stakeData.stakeChecked==selectKey&&item.zt==2){
				$scope.stakeData.showStakeSure = 1;
			}else if($scope.stakeData.stakeChecked==selectKey&&item.zt==0){
				$scope.stakeData.showStakeSure = 0;
			};
			$scope.playMeathod.detail[pIndex1].list[cIndex1].zt = item.zt;
			$scope.playMeathod.detail[pIndex1].list[cIndex1].cs = item.cs;
			$scope.playMeathod.detail[pIndex1].list[cIndex1].je = item.je;
			$scope.playMeathod.detail[pIndex1].list[cIndex1].yl = item.yl;
			$scope.playMeathod.detail[pIndex1].list[cIndex1].fh = item.fh;
			$scope.stakeData.showFanhui = item.fh;
			$scope.stakeData.bettingNum = item.cs;
			$scope.stakeData.selfBeanNum = item.je;
			$scope.stakeData.selfProfit = item.yl;
		}else{
			pop.drawWarn('参数错误',1500);
		}
	});
	$scope.$on('upData-playMethodNew',function(){//100002
		var res = mainService.playMethodNew.get();
		if(res.result.result==1&&res.result.body.id==itemId){
			var resBody = res.result.body;
			if(resBody.bf!=null){
				var minArr = [];
				var sameArr = [];
				var maxArr = [];
				resBody.bf.list.forEach(function(v){
					var msArr = v.ms.split(':');
					if(msArr[0]==msArr[1]){
						sameArr.push(v);
					}else if(msArr[0]>msArr[1]){
						maxArr.push(v);
					}else if(msArr[0]<msArr[1]){
						minArr.push(v);
					};
				});
				resBody.bf.list = maxArr.concat(sameArr.concat(minArr));
				var bflist = resBody.bf.list;
				var bfLength =bflist.length;
				$scope.playMeathod.detail.bf.id = resBody.bf.id;
				for(var i=0;i<bfLength;i++){
					$scope.playMeathod.detail.bf.list[i].bl = bflist[i].bl;
					$scope.playMeathod.detail.bf.list[i].xr = bflist[i].xr;
				}
			};
			if(resBody.ds!=null){
				var dslist = resBody.ds.list;
				var dsLength =dslist.length;
				$scope.playMeathod.detail.ds.id = resBody.ds.id;
				for(var i=0;i<dsLength;i++){
					$scope.playMeathod.detail.ds.list[i].bl = dslist[i].bl;
					$scope.playMeathod.detail.ds.list[i].xt = dslist[i].xr;
				}
			};
			if(resBody.sf!=null){
				var sflist = resBody.sf.list;
				var sfLength =sflist.length;
				$scope.playMeathod.detail.sf.id = resBody.sf.id;
				for(var i=0;i<sfLength;i++){
					$scope.playMeathod.detail.sf.list[i].bl = sflist[i].bl;
					$scope.playMeathod.detail.sf.list[i].xt = sflist[i].xr;
				}
			};
			if(resBody.xjq!=null){
				var xjqlist = resBody.xjq.list;
				var xjqLength =xjqlist.length;
				$scope.playMeathod.detail.xjq.id = resBody.xjq.id;
				for(var i=0;i<xjqLength;i++){
					$scope.playMeathod.detail.xjq.list[i].bl = xjqlist[i].bl;
					$scope.playMeathod.detail.xjq.list[i].xr = xjqlist[i].xr;
				}
			};
			if(resBody.zqjq!=null){
				var zqjqlist = resBody.zqjq.list;
				$scope.playMeathod.detail.zqjq.id = resBody.zqjq.id;
				var zqjqLength =zqjqlist.length;
				for(var i=0;i<zqjqLength;i++){
					$scope.playMeathod.detail.zqjq.list[i].bl = zqjqlist[i].bl;
					$scope.playMeathod.detail.zqjq.list[i].xt = zqjqlist[i].xr;
				}
			};
		};
	});
	$scope.$on('upData-stateTypeData',function(){//100003本场数据
		var res = mainService.stateTypeData.get();
		if(res.result.result==1&&res.result.body.id==itemId){
			var newlistData = res.result.body.list[0];
			newlistData.styleL = {
				'width':parseInt(parseInt(newlistData.homeTeamValue)/(parseInt(newlistData.homeTeamValue)+parseInt(newlistData.awayTeamValue))*36)+'vw'
			};
			newlistData.styleR = {
				'width':parseInt(parseInt(newlistData.awayTeamValue)/(parseInt(newlistData.homeTeamValue)+parseInt(newlistData.awayTeamValue))*36)+'vw'
			};
			var stateHas = $scope.playMeathod.detail.tj.some(function(v){
				if(v.statsType==90000){
					$scope.playMeathod.detail.zscore = v.homeTeamValue;
					$scope.playMeathod.detail.kscore = v.awayTeamValue;
				};
				if(v.statsType==newlistData.statsType){
					v.styleL = newlistData.styleL;
					v.styleR = newlistData.styleR;
					v.homeTeamValue = newlistData.homeTeamValue;
					v.awayTeamValue = newlistData.awayTeamValue;
				}
				return newlistData.statsType == v.statsType
			})
		}
	});
	$scope.$on('upData-selfBeanChange',function(){//金豆
		var res = mainService.selfBeanChange.get();
		if(res.result.result==1){
			var userInfo = mainService.userInfoData.get();
			userInfo.selfBean = res.result.body.sl;
			$scope.stakeData.showSelectAll = userInfo.selfBean;
			mainService.userInfoData.set(userInfo);
		}
	})
	//加注事件
	$scope.betdBtnAction = function(){
		$scope.stakeData.showStakeSure = 0;
	};
	var MarmainQueeStop,MarmainQuee;
	//头部轮询消息
	$scope.$on('upData-headRound',function(){//头部实时消息推送100005
		var res = mainService.headRound.get();
		if(res.result.result == 1){
			var res = mainService.headNoteMes.get();
			if(res.result.result==1){
				$scope.headMesNoteDe = res.result.body.info;
				$scope.guessState.headMesNoteState = true;
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
						requestAnimationFrame(MarmainQuee)
					}
					MarmainQuee()
				})
			}
		}else{
			pop.drawWarn('走马灯获取信息失败',1500)
		}
	});
	
	//押注轮播切换事件
	$scope.stakePlayAction = function(index){
		$scope.stakeData.showStakeBtn = false;
		$scope.stakeData.slideTitle = $scope.playMeathod.title2[index];
	};
	//切换实时赛况按钮
	$scope.liveDataChange = function(state){
		$scope.guessState.liveState = state;
	};
	//切换分析模块按钮
	$scope.analysisDataChange = function(state){
		$scope.guessState.analysisState = state;
		switch(state){
			case 0:
				
			break;
			case 1:
				
			break;
			//未来赛事获取数据
			case 2:
				/*mainService.getFutrueMatch('',function(res){
					$scope.matchFutrue = res;
					$scope.matchFutrue.forEach(function(v){
						var timerFu = mainService.dateSwitch(v.EventDate);
						v.EventDate = timerFu.getFullYear()+'-'+(timerFu.getMonth()+1)+'-'+timerFu.getDate();
					})
				},function(e){
					console.log(e)
				})*/
			break;
		}
	};
	//点击判断五种玩法的每个小选项哪个选中
	$scope.guessAction = function(item,index,indexState,state){
		if(item.zt==0){
			$scope.stakeData.showStakeSure = 0;
		}else if(item.zt==1){
			$scope.stakeData.showStakeSure = 2;
		}else if(item.zt==2){
			$scope.stakeData.showStakeSure = 1;
		}else if(item.zt==3){
			$scope.stakeData.showStakeSure = 4;
		}else if(item.zt==4){
			$scope.stakeData.showStakeSure = 3;
		};
		$scope.stakeData.showFanhui = item.fh;
		$scope.guessState.slideChange = 1;
		$scope.stakeData.stakeChecked = item.zid+'&'+$scope.playMeathod.detail[state].id;
		$scope.stakeData.showStakeDou = 10;
		if(item.xr<10){
			$scope.stakeData.showStakeDou = item.xr;
		};
		if(state=='bf'){
			var msArr = item.ms.split(':');
			if(msArr[0]==msArr[1]){
				$scope.guessState.guessCountSlide=1;
			}else if(msArr[0]>msArr[1]){
				$scope.guessState.guessCountSlide=0;
			}else if(msArr[0]<msArr[1]){
				$scope.guessState.guessCountSlide=2;
			};
		};
		$scope.stakeData.showOddsNum = item.bl;
		$scope.stakeData.showStakeGain = parseInt(parseInt($scope.stakeData.showStakeDou)*(parseFloat($scope.stakeData.showOddsNum)-1));
		$scope.stakeData.showSelectMax = item.xr;
		
		$scope.stakeData.bettingNum = item.cs;
		$scope.stakeData.selfBeanNum = item.je;
		$scope.stakeData.selfProfit = item.yl;
		$scope.guessState.stakeHoldeState.pIndex = state;
		$scope.guessState.stakeHoldeState.cIndex = indexState;
		$timeout(function(){
			$ionicSlideBoxDelegate.slide(index,200);
			$scope.stakeData.showStakeBtn = true;
			$scope.stakeData.slideTitle = $scope.playMeathod.title2[index];
		},0)
	};
	//点击显示隐藏模拟select
	$scope.changeSelect = function(state){
		switch(state){
			case 1:
				$scope.guessState.selectShow = 1;
			break;
			case 'all':
				$scope.stakeData.showSelectCon = $scope.stakeData.showSelectAll;
				$scope.guessState.selectShow = 0;
			break;
			default:
				$scope.guessState.selectShow = 0;
				if(state>$scope.stakeData.showSelectAll){
					pop.alert('提示','金豆不足无法完成投注，请充值','取消','充值',function(){$scope.stakeData.stateToggle = true;},function(){
						$scope.stakeData.stateToggle = true;
						$state.go('hotPayCenter')
					});
				}else{
					$scope.stakeData.showSelectCon = state;
				}
			break;
		};
	};
	//点击屏幕让select收起
	var oHotDom = document.querySelector(".hot_default");
	oHotDom.addEventListener('click',function(e){
		if(e.target.nodeName == 'I'){
			if(e.target.parentNode.className.indexOf('option')===-1){
				$scope.guessState.selectShow = 0;
			}
		}else if(e.target.className.indexOf('option')===-1){
			$scope.guessState.selectShow = 0;
		}
	},false);
	//点击押注减号事件
	$scope.reduceBtn = function(){
		$scope.stakeData.showStakeDou -= $scope.stakeData.showSelectCon;
		if($scope.stakeData.showStakeDou<10){
			$scope.stakeData.showStakeDou=10;
			$scope.stakeData.stateToggle = false;
			pop.loadAuto('投注超出下限',1500);
			return false;
		}
		$scope.stakeData.showStakeGain = parseInt(parseInt($scope.stakeData.showStakeDou)*(parseFloat($scope.stakeData.showOddsNum)-1));
	};
	//点击押注加号事件
	$scope.addBtn = function(){
		$scope.stakeData.showStakeDou += $scope.stakeData.showSelectCon;
		if($scope.stakeData.showSelectAll>=$scope.stakeData.showSelectMax){
			if($scope.stakeData.showStakeDou>=$scope.stakeData.showSelectMax){
				$scope.stakeData.showStakeDou = $scope.stakeData.showSelectMax;
				$scope.stakeData.stateToggle = false;
				pop.loadAuto('投注超出上限',1500);
			}
		}else{
			if($scope.stakeData.showStakeDou>=$scope.stakeData.showSelectAll){
				$scope.stakeData.showStakeDou = $scope.stakeData.showSelectAll;
				$scope.stakeData.stateToggle = false;
				pop.alert('提示','金豆不足无法完成投注，请充值','取消','充值',function(){$scope.stakeData.stateToggle = true;},function(){$scope.stakeData.stateToggle = true;$state.go('tabs.hotPayCenter')});
			}
		};
		$scope.stakeData.showStakeGain = parseInt(parseInt($scope.stakeData.showStakeDou)*(parseFloat($scope.stakeData.showOddsNum)-1));
	};
	//长时间押注减号事件
	$scope.reduce_hold = function(){
		$scope.stakeTimer = $interval(function(){
			$scope.reduceBtn();
		},100)
	};
	//长时间押注加号事件
	$scope.add_hold = function(){
		$scope.stakeTimer = $interval(function(){
			if($scope.stakeData.stateToggle){
				$scope.addBtn();
			}
		},100)
	};
	//取消长安事件
	$scope.release = function(){
		$interval.cancel($scope.stakeTimer)
	};
	//确认投注
	$scope.stakeSurePut = function(){
		pop.alertStake('投注确认','<p>即将投注<span class="bean_count">'+$scope.stakeData.showStakeDou+'</span>金豆</p><p>系统将在20秒内确认是否投注成功</p>','取消','投注',function(){},function(){
//			pop.loading();
			var indexObj = $scope.guessState.stakeHoldeState;
			sessionStorage.setItem('indexObj',JSON.stringify(indexObj));
			var pIndex = indexObj.pIndex;
			var cIndex = indexObj.cIndex;
			$scope.stakeData.showStakeSure = 2;
			$scope.playMeathod.detail[pIndex].list[cIndex].zt = 1;
			webSocket.send({'cmd':10004,'body':{'id':itemId,'wfid':$scope.stakeData.stakeChecked.split('&')[1],'zid':$scope.stakeData.stakeChecked.split('&')[0],'jine':$scope.stakeData.showStakeDou}});
		});
	};
	//点击切换竞猜 实况 分析
	$scope.guessChecked = function(index){
		$scope.guessState.checked = index;
		switch(index){
			case 0:
				
			break;
			case 1:
				
			break;
			case 2:
				//获取分析 历史数据
				/*mainService.getAnalysisHisList('',function(res){
					$scope.analysisHisList = res;
					$scope.analysisHisList.Data.forEach(function(v){
						var tipTimeDate = mainService.dateSwitch(v.EventDate);
						v.EventDate = tipTimeDate.getFullYear()+"-"+((tipTimeDate.getMonth()+1)>9 ? (tipTimeDate.getMonth()+1) : "0"+(tipTimeDate.getMonth()+1))+'-'+(tipTimeDate.getDate()>9?tipTimeDate.getDate():"0"+tipTimeDate.getDate())+' '+(tipTimeDate.getHours() > 9 ? tipTimeDate.getHours() : "0" + tipTimeDate.getHours()) + ":" + (tipTimeDate.getMinutes() > 9 ? tipTimeDate.getMinutes() : "0" + tipTimeDate.getMinutes());
					});
				},function(e){
					console.log(e)
				});*/
			break;
		}
	};
	$scope.$on('upData-backBeanData',function(){//取消投注退回金豆
		var res = mainService.backBeanData.get();
		var objIndex = JSON.parse(sessionStorage.getItem('indexObjBack'));
		var pIndex = objIndex.pIndex;
		var cIndex = objIndex.cIndex;
		if(res.result.result ==1){
			pop.drawWarn('退换成功',1000);
			$scope.stakeData.showStakeSure = 0;
			$scope.playMeathod.detail[pIndex].list[cIndex].zt = 0;
		}else if(res.result.result==2){
			$scope.stakeData.showStakeSure = 1;
			$scope.playMeathod.detail[pIndex].list[cIndex].zt = 2;
			if(res.result.body==1){
				pop.drawWarn('押注失败市场信息不存在',1500)
			}else if(res.result.body==2){
				pop.drawWarn('押注失败已停止押注',1500)
			}else if(res.result.body==3){
				pop.drawWarn('押注失败无可反悔的押注',1500)
			}
		}
	})
	$scope.backBean = function(beanNum){//金豆退回
		pop.alertStake('提示','<p>是否立即兑换<span class="bean_count">'+beanNum+'</span>金豆</p>','取消','兑现',function(){},function(){
			var indexObj = $scope.guessState.stakeHoldeState;
			sessionStorage.setItem('indexObjBack',JSON.stringify(indexObj));
			var pIndex = indexObj.pIndex;
			var cIndex = indexObj.cIndex;
			$scope.stakeData.showStakeSure = 3;
			$scope.playMeathod.detail[pIndex].list[cIndex].zt = 4;
			webSocket.send({'cmd':10005,body:{'id':itemId,'wfid':$scope.stakeData.stakeChecked.split('&')[1],'zid':$scope.stakeData.stakeChecked.split('&')[0]}});
		})
	};
	//点击购买金豆
	$scope.jumpPayPage = function(){
		if($location.path().substr(0,8)=='/tab/hot'){
			$state.go('tabs.payCenterH');
		}else{
			$state.go('tabs.payCenterC');
		}
		
	};
	//跳转玩法介绍
	$scope.jumpPlayShow = function(){
		if($location.path().substr(0,8)=='/tab/hot'){
			$state.go('tabs.playShow');
		}else{
			$state.go('tabs.playShowCom');
		}
//		$ionicViewSwitcher.nextDirection("forward");
	};
	$scope.jumpGuessRecord = function(){
		if($location.path().substr(0,8)=='/tab/hot'){
			$state.go('tabs.guessRecord',{id:$stateParams.itemId});
		}else{
			$state.go('tabs.guessRecordcom',{id:$stateParams.itemId});
		}
	}
	
	
	
	
	
	
	
	
	
	//头部canvas足球效果
	var num = 1;
	canvasTimes = $interval(intervalDraw, 50);
	function intervalDraw() {
		if(num < 39) {
			num++;
			//if($scope.change != undefined) {
				draw();
			//}
		} else {
			num = 1
			//if($scope.change != undefined) {
				draw();
			//}
		}
	};
	var canvas = document.getElementById("canvas"); //获取canvas元素
	var width = canvas.width; //获取canvas元素的宽度
	var height = canvas.height; //获取canvas元素的高度
	var context = canvas.getContext('2d'); //获取canvas元素的图形上下文对象
	var attacky = [0.3 * height, 0.5 * height, 0.8 * height];
	var angle_attacky = [0.3 * height];
	var bingoy = [0.5 * height]; //进球；
	var a_attackx = [0.6 * width];
	var a_attackedx = [0.6 * width, 0.65 * width];
	var a_risk_attackedx = [0.7 * width];
	var a_bingox = [0.3 * width, 0.5 * width, 0.8 * width]
	var a_anglex = [0.73 * width]
	var any_attackedx = [0.5 * width];
	var b_attackedx = [0.4 * width, 0.45 * width];
	var b_anglex = [0.27 * width]
	var b_bingox = [0.2 * width]
	var b_risk_attackedx = [0.28 * width]
	var BallX = any_attackedx[0]; //随机设置小球的当前横坐标
	var BallY = attacky[1]; //随机设置小球的当前纵坐标
	//重绘矩形桌面与小球
	function draw() {
		context.clearRect(0, 0, width, height); //清除canvas元素中的内容
		//图片改变;
		context.save(); //保存当前绘制状态
		context.scale(0.125, 0.25);
		context.beginPath(); //开始创建路径
		var pic = new Image();
		pic.src = 'img/ball.png';
		context.drawImage(pic, (num - 1) * 77, $scope.canvas.colorY * 87, 77, 87, (BallX - 26) * 8, (BallY - 38) * 4, width, height);

		context.closePath(); //关闭路径
		context.restore(); //恢复上次保存的绘制状态;
		//			各种状态小球坐标；
		//		$scope.caseEventState=101024;
		if($scope.oldState != $scope.playMeathod.detail.matchIcon) {
			switch($scope.playMeathod.detail.matchIcon) {
				case 101030: //主队进球无效
					BallX = any_attackedx[0]; //球场中央
					BallY = bingoy[0]; //球场中央
					$scope.oldState = 101030;
					$scope.change = "101030";
					$scope.canvas.colorY = 0;
					break;
				case 101024: //主队进攻
					BallX = a_attackedx[parseInt(Math.random() * 2)]; //球场右边0.6或0.65
					BallY = attacky[parseInt(Math.random() * 3)]; //上下随机
					$scope.oldState = 101024;
					$scope.change = "101024";
					$scope.canvas.colorY = 0;
					break;
				case 101026: //主队危险进攻
					BallX = a_risk_attackedx[0]; //球场右边0.7位置
					BallY = attacky[parseInt(Math.random() * 3)]; //上下随机
					$scope.oldState = 101026;
					$scope.change = "101026";
					$scope.canvas.colorY = 1;
					break;
				case 101028: //主队任意球
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[parseInt(Math.random() * 3)]; //随机设置小球的当前纵坐标
					$scope.oldState = 101028;
					$scope.change = "101028";
					$scope.canvas.colorY = 0;
					break;
				case 101031: //主队点球
					BallX = a_risk_attackedx[0]; //0.7位置
					BallY = bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101031;
					$scope.change = "101031";
					$scope.canvas.colorY = 0;
					break;
				case 101025: //主队角球
					BallX = a_anglex[0]; //随机设置小球的当前横坐标
					BallY = angle_attacky[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101025;
					$scope.change = "101025";
					$scope.canvas.colorY = 0;
					break;
				case 101029: //主队进球
					BallX = a_bingox[2]; //随机设置小球的当前横坐标
					BallY = bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101029;
					$scope.change = "101029";
					$scope.canvas.colorY = 2;
					break;
				case 101034: //主队黄牌
									BallX =a_bingox[parseInt(Math.random() * 3)]; //随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101034;
					$scope.change = "101034";
					$scope.canvas.colorY = 0;
					break;
				case 101045: //主队2黄变一红
									BallX =a_bingox[parseInt(Math.random() * 3)];//随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101045;
					$scope.change = "101045";
					$scope.canvas.colorY = 0;
					break;
				case 101032: //主队红牌
									BallX =a_bingox[parseInt(Math.random() * 3)]; //随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 101032;
					$scope.change = "101032";
					$scope.canvas.colorY = 0;
					break;
				case 102058: //客队黄牌
									BallX =a_attackedx[parseInt(Math.random() * 2)]; //随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102058;
					$scope.change = "102058";
					$scope.canvas.colorY = 0;
					break;
				case 102069: //客队2黄变1红;
									BallX =a_attackedx[parseInt(Math.random() * 2)]; //随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102069;
					$scope.change = "102069";
					$scope.canvas.colorY = 0;
					break;
				case 102056: //客队红牌
									BallX =a_attackedx[parseInt(Math.random() * 2)]; //随机设置小球的当前横坐标
									BallY =bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102056;
					$scope.change = "102056";
					$scope.canvas.colorY = 0;
					break;
				case 102054: //客队进球无效
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102054;
					$scope.change = "102054";
					$scope.canvas.colorY = 0;
					break;
				case 102053: //客队进球；
					BallX = b_bingox[0]; //随机设置小球的当前横坐标
					BallY = bingoy[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102053;
					$scope.change = "102053";
					$scope.canvas.colorY = 2;
					break;
				case 102055: //客队点球
					BallX = a_bingox[0]; //随机设置小球的当前横坐标
					BallY = attacky[1]; //随机设置小球的当前纵坐标
					$scope.oldState = 102055;
					$scope.change = "102055";
					$scope.canvas.colorY = 0;
					break;
				case 102049: //客队角球
					BallX = b_anglex[0]; //随机设置小球的当前横坐标
					BallY = angle_attacky[0]; //随机设置小球的当前纵坐标
					$scope.oldState = 102049;
					$scope.change = "102049";
					$scope.canvas.colorY = 0;
					break;
				case 102052: //客队任意球
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[parseInt(Math.random() * 3)]; //随机设置小球的当前纵坐标
					$scope.oldState = 102052;
					$scope.change = "102052";
					$scope.canvas.colorY = 0;
					break;
				case 102048: //客队进攻
					BallX = b_attackedx[parseInt(Math.random() * 2)]; //随机设置小球的当前横坐标
					BallY = attacky[parseInt(Math.random() * 3)]; //随机设置小球的当前纵坐标
					$scope.oldState = 102048;
					$scope.change = "102048";
					$scope.canvas.colorY = 0;
					break;
				case 102050: //客队危险进攻
					BallX = b_risk_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[parseInt(Math.random() * 3)]; //随机设置小球的当前纵坐标
					$scope.oldState = 102050;
					$scope.change = "102050";
					$scope.canvas.colorY = 1;
					break;
				case -100: // 比赛未开始
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[1]; //随机设置小球的当前纵坐标
					$scope.oldState = -100;
					$scope.change = "-100";
					$scope.canvas.colorY = 0;
					break;
				case -200: // 比赛结束
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[1]; //随机设置小球的当前纵坐标
					$scope.oldState = -200;
					$scope.change = "-200";
					$scope.canvas.colorY = 0;
					break;
				case -300: // 无法连接服务器
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[1]; //随机设置小球的当前纵坐标
					$scope.oldState = -300;
					$scope.change = "-300";
					$scope.tips = '无服务连接';
					$scope.canvas.colorY = 0;
					break;
				default:
					BallX = any_attackedx[0]; //随机设置小球的当前横坐标
					BallY = attacky[1]; //随机设置小球的当前纵坐标
					$scope.canvas.colorY = 0;
				break;
			}
		}
	}
	
}])