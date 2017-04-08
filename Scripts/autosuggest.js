angular.module('autosuggest', [] )
    .directive('autosuggest', function ($parse, $http) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "titleField": "@titlefield",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength"
        },
        template: '<div class="autosuggest-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" ng-keyup="keyPressed($event)" ng-required="true" /><div id="{{id}}_dropdown" class="autosuggest-dropdown" ng-if="showDropdown" style="height:300px;overflow:auto"><div class="autosuggest-searching" ng-show="searching">Searching...</div><div class="autosuggest-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="autosuggest-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'autosuggest-selected-row\': $index == currentIndex}"><div>{{result.title}}</div></div></div></div>',
        controller: function ( $scope ) {
            $scope.lastFoundWord = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 0;

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }

            $scope.processResults = function (responseData) {

                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++)
                    {
                        var titleCode = "";

                        for (var t = 0; t < titleFields.length; t++) {
                            if (t > 0) {
                                titleCode = titleCode +  " + ' ' + ";
                            }
                            titleCode = titleCode + "responseData[i]." + titleFields[t];
                        }

                        var resultRow = {
                            title: eval(titleCode),
                            originalObject: responseData[i]
                        }

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function(str) {

                    if ($scope.localData)
                    {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++)
                        {
                            if (str.length != 0)
                            {
                                var match = false;

                                for (var s = 0; s < searchFields.length; s++) {
                                    var evalStr = 'match = match || ($scope.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                                    eval(evalStr);
                                }

                                if (match) {
                                    matches[matches.length] = $scope.localData[i];
                                }
                            }
                            else
                            {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches);
                        $scope.$apply();
                    }
                    else
                    {
                        $http.get($scope.url + str, {}).
                            success(function (responseData, status, headers, config)
                            {
                                $scope.searching = false;
                                $scope.processResults(responseData);
                            }).
                            error(function (data, status, headers, config)
                            {
                                console.log("error");
                            });
                    }
            }

            $scope.hoverRow = function (index)
            {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function (event)
            {
              if (event.which == 27) {
                  $scope.showDropdown = false; return;
              }

            $scope.showDropdown = true;
            $scope.currentIndex = -1;
            $scope.results = [];

            if ($scope.searchTimer) {
                clearTimeout($scope.searchTimer);
            }

            $scope.searching = true;

            if (angular.isUndefined($scope.searchStr) || document.getElementById('ex1_value').value == '') $scope.searchStr = '';
            $scope.searchTimer = setTimeout(function() {
                $scope.searchTimerComplete($scope.searchStr);
            }, $scope.pause);

            }

            $scope.selectResult = function(result) {
                $scope.searchStr = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];
            }
        },
    };
});