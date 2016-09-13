

var dbName = "Mobiledb";

//创建数据库，名为Mobiledb
function createDB() {
    uexDataBaseMgr.openDataBase(dbName, 1);
    uexDataBaseMgr.cbOpenDataBase = createDBCallBack;
}

//创建表，名为MobileTable
function createTable() {
    var sql = "CREATE TABLE MobileTable (APIName,APIData)";
    uexDataBaseMgr.executeSql(dbName, 1, sql);
    uexDataBaseMgr.cbExecuteSql = createTableCallBack;
    appcan.locStorage.setVal("isFirst", true);
}

//初始化表
//function InsertEmptyData() {
//    var ajaxdata = [{ "APIName": "HomeworkStu" }, { "APIName": "HomeworkTch" }];
//    $(ajaxdata).each(function () {
//        var APIName = this.APIName;
//        var APIData = "[]";
//        insertData(APIName, APIData);
//    })
//}

//function insertData(APIName, APIData) {
//    var sql = "INSERT INTO MobileTable VALUES('"+APIName+"','"+APIData+"')";
//    uexDataBaseMgr.executeSql(dbName, 1, sql);
//    uexDataBaseMgr.cbExecuteSql = insertDataCallBack;
//    appcan.locStorage.setVal("isFirst", true);
//}

//数据库回调函数
function createDBCallBack(opid, type, data) {
    if (opid == 1 && type == 2 && data == 0) {
        alert("数据库打开成功！");
    } else {
        alert("数据库打开失败！");
    }
};
//表回调函数
function createTableCallBack(opid, type, data) {
    if (opid == 1 && type == 2 && data == 0) {
        alert("表创建成功！");
    } else {
        alert("表创建失败！");
    }
};
//插入数据回调函数
//function insertDataCallBack(opid, type, data) {
//    if (opid == 1 && type == 2 && data == 0) {
//        alert("数据插入成功！");
//    } else {
//        alert("数据插入失败！");
//    }
//};