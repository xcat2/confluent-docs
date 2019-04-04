;(function() {
'use strict';
var loaded_data;
var idx;
function loadData() {
    loaded_data = JSON.parse(this.response);
    var datum;
    idx = lunr(function() {
        this.field('id');
        this.field('title');
        this.field('content');
        this.field('categories');
        for (datum in loaded_data) {
            var item = loaded_data[datum];
            item['id'] = datum;
            this.add(item);
            }
        });
    doSearch();
}
function doSearch(evt) {
        if (evt) { evt.preventDefault(); }
        var searchtext = document.getElementById('search_box').value;
        var res;
        var display = document.getElementById('search_results');
        while (display.hasChildNodes()) {
            display.removeChild(display.firstChild);
        }
        if (!searchtext) { return; }
        var results = idx.search(searchtext);
        for (res in results) {
                res = loaded_data[results[res]['ref']]
                if (!res.title) {
                        console.log(res);
                        continue;
                }
                var currli = document.createElement('li');
                var curra = document.createElement('a');
                curra.href = res.url;
                curra.textContent = res.title;
                currli.appendChild(curra);
                display.appendChild(currli);
        }
}
function initSearch() {
    var request = new XMLHttpRequest();
    request.onload = loadData;
    request.open('get', 'search_data.json', true);
    request.send();
    document.getElementById('search_box').addEventListener('input', doSearch);;
    document.getElementById('search_box').focus();
}
document.addEventListener('DOMContentLoaded', initSearch);
})();
