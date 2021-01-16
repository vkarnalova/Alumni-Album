<?php

try {
    $config = parse_ini_file("config.ini", true);

    $host = $config['db']['host'];
    $dbname = $config['db']['name'];
    $username = $config['db']['user'];
    $pass = $config['db']['password'];

    // Create database
    $connection = new PDO("mysql:host=$host", $username, $pass);

    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    $connection->exec($sql);

    // Create users table
    $connection = new PDO(
        "mysql:host=$host;dbname=$dbname",
        $username,
        $pass,
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
    );

    $sql = "CREATE TABLE users(
            username VARCHAR(30) NOT NULL,
            password VARCHAR(30) NOT NULL,
            email VARCHAR(30) NOT NULL,
            admin TINYINT(1) NOT NULL,
            PRIMARY KEY (username)
        )";
    $connection->exec($sql);

    // Add admin
    $sql = "INSERT INTO users(username, password, email, admin) VALUES ('admin', 'admin', 'non-existent@gmail.com', 1)";
    $connection->exec($sql);
} catch (PDOException $error) {
    echo $error->getMessage();
}
