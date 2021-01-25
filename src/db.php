<?php
class Database
{
    private $connection;
    private $insertUserStatement;
    private $selectUserStatement;
    private $selectUserByUsernameStatement;
    private $insertPhotoStatement;
    private $selectPhotoByNameStatement;
    private $insertTagStatement;
    private $selectTagByTextStatement;
    private $insertTagForPhotoStatement;
    private $selectBadgeStatement;
    private $insertBadgeStatement;

    public function __construct()
    {
        $config = parse_ini_file("../config/config.ini", true);

        $host = $config['db']['host'];
        $dbname = $config['db']['name'];
        $user = $config['db']['user'];
        $password = $config['db']['password'];

        $this->init($host, $dbname, $user, $password);
    }

    private function init($host, $dbname, $user, $password)
    {
        try {
            $this->connection = new PDO("mysql:host=$host;dbname=$dbname", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

            $this->prepareStatements();
        } catch (PDOException $e) {
            return "Connection failed: " . $e->getMessage();
        }
    }

    private function prepareStatements()
    {
        // users table statements
        $sql = "INSERT INTO users(username, password, email, admin, firstName, familyName, major, class) VALUES (:user, :password, :email, :admin, :firstName, :familyName, :major, :class)";
        $this->insertUserStatement = $this->connection->prepare($sql);

        $sql = "SELECT * FROM users WHERE username=:username AND password=:password AND admin=:admin";
        $this->selectUserStatement = $this->connection->prepare($sql);

        $sql = "SELECT * FROM users WHERE username=:username";
        $this->selectUserByUsernameStatement = $this->connection->prepare($sql);

        // photos table statements
        $sql = "INSERT INTO photos(name, major, class, potok, groupNumber, occasion) VALUES (:name, :major, :class, :potok, :groupNumber, :occasion)";
        $this->insertPhotoStatement = $this->connection->prepare($sql);

        $sql = "SELECT * FROM photos WHERE name=:name";
        $this->selectPhotoByNameStatement = $this->connection->prepare($sql);

        // tags table statements
        $sql = "INSERT INTO tags(text) VALUES (:text)";
        $this->insertTagStatement = $this->connection->prepare($sql);

        $sql = "SELECT * FROM tags WHERE text=:text";
        $this->selectTagByTextStatement = $this->connection->prepare($sql);

        // photo_tag table statements
        $sql = "INSERT INTO photo_tag(photoId, tagId) VALUES (:photoId, :tagId)";
        $this->insertTagForPhotoStatement = $this->connection->prepare($sql);

        // badges table statements
        $sql = "SELECT * FROM badges WHERE assignedUser=:assignedUser";
        $this->selectBadgeStatement = $this->connection->prepare($sql);

        $sql = "INSERT INTO badges(assignedUser, assigningUser,	title, description, iconId) VALUES (:assignedUser, :assigningUser, :title, :description, :iconId)";
        $this->insertBadgeStatement = $this->connection->prepare($sql);
    }

    public function insertUserQuery($data)
    {
        try {
            // ["user" => "...", "password => "...", :email => ",,,"]
            $this->insertUserStatement->execute($data);

            return ["success" => true];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectUserQuery($data)
    {
        try {
            // ["username" => "...", "password" => "...", "admin" => "..."]
            $this->selectUserStatement->execute($data);

            return ["success" => true, "data" => $this->selectUserStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectUserByUsernameQuery($data)
    {
        try {
            // ["username" => "..."]
            $this->selectUserByUsernameStatement->execute($data);

            return ["success" => true, "data" => $this->selectUserByUsernameStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function updateUserInfoQuery($sql)
    {
        try {
            $updateUserInfoStatement = $this->connection->prepare($sql);
            $updateUserInfoStatement->execute();

            return ["success" => true, "data" => $updateUserInfoStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function insertPhotoQuery($data)
    {
        try {
            // ["name" => "..."]
            $this->insertPhotoStatement->execute($data);

            return ["success" => true, "data" => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectPhotoByNameQuery($data)
    {
        try {
            // ["name" => "..."]
            $this->selectPhotoByNameStatement->execute($data);

            return ["success" => true, "data" => $this->selectPhotoByNameStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function insertTagQuery($data)
    {
        try {
            // ["text" => "..."]
            $this->insertTagStatement->execute($data);

            return ["success" => true, "data" => $this->connection->lastInsertId()];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectTagByTextQuery($data)
    {
        try {
            // ["text" => "..."]
            $this->selectTagByTextStatement->execute($data);

            return ["success" => true, "data" => $this->selectTagByTextStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function insertTagForPhotoQuery($data)
    {
        try {
            // ["photoId" => "...", "tagId" => "..."]
            $this->insertTagForPhotoStatement->execute($data);

            return ["success" => true];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectBadge($data)
    {
        try {
            $this->selectBadgeStatement->execute($data);

            return ["success" => true, "data" => $this->selectBadgeStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function insertBadge($data)
    {
        try {
            $this->insertBadgeStatement->execute($data);

            return ["success" => true];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }

    public function selectPhotoByInputQuery($sql)
    {
        $selectPhotoByInputStatement = $this->connection->prepare($sql);

        try {
            $selectPhotoByInputStatement->execute();
            return ["success" => true, "data" => $selectPhotoByInputStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }
}
