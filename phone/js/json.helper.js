Array.prototype.selectFirst = function (predicate) { 
    var first = null; 
    if (typeof predicate == "function") {

        for (var i = 0; i < this.length; i++) { 
            if (predicate(this[i])) { 
                first = this[i]; 
                break; 
            } 
        } 

    } else { 
        throw new Error("predicate 类型必须为function"); 
    } 
    return first; 
}; 

Array.prototype.deleteFirst = function (predicate) { 
    if (typeof predicate == "function") { 
        var obj = this.firstOrDefault(predicate); 
        if (obj) {
            //delete obj;
            //array.splice(array.indexOf(obj),1);
            this.splice(this.indexOf(obj), 1);
        } 

    } else { 
        throw new Error("predicate 类型必须为function"); 
    } 
};

//测试
//var str = '[{"name":"aa","age":"23"},{"name":"bb","age":"24"},{"name":"cc","age":"25"}]';
//var array = JSON.parse(str);

//array.push({ "name": "dd", "age": "25" });

////修改 
//var obj = array.selectFirst(
//    function (x) {
//        return x.name == 'bb';
//    }
//);
//obj.age = 25;

////删除 
//array.deleteFirst(
//    function (x) {
//        return x.name == 'cc';
//    }
//);

////转为json字符串 
//str = JSON.stringify(array);
//alert(str);





//另外一种修改
//可以对值进行删改：没有return表示放弃该属性，return的值表示该key在json字符串中的值
//var jsonStr = '{"name": "hanzichi", "sex": "male", "age": 10}';
//var obj = JSON.parse(jsonStr, function (key, value) {
//    if (key === 'name') {
//        return 'my name is ' + value;
//    }
//    return value;

//});