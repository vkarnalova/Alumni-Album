CREATE DATABASE album;

CREATE TABLE album.users(
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
);

CREATE TABLE album.photos(
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
);

CREATE TABLE album.photo_tag(
        photoId int NOT NULL,
        tagId int NOT NULL,
        PRIMARY KEY (photoId, tagId)
);

CREATE TABLE album.tags(
        id int NOT NULL AUTO_INCREMENT,
        text VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
);

CREATE TABLE album.badges(
		assignedUser VARCHAR(30) NOT NULL,
		assigningUser VARCHAR(30) NOT NULL,
		title VARCHAR(30) NOT NULL,
		description VARCHAR(255),
		iconId int NOT NULL,
		PRIMARY KEY (assignedUser, assigningUser, title)
);

INSERT INTO users(username, password, email, admin, firstName, familyName, major, class) VALUES ('admin', 'admin', 'non-existent@gmail.com', 1, 'Admin', 'Adminov', 'ad', 1992);