transactionValidations={toggleSendButtonClass:function(a,target){var p={asset:document.querySelector("#action-send .modal-send-currency").getAttribute("asset"),target_address:target,amount:Number(a),available:Number(document.querySelector("#action-send .modal-send-balance").innerHTML)};var txDetailsAreValid=!isNaN(p.amount)&&p.amount>0&&p.amount<=p.available&&R.not(R.isNil(p.target_address));var classListMethod=txDetailsAreValid?"remove":"add";document.querySelector("#action-send .pure-button-send").classList[classListMethod]("disabled");return txDetailsAreValid}};
