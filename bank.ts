// frida -U NFHemobileSit -l bank.ts
// frida 脚本 for ios 

function nsstr2nsdata(nsstr) {
    return nsstr.dataUsingEncoding_(4);
}

function nsdata2nsstr(nsdata) {
    return ObjC.classes.NSString.alloc().initWithData_encoding_(nsdata, 4);
}

Interceptor.attach(ObjC.classes.DTRpcOperation['- signRequest:'].implementation , {
    onEnter : function(args){
        try{
            var httpObj = new ObjC.Object(args[0])['- httpBodyParameters']()
            // console.warn(`[+] ${httpObj}`)
            var httpBody = httpObj['objectForKey:']('requestData')

            var plainTextJson = JSON.parse(httpBody)

            plainTextJson[0]['_requestBody']['applyNo'] = '542206290000368' // 此处修改applyNo


            httpObj.setObject_forKey_(JSON.stringify(plainTextJson) , "requestData")
            
            console.warn(`[+] 请求:\n${JSON.stringify(plainTextJson)}\n`)
        }catch(e){
            console.log(e)

        }

    } , 
    onLeave : function(retval){
    }

})


Interceptor.attach(ObjC.classes.DTURLRequestOperation['- gunzipAndDecrypt:'].implementation , {
    onLeave : function(retval){
        var retvalString = nsdata2nsstr(retval)
        console.log(`[!] 响应:\n${retvalString}\n`)

        try{
            var retvalJson = JSON.parse(retvalString)

        }catch(e){

        }

    }
})

