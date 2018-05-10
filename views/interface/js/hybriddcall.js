ychan=function(usercrypto,step,txtdata){var encdata=ychan_encode(usercrypto,step,txtdata);return"y/"+encdata};ychan_obj=function(usercrypto,step,encdata){return JSON.parse(ychan_decode(usercrypto,step,encdata))};ychan_encode=function(usercrypto,step,txtdata){var session_object=read_session(usercrypto.user_keys,usercrypto.nonce);var sessionid=session_object.session_pubsign;var server_session_pubkey=nacl.from_hex(session_object.server_pubkey);var client_session_seckey=nacl.from_hex(session_object.session_seckey);var nonce1_dec=new Decimal(hex2dec.toDec(session_object.nonce1));var nonce2_dec=new Decimal(hex2dec.toDec(session_object.nonce2));var step_dec=new Decimal(step);var nonce_constr=nonce1_dec.plus(nonce2_dec).plus(step_dec).toDecimalPlaces(64);var nonce_convert=hex2dec.toHex(nonce_constr.toFixed(0).toString());var nonce_conhex=nonce_convert.substr(2,nonce_convert.length);var session_nonce=nacl.from_hex(nonce_conhex);var crypt_utf8=nacl.encode_utf8(txtdata);var crypt_bin=nacl.crypto_box(crypt_utf8,session_nonce,server_session_pubkey,client_session_seckey);var encdata=nacl.to_hex(crypt_bin);return sessionid+"/"+step+"/"+UrlBase64.safeCompress(encdata)};ychan_decode=function(usercrypto,step,encdata){if(encdata==null){txtdata=null}else{encdata=UrlBase64.safeDecompress(encdata);var session_object=read_session(usercrypto.user_keys,usercrypto.nonce);var server_session_pubkey=nacl.from_hex(session_object.server_pubkey);var client_session_seckey=nacl.from_hex(session_object.session_seckey);var nonce1_dec=new Decimal(hex2dec.toDec(session_object.nonce1));var nonce2_dec=new Decimal(hex2dec.toDec(session_object.nonce2));var step_dec=new Decimal(step);var nonce_constr=nonce1_dec.plus(nonce2_dec).plus(step_dec).toDecimalPlaces(64);var nonce_convert=hex2dec.toHex(nonce_constr.toFixed(0).toString());var nonce_conhex=nonce_convert.substr(2,nonce_convert.length);var session_nonce=nacl.from_hex(nonce_conhex);var hexdata=encdata;if(hexdata!=null){var crypt_hex=nacl.from_hex(hexdata);var crypt_bin=nacl.crypto_box_open(crypt_hex,session_nonce,server_session_pubkey,client_session_seckey);var txtdata=nacl.decode_utf8(crypt_bin)}else{txtdata=null}}return txtdata};zchan=function(usercrypto,step,txtdata){var encdata=ychan_encode(usercrypto,step,zchan_encode(usercrypto,step,txtdata));return"z/"+encdata};zchan_obj=function(usercrypto,step,encdata){try{return JSON.parse(zchan_decode(usercrypto,step,encdata))}catch(err){return false}};zchan_encode=function(usercrypto,step,txtdata){return LZString.compressToEncodedURIComponent(txtdata)};zchan_decode=function(usercrypto,step,encdata){return LZString.decompressFromEncodedURIComponent(ychan_decode(usercrypto,step,encdata))};fromInt=function(input,factor){var f=Number(factor);var x=new Decimal(String(input));return x.times((f>1?"0."+new Array(f).join("0"):"")+"1")};toInt=function(input,factor){var f=Number(factor);var x=new Decimal(String(input));return x.times("1"+(f>1?new Array(f+1).join("0"):""))};formatFloat=function(n){return String(Number(n))};isToken=function(symbol){return symbol.indexOf(".")!==-1?1:0};activate=function(code){if(typeof code=="string"){eval("var deterministic = (function(){})(); "+code);return deterministic}else{console.log("Cannot activate deterministic code!");return function(){}}};initAsset=function(entry,fullmode){function finalize(dcode,submode){deterministic=activate(LZString.decompressFromEncodedURIComponent(dcode));assets.mode[entry]=fullmode;assets.seed[entry]=deterministicSeedGenerator(entry);assets.keys[entry]=deterministic.keys({symbol:entry,seed:assets.seed[entry],mode:submode});assets.addr[entry]=deterministic.address(Object.assign(assets.keys[entry],{mode:submode}));var loop_step=next_step();hybriddcall({r:"a/"+entry+"/details",c:GL.usercrypto,s:loop_step,z:0},0,function(object){if(typeof object.data!=="undefined"){assets.fact[entry]=object.data["factor"];assets.fees[entry]=object.data["fee"];assets.cntr[entry]=object.data["contract"];assets.base[entry]=object.data["keygen-base"];assets.fsym[entry]=object.data["fee-symbol"]}})}var mode=fullmode.split(".")[0];var submode=fullmode.split(".")[1];if(typeof assets.modehashes[mode]!="undefined"){storage.Get(assets.modehashes[mode]+"-LOCAL",function(dcode){if(dcode){finalize(dcode,submode);return true}else{storage.Del(assets.modehashes[mode]+"-LOCAL")}if(!dcode){hybriddcall({r:"s/deterministic/code/"+mode,z:0},null,function(object){if(typeof object.error!=="undefined"&&object.error===0){storage.Set(assets.modehashes[mode]+"-LOCAL",object.data);finalize(object.data,submode)}});return true}})}};userStorageKey=function(key){return nacl.to_hex(sha256(GL.usercrypto.user_keys.boxPk))+"-"+String(key)};userEncode=function(data){var nonce_salt=nacl.from_hex("F4E5D5C0B3A4FC83F4E5D5C0B3A4AC83F4E5D000B9A4FC83");var crypt_utf8=nacl.encode_utf8(JSON.stringify(data));var crypt_bin=nacl.crypto_box(crypt_utf8,nonce_salt,GL.usercrypto.user_keys.boxPk,GL.usercrypto.user_keys.boxSk);return UrlBase64.safeCompress(nacl.to_hex(crypt_bin))};userDecode=function(data){var object=null;if(data!=null){var nonce_salt=nacl.from_hex("F4E5D5C0B3A4FC83F4E5D5C0B3A4AC83F4E5D000B9A4FC83");var crypt_hex=nacl.from_hex(UrlBase64.safeDecompress(data));var crypt_bin=nacl.crypto_box_open(crypt_hex,nonce_salt,GL.usercrypto.user_keys.boxPk,GL.usercrypto.user_keys.boxSk);try{object=JSON.parse(nacl.decode_utf8(crypt_bin))}catch(err){object=null}}return object};function deterministicSeedGenerator(asset){var salt="1nT3rN3t0Fc01NsB1nD5tH3cRyPt05Ph3R3t093Th3Rf0Rp30Pl3L1k3M34nDy0U";function xorEntropyMix(key,str){var c="";var k=0;for(i=0;i<str.length;i++){c+=String.fromCharCode(str[i].charCodeAt(0).toString(10)^key[k].charCodeAt(0).toString(10));k++;if(k>=key.length){k=0}}return c}return UrlBase64.Encode(xorEntropyMix(nacl.to_hex(GL.usercrypto.user_keys.boxPk),xorEntropyMix(asset.split(".")[0],xorEntropyMix(salt,nacl.to_hex(GL.usercrypto.user_keys.boxSk))))).slice(0,-2)}progressbar=function(size){return'<div class="progress-radial" proc-data=""'+(size>0?' style="font-size: '+size+'em;" size="'+size+'"':"")+'><div class="dot" style="'+(size>0?"width:"+size+"px;height:"+size+'px;"':'width:1em;height:1em;overflow:visible;"')+'"></div><svg style="margin-left:-'+(size>0?size+"px":"1em")+';" viewbox="0 0 80 80" height="120" width="120"><circle cx="40" cy="40" r="35" fill="rgba(255,255,255,0.0)" stroke="#BBB" stroke-width="10" stroke-dasharray="239" stroke-dashoffset="239" /></svg></div>'};hybriddcall=function(properties,element,postfunction,waitfunction){if(typeof properties.r=="undefined"){if(typeof this.vars.postfunction=="function"){this.vars.postfunction({object:{properties:properties}})}}var urltarget=properties.r;var usercrypto=GL.usercrypto;var step=next_step();var reqmethod=typeof properties.z!="undefined"&&!properties.z?0:1;if(!element){element="#NULL"}var urlrequest=path+(reqmethod?zchan(usercrypto,step,urltarget):ychan(usercrypto,step,urltarget));var varsmain={properties:properties,element:element,postfunction:postfunction,waitfunction:waitfunction};$.ajax({url:urlrequest,timeout:3e4,success:function(encobject){var object=reqmethod?zchan_obj(usercrypto,step,encobject):ychan_obj(usercrypto,step,encobject);if(object===false){console.log("Retrying call no: "+step);hybriddcall(properties,element,postfunction,waitfunction)}else{if(object==null){object={}}object.properties=properties;if($(this.vars.element).html()==="?"){var size=$(this.vars.element+" .progress-radial").attr("size");$(this.vars.element).html(progressbar(size))}hybriddproc(this.vars.element,object,this.vars.postfunction,this.vars.waitfunction,0)}}.bind({vars:varsmain}),error:function(object){$(this.vars.element).html("[read error!]");if(typeof this.vars.postfunction=="function"){var pass=typeof this.vars.properties.pass!="undefined"?this.vars.properties.pass:null;this.vars.postfunction(object,pass)}}.bind({vars:varsmain})});function hybriddproc(element,object,postfunction,waitfunction,cnt){if(cnt){if(cnt<10){cnt++}}else{cnt=1}var urltarget=object.properties.r;var usercrypto=GL.usercrypto;var proc_step=next_step();var reqmethod=typeof object.properties.z!="undefined"&&!object.properties.z?0:1;var procobj=object;if(typeof object.data!="undefined"){var urlrequest=path+(reqmethod?zchan(usercrypto,proc_step,"p/"+object.data):ychan(usercrypto,proc_step,"p/"+object.data));var varsproc={element:element,procobj:procobj,postfunction:postfunction,waitfunction:waitfunction,cnt:cnt};$.ajax({url:urlrequest,timeout:3e4,success:function(result){var object=reqmethod?zchan_obj(usercrypto,proc_step,result):ychan_obj(usercrypto,proc_step,result);if(typeof object!="object"){object.progress=0}var cnt=this.vars.cnt;var element=this.vars.element;var procobj=this.vars.procobj;var postfunction=this.vars.postfunction;var waitfunction=this.vars.waitfunction;var perc=259*(1-object.progress);perc=perc>239?perc>258?239:232:perc<20?20:perc;$(element+" .progress-radial circle").css("stroke-dashoffset",perc);if(object.progress<1&&object.stopped==null){$(element+" .progress-radial").attr("proc-data",object.data);setTimeout(function(element,procobj,postfunction,waitfunction,cnt){hybriddproc(element,procobj,postfunction,waitfunction,cnt)},cnt*3e3,element,procobj,postfunction,waitfunction,cnt);if(typeof waitfunction=="function"){var pass=typeof procobj.properties.pass!="undefined"?procobj.properties.pass:null;waitfunction(object,pass)}}else{if(typeof postfunction=="function"){var pass=typeof procobj.properties.pass!="undefined"?procobj.properties.pass:null;object=postfunction(object,pass)}if(typeof object=="undefined"){object={}}if(typeof object.data!="undefined"){if(object.data==null){object.data="?"}if(object.data==0){object.data="0"}}else{object.data="?"}if($(this.vars.element).html()==="?"){$(element+" .progress-radial").fadeOut("slow",function(){$(element).html(object.data)})}else{$(element).html(object.data)}}}.bind({vars:varsproc}),error:function(object){$(this.vars.element).html("?");if(typeof this.vars.postfunction=="function"){var pass;if(typeof this.vars.properties!=="undefined"){pass=typeof this.vars.properties.pass!=="undefined"?this.vars.properties.pass:null}else{pass=null}this.vars.postfunction(object,pass)}}.bind({vars:varsproc})})}}};
