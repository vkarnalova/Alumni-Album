<?php
class Database
{
    private $connection;
    private $insertUserStatement;
    private $selectUserStatement;

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
        $sql = "INSERT INTO users(username, password, email, admin) VALUES (:user, :password, :email, :admin)";
        $this->insertUserStatement = $this->connection->prepare($sql);

        $sql = "SELECT * FROM users WHERE username=:username AND password=:password AND admin=:admin";
        $this->selectUserStatement = $this->connection->prepare($sql);
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
            // ["user" => "..."]
            $this->selectUserStatement->execute($data);

            return ["success" => true, "data" => $this->selectUserStatement];
        } catch (PDOException $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }
    }
}
