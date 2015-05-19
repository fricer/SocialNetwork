﻿(function () {
    var module = angular.module('SocialNetworkApp');

    var headerController = function ($scope, $rootScope, $location, CurrentUserQueryExecutor, Authorization, Notifications) {
        CurrentUserQueryExecutor.getUser()
            .then(function (result) {
                $scope.username = result.data["username"];
                if (result.data["profileImageData"] == null) {
                    $scope.image = false;
                } else {
                    $scope.image = true;
                    $scope.profileImageData = result.data["profileImageData"];
                }
            }, function (error) {
                Notifications.error(error.data["message"]);
            });

        CurrentUserQueryExecutor.getFriendRequests()
            .then(function (result) {
                if (result.data.length === 0) {
                    $scope.hasRequests = false;
                } else {
                    $scope.hasRequests = true;
                    $scope.requestsCount = result.data.length;
                }
            }, function (error) {
                Notifications.error(error.data["message"]);
            });

        var logout = function () {
            Authorization.logout()
                .then(function (result) {
                    Notifications.success("Successfully logged out");
                    $location.path("/login");
                }, function (error) {
                    Notifications.error(error);
                });
        }

        var changePasswordView = function () {
            $location.path("/profile/password");
        }

        var editProfileView = function () {
            $location.path("/profile");
        }

        var searchForUsers = function () {
            if ($scope.searchTerm !== "") {
                CurrentUserQueryExecutor.searchUsersByName($scope.searchTerm)
                    .then(function(result) {
                        $("#serach-results").show();
                        $scope.searchResults = result.data;
                        $scope.resultsCount = result.data.length;
                    }, function(error) {
                        Notifications.error(error.data['message']);
                    });
            } else {
                $("#serach-results").hide();
            }
        }

        $scope.logout = logout;
        $scope.changePasswordView = changePasswordView;
        $scope.editProfileView = editProfileView;
        $scope.searchForUsers = searchForUsers;
    }

    module.controller('HeaderController', headerController);
}());