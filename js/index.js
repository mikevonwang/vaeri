'use strict'

/*

- - -   V A E R I   - - -

This file contains global JS functions.

*/

function $(x,c) {
  if (c === undefined) {
    c = document;
  }
  let y = Array.prototype.slice.call(c.querySelectorAll(x));
  if (y.length > 1) {
    return y;
  }
  else {
    return y[0];
  }
}

function cr(x,o) {
  let html = '';
  html += '<' + x;
  Object.keys(o).forEach((c) => {
    html += ' ' + c + '="' + o[c] + '"';
  });
  html += '>';
  html += '</' + x + '>';
  return html;
}

function history_push(new_path) {
  window.history.pushState({}, '', window.location.origin + new_path);
}

function api_call(method, path, body, callback) {
  const url = (location.hostname.startsWith('localhost') ? (config.api_base_dev + '/' + method) : (config.api_base_prod);
  const req = {
    path,
    body,
  };
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      callback(xhr.responseText);
    }
    else {
      console.log({
        error: xhr.responseText,
        error_code: xhr.status
      });
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(req));
}

function set_cookie(key,value) {
  document.cookie = key + '=' + value + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

function get_cookie(key) {
  var cookies = document.cookie.split(';');
  var crumbs;
  for (let i=0; i<cookies.length; i++) {
    crumbs = cookies[i].split('=');
    if (crumbs[0] === key) {
      return (crumbs[1]);
    }
  }
  return undefined;
}
