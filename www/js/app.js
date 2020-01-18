// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
 $cordovaStatusbar.overlaysWebView(true);
 $cordovaStatusbar.styleHex('#ABCDEF');
 $cordovaStatusbar.show();
     
    }

         var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

  window.plugins.OneSignal
    .startInit("240363a5-f313-4cb5-be1c-289a5dce1abb")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })


  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'AppCtrl'
  })

    .state('tab.playlist', {
    url: '/playlist',
    views: {
      'tab-dash': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })


  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'ProfilCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback

      if (JSON.parse(localStorage.getItem('kullaniciBilgi')) == undefined) {
   
   $urlRouterProvider.otherwise('/login');
  }
  else {
    $urlRouterProvider.otherwise('/tab/dash');
   
  }


});
