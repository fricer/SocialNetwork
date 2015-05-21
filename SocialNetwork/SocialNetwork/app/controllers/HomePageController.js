﻿(function () {
    var module = angular.module('SocialNetworkApp');

    var homePageController = function ($scope, $rootScope, $location, $document, CurrentUserQueryExecutor, Authorization, Notifications) {
        CurrentUserQueryExecutor.getUser()
            .then(function(result) {
                $scope.myUsername = result.data["username"];
            }, function(error) {
                Notifications.error(error.data["message"]);
            });

        CurrentUserQueryExecutor.getOwnFriendsPreview()
            .then(function(result) {
                $scope.myFriendsList = result.data["friends"];
            }, function (error) {
                Notifications.error(error.data["message"]);
            });

        var getNewsFeed = function() {
            return CurrentUserQueryExecutor.getNewsFeed()
                .then(function(result) {
                    $scope.newsFeedPosts = result.data;
                    console.log(result.data);
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }
        getNewsFeed();

        var getOwnFriendsPreview = function () {
            return CurrentUserQueryExecutor.getOwnFriendsPreview()
                .then(function(result) {
                    $scope.friendsCount = result.data["totalCount"];
                    $scope.friends = result.data["friends"];
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }
        getOwnFriendsPreview();

        var openSelectedUserProfile = function (username) {
            $location.path("/users/" + username);
        }

        var likePost = function(postId) {
            return CurrentUserQueryExecutor.likePost(postId)
                .then(function (result) {
                    getNewsFeed();
                    Notifications.success("Successfully liked post");
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var unlikePost = function (postId) {
            return CurrentUserQueryExecutor.unlikePost(postId)
                .then(function (result) {
                    getNewsFeed();
                    Notifications.success("Successfully unliked post");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var addCommentToPost = function(postId, commentText) {
            if (commentText === "" || commentText === undefined) {
                Notifications.error("The commentText cannot be empty");
            } else {
                var comment = {
                    commentContent: commentText
                };

                return CurrentUserQueryExecutor.addCommentToPost(postId, comment)
                    .then(function(result) {
                        getNewsFeed();
                        Notifications.success("Successfully added a comment");
                    }, function(error) {
                        Notifications.error(error.data["message"]);
                    });
            }
        }

        var likePostComment = function(postId, commentId) {
            return CurrentUserQueryExecutor.likeComment(postId, commentId)
                .then(function(result) {
                    getNewsFeed();
                    Notifications.success("Successfully liked comment");
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var unlikePostComment = function (postId, commentId) {
            return CurrentUserQueryExecutor.unlikeComment(postId, commentId)
                .then(function (result) {
                    getNewsFeed();
                    Notifications.success("Successfully unliked comment");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        $scope.$on('friend-accepted', function () {
            getOwnFriendsPreview();
        });
        $scope.getOwnFriendsPreview = getOwnFriendsPreview;
        $scope.openSelectedUserProfile = openSelectedUserProfile;
        $scope.getNewsFeed = getNewsFeed;
        $scope.likePost = likePost;
        $scope.unlikePost = unlikePost;
        $scope.addCommentToPost = addCommentToPost;
        $scope.likePostComment = likePostComment;
        $scope.unlikePostComment = unlikePostComment;
    }

    module.controller('HomePageController', homePageController);
}());