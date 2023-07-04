import frida
import sys


def on_message(message, data):
    print(message)


# attach 模式传入的是 APP 名称，spawn 模式传入的是 APP 包名
# 方式一：attach 模式，已经启动的 APP
session = frida.get_remote_device().attach("农发企业银行")
# session = frida.get_usb_device().attach("com.android.chrome")
# print(session)
# 方式二，spawn 模式，重启 APP
# device = frida.get_usb_device(-1)
# pid = frida.get_remote_device().spawn(["owasp.mstg.uncrackable1"])
# session = device.attach(pid)

# with open("./js/cookieDump.js", "r", encoding="utf-8") as f:
with open("./demo.js", "r", encoding="utf-8") as f:
    script = session.create_script(f.read())


script.on("message", on_message)
script.load()  # 加载脚本

sys.stdin.read()
