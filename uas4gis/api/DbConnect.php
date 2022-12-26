<?php
	/**
	* Database Connection
	*/
	class DbConnect {
		private $server = 'localhost';
		private $dbname = 'upthehil_uas4gis';
		private $user = 'upthehil_upthehil';
		private $pass = 'SyS6rd0QS1';

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

<!-- Database:	upthehil_uas4gis
Host:	localhost
Username:	upthehil_upthehil -->

<!-- set global sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'; -->

<!-- -- Create database
CREATE DATABASE upthehil_uas4gis;

CREATE TABLE `upthehil_uas4gis`.`users` 
(
`id` int NOT NULL auto_increment,
`userId` varchar(250),
`displayName` varchar(250),
`pictureUrl` varchar(500),
`rank` varchar(250),
`name` varchar(250),
`surname` varchar(250),
`email` varchar(250),
`mobile` bigint(16),
`created_at` timestamp,
`updated_at` timestamp, PRIMARY KEY (id)); -->
