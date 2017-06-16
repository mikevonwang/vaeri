<?php

/*

- - -   V A E R I   - - -

This file is the entrance point for all API requests.

*/

  require_once('api/ctrl_user.php');
  require_once('php/config.php');

  // get the data that was sent in the request from network.js
  $req_raw = file_get_contents('php://input');
  $req = json_decode($req_raw);
  $body = $req->body;
  $ofst = strrpos($data->path,'/');
  $path = substr($data->path, 0, $ofst);
  $subpath = substr($data->path, $ofst);

  // establish a connection to the database
  $con = mysqli_connect($db_host,$db_user,$db_pass,$db_name);
  if (!$con) {
    echo 'connection_error';
    exit;
  }

  // controllers
  if ($path == '/User') {
    $output = User($subpath, $body, $con);
  }

  // return data
  mysqli_close($con);
  echo json_encode($output, JSON_NUMERIC_CHECK);

?>
