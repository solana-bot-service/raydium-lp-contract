<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case "GET":
        $sql = "SELECT * FROM users";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $users = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($users);
        break;
    case "POST":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO users(id, userId, rank, name, surname, email, unit, building, room, tel, created_at) VALUES(null, :userId, :rank, :name, :surname, :email, :unit,  :building, :room, :tel, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':rank', $user->rank);
        $stmt->bindParam(':userId', $user->userId);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':surname', $user->surname);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':unit', $user->unit);
        $stmt->bindParam(':building', $user->building);
        $stmt->bindParam(':room', $user->room);
        $stmt->bindParam(':tel', $user->tel);
        $stmt->bindParam(':created_at', $created_at);

        if($stmt->execute()) {
            $id = $conn->lastInsertId();
            $response = ['status' => 1, 'message' => 'Record created successfully.', 'id' => $id];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to create record.'];
        }
        echo json_encode($response);
        break;

    case "PUT":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE users SET userId= :userId, rank= :rank, name= :name, surname =:surname, email =:email, unit =:unit, building =:building, room =:room, tel =:tel, updated_at =:updated_at WHERE id = :id AND userId = :userId";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':rank', $user->rank);
        $stmt->bindParam(':userId', $user->userId);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':surname', $user->surname);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':unit', $user->unit);
        $stmt->bindParam(':building', $user->building);
        $stmt->bindParam(':room', $user->room);
        $stmt->bindParam(':tel', $user->tel);
        $stmt->bindParam(':updated_at', $updated_at);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM users WHERE id = :id";
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[3]);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}