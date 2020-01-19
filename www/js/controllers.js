angular.module('starter.controllers', [])

.controller('AppCtrl', function($parse, $scope, $ionicModal, $timeout, $http, $rootScope, $ionicLoading, $state, $ionicHistory,$ionicPopup){


   $scope.updatekranpuan=function(){
  console.log("Buradayım");
 $scope.user = JSON.parse(localStorage.getItem('kullaniciBilgi'));
 console.log("Kullanıcı Bilgileri Profil COntroller: ",$scope.user.username);
console.log("Kullanıcı Bilgileri Profil COntroller: ",$scope.user.user_id);


   $scope.puanD={
    service_type: 'get_puan',
    username:$scope.user.username,
    user_id:$scope.user.user_id
   }

      var promise = $scope.postService('puanlar',  $scope.puanD);
      promise.then(function (data) {
      
                       
      $scope.emsileEkran=parseInt($rootScope.puanlar[0].emsile_puan,10);
      $scope.binaEkran=parseInt($rootScope.puanlar[0].bina_puan,10);
      $scope.magsudEkran=parseInt($rootScope.puanlar[0].magsud_puan,10);


    });

  

}
 
 
  $scope.phoneOkey;
  $scope.mailOkey;
  $scope.userOkey;

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };



  // Perform the login action when the user submits the login form


    $scope.doLogin = function () {
        $scope.loginDataJson = {
        service_type: 'login_user',
        email_address: $scope.loginData.email_address,
        password_user: $scope.loginData.password};
      var promise = $scope.postService("userInfo", $scope.loginDataJson);
      promise.then(function (data) {

       
        console.log("Ne geliyor ?", data);
        if ($rootScope.userInfo[0].name_user !== undefined) {
          console.log("ROOT SCOPE" + $rootScope.userInfo[0].name_user);
          localStorage.setItem('kullaniciBilgi', JSON.stringify($rootScope.userInfo[0]));
          localStorage.setItem('user_id', JSON.stringify($rootScope.userInfo[0].user_id));
          localStorage.setItem('user_name',JSON.stringify($rootScope.userInfo[0].name_user));
          localStorage.setItem('email_address',JSON.stringify($rootScope.userInfo[0].email_address));
          localStorage.setItem('telephone',JSON.stringify($rootScope.userInfo[0].phone_number));
          //Localden çekilcek diğer sayfalardan yönlendireceğiz.
          $timeout(function () {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('tab.dash');
          }, 1000);
        } else {

$ionicPopup.alert({
      title: 'Hata!',
      template: 'Eposta adresiniz ya da şifreniz yanlış. Tekrar deneyin.'
    });

          console.log("NUll GELDİ");
        }

      });

      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

       $scope.doRegister = function () {
      $scope.registerDataJson = {
        service_type: 'register_user',
        username: $scope.registerData.username,
        password_user: $scope.registerData.password_user,
        name_user: $scope.registerData.name_user,
        school: $scope.registerData.school,
        email_address: $scope.registerData.email_address,
        phone_number: $scope.registerData.phone_number,
        company_id: $scope.registerData.company_id
      };
      $scope.kayitMail = {
        service_type : 'kayitMail',
        email_address : $scope.registerData.email_address
      }
      $scope.postService('onayMail',$scope.kayitMail);
      $scope.postService('registerBilgi', $scope.registerDataJson);

      $timeout(function () {
        $ionicPopup.alert({
      title: 'E-posta Onay',
      template: 'E-Posta adresinizi onaylayınız.'
    });
        $scope.closeRegister();
      }, 2000);
    };
    
      $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerModal = modal;
    });

    $scope.register = function () {
      console.log("register1");
      $scope.registerData = {};
      $scope.registerModal.show();
      $scope.dogrula = 0;
    };

       $scope.closeRegister = function () {
      $scope.registerModal.hide();

    };



        $ionicModal.fromTemplateUrl('templates/forgot.html', { //Sifremi unuttum sayfasını oluştruman gerek
      scope: $scope
    }).then(function (modal) {
      $scope.forgotModal = modal; // moda
    });
    $scope.sifremiUnuttumAc = function () { // burda o sayfayı açıyoruz
      console.log('deneme');
      $scope.forgotModal.show(); // Burda ekranda gösteriyoruz fakat kapatma olayını yazmadın aşağıdaki ile aynı
    };


    $scope.doForgot = function () {
      //console.log($scope.loginData.phoneNumber);
      // $scope.girdilerForgot = {
      //   service_type : 'forgot_password',
      //   phone_number : $scope.loginData.phoneNumber
      // }
      $scope.girdilerForgot = {};
      $scope.girdilerForgot.service_type = "forgot_password";
      $scope.girdilerForgot.phone_number = $scope.loginData.phoneNumber;
      console.log($scope.girdilerForgot);
      console.log("Promise oncesi");
      var promise = $scope.postService('forgot_password', $scope.girdilerForgot);
      console.log("Promise sonrası");
      promise.then(function (data) {
        console.log("data : ", data);

      });

        };

        $scope.sifremiUnuttumKapa = function () {
      $scope.forgotModal.hide();
    };

        $scope.checkMail = function () {
      $scope.user = {};
      $scope.user.service_type = "mail_varMi";
      $scope.user.email_address = $scope.registerData.email_address;
      var promise = $scope.postService('mailKontrol', $scope.user);
      promise.then(function (data) {
      $scope.mailVar=parseInt($scope.mailKontrol[0],10);
      if($scope.mailVar == 0 ){
          $scope.mailOkey=false;
          console.log("Mail yok");
          $scope.dogrula++;
          console.log("Doğrulama : ",$scope.dogrula);
        }else{
          $scope.mailOkey=true;
          console.log("Mail var");
        }
      });
    };
    
    $scope.checkPhone = function () {
      $scope.user = {};
      $scope.user.service_type = "tel_varMi";
      $scope.user.phone_number = $scope.registerData.phone_number;
      var promise = $scope.postService('telKontrol', $scope.user);
      promise.then(function (data) {
      $scope.telVar=parseInt($scope.telKontrol[0],10);
  if($scope.telVar == 0 ){
          console.log("Telefon yok");
          $scope.phoneOkey=false;
          $scope.dogrula++;
          console.log("Doğrulama : ",$scope.dogrula);
        }else{
          console.log("Telefon var");
          $scope.phoneOkey=true;

        }
      });
    };

        $scope.checkUser = function () {
      $scope.user = {};
      $scope.user.service_type = "user_varMi";
      $scope.user.username = $scope.registerData.username;
      var promise = $scope.postService('usernameKontrol', $scope.user);
      promise.then(function (data) {
        $scope.usernameVar=parseInt($scope.usernameKontrol[0],10);
        console.log($scope.usernameKontrol[0]);
        console.log($scope.usernameVar);
        if($scope.usernameVar == 0 ){
          $scope.userOkey=false;
          console.log("User yok");
          $scope.dogrula++;
          console.log("Doğrulama : ",$scope.dogrula);
        }else{
            $scope.userOkey=true;
          console.log("User var");
        }
      });
    };










    $rootScope.datax={};
  $scope.dinamikScope = function (name, data) { //2 parametre alıyor
      var modelScope = $parse(name); // name ismi parse ediliyor.
      modelScope.assign($rootScope, data);

    };


    $scope.postService = function (scopeName, sentData) {

      return $http.post($scope.serviceLink, sentData)
        .then(function (response) {
          var data = response.data;
          console.log("Fetched data: " + data);
          $scope.dinamikScope(scopeName, data);
          return response.data;
        })
        .catch(function (response) {
          var errData = response.data;
          console.log("Error: " + errData);
          throw response;
        });
  };




})




.controller('DashCtrl', function($scope,$rootScope,$http) {

     $scope.playlistD = {
      service_type: 'get_kitap',
    };

    var promise = $scope.postService('playlists', $scope.playlistD);
    promise.then(function (data) {
      
      localStorage.setItem('kampanyaliUrunler', JSON.stringify($rootScope.playlists));
      $scope.kitaplar = localStorage.getItem('kampanyaliUrunler');
      console.log("Sorular",$scope.kitaplar);
    });


 $scope.emsile_puan=parseInt(JSON.parse(localStorage.getItem('emsile_puan')),10);
 $scope.bina_puan=parseInt(JSON.parse(localStorage.getItem('bina_puan')),10);
 $scope.magsud_puan=parseInt(JSON.parse(localStorage.getItem('magsud_puan')),10);

  $scope.indexle=function(index){
  console.log(index);
  $rootScope.levelId=index+1;
  console.log($rootScope.levelId); 
  $rootScope.table;
  $rootScope.toplamPuan;

if($rootScope.levelId==1){
    $rootScope.table="level1";
    $rootScope.toplamPuan= parseInt(JSON.parse(localStorage.getItem('emsile_puan')),10);
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==2){
    $rootScope.table="level2";
    $rootScope.toplamPuan= parseInt(JSON.parse(localStorage.getItem('emsile_puan')),10);

    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==3){
    $rootScope.table="level3";
        $rootScope.toplamPuan=parseInt(JSON.parse(localStorage.getItem('emsile_puan')),10);

    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==4){
    $rootScope.table="level4";
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==5){
    $rootScope.table="level5";
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==6){
    $rootScope.table="level6";
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==7){
    $rootScope.table="level7";
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==8){
    $rootScope.table="level8";
    console.log("LEVEL: "+$rootScope.table)
}else if($rootScope.levelId==9){
    $rootScope.table="level9";
    console.log("LEVEL: "+$rootScope.table)
}

}





})

.controller('PlaylistCtrl', function($scope,$rootScope,$http,$timeout,$interval,$ionicHistory,$state) {

      $scope.soruD={
    service_type: 'get_soru',
    kitapid:$rootScope.levelId,
    levelid:$rootScope.soruId,
    level:$rootScope.table,
   }

      var promise = $scope.postService('sorular',  $scope.soruD);
    promise.then(function (data) {
      console.log("Gelen Data"+data);
      console.log("scopmu"+$rootScope.sorular);
      
      localStorage.setItem('sorus', JSON.stringify($rootScope.sorular));
      $scope.sorux = localStorage.getItem('sorus');
      console.log("Levellerimiz",$scope.sorux);
    });

  $scope.aktifSoru=0;
  $scope.final=false;
  $scope.skor=0;
  $scope.sonskor;
  $scope.soruindex=0;
  $scope.basla=true;
  $scope.cevap1=1;
  $scope.cevap2=2;
  $scope.cevap3=3;
  $scope.cevap4=4;
  $scope.isActive = false;
  $scope.aciklama=false;
  $scope.checked=false;
  $scope.buttonStyle1="item-calm";
  $scope.buttonStyle2="item-calm";
  $scope.buttonStyle3="item-calm";
  $scope.buttonStyle4="item-calm";
  $scope.animasyon="button-calm";
  $scope.animasyoncard="";
  $scope.soruindexarabic="١";


  $scope.puanguncelle=function(index){
console.log("Tamamdır fonksiyon oldu."+index);

 $scope.user = JSON.parse(localStorage.getItem('kullaniciBilgi'));
 console.log("Kullanıcı Bilgileri Profil COntroller: ",$scope.user.username);
console.log("Kullanıcı Bilgileri Profil COntroller: ",$scope.user.user_id);


if($rootScope.levelId==1){
$scope.kitappuan="emsile_puan";
}else if($rootScope.levelId==2){
$scope.kitappuan="bina_puan";
}else if($rootScope.levelId==3){
$scope.kitappuan="maksut_puan";
}else if($rootScope.levelId==4){
  
}else if($rootScope.levelId==5){
  
}else if($rootScope.levelId==6){
  
}

console.log("Kitap Puan"+$scope.kitappuan);




   $scope.puanU={
    service_type: 'update_puan',
    user_id:$scope.user.user_id,
    puan:index,
    kitappuan:$scope.kitappuan,


   }

      var promise = $scope.postService('updatepuan',  $scope.puanU);
      promise.then(function (data) {
      
       console.log("Gelen Data"+data);
        console.log("scopmu"+$rootScope.updatepuan);

    });
    
  }

  /////////Soruya tıkladığında calisan fonksiyon//////////
$scope.soruArtir=function(index){




  if($scope.soruindex<($rootScope.sorular.length)){
      if($rootScope.sorular[$scope.soruindex].dogruid==index){

   
    $scope.animasyon="animated flash";
    $scope.skor++;
    $timeout(function(){
       $scope.buttonStyle="item-calm";
       $scope.animasyon="button-calm";
       $scope.animasyoncard="";
        if($scope.soruindex<($rootScope.sorular.length-1)){
      $scope.soruindex++;
    }else{
       $scope.final=true;
 $scope.puanguncelle($scope.skor);
    }
                
    }, 500);

     if($rootScope.sorular[$scope.soruindex].dogruid==1){
      $scope.buttonStyle1="item-balanced";

         $timeout(function(){
       $scope.buttonStyle1="item-calm";
       $scope.animasyon="button-calm";
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==2){
                  $scope.buttonStyle2="item-balanced";

         $timeout(function(){
       $scope.buttonStyle2="item-calm";
       $scope.animasyon="button-calm";
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==3){
                  $scope.buttonStyle3="item-balanced";

         $timeout(function(){
       $scope.buttonStyle3="item-calm";
       $scope.animasyon="button-calm";
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==4){
      $scope.buttonStyle4="item-balanced";

         $timeout(function(){
       $scope.buttonStyle4="item-calm";
       $scope.animasyon="button-calm";
    }, 500);
       }

  }else if($rootScope.sorular[$scope.soruindex].dogruid!=index){

    if($rootScope.sorular[$scope.soruindex].dogruid==1){
      $scope.buttonStyle1="item-balanced";
      $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle1="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==2){
                  $scope.buttonStyle2="item-balanced";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle2="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==3){
                  $scope.buttonStyle3="item-balanced";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle3="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);
       }else if($rootScope.sorular[$scope.soruindex].dogruid==4){
      $scope.buttonStyle4="item-balanced";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle4="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);
       }

    if($scope.cevap1==index){

    $scope.buttonStyle1="item-assertive";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle1="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);
    }else if($scope.cevap2==index){

    $scope.buttonStyle2="item-assertive";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle2="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);

    }else if($scope.cevap3==index){

    $scope.buttonStyle3="item-assertive";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle3="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);

    }else if($scope.cevap4==index){

    $scope.buttonStyle4="item-assertive";
    $scope.animasyon="animated shake";

         $timeout(function(){
       $scope.buttonStyle4="item-calm";
       $scope.animasyon="button-calm";
       $scope.aciklama=true;
       $scope.checked=false;
    }, 500);

    }







  }
   }else{
        
        if($rootScope.sorular[$scope.soruindex].dogruid==index){
  $scope.skor++;  
        }
    $scope.final=true;
    $scope.puanguncelle($scope.skor);
   }


 

}


$scope.digerSoru=function(){
  console.log("soru index:"+$scope.soruindex);
  console.log("soru uzunluk index:"+$rootScope.sorular.length);

  
    if($scope.soruindex<($rootScope.sorular.length-1)){
      $scope.soruindex++;
    }else{
       $scope.final=true;
 $scope.puanguncelle($scope.skor);
    }
  $scope.aciklama=false;

}


$scope.tekrar=function(){
    $scope.soruindex=0;
    $scope.skor=0;
    $scope.final=false;
    $rootScope.toplamPuan=0;
  

}




$scope.gitKitaplar=function(){
   
             $timeout(function () {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('tab.dash');
          }, 500);
}




})


.controller('ChatsCtrl', function($scope,$rootScope,$http) {




})

.controller('ProfilCtrl', function($scope,$rootScope,$http,$timeout,$ionicHistory,$state) {
 
      $scope.profil = JSON.parse(localStorage.getItem('kullaniciBilgi'));
      
      $scope.doLogout = function(){
      localStorage.clear();
      $timeout(function () {

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('login');
      }, 1000);
    };



});
