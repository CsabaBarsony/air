var foodSuggest = new Suggest(document.getElementById('suggest-container'), function(text, resolve) {
    setTimeout(function() {
        resolve(['cate', 'doge', 'ape']);
    }, 300);
});
