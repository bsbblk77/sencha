<?php
$to = $_REQUEST['to'];
$dsn = 'mysql:dbname=boloyaco_fb;host=localhost';
$user = 'boloyaco';
$password = '3141592654';
$To = "bsbblk@gmail.com";
$Subject = $_REQUEST['subject'];
$strHeader .= "From: ".$_REQUEST["name"]."<".$_REQUEST["email"].">\nReply-To:".$_POST["email"].""; 
$Header = $_REQUEST['email'];
$Message = $_REQUEST['message'];
if($Subjext != ' ' && $Header != ' ' &&  $Message !=' '){
//mail ($to,$Subject,$Message,$strHeader);
try {
    $dbh = new PDO($dsn, $user, $password);

    if (isset($_GET['action']) && $_GET['action'] == "get") {
        $sql = "SELECT * FROM messages";
        $guests = array();
        foreach ($dbh->query($sql) as $row)
        {
            $guests[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'subject' => $row['subject'],
                'message' => $row['message'],
                'date' => $row['date_entry']
            );
        }
        echo json_encode(array('success' => true, 'guests' => $guests));
    } else {
        $dbh->exec("INSERT INTO messages VALUES ('', '".$_POST['name']."',
            '".$_POST['email']."', '".$_POST['subject']."', '".$_POST['message']."',
            '".date("Y-m-d H:i:s")."')");
        
        echo '{"success":true, "msg":'.json_encode('Email Has Been Sent').'}';
    }
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
}
?>
