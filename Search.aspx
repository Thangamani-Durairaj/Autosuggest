<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Search.aspx.cs" Inherits="Search" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<title>Search</title>
<link href="Styles/autosuggest.css" rel="stylesheet" />
<script type="text/javascript" src="Scripts/angular.min.js"></script>
<script src="Scripts/angular-touch.js"></script>
<script src="Scripts/autosuggest.js"></script>

<script>
   
var app = angular.module('ResumeApp', ["ngTouch", "autosuggest"])

app.controller('SearchResults', function ($scope, $http, $window)
{
    $scope.ButtonClick = function ()
    {
        if (!(document.getElementById("ex1_value").value)) return;

        var post = $http({
            method: "POST",
            url: "Search.aspx/ResumeSearch",
            dataType: 'json',
            data: { strTemplate: strSearchText: document.getElementById("ex1_value").value },
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status)
        {
            var strData = data.d;
            $scope.reports = JSON.parse(strData);
        });
        post.error(function (data, status)
        {
            $window.alert(data.Message);
        });
    },

    $scope.GetList = function ()
    {
        document.getElementById("ex1_value").value = '';

        if (!($scope.SearchKey)) return;

        var post = $http({
            method: "POST",
            url: "Search.aspx/GetDataList",
            dataType: 'json',
            data: { strType: $scope.SearchKey},
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            var strData = data.d;
            $scope.datalist = JSON.parse(strData);
            $scope.searchStr = null;
        });
        post.error(function (data, status) {
            $window.alert(data.Message);
        });
    }
});
</script>    
</head>
<body>
<form id="frmSearch">
    
<div ng-app="ResumeApp" ng-controller="SearchResults">
<table width="100%" cellpadding="3" cellspacing="1" border="0" align="center">
   
    <tr style="height:50px;">
        <td class="label" width="20%">Search Key <span class="mand">*</span> </td>
        <td class="value">
            <div autosuggest="" id="ex1" placeholder="Type the text to search" pause="100" selectedobject="selectedData" localdata="datalist" searchfields="Title" titlefield="Title" minlength="1" inputClass="form-control">
            <div class="autosuggest-holder">
                <input id="ex1_value" name="searchStr" ng-model="searchStr" placeholder="Type the text to search" ng-keyup="keyPressed($event)" type="text" >
            </div>
            </div>
        </td>
    </tr>
    <tr>
    <td colspan="2" align="right">
        <input type="button" class="winbutton" id="btnSearch" value="Search" style="width:70px" ng-click="ButtonClick()" />
    </td>
    </tr>
</table>
</div>
</form>
</body>
</html>
