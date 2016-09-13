var j = 0;
function MsgController( $scope ) {
    var apiConfig = JSON.parse( localStorage.ApiConfig );
    var AllAppIdJson = [{ "通知公告": "e6d44320-7deb-4fec-9f7d-b5b55c7a6d73", "成绩查询": "7f6b4c18-e26f-4f01-a9e2-68796fd81023", "行政办公": "76014e09-c57c-4ec4-aff8-d7600a0885d0", "出勤情况": "e923e0ae-dbae-47b7-bcd1-2398ef2ca3ae", "日常表现": "d923e0ae-dbae-47b7-bcd1-2398ef2ca3ad", "今日作业": "f923e0ae-dbae-47b7-bcd1-2398ef2ca3af", "校园新闻": "xiaoyuanxinwen", "公众号": "gongzhonghao" }];
    //var AllAppIdJson = apiConfig.AllAppIdJson;
    var AllAppId = JSON.stringify( AllAppIdJson );
    //BindingLatestTopOneMsgData($scope)
    var isSuccess = 0;
    $scope.NoData = 0;
alert(11)
    var userId = appcan.locStorage.val( "UserID" );
    var Token = appcan.locStorage.val( "Token" );

    //var GetLatestTopOneUrl = BaseUrl + '/MessageCenter.WebApiService/api/user/' + userId + '/Messages/LatestTopOne/GroupByApp?accessToken=' + Token;

    var GetLatestTopOneType = apiConfig.GetLatestTopOne.Type;
    var LatestTopOneApiParameters = { "UserId": userId, "accessToken": Token };

    var GetLatestTopOneUrl = apiConfig.GetLatestTopOne.Url;
    GetLatestTopOneUrl = GetMappingUrl( GetLatestTopOneUrl, LatestTopOneApiParameters );
    $.ajax( {
        url: GetLatestTopOneUrl,
        type: GetLatestTopOneType,
        dataType: "json",
        data: LatestTopOneApiParameters,
        success: function ( data ) {
            alert(data)
            isSuccess = 1;
            localStorage.MsgData = JSON.stringify( data );
            if ( data == '' ) {
                $scope.NoData = 1;
                $scope.$apply();
            }
        },
        complete: function () {
            if ( isSuccess != 1 ) {
                BindingLatestTopOneMsgData( $scope );
                touchEvent();
                //alert("获取消息中心数据失败（005）");
                isSuccess = 0;
            } else {
                BindingLatestTopOneMsgData( $scope );
                touchEvent();
            }
        }
    } );

    //var GetUnReadCountUrl = BaseUrl + '/MessageCenter.WebApiService/api/user/' + userId + '/Messages/UnRead/Count/GroupByApp';
    var apiConfig = JSON.parse( appcan.getLocVal( "ApiConfig" ) );
    var GetUnReadCountUrl = apiConfig.GetUnReadCount.Url;
    var UnReadCountApiParameters = { "userId": userId, "accessToken": Token };
    GetUnReadCountUrl = GetMappingUrl( GetUnReadCountUrl, UnReadCountApiParameters );
    var GetUnReadCountType = apiConfig.GetUnReadCount.Type;
    $.ajax( {
        url: GetUnReadCountUrl,
        type: GetUnReadCountType,
        dataType: "json",
        data: UnReadCountApiParameters,
        success: function ( data ) {
            isSuccess = 1;
            $scope.URCount = data;
            $scope.$apply();
            localStorage.UnReadCount = JSON.stringify( data );
            var UnReadCountData = data;
            for ( var i = UnReadCountData.length - 1; i >= 0; i-- ) {
                j += UnReadCountData[i].UnReadCount;
            }
            localStorage.UnReadCountSum = j;
        },
        complete: function () {
            if ( isSuccess != 1 ) {
                //alert("获取消息中心数据失败（004）");
                isSuccess = 0;
            }
        }
    } );

    appcan.ready( function () {
        UnRead( j );
        NetworkState();
        ReFresh( $scope, GetUnReadCountUrl, GetUnReadCountType, GetLatestTopOneUrl, GetLatestTopOneType )
        $( "#divContent1" ).show();
        $( "#loading" ).hide();
        touchEvent();
    } );
}//controller结束

function BindingLatestTopOneMsgData( $scope ) {
    var LatestTopOneMsgData = localStorage.MsgData;
    if ( LatestTopOneMsgData == [] || LatestTopOneMsgData == '' || LatestTopOneMsgData == null ) {
        $scope.NoData = 1;
        $scope.$apply();
    }
    var LatestTopOneMsg = JSON.parse( LatestTopOneMsgData );
    $scope.LastMsg = LatestTopOneMsg;
    $scope.$apply();
    for ( var i in LatestTopOneMsg ) {
        if ( AllAppId.indexOf( LatestTopOneMsg[i].Application.Id ) != -1 ) {
            $( function () {
                $( "[appIconId='" + LatestTopOneMsg[i].Application.Id + "']" ).css( "background-image", "url('../MyMsgContent/css/myImg/" + LatestTopOneMsg[i].Application.Id + ".png')" );
            } )
        } else {
            $( function () {
                $( "[appIconId='" + LatestTopOneMsg[i].Application.Id + "']" ).css( "background-image", "url('../MyMsgContent/css/myImg/others.png')" );
            } )
        }
    }
}

function SetMsgRead( appId ) {
    var userId = appcan.locStorage.val( "UserID" );
    var Token = appcan.locStorage.val( "Token" )
    //var SetMsgReadUrl = appcan.locStorage.val("BaseUrl3") + '/MessageCenter.WebApiService/api/envelope/open/app';
    var apiConfig = JSON.parse( appcan.getLocVal( "ApiConfig" ) );
    var SetMsgReadUrl = apiConfig.SetMsgRead.Url;
    var SetMsgReadType = apiConfig.SetMsgRead.Type;
    var SetMsgReadApiParameters = { "UserId": userId, "AppId": appId, "accessToken": Token };
    SetMsgReadUrl = GetMappingUrl( SetMsgReadUrl, SetMsgReadApiParameters );
    $.ajax( {
        url: SetMsgReadUrl,
        type: SetMsgReadType,
        data: SetMsgReadApiParameters,
        dataType: "json",
        success: function ( data, status, xhr ) {
            var isSuccess = 1;
        },
        complete: function () {
            if ( isSuccess != 1 ) {
                //alert("获取消息中心数据失败（006）");
            }
        }
    } );
}

//未读左上角左下角未读消息总数
function UnRead( j ) {
    appcan.window.evaluateScript( {
        name: "MainTab",
        scriptContent: "UnReadNum('" + j + "')"
    } );
}

function ReFresh( $scope, GetUnReadCountUrl, GetUnReadCountType, GetLatestTopOneUrl, GetLatestTopOneType ) {
    NetworkState();
    var Token = appcan.locStorage.val( "Token" );
    setInterval( "UnReadCount()", 10000 );//自动刷新
    appcan.frame.setBounce( 0, function ( type ) {
    }, function ( type ) {
    }, function ( type ) {
        setTimeout( function ( type ) {
            appcan.frame.resetBounce( type );

            //未读数量刷新
            $.ajax( {
                url: GetUnReadCountUrl,
                type: GetUnReadCountType,
                dataType: "json",
                data: { "accessToken": Token },
                success: function ( data ) {
                    isSuccess = 1;
                    $scope.URCount = data;
                    $scope.$apply();
                    localStorage.UnReadCount = data;
                    UnReadCountData = data;
                },
                complete: function () {
                    if ( isSuccess != 1 ) {
                        //alert("获取消息中心数据失败（007）");
                        isSuccess = 0;
                    } else {
                        var j = 0;
                        for ( var i = UnReadCountData.length - 1; i >= 0; i-- ) {
                            j += UnReadCountData[i].UnReadCount;
                        }
                        localStorage.UnReadCountSum = j;
                        UnRead( j );
                        isSuccess = 0;
                    }
                }
            } );

            //未读消息刷新
            $.ajax( {
                url: GetLatestTopOneUrl,
                type: GetLatestTopOneType,
                dataType: "json",
                data: { "accessToken": Token },
                success: function ( data ) {
                    isSuccess = 1;
                    localStorage.MsgData = JSON.stringify( data );
                },
                complete: function () {
                    if ( isSuccess != 1 ) {
                        //alert("获取消息中心数据失败（008）");
                        isSuccess = 0;
                    } else {
                        BindingLatestTopOneMsgData( $scope )
                        touchEvent();
                        isSuccess = 0;
                    }
                }
            } );
        }, 1000 );
    } )
}

function touchEvent() {
    $( function () {
        $( "#divContent1>ul>li" ).on( "click", function () {
            $( this ).addClass( "sc-bg-active" );
            setTimeout( "$('#divContent1>ul>li').removeClass('sc-bg-active');", 300 );
        } );

        $( ".msgClass" ).on( "click", function () {
            var AppId = $( this ).attr( "AppId" );
            appcan.locStorage.setVal( "AppId", AppId );
            if ( AppId == "e6d44320-7deb-4fec-9f7d-b5b55c7a6d73" ) {
                appcan.window.open( "Notice", "../MyApp/Notice.html", 5 );
            } else {
                appcan.window.open( "MsgCenter", "../MyMsg/MsgCenter.html", 2 );
            }
            var UnReadCountSum = appcan.locStorage.val( "UnReadCountSum" );
            if ( UnReadCountSum != 0 ) {
                var n = $( this ).find( ".UnReadCount" ).html();
                UnReadCountSum = UnReadCountSum - n;
                UnRead( UnReadCountSum );
                $( this ).find( ".UnReadCount" ).html( 0 ).hide();//点击后把未读数量标记为0，并隐藏
                SetMsgRead( AppId );
            }
        } );
    } )
}

function UnReadCount() {
    NetworkState();
    var userId = appcan.locStorage.val( "UserID" );
    var BaseUrl = appcan.locStorage.val( "BaseUrl3" );
    var Token = appcan.locStorage.val( "Token" );
    //var GetUnReadCountUrl = BaseUrl + '/MessageCenter.WebApiService/api/user/' + userId + '/Messages/UnRead/Count/GroupByApp';
    var apiConfig = JSON.parse( appcan.getLocVal( "ApiConfig" ) );
    var GetUnReadCountUrl = apiConfig.GetUnReadCount.Url;
    var UnReadCountApiParameters = { "UserId": userId, "accessToken": Token };
    GetUnReadCountUrl = GetMappingUrl( GetUnReadCountUrl, UnReadCountApiParameters );
    var GetUnReadCountType = apiConfig.GetUnReadCount.Type;
    var isSuccess = 0;
    //未读数量刷新
    $.ajax( {
        url: GetUnReadCountUrl,
        type: GetUnReadCountType,
        dataType: "json",
        data: { "accessToken": Token },
        success: function ( data ) {
            isSuccess = 1;
            localStorage.UnReadCount = data;
            UnReadCountData = data;
        },
        complete: function () {
            if ( isSuccess == 1 ) {
                var j = 0;
                for ( var i = UnReadCountData.length - 1; i >= 0; i-- ) {
                    j += UnReadCountData[i].UnReadCount;
                }
                localStorage.UnReadCountSum = j;
                UnRead( j );
                isSuccess = 0;
            }
        }
    } );
}

function NetworkState() {
    appcan.device.getInfo(13, function (err, data, dataType, optId) {
        var netStatus = JSON.parse(data);
        if (netStatus.connectStatus == "-1")//-1：网络不可用，0：WIFI 1：3G，2：2G
        {
            //网络不可用
            var NoNetwork = '<div class="tx-c umh4 NoNetworkColor diyLineHeight" id="NoNetwork">网络不可用，请检查网络设置！</div>';
            $("#NetworkState").html(NoNetwork);
        }
        else {
            $("#NoNetwork").hide();
        }
    });
}