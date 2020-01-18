<?php
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Credentials: true");
  header('Access-Control-Allow-Headers: X-Requested-With');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT'); // http://stackoverflow.com/a/7605119/578667
// header('Access-Control-Max-Age: 86400');
 include("databaseCon.php");
 include("class.phpmailer.php");
 include("class.smtp.php");

// $jsonDeneme ->phone_number ="05511716961";
//  $jsonDeneme ->email_address = "asd";
// $jsonDeneme ->service_type ="forgot_password";
//  $jsonDeneme ->name_user = "ads";
//  $jsonDeneme ->school="asd";
//  $jsonDeneme ->company_id="12";

//$gelen_json = json_encode($jsonDeneme);


$gelen_json = file_get_contents("php://input");
$gelen_data = json_decode($gelen_json);
$service_type = $gelen_data->service_type;


// echo $myJson;
//login_user($pdo,$myJson);
//-----------------------------------------------------------------
switch($service_type){
  case get_kitap:
    get_kitap($pdo, $gelen_data);
    break;
    case get_level:
    get_level($pdo, $gelen_data);
    break;
  case get_soru:
    get_soru($pdo,$gelen_data);
    break;
  case register_levelpuan:
    register_levelpuan($pdo,$gelen_data);
    break;
  case login_user:
    login_user($pdo,$gelen_data);
    break;
  case register_user:
    register_user($pdo, $gelen_data);
    break;
  case user_varMi:
    user_varMi($pdo,$gelen_data);
    break;
  case mail_varMi:
    mail_varMi($pdo,$gelen_data);
    break;
  case tel_varMi:
    tel_varMi($pdo,$gelen_data);
    break;
   case forgot_password:
    forgot_password($pdo,$gelen_data);
    break;
  case update_puan:
    update_puan($pdo,$gelen_data);
    break;
  case get_puan:
    get_puan($pdo,$gelen_data);
    break;
  default:
    echo $service_type."Switch 0";
}


function login_user($pdo, $gelen_data){

    $email_address = $gelen_data->email_address;
    $password_user =$gelen_data->password_user;

    $stmt = $pdo->prepare("SELECT user_id,name_user, username,school,email_address,phone_number,user_id,onaylanmisHesap,emsile_puan,bina_puan,magsud_puan
    from user where email_address=:email_address and password_user=:password_user");
    //Localstorage -> name_user, username,school,email_address,phone_number,company_id
    $stmt->bindParam(':email_address', $email_address, PDO::PARAM_STR);
    $stmt->bindParam(':password_user', $password_user, PDO::PARAM_STR);
    $stmt->execute();

    $gelenuser = $stmt->fetchAll(PDO::FETCH_ASSOC); //tüm gelenleri atıyor
    $json_data=json_encode($gelenuser,JSON_UNESCAPED_UNICODE); //json'a döüştürüyor
    if($gelenuser){
      //  $jsonArray = json_decode($json_data,true);
      //  print $jsonArray;
      print $json_data;
    }else{
      echo $gelenuser;
      return false;
    }
}


function get_puan($pdo,$gelen_data){


    $user_id =$gelen_data->user_id;
    $stmt = $pdo->prepare("SELECT * FROM user WHERE user_id=:user_id");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
    $stmt->execute();

  $gelenpuan = $stmt->fetchAll(PDO::FETCH_ASSOC); 
  $json_data=json_encode($gelenpuan,JSON_UNESCAPED_UNICODE); //json'a döüştürüyor
  if($gelenpuan){
    print $json_data;
  }else{

    echo "hata verdi get puan";
  }



}


function forgot_password($pdo, $gelen_data){
  //echo "Fonksiyona girdi";
  $phone_number = $gelen_data->phone_number;
  $stmt = $pdo->prepare("SELECT name_user,password_user,email_address, username FROM user WHERE phone_number=:phone_number");
  $stmt->bindParam(':phone_number', $phone_number, PDO::PARAM_STR);
  $stmt->execute();

  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $pass = $row['password_user'];
  $email_address = $row['email_address'];
  $username = $row['username'];
  $name_user = $row['name_user'];
  $mail = new PHPMailer();
  $mail->IsSMTP();
  $mail->SMTPAuth = true;
  $mail->Host = 'smtp.gmail.com';
  $mail->Port = 587;
  $mail->SMTPSecure = 'tls';
  $mail->Username = 'tahririapp@gmail.com';
  $mail->Password = '+-Muzaffer1997';
  $mail->SetFrom($mail->Username, 'Tahriri App');
  $mail->AddAddress($email_address, $name_user);
  $mail->CharSet = 'UTF-8';
  $mail->Subject = 'Şifre İsteği';
  $content = '
        <div style="background-color:#f2f3f5;padding:20px">
            <div style="max-width:600px;margin:0 auto">
                <div style="background:#fff;font:14px sans-serif;color:#686f7a;border-top:4px solid #11c1f3;margin-bottom:20px">
                    
                        <div style="border-bottom:1px solid #f2f3f5;padding:20px 30px">
                            
                                <img id="m_618079303692268896logo" width="150" style="max-width:100px;display:block" src="https://kavurgam.com/gmailicon.png" alt="Udemy" class="CToWUd">
                            
                        </div>
                    
                    
                        
                        <div style="padding:20px 30px">
                            <div style="font-size:16px;line-height:1.5em;border-bottom:1px solid #f2f3f5;padding-bottom:10px;margin-bottom:20px">
                                
                                    <p><a style="text-decoration:none;color:#000">
                                        
                                            
                                                Merhaba '.$username.',
                                            
                                        
                                    </a></p>
                                
                                
                                    
                                <p><a style="text-decoration:none;color:#000">Hesabınız için bir şifre isteği gönderildi.</a></p>
                                    
                                <p><a style="text-decoration:none;color:#000">Şifreniz: <span style="font-weight: bold;">'.$pass.'</span> </a></p>
                                    
                                <p><a style="text-decoration:none;color:#000"></a></p>
                                    
                                
                                
                                    

                                
                            </div>
                            
                            
                        </div>
                    
                    
                        
                    
                </div>
                <div style="font:11px sans-serif;color:#686f7a">
                    <p style="font-size:11px;color:#686f7a">
                        
                            Sağlayan: Tahriri Uyugulaması Ekibi.
                        
                        
                            
                        
                        
                            
                        
                    </p>
                </div>
            </div>
        </div>
    
';
  $mail->MsgHTML($content);
  if($mail->Send()) {
      echo "e-posta başarılı ile gönderildi";
  } else {
      echo "bir sorun var, sorunu ekrana bastıralım".'</br>';
      echo $mail->ErrorInfo;
  }

}




 function update_puan($pdo,$gelen_data){
  echo "update_puan dayım tamamdır buradayım";
  echo $gelen_data->kitappuan;
  $user_id =$gelen_data->user_id;
  $puan=$gelen_data->puan;
  $kitappuan = $gelen_data->kitappuan;

  if($kitappuan==emsile_puan){
      $stmt = $pdo->prepare("UPDATE `user` SET `emsile_puan`=($puan+emsile_puan) WHERE `user_id`=$user_id");
  //$stmt->bindParam(':kitappuan', $kitappuan, PDO::PARAM_STR);
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $stmt->bindParam(':puan', $puan, PDO::PARAM_STR);
  $stmt->execute();
   
  }else if($kitappuan==bina_puan){
      $stmt = $pdo->prepare("UPDATE `user` SET `bina_puan`=($puan+bina_puan) WHERE `user_id`=$user_id");
  //$stmt->bindParam(':kitappuan', $kitappuan, PDO::PARAM_STR);
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $stmt->bindParam(':puan', $puan, PDO::PARAM_STR);
  $stmt->execute();
}else if($kitappuan==magsud_puan){
      $stmt = $pdo->prepare("UPDATE `user` SET `magsud_puan`=($puan+magsud_puan)  WHERE `user_id`=$user_id");
  //$stmt->bindParam(':kitappuan', $kitappuan, PDO::PARAM_STR);
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $stmt->bindParam(':puan', $puan, PDO::PARAM_STR);
  $stmt->execute();
}

  //UPDATE `user` SET `emsile_puan`=10,`bina_puan`=10,`magsud_puan`=10 WHERE `user_id`=2
  /*
 $sql = "UPDATE `product_list` SET 
       `product_name` = '$product_name', 
       `product_category` = '$product_category', 
       `product_price` = '$product_price', 
       `product_description` = '$product_description', 
       `product_size_category` = '$size_category' 
  where clause..... (if required) ";

  $sql = "UPDATE product_list SET product_name='".$product_name."',product_category='".$product_category."',product_price='".$product_price."',product_description='".$product_description."',size_category='".$size_category."' WHERE product_id=".$product_id;


          $stmt = $pdo->prepare('UPDATE  consumption SET  consumption.count=consumption.count+1, consumption.totalCount = consumption.totalCount+1
        WHERE  consumption.user_id =:user_id and consumption.product_id=:product_id');
        $stmt->bindParam(':product_id', $product_id, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
        $stmt->execute();
  */
 // $stmt = $pdo->prepare('UPDATE  consumption SET  consumption.count=consumption.count+1, consumption.totalCount = consumption.totalCount+1 WHERE user_id =:user_id ');

          //UPDATE `user` SET `emsile_puan`=10,`bina_puan`=10,`magsud_puan`=10 WHERE `user_id`=2
/*
  $stmt = $pdo->prepare("UPDATE `user` SET `emsile_puan`=$puan WHERE `user_id`=$user_id");
  //$stmt->bindParam(':kitappuan', $kitappuan, PDO::PARAM_STR);
  $stmt->bindParam(':user_id', $user_id, PDO::PARAM_STR);
  $stmt->bindParam(':puan', $puan, PDO::PARAM_STR);
  $stmt->execute();
   
*/
 }


function register_user($pdo,$gelen_data){




  $name_user = $gelen_data->name_user;
  $username = $gelen_data->username;
  $password_user = $gelen_data->password_user;
  $school= $gelen_data->school;
  $email_address= $gelen_data->email_address;
  $phone_number= $gelen_data->phone_number;
  $company_id= $gelen_data->company_id;

  if( $pdo->exec('INSERT INTO user ( name_user, username,password_user,school,email_address,phone_number,company_id)
  VALUES ("'.$name_user.'","'.$username.'","'.$password_user.'","'.$school.'","'.$email_address.'","'.$phone_number.'","'.$company_id.'")')){
    echo "kayıt eklendi";
  }
  

}

function user_varMi($pdo,$gelen_data){
  $username =$gelen_data->username;

  $stmt = $pdo->prepare("SELECT * FROM user WHERE username=:username");
  $stmt->bindParam(':username', $username, PDO::PARAM_STR);
  $stmt->execute();
  echo $stmt->rowCount();

}

function mail_varMi($pdo,$gelen_data){
  $email_address =$gelen_data->email_address;
  $stmt = $pdo->prepare("SELECT * FROM user WHERE email_address=:email_address");
  $stmt->bindParam(':email_address', $email_address, PDO::PARAM_STR);
  $stmt->execute();
  echo $stmt->rowCount();
}

function tel_varMi($pdo,$gelen_data){
  $phone_number =$gelen_data->phone_number;

  $stmt = $pdo->prepare("SELECT * FROM user WHERE phone_number=:phone_number");
  $stmt->bindParam(':phone_number', $phone_number, PDO::PARAM_STR);
  $stmt->execute();
  echo $stmt->rowCount();
}



 
function get_kitap($pdo,$gelen_data){
  $stmt = $pdo->prepare("SELECT * FROM kitap");
  $stmt->execute();
  $gelenProducts = $stmt->fetchAll(PDO::FETCH_ASSOC); //tüm gelenleri atıyor
  $json_data=json_encode($gelenProducts,JSON_UNESCAPED_UNICODE); //json'a döüştürüyor
  if($gelenProducts){
    print $json_data;
  }else{

    echo "hata verdi get level";
  }



}






function get_soru($pdo,$gelen_data){ //Kampanyali olanları getirecek.
  
  

  $kitapid = $gelen_data->kitapid;

  $stmt = $pdo->prepare("SELECT id,soru,cevap1,cevap2,cevap3,cevap4,dogruid,levelid,kitapid,aciklama,sayfa FROM soru WHERE kitapid=:kitapid ORDER BY rand() LIMIT 10");
  $stmt->bindParam(':kitapid', $kitapid, PDO::PARAM_STR);
  $stmt->execute();
  $gelenProducts = $stmt->fetchAll(PDO::FETCH_ASSOC); //tüm gelenleri atıyor
  $json_data=json_encode($gelenProducts,JSON_UNESCAPED_UNICODE); //json'a döüştürüyor
  if($gelenProducts){
    print $json_data;
  }else{
    echo "hata verdi get soru";
  }
}



function register_levelpuan($pdo,$gelen_data){
  echo $gelen_data->levelpuan;
  $levelpuan = $gelen_data->levelpuan;
  $kitapid = $gelen_data->kitapid;
  $levelid = $gelen_data->levelid;
  $stmt = $pdo->prepare("UPDATE level SET levelpuan=11 WHERE kitapid=1 AND level=1");
  $stmt->bindParam(':kitapid', $kitapid, PDO::PARAM_STR);
  $stmt->bindParam(':levelid', $levelid, PDO::PARAM_STR);
  $stmt->execute();
   
}





?>
