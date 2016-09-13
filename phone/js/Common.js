
//var url1 = "abc/{Test}/{Test2}";
//var jsonParam = { "Test": "djw", "Test2": "xhw", "Test3": "wyyy" };

function GetMappingUrl(url,jsonParam)
{
    var returnUrl = url;
    var strParam = JSON.stringify(jsonParam).replace("{", "").replace("}", "");
    var arrParam = strParam.split(',');

    $.each(arrParam, function (index, item) {

        var paramKey = arrParam[index].split(':')[0].replace("\"", "").replace("\"", "").replace("'", "").replace("'", "");
        var paramVal = arrParam[index].split(':')[1].replace("\"", "").replace("\"", "").replace("'", "").replace("'", "");

        returnUrl = returnUrl.replace("{"+paramKey+"}", paramVal);

    });

    return returnUrl;
}

//var resutl = GetMappingUrl(url1, jsonParam);
//alert(resutl);