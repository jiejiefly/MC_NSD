//移动校园1.0
var plat;
window.uexOnload = function (type) {
    //appcan.locStorage.remove();
    appcan.setLocVal("BaseUrl", "http://221.224.83.111/mobile/api/");
    uexWidgetOne.cbGetMainWidgetId = cbGetMainWidgetId;
    uexWidgetOne.getMainWidgetId();

    //获取版本号
    uexWidgetOne.cbGetCurrentWidgetInfo = cbGetCurrentWidgetInfo;
    uexWidgetOne.getCurrentWidgetInfo();
    
    //获取平台信息（andriod or ios）
    uexWidgetOne.cbGetPlatform = cbGetPlatform;
    uexWidgetOne.getPlatform();

    //if (!type) {
        ExitForAndroid();
    //}

    if (appcan.getLocVal("AppStarted-V20150629") == null) {
        ExecuteOneTime();
    }
    
    appcan.ready(function () {

        //登录和每次启动执行业务
        function LoginCheck() {

            var token = appcan.getLocVal("Token");
            if (token == null) {
                appcan.window.open({ name: 'Login', data: 'Login.html', aniId: 5 });
            }
            else {
                ExecuteMoreTimes();
                //appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
            }

        }

        //读取配置文件到本地缓存或DB里
        var baseUrl = appcan.getLocVal("BaseUrl");
        //alert(baseUrl);
        $.ajax({
            url: baseUrl + "Config/GetJson?category=app",
            type: "GET",
            dataType: "json",
            success: function (appConfig) {
                appcan.setLocVal("AppConfig", JSON.stringify(appConfig));
                //切换数据源的时候，清除Token
                var lastDataSource = appcan.getLocVal("DataSource");
                if (lastDataSource != appConfig.DataSource) {
                    appcan.locStorage.remove("Token");
                    appcan.setLocVal("DataSource", appConfig.DataSource);
                }
                if (appConfig.DataSource == "ProjectData") {
                    $.ajax({
                        url: baseUrl + "Config/GetScript?category=ProjectApi",
                        dataType: "json",
                        success: function (data) {
                            eval(data);
                            appcan.setLocVal("ApiConfig", apiConfig);
                            LoginCheck();
                            //if (MainWidgetId != "001") {
                            //    xgPush();
                            //};
                        },
                        error: function () { ErrorFun2('读取ProjectApi配置文件错误(004)！'); }
                    });
                }
                else if (appConfig.DataSource == "OnlineSampleData") {                   
                    $.ajax({
                        url: baseUrl + "Config/GetScript?category=OnlineSampleApi",
                        dataType: "json",
                        success: function (data) {
                            eval(data);
                            appcan.setLocVal("ApiConfig", apiConfig);
                            LoginCheck();
                            //if (MainWidgetId != "001") {
                            //    xgPush();
                            //};
                        },
                        error: function () { ErrorFun2('读取OnlineSampleApi配置文件错误(005)！'); }
                    });
                }
                else {                   
                    $.ajax({
                        url: "Config/LocalSampleApi.js",
                        dataType: "script",
                        success: function () {
                            //alert(apiConfig.GetUserInfo.Type);
                            appcan.setLocVal("ApiConfig", apiConfig);
                            LoginCheck();
                        },
                        error: function () { ErrorFun2('读取LocalSampleApi配置文件错误(006)！'); }
                    });
                }
                setAccessIdAndKey();
            },            
            error: function () { ErrorFun2('读取App配置文件错误(003)！'); }
        });

    });

}

//卢湾一小的方法:
function setAccessIdAndKey() {
    //在本地调试中心运行的时候，MainWidgetId是001，不能执行XG，会有问题。
    if (MainWidgetId != "001") {

        var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));
        var accessId;
        var accessKey;

        if (plat == "Android") {
            accessId = appConfig.MsgAndroid.AccessID;
            accessKey = appConfig.MsgAndroid.AccessKey;
        }
        else {
            accessId = appConfig.MsgIOS.AccessID;
            accessKey = appConfig.MsgIOS.AccessKey;
        }

        uexXGPush.setAccessidAndKey(accessId, accessKey);

    }
}

function ExitForAndroid() {
    //如果是Android平台，则监听返回按钮事件
    plat = uexWidgetOne.getPlatform();
    if (plat) {
        var exitv = 0;
        uexWindow.onKeyPressed = function (keyCode) {
            if (keyCode == 0) {
                exitv++;
                //uexWidgetOne.exit();
                //uexWidgetOne.exit("0");
                if (exitv == 1) {
                    appcan.window.openToast("再按一次，退出应用！", 3000);
                    setTimeout("exitv = 0;", 3000);
                }
                else if (exitv == 2) {
                    uexWidgetOne.exit("0");
                }
            }
        }
        uexWindow.setReportKey(0, 1);
    }
}

//只需要在应用启动的时候执行一次的,每次版本升级，需要AppStarted+版本号
function ExecuteOneTime() {
    appcan.setLocVal("AppStarted-V20150629", "True");
    appcan.setLocVal("BaseUrl", "http://221.224.83.111/mobile/api/");
    //appcan.setLocVal("BaseUrl", "http://121.40.48.1/mobile/api/");
}

//需要第一次执行和登录后再次执行的JS
function ExecuteMoreTimes() {
    var token = appcan.locStorage.getVal("Token");
    var userInfoApiParameters = { "accessToken": token };
    var apiConfig = JSON.parse(appcan.getLocVal("ApiConfig"));  
    var url = apiConfig.GetUserInfo.Url;
    url = GetMappingUrl(url, userInfoApiParameters);
    var Type = apiConfig.GetUserInfo.Type;
    var xgId;
    var isSuccess = 0;
    $.ajax({
        url: url,
        type: Type,
        data: userInfoApiParameters,
        dataType: "json",
        success: function (dt) {
            isSuccess = 1;
            var EEData = dt;
            var EEData_string = JSON.stringify(dt);
            //alert(EEData_string);
            if (EEData.res_code == undefined) {

                GlobalInit(EEData_string);
                appcan.setLocVal("UserInfo", EEData_string);
                appcan.setLocVal("UserID", EEData.Id);
                xgId = EEData.Id;
                //在本地调试中心运行的时候，MainWidgetId是001，不能执行XG，会有问题。
                //if (MainWidgetId != "001") { 
                //    uexXGPush.registerPush(EEData.Id);
                //    //uexXGPush.registerPush(userinfo.Id);
                //    //var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));
                //    //var accessID;
                //    //var accessKey;
                //    //if (plat) {
                //    //    accessID = appConfig.MsgAndroid.AccessID;
                //    //    accessKey = appConfig.MsgAndroid.AccessKey;
                //    //}
                //    //else {
                //    //    accessID = appConfig.MsgIOS.AccessID;
                //    //    accessKey = appConfig.MsgIOS.AccessKey;
                //    //}
                //    //uexXG.InitXgUserPush(accessID, accessKey, EEData.Id);
                //}
                //IOS下面，需要下面这个代码，否则跳转不过去，似乎与异步有关系。
                appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
            }
            else if (EEData.res_code == "0") { }
            else if (EEData.res_code == "-1") {
                //-1表示Token无效
                alert("请重新登录！");
                appcan.locStorage.remove("Token");
                appcan.window.open({ name: 'Login', data: 'Login.html', aniId: 5 });
            }
            else { alert(res_message); }
        },
        complete: function (xhr, status) {
            if (isSuccess == 0) {
                ErrorFun('获取用户信息发生错误(001)！');
            } else {
                //在本地调试中心运行的时候，MainWidgetId是001，不能执行XG，会有问题。
                if (MainWidgetId != "001") {
                    uexXGPush.registerPush(xgId);
                }
            }
        }
    });

}

//获取平台信息（Android or ios）的方法
function cbGetPlatform(opId, dataType, data) {
        var plat;
        if (data == 0) {
            plat = "iOS";
        } else if (data == 1) {
            plat = "Android";
        } else {
            plat = "Unknow";
        }
        appcan.locStorage.val("Platform", plat);
    }


////信鸽推送
//function xgPush() {
//    var accessId;
//    var accessKey;
//    var plat = appcan.locStorage.val("Platform");
//    var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));
//    if (plat == "Android") {
//        accessId = appConfig.MsgAndroid.AccessID;
//        accessKey = appConfig.MsgAndroid.AccessKey;
//    }
//    else if (plat == "iOS") {
//        accessId = appConfig.MsgIOS.AccessID;
//        accessKey = appConfig.MsgIOS.AccessKey;
//    }
//    uexXGPush.setAccessidAndKey(accessId, accessKey);
//}


//错误处理公共方法
function ErrorFun(errorTxt) {
    appcan.window.confirm({
        title: '错误信息',
        content: errorTxt,
        buttons: ['重试', '退出', '继续'],
        callback: function (err, data, dataType, optId) {
            if (err) {
                return;
            }
            if (data == 0) {
                ExecuteMoreTimes();
            }
            else if (data == 1) {
                uexWidgetOne.exit("0");
            }
            else if (data == 2) {
                appcan.window.open({ name: 'MainTab', data: 'MainTab.html', aniId: 5 });
            }
        }
    });
}

function ErrorFun2(errorTxt) {
    appcan.window.confirm({
        title: '错误信息',
        content: errorTxt,
        buttons: ['退出', '继续'],
        callback: function (err, data, dataType, optId) {
            if (err) {
                return;
            }
            if (data == 0) {
                uexWidgetOne.exit("0");
            }
            else if (data == 1) {
                LoginCheck();
            }
        }
    });
}

//全局对象初始化 持久化
function GlobalInit(userInfo) {

    var appConfig = JSON.parse(appcan.getLocVal("AppConfig"));

    if (userInfo.indexOf(appConfig.RoleId.Teacher) != -1) {
        //老师
        appcan.setLocVal("UserType", "Teacher");
    }
    else if (userInfo.indexOf(appConfig.RoleId.Parents) != -1) {
        //家长    
        appcan.setLocVal("UserType", "Parents");
    }
    else {
        //学生
        appcan.setLocVal("UserType", "Student");
    }
}

function cbGetCurrentWidgetInfo(opId, dataType, data) {
    var data = JSON.parse(data);
    var version = data.version;
    appcan.locStorage.val("version", version);

    var appId = data.appId;
    appcan.locStorage.val("appId", appId);
}
