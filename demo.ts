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
      //   this.encryptTokenpassword(str1,str2,str2,str3);
    };
  });
}
function main() {
  hook_xxx();
}

setImmediate(main);
