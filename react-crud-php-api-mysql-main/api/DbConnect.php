<?php
	/**
	* Database Connection
	*/
	class DbConnect {
		private $server = '127.0.0.1';
		private $dbname = 'upthehil_uas4gis';
		private $user = 'upthehil_upthehil';
		private $pass = '9nRleoZ2zH';

		public function connect() {
			try {
				$conn = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname, $this->user, $this->pass);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				return $conn;
			} catch (\Exception $e) {
				echo "Database Error: " . $e->getMessage();
			}
		}
        
	}
?>