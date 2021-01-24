<?php

function startsWith ($string, $startString) { 
    $len = strlen($startString); 
    return (substr($string, 0, $len) === $startString); 
} 

function modifySendmailIni($sendMailIniPath) {
	$configfile = fopen($sendMailIniPath, "r") or die("Unable to open file!");
	$content = "";
    while (($line = fgets($configfile)) !== false) {
        if (startsWith($line, "smtp_server")) {
			$content .= "smtp_server=smtp.gmail.com\n";
		} else if (startsWith($line, "smtp_port")) {
			$content .= "smtp_port=587\n";
		} else if (startsWith($line, "smtp_ssl")) {
			$content .= "smtp_ssl=tls\n";
		} else if (startsWith($line, ";error_logfile")) {
			$content .= "error_logfile=error.log\n";
		} else if (startsWith($line, ";debug_logfile")) {
			$content .= "debug_logfile=debug.log\n";
		} else if (startsWith($line, "auth_username")) {
			$content .= "auth_username=alumnialbummail@gmail.com\n";
		} else if (startsWith($line, "auth_password")) {
			$content .= "auth_password=Alumni-Album1\n";
		} else if (startsWith($line, "force_sender")) {
			$content .= "force_sender=alumnialbummail@gmail.com\n";
		} else if (startsWith($line, "hostname")) {
			$content .= "hostname=localhost\n";
		} else {
			$content .= $line;
		}
    }
	
    fclose($configfile);	
	file_put_contents($sendMailIniPath, $content);
}

function modifyPhpIni($phpIniPath, $sendMailExePath) {
	$configfile = fopen($phpIniPath, "r") or die("Unable to open file!");
	$content = "";
	while (($line = fgets($configfile)) !== false) {
		$content .= $line;
		if (startsWith($line, "[mail function]")) {
			break;
		}
	}
	
    while (($line = fgets($configfile)) !== false) {
        if (startsWith($line, "SMTP=localhost")) {
			$content .= ";" . "$line";
		} else if (startsWith($line, "smtp_port")) {
			$content .= ";" . "$line";
		} else if (startsWith($line, "sendmail_from")) {
			$content .= ";" . "$line";
		} else if (startsWith($line, ";sendmail_path") || startsWith($line, "sendmail_path")) {
			$content .= "sendmail_path=" . "$sendMailExePath" . "\n";
		} else if (startsWith($line, ";extension=php_openssl.dll")) {
			$content .= "extension=php_openssl.dll\n";
		} else {
			$content .= $line;
		}
    }
	
    fclose($configfile);	
	file_put_contents($phpIniPath, $content);
}

try {
	$sendMailIniPath = "D:\\xampp\\sendmail\\sendmail.ini";
	$phpIniPath = "D:\\xampp\\php\\php.ini";
	$sendMailExePath = "D:\\xampp\\sendmail\\sendmail.exe";
	modifySendMailIni($sendMailIniPath);
	modifyPhpIni($phpIniPath, $sendMailExePath);

    
} catch (PDOException $error) {
    echo $error->getMessage();
}
