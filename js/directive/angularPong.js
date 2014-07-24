(function () {
"use strict";
    var KEY = {
	    UP: 38,
	    DOWN: 40,
	    W: 87,
	    S: 83
    }

    angular.module('pingpong', [])
	.directive('angularPong', ['$timeout','$interval','$document',function ($timeout,$interval,$document) {
        return {
            restrict: 'E',
            replace: true,
	    scope: {},
            templateUrl: 'template/pingpong.html',
            link: function (scope, element, attrs) {
                var timeoutId;
                scope.scoreA = 0;
                scope.scoreB = 0;
                var Keys = [];
                var ball = {
                    speed: 5,
                    directionX: 1,
                    directionY: 1
                }

                function monitorKeys() {
                    $document.keydown(function (e) {
                        Keys[e.keyCode] = true;
                    });
                    $document.keyup(function (e) {
                        Keys[e.keyCode] = false;
                    });
                };

                function moveBall() {
                    // get ball and playground details
                    var ballTop = parseInt(element.find("#ball").css("top"));
                    var ballLeft = parseInt(element.find("#ball").css("left"));
                    var playgroundHeight = parseInt(element.find("#playground").height());
                    var playgroundWidth = parseInt(element.find("#playground").width());

                    // check playground boundary
                    // check bottom
                    if (ballTop + ball.speed * ball.directionY > playgroundHeight) {
                        ball.directionY = -1;
                    }
                    // check top
                    if (ballTop + ball.speed * ball.directionY < 0) {
                        ball.directionY = 1;
                    }
                    // check right
                    if (ballLeft + ball.speed * ball.directionX > playgroundWidth) {
                        // player B lost.		
                        scope.scoreA++;
                        //$("#scoreA").html(scoreA);

                        // reset the ball;
                        element.find("#ball").css({
                            "left": "250px",
                            "top": "100px"
                        });

                        // update ball location details
                        ballTop = parseInt(element.find("#ball").css("top"));
                        ballLeft = parseInt(element.find("#ball").css("left"));
                        ball.directionX = -1;
                    }
                    // check left
                    if (ballLeft + ball.speed * ball.directionX < 0) {
                        // player A lost.		
                        scope.scoreB++;
                        //$("#scoreB").html(scoreB);

                        // reset the ball;
                        element.find("#ball").css({
                            "left": "150px",
                            "top": "100px"
                        });

                        // update the ball location details
                        ballTop = parseInt(element.find("#ball").css("top"));
                        ballLeft = parseInt(element.find("#ball").css("left"));
                        ball.directionX = 1;
                    }

                    // check left paddle
                    var paddleAX = parseInt(element.find("#paddleA").css("left")) + parseInt(element.find("#paddleA").css("width"));
                    var paddleAYBottom = parseInt(element.find("#paddleA").css("top")) + parseInt(element.find("#paddleA").css("height"));
                    var paddleAYTop = parseInt(element.find("#paddleA").css("top"));
                    if (ballLeft + ball.speed * ball.directionX < paddleAX) {
                        if (ballTop + ball.speed * ball.directionY <= paddleAYBottom &&
                            ballTop + ball.speed * ball.directionY >= paddleAYTop) {
                            ball.directionX = 1;
                        }
                    }

                    // check right paddle
                    var paddleBX = parseInt(element.find("#paddleB").css("left"));
                    var paddleBYBottom = parseInt(element.find("#paddleB").css("top")) + parseInt(element.find("#paddleB").css("height"));
                    var paddleBYTop = parseInt(element.find("#paddleB").css("top"));
                    if (ballLeft + ball.speed * ball.directionX >= paddleBX) {
                        if (ballTop + ball.speed * ball.directionY <= paddleBYBottom &&
                            ballTop + ball.speed * ball.directionY >= paddleBYTop) {
                            ball.directionX = -1;
                        }
                    }


                    // move the ball with speed and direction
                    element.find("#ball").css({
                        "left": ballLeft + ball.speed * ball.directionX,
                        "top": ballTop + ball.speed * ball.directionY
                    });
                };

                function movePaddles() {
                    // check if a key is pressed. 
                    if (Keys[KEY.UP]) // arrow up
                    {
                        // move the paddle B up 5 pixels
                        var top = parseInt(element.find("#paddleB").css("top"));
                        element.find("#paddleB").css("top", top - 5);
                    }
                    if (Keys[KEY.DOWN]) // arrow down
                    {
                        // move the paddle B down 5 pixels
                        var top = parseInt(element.find("#paddleB").css("top"));
                        element.find("#paddleB").css("top", top + 5);
                    }
                    if (Keys[KEY.W]) // w
                    {
                        // move the paddle A up 5 pixels
                        var top = parseInt(element.find("#paddleA").css("top"));
                        element.find("#paddleA").css("top", top - 5);
                    }
                    if (Keys[KEY.S]) // s
                    {
                        // move the paddle A down 5 pixels
                        var top = parseInt(element.find("#paddleA").css("top"));
                        element.find("#paddleA").css("top", top + 5);
                    }
                };

                element.on('$destroy', function () {
                    $interval.cancel(timeoutId);
                });

                function gameloop() {
                    moveBall();
                    movePaddles();
                };

                function setTimer(func) {
                    $interval(func, 30);
                };

                timeoutId = $timeout(function () {
                    // call gameloop every 30 milliseconds
                    setTimer(gameloop);

                    // need to remember what key is down and up
                    monitorKeys();

                }, 1000);
            }
        };
    }]);

}());