var fetch_=fetch;valuations={getDollarPrices:function(){var url="https://api.coinmarketcap.com/v2/ticker/?limit=0";var valuationsStream=Rx.Observable.fromPromise(U.fetchDataFromUrl(url,"Could not fetch valuations."));valuationsStream.subscribe(function(coinMarketCapData){GL.coinMarketCapTickers=R.prop("data",coinMarketCapData)})},renderDollarPrice:function(symbolName,amount){var assetSymbolUpperCase=symbolName.toUpperCase();var tickers=GL.coinMarketCapTickers;var matchedTicker=R.compose(R.find(R.propEq("symbol",assetSymbolUpperCase)),R.values)(tickers);var dollarPrice=(amount*R.path(["quotes","USD","price"],matchedTicker)).toFixed(2);return R.not(isNaN(dollarPrice))?"$"+dollarPrice:"n/a"}};