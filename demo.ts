/*
 * @Author: rootphantomer rootphantomy@hotmail.com
 * @Date: 2023-06-25 14:42:52
 * @LastEditors: rootphantomer
 * @LastEditTime: 2023-06-25 16:30:25
 * @FilePath: /FridaTest/demo.ts
 * @Description:demo frida js
 *
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved.
 */
// frida -U -l chrome.js com.android.chrome

console.log("[*] Starting firda script");
function bytes2hexstr_2(arrBytes) {
  var str_hex = JSON.stringify(arrBytes);
  return str_hex;
}
function hook_xxx() {
  Java.perform(function () {
    console.log("Starting hook function...");
    var targetClass = "com.xxxxxx.xxxx.util.jni.Coded";
    var gclass = Java.use(targetClass);
    gclass.encryptTokenpassword.implementation = function (str1, str2, str3) {
      var res = this.encryptTokenpassword("test1", "", "123456", "");
      //send(res);
      console.log(res);
      return res;
      //  return this.encryptTokenpassword(str1,str2,str2,str3);
      //返回原来的值不进行任何操作
    };
  });
}
function main() {
  hook_xxx();
}

setImmediate(main);
