<?php 


error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

if(isset($_POST['verifyemail']))
{
//Post Values
$id=$_POST['id'];
$email=$_POST['email'];
$status=0;
$activationcode=md5('testtest'); // Creating activation code

$sql="UPDATE users SET activationcode=:activationcode WHERE id=:id";
$query = $conn->prepare($sql);
$query -> bindParam(':code',$code, PDO::PARAM_STR);
$query-> bindParam(':st',$st, PDO::PARAM_STR);
$query -> execute();

$to=$email;
$msg= "Thanks for new Registration.";   
$subject="Email verification";
$headers .= "MIME-Version: 1.0"."\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1'."\r\n";
$headers .= 'From: PHPGurukul | Programing Blog (Demo) <noreply@uas4gisupthehill-tothe.top>'."\r\n"; //Change this to  your email

$ms.="<html></body><div><div>Dear $name,</div></br></br>";
$ms.="<div style='padding-top:8px;'>Please click The following link For verifying and activation of your account</div>
<div style='padding-top:10px;'><a href='https://uas4gis.upthehill-tothe.top/api/email/email_verification.php?code=$activationcode'>Click Here</a></div> 
</body></html>";
mail($to,$subject,$ms,$headers);
echo "<script>alert('Registration successful, please verify in the registered Email-Id');</script>";


}
?>