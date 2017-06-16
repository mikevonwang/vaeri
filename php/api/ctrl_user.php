<?php

/*

- - -   V A E R I   - - -

This file controls the User.

*/

  function User($method, $data, $con) {
    // load JWT data
    require_once('../php/JWT.php');
    require_once('../php/config.php');
    date_default_timezone_set($vi_timezone);
    $now = new DateTime();
    $payload = (object) ['exp' => $now->getTimestamp() + 259200];
    // load bcrypt data
    require_once('../php/password.php');
    // define controller-wide variables
    $err = NULL;
    $result = NULL;
    $qry = (array) [];
    // *** /VerifyToken *** //
    if ($method == '/VerifyToken') {
      if (is_null($err)) {
        try {
          $decoded = JWT::decode($data->token, $vi_key, array('HS256'));
        }
        catch (Exception $e) {
          $decoded = NULL;
        }
        if ($decoded) {
          $result = (array) [];
          $result['user_id'] = $decoded->user_id;
          $result['username'] = $decoded->username;
        }
        else {
          $err = 'invalid_token';
        }
      }
      if (is_null($err)) {
        $qry[0] = ('UPDATE users SET date_activity = NOW() WHERE user_ID = ' . $result['user_id']);
        $ans = mysqli_query($con,$qry[0]);
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
      }
    }
    // *** /Register *** //
    else if ($method == '/Register') {
      if (is_null($err)) {
        $qry[0] = 'SELECT user_id FROM users WHERE email = "' . $data->email . '" AND deleted = 0';
        $ans = mysqli_query($con,$qry[0]);
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
        else if ($ans->{'num_rows'} > 0) {
          $err = 'email_taken';
          $result = NULL;
        }
      }
      if (is_null($err)) {
        $qry[1] = 'INSERT INTO users (email, hash, date_joined) VALUES ("' . $data->email . '", "' . $data->hash . '", NOW())';
        $ans = mysqli_query($con,$qry[1]);
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
      }
      if (is_null($err)) {
        $qry[2] = 'SELECT user_id FROM users WHERE email = "' . $data->email . '" AND deleted = 0';
        $ans = mysqli_query($con,$qry[2]);
        $args = $ans->fetch_object();
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
        else if ($ans->{'num_rows'} == 0) {
          $err = 'database_error';
          $result = NULL;
        }
        else {
          $payload->user_id = $args->user_id;
          $token = JWT::encode($payload, $vi_key);
        }
      }
      if (is_null($err)) {
        $qry[3] = 'UPDATE users SET token="' . $token . '" WHERE user_id=' . $args->user_id;
        $ans = mysqli_query($con,$qry[3]);
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
        else {
          $result = (array) [];
          $result['user_id'] = $args->user_id;
          $result['token'] = $token;
        }
      }
    }
    // *** /Login *** //
    else if ($method == '/Login') {
      if (is_null($err)) {
        $qry[0] = 'SELECT user_id, username, hash FROM users WHERE email = "' . $data->email . '" AND deleted = 0';
        $ans = mysqli_query($con,$qry[0]);
        $args = $ans->fetch_object();
        if (!$ans) {
          $err = mysqli_error($con);
        }
        else if ($ans->{'num_rows'} == 0) {
          $err = 'nonexistent_email';
          $result = NULL;
        }
        else if (!password_verify($data->password, $args->hash)) {
          $err = 'incorrect_password';
          $result = NULL;
        }
        else {
          $payload->user_id = $args->user_id;
          $payload->username = $args->username;
          $token = JWT::encode($payload, $vi_key);
        }
      }
      if (is_null($err)) {
        $qry[1] = 'UPDATE users SET token = "' . $token . '" WHERE user_id = ' . $args->user_id;
        $ans = mysqli_query($con,$qry[1]);
        if (!$ans) {
          $err = mysqli_error($con);
        }
        else {
          $result = (array) [];
          $result['user_id'] = $args->user_id;
          $result['username'] = $args->username;
          $result['token'] = $token;
        }
      }
    }
    // *** /Logout *** //
    else if ($method == '/Logout') {
      if (is_null($err)) {
        $qry[0] = 'UPDATE users SET token = NULL WHERE user_id = ' . $data->user_id;
        $ans = mysqli_query($con,$qry[0]);
        if (!$ans) {
          $err = mysqli_error($con);
          $result = NULL;
        }
        else {
          $result = 'token_deleted';
        }
      }
    }
    // return output
    if (!is_string($result)) {
      $result = (object) $result;
    }
    $output = (object) ['err' => $err, 'result' => $result, 'qry' => $qry];
    return $output;
  }

?>
