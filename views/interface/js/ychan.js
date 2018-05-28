ychan=function(usercrypto,step,txtdata){var encdata=ychan_encode(usercrypto,step,txtdata);return"y/"+encdata};ychan_obj=function(usercrypto,step,encdata){return JSON.parse(ychan_decode(usercrypto,step,encdata))};ychan_encode=function(usercrypto,step,txtdata){var sessionData=document.querySelector("#session_data").textContent;var sessionSecData=getGeneralSessionData(usercrypto,step,sessionData);var cryptUtf8=nacl.encode_utf8(txtdata);var cryptBin=nacl.crypto_box(cryptUtf8,sessionSecData.sessionNonce,sessionSecData.serverSessionPubKey,sessionSecData.clientSessionSecKey);var encdata=nacl.to_hex(cryptBin);return sessionSecData.sessionID+"/"+step+"/"+UrlBase64.safeCompress(encdata)};ychan_decode=function(usercrypto,step,encdata){var sessionData=document.querySelector("#session_data").textContent;if(encdata==null){txtdata=null}else{encdata=UrlBase64.safeDecompress(encdata);var sessionSecData=getGeneralSessionData(usercrypto,step,sessionData);var hexdata=encdata;if(hexdata!=null){var cryptHex=nacl.from_hex(hexdata);var cryptBin=nacl.crypto_box_open(cryptHex,sessionSecData.sessionNonce,sessionSecData.serverSessionPubKey,sessionSecData.clientSessionSecKey);var txtdata=nacl.decode_utf8(cryptBin)}else{txtdata=null}}return txtdata};function getGeneralSessionData(usercrypto,step,sessionData){var sessionObject=readSession(usercrypto.user_keys,usercrypto.nonce,sessionData,couldNotRetrieveSessionDataAlert);var sessionID=sessionObject.session_pubsign;var serverSessionPubKey=nacl.from_hex(sessionObject.server_pubkey);var clientSessionSecKey=nacl.from_hex(sessionObject.session_seckey);var nonce1Dec=new Decimal(hex2dec.toDec(sessionObject.nonce1));var nonce2Dec=new Decimal(hex2dec.toDec(sessionObject.nonce2));var stepDec=new Decimal(step);var nonceConstr=nonce1Dec.plus(nonce2Dec).plus(stepDec).toDecimalPlaces(64);var nonceConvert=hex2dec.toHex(nonceConstr.toFixed(0).toString());var nonceConhex=nonceConvert.substr(2,nonceConvert.length);var sessionNonce=nacl.from_hex(nonceConhex);return{sessionID:sessionID,clientSessionSecKey:clientSessionSecKey,serverSessionPubKey:serverSessionPubKey,sessionNonce:sessionNonce}}function couldNotRetrieveSessionDataAlert(){console.log("Error: Could not retrieve session data.")}