// ==UserScript==
// @name         ASO Google Play
// @namespace    https://github.com/ayoubfletcher
// @version      1.0
// @description  Your tool kit to speed up your aso abilities.
// @author       Ayoub Fletcher
// @match        https://play.google.com/store/apps/details?id=*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @connect      appbrain.com
// @run-at document-body
// ==/UserScript==

(function() {
    'use strict';
    run();
})();

// Initialize Params
const app_brain_url = "https://www.appbrain.com/app/";
const dev_barin_url = "https://www.appbrain.com/dev/";
const date_template = "<style>#aso-data li{display:inline-block;width:110px;margin-right:10px;margin-bottom:10px;background:#F7F7F7}.icon{height:50px;background-position:50% 50%;background-repeat:no-repeat;background-size:contain;position:relative}.app-age{background-color:#04B5B0;background-image:url('https://www.appbrain.com/static/images/infotile-age.png')}.app-ranking{background-color:#F4460A;background-position:0 50%;background-image:url('https://www.appbrain.com/static/images/infotile-ranking.png')}.app-size{background-color:#EA6E00;background-image:url('https://www.appbrain.com/static/images/infotile-size.png')}.app-update{background-color:#e6a509;background-image:url('https://www.appbrain.com/static/images/infotile-update.png')}.app-android{background-color:#EB008B;background-image:url('https://www.appbrain.com/static/images/infotile-android.png')}.dev-age{background-color:#1E88E5;background-image:url('https://www.appbrain.com/static/images/infotile-age.png')}.dev-total-installs{background-color:#E65100;background-image:url('https://www.appbrain.com/static/images/infotile-download.png')}.dev-total-apps{background-color:#EB008B;background-image:url('https://www.appbrain.com/static/images/infotile-appcount.png')}.dev-average-rating{background-color:#80af3f;background-image:url('https://www.appbrain.com/static/images/infotile-rating.png')}.dev-recent-rating{background-color:#80af3f;background-image:url('https://www.appbrain.com/static/images/infotile-recent-rating.png')}.dev-total-rating{background-color:#80af3f;background-image:url('https://www.appbrain.com/static/images/infotile-rating-count.png')}#aso-data .value{text-align:center;padding:15px 5px;font-family:Arial;font-size:15px;font-weight:bold;color:#666}#aso-data .title{text-align:center;padding:5px;font-family:Arial;font-size:13px;color:#999;border-top:1px solid #E1E1E1}#aso-data .header{font-size:18px;padding:20px 10px;color:#666;text-transform:uppercase;font-family:Arial;font-weight:bold}#description{width:100%;float:left;margin-bottom:20px}#description .content{color:#fff;padding:10px;background:#666;font-family:Arial;font-size:15px;text-align:center}</style><div id='aso-data'><ul id='description'><div class='content'> {%SHORT_DESCRIPTION%}</div></ul><ul id='app-data'><div class='header'> App Information</div><li><div class='top'><div class='icon app-age'></div><div class='value'>{%APP_AGE%}</div><div class='title'>App Age</div></div></li><li><div class='top'><div class='icon app-ranking'></div><div class='value'>{%RANKING%}</div><div class='title'>Ranking</div></div></li><li><div class='top'><div class='icon app-size'></div><div class='value'>{%APP_SIZE%}</div><div class='title'>App Size</div></div></li><li><div class='top'><div class='icon app-update'></div><div class='value'>{%LAST_UPDATE%}</div><div class='title'>Last Update</div></div></li><li><div class='top'><div class='icon app-android'></div><div class='value'>{%ANDROID_VERSION%}</div><div class='title'>Android Version</div></div></li></ul><ul id='dev-data'><div class='header'> Developer Information</div><li><div class='top'><div class='icon dev-age'></div><div class='value'>{%DEVELOPER_AGE%}</div><div class='title'>Active since</div></div></li><li><div class='top'><div class='icon dev-total-apps'></div><div class='value'>{%TOTAL_APPS%}</div><div class='title'>Total apps</div></div></li><li><div class='top'><div class='icon dev-total-installs'></div><div class='value'>{%TOTAL_INSTALLS%}</div><div class='title'>Installs</div></div></li><li><div class='top'><div class='icon dev-average-rating'></div><div class='value'>{%AVERAGE_RATING%}</div><div class='title'>Average rating</div></div></li><li><div class='top'><div class='icon dev-recent-rating'></div><div class='value'>{%RECENT_RATING%}</div><div class='title'>Recent rating</div></div></li><li><div class='top'><div class='icon dev-total-rating'></div><div class='value'>{%TOTAL_RATING%}</div><div class='title'>Rating total</div></div></li></ul></div>";

// Get HTTP Async
function getHttpRequest(url, callback) {
    GM_xmlhttpRequest({
        method: "GET", url: url, onload: function (response) {
            if (response.status == 200) {
                callback(response.responseText);
            }
        }
    });
}

// Get data field appbrain
function extractField(selector) {
    if(selector.find(".infotile-text-solo").length) {
        return selector.find(".infotile-text-solo").text().trim();
    } else {
        return selector.find(".infotile-text").text().trim() + " " + selector.find(".infotile-subtext").text().trim();
    }
}

// Get app data
function getApp() {
    // Initialize params
    const package_name = location.href.split("?id=")[1].split("&")[0];
    const developer = $(document).find("div[itemprop='author'] span[itemprop='name'").text();
    // Initialize containers
    var app = {};
    var dev = {};
    // Get the app information
    getHttpRequest(app_brain_url+package_name, function(result) {
        let data = $(result).find('.infotiles');
        // extract the data of app
        app = {
            age: extractField(data.find(".infotile-top-age").parent()),
            ranking: extractField(data.find(".infotile-top-ranking").parent()),
            size: extractField(data.find(".infotile-top-size").parent()),
            update: extractField(data.find(".infotile-top-lastupdated").parent()),
            android_version: extractField(data.find(".infotile-top-androidversion").parent())
        };
        // Get developer information
        getHttpRequest(dev_barin_url+developer, function(result) {
            let data = $(result).find(".infotiles");
            // extract the data of developer
            dev = {
                age: extractField(data.find(".infotile-top-age").parent()),
                total_apps: extractField(data.find(".infotile-top-appcount").parent()),
                total_installs: extractField(data.find(".infotile-top-total-installs").parent()),
                average_rating: extractField(data.find(".infotile-top-rating").parent()),
                total_rating: extractField(data.find(".infotile-top-rating-count").parent()),
                rating_recent: extractField(data.find(".infotile-top-recent-rating").parent())
            };
            // Inject the data into page
            injectData(app, dev);
        });
    });
}

// Get Short description of the app
function shortDescription() {
    const metaTags = document.getElementsByTagName('meta');
    for(let i = 0; i < metaTags.length; i++) {
        if(metaTags[i].getAttribute('name') == 'description') {
            return metaTags[i].getAttribute('content');
        }
    }
    return "";
}

// Inject data
function injectData(app, developer) {
    // Initialize data
    data_html = date_template.replace("{%SHORT_DESCRIPTION%}", shortDescription());
    data_html = data_html.replace("{%APP_AGE%}", app.age);
    data_html = data_html.replace("{%RANKING%}", app.ranking);
    data_html = data_html.replace("{%APP_SIZE%}", app.size);
    data_html = data_html.replace("{%LAST_UPDATE%}", app.update);
    data_html = data_html.replace("{%ANDROID_VERSION%}", app.android_version);
    data_html = data_html.replace("{%DEVELOPER_AGE%}", developer.age);
    data_html = data_html.replace("{%TOTAL_APPS%}", developer.total_apps);
    data_html = data_html.replace("{%TOTAL_INSTALLS%}", developer.total_installs);
    data_html = data_html.replace("{%AVERAGE_RATING%}", developer.average_rating);
    data_html = data_html.replace("{%RECENT_RATING%}", developer.rating_recent);
    data_html = data_html.replace("{%TOTAL_RATING%}", developer.total_rating);

    // Inject result
    const elemTarget = $('.info-box-top .document-subtitles')[1];
    $(data_html).insertAfter(elemTarget);
}

// RUN
function run() {
    var appId = location.href;
    var firstTime = true;
    var loop = setInterval(function() {
       if(firstTime) {
           firstTime = false;
           appId = location.href;
           getApp();
       } else {
           if(appId !== location.href) {
               appId = location.href;
               getApp();
           }
       }
    }, 1000);
}

