﻿(function() {
    var app = angular.module("SocialNetworkApp", ["ngRoute", "ngCookies", "infinite-scroll"]);

    // define the root url for the services
    // to be used across all controllers
    app.value('rootUrl', 'http://softuni-social-network.azurewebsites.net/api/');

    app.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./views/welcome-screen-view.html"
            })
            .when("/login", {
                templateUrl: "./views/login-view.html",
                controller: "LoginController"
            })
            .when("/register", {
                templateUrl: "./views/register-view.html",
                controller: "RegisterController"
            })
            .when("/user/home", {
                templateUrl: "./views/home-page-view.html",
                controller: "HomePageController",
                resolve: { loginRequired: loginRequired }
            })
            .when("/profile/password", {
                templateUrl: "./views/change-password-view.html",
                controller: "ChangePasswordController",
                resolve: { loginRequired: loginRequired }
            })
            .when("/profile", {
                templateUrl: "./views/edit-profile-view.html",
                controller: "EditProfileController",
                resolve: { loginRequired: loginRequired }
            })
            .when("/users/:username", {
                templateUrl: "./views/user-profile-view.html",
                controller: "UserProfileController",
                resolve: { loginRequired: loginRequired }
            })
            .when("/user/friends", {
                templateUrl: "./views/my-friends-view.html",
                controller: "MyFriendsController",
                resolve: { loginRequired: loginRequired }
            })
            .when("/users/:username/friends", {
                templateUrl: "./views/user-friends-view.html",
                controller: "UserFriendsController",
                resolve: { loginRequired: loginRequired }
            })
            .otherwise({ redirectTo: "/" });
    });

    var loginRequired = function ($location, $q, Authorization) {
        var deferred = $q.defer();

        if (Authorization.isLogged() === false) {
            deferred.reject();
            $location.path('/login');
        }
    }
}());