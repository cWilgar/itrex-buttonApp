var buttonApp = angular.module('3dButton', ['ionic'])

buttonApp.controller('ButtonController', ['$scope','$ionicPopup', '$ionicPopover', 
  function ($scope, $ionicPopup, $ionicPopover) {

  $scope.buttonData = {
    totalPresses : 0,
    maxPresses : 10
  }
  $scope.mouseData = {
    Xpos : 0,
    Ypos : 0,
    eData : {},
    overButton : false
  }
  $scope.popoverData = {
    hasShown : false,
    isRemoved : false
  }

  $scope.popoverData.hasShown = false;

  $scope.updateMousePos = function (event){
    $scope.mouseData.Xpos = event.clientX;
    $scope.mouseData.Ypos = event.clientY;
    $scope.mouseData.eData = event;
  };

  $scope.incrementClicks = function() {
    if($scope.mouseData.overButton){
      $scope.buttonData.totalPresses ++;
      if ($scope.buttonData.totalPresses > $scope.buttonData.maxPresses){
        $scope.showAlert()
      }
    }
  }
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'AY AY AY STOPPIIIT',
      template: "Now that's " + ($scope.buttonData.totalPresses - $scope.buttonData.maxPresses) +" times too many" 
    });
  }

  $ionicPopover.fromTemplateUrl('templates/popover.html', function(popover) {
    $scope.popover = popover;
  });


  $scope.showPopover = function(){
    if ($scope.mouseData.overButton && !$scope.popoverData.hasShown)
    {
      $scope.popover.show($scope.mouseData.eData);
      $scope.popoverData.hasShown = true;
    }
  };
  $scope.removePopoverIfShown = function(){
    if ($scope.popoverData.hasShown){
      $scope.popover.remove();
      $scope.popoverData.isRemoved = true;
    }
  }

  $scope.mouseOverButton = function(){
    $scope.mouseData.overButton = true;
    $scope.showPopover()
  }
  $scope.mouseOutofButton = function(){
    $scope.mouseData.overButton = false;
  }
  

}]);

