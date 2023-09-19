<!-- http://www.phpgurukul.com/demos/emailverify/email_verification.php?code=27ecacb117b60cc525c9efe964429046 -->

<?php include_once("config.php");
if(isset($_POST['submit']))
{
//Post Values
$id=$_POST['id'];
$email=$_POST['email'];
$status=0;
$activationcode=md5($email.time()); // Creating activation code

$sql="UPDATE users SET activationcode=:activationcode WHERE id=:id";
// "insert into users(name,email,password,activationcode,status) values(:name,:email,:password,:activationcode,:status)";
$query = $dbh->prepare($sql);
$query -> bindParam(':code',$code, PDO::PARAM_STR);
$query-> bindParam(':st',$st, PDO::PARAM_STR);
$query -> execute();
$lastInsertId = $dbh->lastInsertId();
if($lastInsertId)
{
$to=$email;
$msg= "Thanks for new Registration.";   
$subject="Email verification";
$headers .= "MIME-Version: 1.0"."\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1'."\r\n";
$headers .= 'From: PHPGurukul | Programing Blog (Demo) <info@phpgurukul.com>'."\r\n"; //Change this to  your email

$ms.="<html></body><div><div>Dear $name,</div></br></br>";
$ms.="<div style='padding-top:8px;'>Please click The following link For verifying and activation of your account</div>
<div style='padding-top:10px;'><a href='http://yourdomain.com/email_verification.php?code=$activationcode'>Click Here</a></div> 
</body></html>";
mail($to,$subject,$ms,$headers);
echo "<script>alert('Registration successful, please verify in the registered Email-Id');</script>";
echo "<script>window.location = 'login.php';</script>";;
}
else
{
echo "<script>alert('Something went wrong. Please try again.');</script>";
}
}
?>