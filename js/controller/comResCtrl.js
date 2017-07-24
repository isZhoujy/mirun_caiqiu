mirun.controller('comResCtrl',['$scope','$state','$stateParams','$timeout','$interval','$ionicTabsDelegate','$ionicSlideBoxDelegate','$ionicScrollDelegate','mainService','pop',function($scope,$state,$stateParams,$timeout,$interval,$ionicTabsDelegate,$ionicSlideBoxDelegate,$ionicScrollDelegate,mainService,pop){
	$scope.buttonBarCon = ['实时赛况','本场数据'];
	$scope.state = {
		btnActive:0,//button切换
		hasDataLive:true,//实施赛况是否有数据
	};
	$scope.mainList = JSON.parse(sessionStorage.getItem('competeItem'))||{};
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
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicTabsDelegate.showBar(false)
	});
	$scope.mainList.cs.forEach(function(v){
		if(v.caseType.toString().substr(0,3)==101){
			v.TeamID=1;
		}else{
			v.TeamID=2;
		}
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
		};
	});
	$scope.mainList.cs.sort(function(a,b){
		return b.caseMinutes-a.caseMinutes
	});
	var matchDataList = $scope.mainList.tj;
	$scope.mainList.tj = matchData;
	$scope.mainList.tj.forEach(function(vWrap){
		matchDataList.forEach(function(v){
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
		})
	});
	
	//获取本场数据信息
	/*mainService.getMatchResDataList('',function(res){
		$scope.matchMainData = res;
		$scope.matchResultList = res.EventStatsAnalysisDtoList;
		$scope.matchResultList.forEach(function(v){
			v.styleL = {
				'width':parseInt(v.HomeTeamValue)/(parseInt(v.HomeTeamValue)+parseInt(v.AwayTeamValue))*36+'vw'
			}
			v.styleR = {
				'width':parseInt(v.AwayTeamValue)/(parseInt(v.HomeTeamValue)+parseInt(v.AwayTeamValue))*36+'vw'
			}
		})
	},function(e){
		console.log(e)
	});
	//获取实时赛果信息
	mainService.getMatchEventList('',function(res){
		$scope.matchEventList = res;
		console.log(res)
	},function(e){
		console.log(e)
	});*/
	
}])