<?php
include '../DbConnect.php';
if(!empty($_GET['code']) && isset($_GET['code']))
{
$code=$_GET['code'];

$sql = "SELECT * FROM users WHERE activationcode=:code";
$query = $dbh -> prepare($sql);
$query->bindParam(':code',$code,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount() > 0)
{
  
$st=0;
$sql = "SELECT id FROM users WHERE activationcode=:code and status=:st";
$query = $dbh -> prepare($sql);
$query->bindParam(':code',$code,PDO::PARAM_STR);
$query->bindParam(':st',$st,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount() > 0)
{
$st=1;
$sql = "UPDATE users SET status=:st WHERE activationcode=:code";
$query = $dbh->prepare($sql);
$query -> bindParam(':code',$code, PDO::PARAM_STR);
$query-> bindParam(':st',$st, PDO::PARAM_STR);
$query -> execute();
}
else
{
$msg ="Your account is already active, no need to activate again";
}
}
else
{
$msg ="Wrong activation code.";
}
}
?>