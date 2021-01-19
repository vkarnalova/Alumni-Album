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

    $connection = new PDO(
        "mysql:host=$host;dbname=$dbname",
        $username,
        $pass,
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
    );

    // Create users table
    $sql = "CREATE TABLE users(
            username VARCHAR(30) NOT NULL,
            password VARCHAR(30) NOT NULL,
            email VARCHAR(30) NOT NULL,
            admin TINYINT(1) NOT NULL,
            PRIMARY KEY (username)
        )";
    $connection->exec($sql);

    // Create photos table
    $sql = "CREATE TABLE photos(
        id int NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )";
    $connection->exec($sql);

    // Create photo_tag table
    $sql = "CREATE TABLE photo_tag(
        photoId int NOT NULL,
        tagId int NOT NULL,
        PRIMARY KEY (photoId, tagId)
    )";
    $connection->exec($sql);

    // Create tags table
    $sql = "CREATE TABLE tags(
        id int NOT NULL AUTO_INCREMENT,
        text VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    )";
    $connection->exec($sql);

    // Add admin
    $sql = "INSERT INTO users(username, password, email, admin) VALUES ('admin', 'admin', 'non-existent@gmail.com', 1)";
    $connection->exec($sql);
} catch (PDOException $error) {
    echo $error->getMessage();
}
