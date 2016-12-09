var loadcounter = 0;
var readycounter = 0;

var foodSuggest = new Suggest(document.getElementById('suggest-container'), function(text, resolve) {
    console.log('load', loadcounter++);
    setTimeout(function() {
        console.log('ready', readycounter++);
        resolve(['cate', 'doge', 'ape']);
    }, 600);
});
