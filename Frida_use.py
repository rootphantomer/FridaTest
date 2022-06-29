import json
import frida
import sys


def on_message(message, data):
    print(message)


session = frida.get_remote_device().attach("农发企业银行")
# print(session)

with open("./js/cookieDump.js","r",encoding="utf-8") as f:
    script = session.create_script(f.read())


script.on('message',on_message)
script.load()  #加载脚本

sys.stdin.read()

if __name__ == '__main__':
    pass




