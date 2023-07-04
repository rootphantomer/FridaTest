function find_hook_fun() {
  var fun_Name = "";
  var libart = Module.findBaseAddress("libart.so"); //查找基地址
  var exports = Module.enumerateExportsSync("libart.so");
  for (var i = 0; i < exports.length; i++) {
    if (exports[i].name.indexOf("OpenMemory") !== -1) {
      fun_Name = exports[i].name;
      console.log(
        "导出模块名: " +
          exports[i].name +
          "\t\t偏移地址: " +
          (exports[i].address - libart - 1)
      );
      break;
    } else if (exports[i].name.indexOf("OpenCommon") !== -1) {
      fun_Name = exports[i].name;
      console.log(
        "导出模块名: " +
          exports[i].name +
          "\t\t偏移地址: " +
          (exports[i].address - libart - 1)
      );
      break;
    }
  }
  return fun_Name;
}

function DexFileVerifier(Verify) {
  var magic_03x = true;
  var magic_Hex = [0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00];
  for (var i = 0; i < 8; i++) {
    if (Memory.readU8(ptr(Verify).add(i)) !== magic_Hex[i]) {
      if (Memory.readU8(ptr(Verify).add(i)) === 0x37 || 0x38) {
        console.log("new dex");
      } else {
        magic_03x = false;
        break;
      }
    }
  }
  return magic_03x;
}

function dump_Dex(fun_Name, apk_Name) {
  if (fun_Name !== "") {
    var hook_fun = Module.findExportByName("libart.so", fun_Name);
    Interceptor.attach(hook_fun, {
      onEnter: function (args) {
        var begin = 0;
        var dex_flag = false;
        dex_flag = DexFileVerifier(args[0]);
        if (dex_flag === true) {
          begin = args[0];
        }
        if (begin === 0) {
          dex_flag = DexFileVerifier(args[1]);
          if (dex_flag === true) {
            begin = args[1];
          }
        }
        if (dex_flag === true) {
          console.log("magic : " + Memory.readUtf8String(begin));
          var address = parseInt(begin, 16) + 0x20;
          var dex_size = Memory.readInt(ptr(address));
          console.log("dex_size :" + dex_size);
          var dex_path = "/data/data/" + apk_Name + "/" + dex_size + ".dex";
          var dex_file = new File(dex_path, "wb");
          dex_file.write(Memory.readByteArray(begin, dex_size));
          dex_file.flush();
          dex_file.close();
        }
      },
      onLeave: function (retval) {},
    });
  } else {
    console.log("Error: no hook function.");
  }
}

var fun_Name = find_hook_fun();
var apk_Name = "com.dodonew.online";
dump_Dex(fun_Name, apk_Name);
// frida -U -f com.dodonew.online -l dumpdex.js --no-pause
