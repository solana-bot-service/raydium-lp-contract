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
            $parameters['user_id']  = !empty($_GET['user_id'])  ? $_GET['user_id']  : null;
            if (isset($parameters['user_id'])){ // (isset($path[3])) { // && is_numeric($path[3])
                $sql .= " WHERE user_id = :user_id LIMIT 1"; // id = :id 
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':user_id', $parameters['user_id']); // $path[3]
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

                            
                if(isset($_POST['verifyemail']))
                    {
                    //Post Values
                    $id=$_POST['id'];
                    $email=$_POST['email'];
                    $activationcode=md5("testtest"); // Creating activation code

                    $sql="UPDATE users SET activationcode=:activationcode WHERE id=:id";
                    $query = $conn->prepare($sql);
                    $query -> bindParam(':activationcode',$activationcode, PDO::PARAM_STR);
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


                } else {

                    $user = json_decode( file_get_contents('php://input') );
                    $sql = "INSERT INTO users(id, user_id, rank, name, surname, email, unit, position, building, room, tel, created_at) VALUES(null, :user_id, :rank, :name, :surname, :email, :unit, :position, :building, :room, :tel, :created_at)";
                    $stmt = $conn->prepare($sql);
                    $created_at = date('Y-m-d');
                    $stmt->bindParam(':rank', $user->rank);
                    $stmt->bindParam(':user_id', $user->user_id);
                    $stmt->bindParam(':name', $user->name);
                    $stmt->bindParam(':surname', $user->surname);
                    $stmt->bindParam(':email', $user->email);
                    $stmt->bindParam(':unit', $user->unit);
                    $stmt->bindParam(':position', $user->position);
                    $stmt->bindParam(':building', $user->building);
                    $stmt->bindParam(':room', $user->room);
                    $stmt->bindParam(':tel', $user->tel);
                    // $stmt->bindParam(':tel', json_encode($user->tel, JSON_INVALID_UTF8_IGNORE | JSON_INVALID_UTF8_SUBSTITUTE));
                    $stmt->bindParam(':created_at', $created_at);

                    if($stmt->execute()) {
                        $id = $conn->lastInsertId();
                        $response = ['status' => 1, 'message' => 'Record created successfully.', 'id' => $id];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to create record.'];
                    }
                    echo json_encode($response);
                    

                }

            
            break;

        case "PUT":
            $user = json_decode( file_get_contents('php://input') );
            $sql = "UPDATE users SET user_id= :user_id, rank= :rank, name= :name, surname =:surname, email =:email, unit =:unit, position =:position, building =:building, room =:room, tel =:tel, updated_at =:updated_at WHERE id = :id AND user_id = :user_id";
            $stmt = $conn->prepare($sql);
            $updated_at = date('Y-m-d');
            $stmt->bindParam(':id', $user->id);
            $stmt->bindParam(':rank', $user->rank);
            $stmt->bindParam(':user_id', $user->user_id);
            $stmt->bindParam(':name', $user->name);
            $stmt->bindParam(':surname', $user->surname);
            $stmt->bindParam(':email', $user->email);
            $stmt->bindParam(':unit', $user->unit);
            $stmt->bindParam(':position', $user->position);
            $stmt->bindParam(':building', $user->building);
            $stmt->bindParam(':room', $user->room);
            $stmt->bindParam(':tel', $user->tel);
            // $stmt->bindParam(':tel', json_encode($user->tel, JSON_INVALID_UTF8_IGNORE | JSON_INVALID_UTF8_SUBSTITUTE));
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