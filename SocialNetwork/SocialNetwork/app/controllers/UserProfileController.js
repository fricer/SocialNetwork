﻿(function () {
    var module = angular.module('SocialNetworkApp');

    var userProfileController = function ($scope, $location, $routeParams, CurrentUserQueryExecutor, Notifications) {
        var startPostId;

        CurrentUserQueryExecutor.getUser()
            .then(function(result) {
                $scope.me = result.data;
            }, function(error) {
                Notifications.error(error.data["message"]);
            });

        var getFriendFriendsPreview = function() {
            CurrentUserQueryExecutor.getFriendFriendsPreview($routeParams.username)
            .then(function (result) {
                $scope.userFriends = result.data;
            }, function (error) {
                Notifications.error(error.data["message"]);
            });
        }

        var showUserProfile = function (username) {
            return CurrentUserQueryExecutor.getUserFullData(username)
                .then(function(result) {
                    $scope.user = result.data;
                    if (result.data["isFriend"] === true) {
                        $scope.isFriend = true;
                        $scope.isNotFriend = false;
                    } else {
                        $scope.isNotFriend = true;
                        $scope.isFriend = false;
                    }

                    if (result.data["hasPendingRequest"] === true && $scope.isFriend === true) {
                        $scope.isPending = false;
                        $scope.isNotFriend = false;
                    } else if (result.data["hasPendingRequest"] === true && $scope.isFriend === false) {
                        $scope.isPending = true;
                        $scope.isNotFriend = false;
                    } else {
                        $scope.isPending = false;
                    }
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var sendFriendRequest = function(username) {
            return CurrentUserQueryExecutor.sendFriendRequest(username)
                .then(function(result) {
                    Notifications.success(result.data["message"]);
                    $scope.isPending = true;
                    $scope.isNotFriend = false;
                    getUserWall();
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var addNewPost = function (postText, username) {
            if (postText === "" || postText === undefined) {
                Notifications.error("Post content cannot be empty");
            } else {
                var post = {
                    postContent: postText,
                    username: username
                };

                return CurrentUserQueryExecutor.addNewPost(post)
                    .then(function (result) {
                        $scope.userWallPosts.unshift(result.data);
                        Notifications.success("Successfully added post");
                }, function(error) {
                        Notifications.error(error.data["message"]);
                    });
            }
        }

        var getUserWall = function() {
            $scope.standbyWall = true;
            return CurrentUserQueryExecutor.getUserWall($routeParams.username, startPostId)
                .then(function (result) {
                    $scope.userWallPosts = $scope.userWallPosts ? $scope.userWallPosts.concat(result.data) : [].concat(result.data);
                    if ($scope.userWallPosts.length > 0) {
                        startPostId = $scope.userWallPosts[$scope.userWallPosts.length - 1].id;
                    }

                    $scope.standbyWall = false;
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }
        getUserWall();

        var likePost = function (post) {
            return CurrentUserQueryExecutor.likePost(post.id)
                .then(function (result) {
                    post.liked = true;
                    post.likesCount++;
                    Notifications.success("Successfully liked post");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var unlikePost = function (post) {
            return CurrentUserQueryExecutor.unlikePost(post.id)
                .then(function (result) {
                    post.liked = false;
                    post.likesCount--;
                    Notifications.success("Successfully unliked post");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var editPost = function (post, postText) {
            if (postText === "" || postText === undefined) {
                Notifications.error("Post content cannot be empty");
            } else {
                var editedPost = {
                    postContent: postText
                };

                return CurrentUserQueryExecutor.editPost(post.id, editedPost)
                    .then(function (result) {
                        post.postContent = postText;
                        Notifications.success("Successfully edited post");
                    }, function (error) {
                        Notifications.error(error.data["message"]);
                    });
            }
        }

        var deletePost = function (post) {
            return CurrentUserQueryExecutor.deletePost(post.id)
                .then(function (result) {
                    var index = $scope.userWallPosts.indexOf(post);
                    $scope.userWallPosts.splice(index, 1);
                    Notifications.success("Successfully deleted post");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var showLessComments = function (post) {
            post.comments.splice(3, post.comments.length - 1);
        }

        var addCommentToPost = function (post, commentText) {
            if (commentText === "" || commentText === undefined) {
                Notifications.error("The commentText cannot be empty");
            } else {
                var comment = {
                    commentContent: commentText
                };

                return CurrentUserQueryExecutor.addCommentToPost(post.id, comment)
                    .then(function (result) {
                        post.comments.unshift(result.data);
                        post.totalCommentsCount++;
                        if (post.comments.length > 3) {
                            showLessComments(post);
                            post.hidableComments = true;
                        }
                        Notifications.success("Successfully added a comment");
                    }, function (error) {
                        Notifications.error(error.data["message"]);
                    });
            }
        }

        var checkPostCommentsCount = function (post) {
            return CurrentUserQueryExecutor.getAllPostComments(post.id)
                .then(function (result) {
                    if (result.data.length > 3) {
                        post.hidableComments = true;
                    } else {
                        post.hidableComments = false;
                    }
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var getCommentAuthor = function (comment) {
            return CurrentUserQueryExecutor.getUserPreviewData(comment.author.username)
                .then(function (result) {
                    comment.author = result.data;
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var removeComment = function (post) {
            return CurrentUserQueryExecutor.getAllPostComments(post.id)
                .then(function (result) {
                    post.comments = result.data;
                    post.totalCommentsCount--;
                    if (post.comments.length > 3) {
                        post.comments.splice(3, post.comments.length - 1);
                    } else if (post.comments.length === 3) {
                        post.hidableComments = false;
                    }
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var deleteComment = function (post, comment) {
            return CurrentUserQueryExecutor.deleteComment(post.id, comment.id)
                .then(function (result) {
                    removeComment(post);
                    Notifications.success("Successfully deleted comment");
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var editComment = function (post, comment, commentText) {
            if (commentText === "" || commentText === undefined) {
                Notifications.error("Comment text cannot be empty");
            } else {
                var editedComment = {
                    commentContent: commentText
                };

                return CurrentUserQueryExecutor.editComment(post.id, comment.id, editedComment)
                    .then(function (result) {
                        comment.commentContent = commentText;
                        Notifications.success("Successfully edited comment");
                    }, function (error) {
                        Notifications.error(error.data["message"]);
                    });
            }
        }

        var getAllPostComments = function (post) {
            return CurrentUserQueryExecutor.getAllPostComments(post.id)
                .then(function (result) {
                    post.comments = result.data;
                }, function (error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var sendFriendRequestOnPopUp = function (username) {
            return CurrentUserQueryExecutor.sendFriendRequest(username)
                .then(function(result) {
                    Notifications.success(result.data["message"]);
                    $scope.isPending = true;
                    $scope.isNotFriend = false;
                }, function(error) {
                    Notifications.error(error.data["message"]);
                });
        }

        var openSelectedUserProfile = function (username) {
            $location.path("/users/" + username);
        }

        $scope.showUserProfile = showUserProfile;
        $scope.selectedUserUsername = $routeParams.username;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.addNewPost = addNewPost;
        $scope.getFriendFriendsPreview = getFriendFriendsPreview;
        $scope.getUserWall = getUserWall;
        $scope.likePost = likePost;
        $scope.unlikePost = unlikePost;
        $scope.deletePost = deletePost;
        $scope.editPost = editPost;
        $scope.addCommentToPost = addCommentToPost;
        $scope.checkPostCommentsCount = checkPostCommentsCount;
        $scope.getCommentAuthor = getCommentAuthor;
        $scope.deleteComment = deleteComment;
        $scope.editComment = editComment;
        $scope.getAllPostComments = getAllPostComments;
        $scope.showLessComments = showLessComments;
        $scope.sendFriendRequestOnPopUp = sendFriendRequestOnPopUp;
        $scope.openSelectedUserProfile = openSelectedUserProfile;
        showUserProfile($scope.selectedUserUsername);
    }

    module.controller('UserProfileController', userProfileController);
}());