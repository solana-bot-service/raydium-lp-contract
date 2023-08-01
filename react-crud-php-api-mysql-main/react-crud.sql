-- Create database
CREATE DATABASE react_crud;

-- Create users table
CREATE TABLE `users`
(
    `id` int NOT NULL auto_increment,
    `user_id` varchar(255),
    `rank` varchar(255),
    `name` varchar(255),
    `surname` varchar(255),
    `email` varchar(255),
    `unit` varchar(255),
    `building` varchar(255),
    `room` varchar(255),
    `tel` bigint(14),
    `created_at` timestamp,
    `updated_at` timestamp, 
    PRIMARY KEY (id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
