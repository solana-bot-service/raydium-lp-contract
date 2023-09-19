<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include '../DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();



if(!empty($_GET['code']) && isset($_GET['code']))
{
$code=$_GET['code'];

$sql = "SELECT * FROM users WHERE activationcode=:code";
$query = $conn -> prepare($sql);
$query->bindParam(':code',$code,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount() > 0)
{
  
$st=0;
$sql = "SELECT id FROM users WHERE activationcode=:code and status=:st";
$query = $conn -> prepare($sql);
$query->bindParam(':code',$code,PDO::PARAM_STR);
$query->bindParam(':st',$st,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount() > 0)
{
$st=1;
$sql = "UPDATE users SET status=:st WHERE activationcode=:code";
$query = $conn->prepare($sql);
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