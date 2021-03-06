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
            firstName VARCHAR(255) NOT NULL,
            familyName VARCHAR(255) NOT NULL,
            major VARCHAR(8) NOT NULL,
            class int NOT NULL,
            potok int,
            groupNumber int,
            phoneNumber VARCHAR(15),
            address VARCHAR(255),
            additionalInfo VARCHAR(255),
            PRIMARY KEY (username)
        )";
    $connection->exec($sql);

    // Create photos table
    $sql = "CREATE TABLE photos(
        id int NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        major VARCHAR(64),
        class int,
        potok int,
        groupNumber int,
        occasion VARCHAR(255),
        date DATETIME,
        user VARCHAR(30),
        PRIMARY KEY (id)
    )";
    $result = $connection->exec($sql);

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

    // Create badges table
    $sql = "CREATE TABLE badges(
		assignedUser VARCHAR(30) NOT NULL,
		assigningUser VARCHAR(30) NOT NULL,
		title VARCHAR(30) NOT NULL,
		description VARCHAR(255),
		iconId int NOT NULL,
		PRIMARY KEY (assignedUser, assigningUser, title)
	)";
    $connection->exec($sql);

    // Add admin
    $sql = "INSERT INTO users(username, password, email, admin, firstName, familyName, major, class) VALUES 
        ('admin', 'admin', 'non-existent@gmail.com', 1, 'Admin', 'Adminov', 'ad', 1992)";
    $connection->exec($sql);
} catch (PDOException $error) {
    echo $error->getMessage();
}
