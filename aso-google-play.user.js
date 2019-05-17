// ==UserScript==
// @name         ASO Google Play
// @namespace    https://github.com/ayoubfletcher
// @version      2.4.1
// @description  Your tool kit to speed up your aso abilities.
// @author       Ayoub Fletcher
// @match        https://play.google.com/store/apps/details?id=*
// @match        https://www.appbrain.com/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @connect      appbrain.com
// @downloadURL  https://github.com/ayoubfletcher/ASO-Google-Play/raw/master/aso-google-play.user.js
// @updateURL    https://github.com/ayoubfletcher/ASO-Google-Play/raw/master/aso-google-play.user.js
// ==/UserScript==

/*******************************************************************************************************************************
 *       █████╗ ██╗   ██╗ ██████╗ ██╗   ██╗██████╗     ███████╗██╗     ███████╗████████╗ ██████╗██╗  ██╗███████╗██████╗        *
 *      ██╔══██╗╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝██║  ██║██╔════╝██╔══██╗       *
 *      ███████║ ╚████╔╝ ██║   ██║██║   ██║██████╔╝    █████╗  ██║     █████╗     ██║   ██║     ███████║█████╗  ██████╔╝       *
 *      ██╔══██║  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██╔══╝  ██║     ██╔══╝     ██║   ██║     ██╔══██║██╔══╝  ██╔══██╗       *
 *      ██║  ██║   ██║   ╚██████╔╝╚██████╔╝██████╔╝    ██║     ███████╗███████╗   ██║   ╚██████╗██║  ██║███████╗██║  ██║       *
 *      ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝     ╚══════╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝       *
 *                               (~‾▿‾)~ DONATE ME PLEASE, I NEED MONEY TO LIVE (ง •̀_•́)ง (╥_╥)                                 *
 *                 WANT TO EDIT THE SCRIPT READ THE STUFF IN THE BOTTOM IF YOU BREAK IT DON'T CRY NO MONEY NO FIX              *
 *                                 SEND MONEY OR I WILL MAKE YOUR ACCOUNT DISAPPEAR YOHAAA (∩｀-´)⊃━☆ﾟ.*･｡ﾟ                    *
 *                                   (\____/)                                                                                  *
 *                                   ( ͡ ͡° ͜ ʖ ͡ ͡°)                                                                               *
 *                                   \╭☞ \╭☞    HERE'S MY PAYAPL: https://www.paypal.me/ayoubfletcher                         *
 *                            I KNOW I'M WASTING TIME WRITING THAT CRAP BECAUSE YOU GUYS ARE STINGY                            *
 *                                   IF YOU FOUND IT OFFSENSIVE DON'T BLAME SEND ME MONEY ¯\_(ツ)_/¯.                          *
 *     DAAH I WROTE THAT STUFF TO MAKE MYSELF LOOK PROFESSIONAL (⌐■_■) KAPPA AND TRUST ME THOSE EMOJIS SO FUN TO PLAY WITH.    *
 *             OKAY WHATEVER HERE'S THE GITHUB REPO FOR THAT CRAPPY SCRIPT IF THERE WAS AN UPDATE I WOULD POST IT THERE:       *
 *                               (╯°□°）╯︵ -> https://github.com/ayoubfletcher/ASO-Google-Play                                *
 *           ( •_•)>⌐■-■ FINAL WORDS IF YOU CANNOT BUY ME A COFFEE BECAUSE ARE "STINGY" WISH ME ATLEAST A GOOD LUCK            *
 *    JUST KIDDING GOOD LUCK BUDDY SORRY FOR WASTING YOUR TIME BUT I'M JUST HAVE FUN PLAYING WITH THOSE EMOJIS “ヽ(´▽｀)ノ”.   *
 *            IF YOU GOT ANY ISSUE WITH THE SCRIPT SEND ME A MESSAGE THROUGH PAYPAL (¬‿¬)  OR THROUGH GITHUB REPO.             *
 *******************************************************************************************************************************/

/**
 * Change logs:
 * - Fixed short description extraction after disabling app extracting.
 * - Added addition links to easy access.
 * - Remove the junk stuff fraom appbrain.com
 */

/**
 * @Note For faster responds consider disabling developers information or app information, or whatever you are free.
 */
/**
 * Parameters to toggle the extraction of the fields
 * @param short_description To turn on extracting the short description of the app: value [true / false].
 * @param feature_image To turn on extracting the feature image of app: value [true / false].
 * @param app turn on extracting the app information: value [true / false].
 * @param dev To turn on extracting the developer app information and inject into the page: value [true / false].
 */
const controls = {
	short_description: true,
	feature_image: true,
	app: true,
	dev: true,
	related_apps: true,
	addition_links: true
};

// To get rid of the warning of scripts
var $ = window.$;

/**
 * Static urls don't change.
 */
const app_brain_url = 'https://www.appbrain.com/app/';
const dev_barin_url = 'https://www.appbrain.com/dev/';
let app_not_found = false;
let cloudflare_detection = false;

// The status of the generating
let processing = false;

// Interval checker to reload the page if an ajax call has been accrued no need to change
const INTERVAL_TIMER_CHECKER = 500;

/**
 * HTML Template for styling and showing the elements
 * If you want to style just do it
 */
const styles_html =
	'<style>#aso-data{padding:10px 0;text-align:center}#aso-data i{margin-top:10px}#aso-data-loading{padding:10px;text-align:center;margin-bottom:10px;font-weight:700}#honor{color:#2c1912}#aso-data i a{color:#546e7a;font-weight:700;-webkit-transition:all .2s;transition:all .2s}#aso-data i a:hover{color:#29434e}#app-data,#dev-data{text-align:center;padding:5px}#aso-data li{display:inline-block;width:110px;margin:0 3px;margin-bottom:10px;background:#f7f7f7}.icon{height:50px;background-position:50% 50%;background-repeat:no-repeat;background-size:contain;position:relative}.app-age{background-color:#04b5b0;background-image:url(https://www.appbrain.com/static/images/infotile-age.png)}.app-installs{background-color:#069bf7;background-image:url(https://www.appbrain.com/static/images/infotile-download.png)}.app-ranking{background-color:#f4460a;background-position:0 50%;background-image:url(https://www.appbrain.com/static/images/infotile-ranking.png)}.app-size{background-color:#ea6e00;background-image:url(https://www.appbrain.com/static/images/infotile-size.png)}.app-update{background-color:#e6a509;background-image:url(https://www.appbrain.com/static/images/infotile-update.png)}.app-android{background-color:#eb008b;background-image:url(https://www.appbrain.com/static/images/infotile-android.png)}.app-maturity{background-color:#a812cc;background-image:url(https://s.appbrain.com/static/201903201140439/images/infotile-content-rating.png)}.app-libraries{background-color:#053aa8;background-image:url(https://s.appbrain.com/static/201903201140439/images/infotile-lib.png)}.dev-age{background-color:#1e88e5;background-image:url(https://www.appbrain.com/static/images/infotile-age.png)}.dev-total-installs{background-color:#e65100;background-image:url(https://www.appbrain.com/static/images/infotile-download.png)}.dev-total-apps{background-color:#eb008b;background-image:url(https://www.appbrain.com/static/images/infotile-appcount.png)}.dev-average-rating{background-color:#80af3f;background-image:url(https://www.appbrain.com/static/images/infotile-rating.png)}.dev-recent-rating{background-color:#80af3f;background-image:url(https://www.appbrain.com/static/images/infotile-recent-rating.png)}.dev-total-rating{background-color:#80af3f;background-image:url(https://www.appbrain.com/static/images/infotile-rating-count.png)}#aso-data .value{text-align:center;padding:15px 5px;font-family:Arial;font-size:12px;font-weight:700;color:#666}#aso-data .title{text-align:center;padding:5px;font-family:Arial;font-size:13px;color:#999;border-top:1px solid #e1e1e1}#aso-data .header{font-size:18px;padding:20px 10px;color:#666;text-transform:uppercase;font-family:Arial;font-weight:700}#description{width:100%;float:left;margin-bottom:20px}#description .content{color:#fff;padding:10px;background:#666;font-family:Arial;font-size:15px;text-align:center}#download_apk{font-size:14px;height:36px;line-height:34px;padding:0 20px;-webkit-border-radius:4px;border-radius:4px;-webkit-box-shadow:0 1px 0 rgba(0,0,0,.05);box-shadow:0 1px 0 rgba(0,0,0,.05);-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transition:all .2s;transition:all .2s;-webkit-user-select:none;background-color:#fff;border:1px solid rgba(0,0,0,.17);color:#fff;cursor:pointer;display:inline-block;font-family:Roboto,sans-serif;font-size:14px;font-style:normal;font-weight:500;height:36px;line-height:34px;min-width:40px;padding:0 20px;position:relative;text-align:center;text-decoration:none;white-space:nowrap;vertical-align:middle;background-color:#546e7a}#download_apk:hover{-webkit-box-shadow:0 1px 0 0 rgba(0,0,0,.27);box-shadow:0 1px 0 0 rgba(0,0,0,.27);cursor:pointer;background-color:#29434e}#aso-feature-image{padding-bottom:20px;text-align:center}#aso-feature-image i{display:block;margin-bottom:10px;font-weight:700}#addition-links{margin-bottom:20px}#addition-links img{height:20px}#addition-links a{margin:5px;font-size:14px;font-weight:700}#addition-links .bg-blue-round{background:#34677c;border-radius:5px;display:inline-block;padding:5px}#related-apps .app-tile{display:inline-block;color:#666;text-decoration:none;border-style:solid;border-width:1px;border-color:#e4e4e4;background-color:#f7f7f7;margin:.2rem;width:8rem;padding:.2rem;text-align:left;white-space:nowrap;font-size:.9rem;line-height:1.3rem;vertical-align:top}#related-apps .app-tile img{display:block;width:7rem;height:7rem;margin:0 auto .8rem}#related-apps .app-tile>div{overflow:hidden}#related-apps .app-tile-title{font-weight:700;text-align:center}#related-apps a.app-tile>div{overflow:hidden}#related-apps .app-tile-developer{margin-bottom:.4rem;text-align:center}#related-apps a.app-tile>div{overflow:hidden}#related-apps .table-div{display:table}#related-apps .app-tile .td{vertical-align:middle}#related-apps .td{display:table-cell}#related-apps .app-tile-rating{width:2rem;height:2rem;color:#fff;text-align:center;line-height:2rem;font-weight:700;border-radius:50%;margin-right:.6rem}#related-apps .app-tile-info{font-size:.9rem;line-height:1rem}#support-me{margin:15px;text-align:center}#support-me a{text-decoration:none;padding:7px;background:#069bf7;border-radius:5px;color:#fff;font-size:15px;transition:all .2s}#support-me a:hover{background:#0873b6}</style>';
const aso_html_template =
	"<div id='aso-data'>{%DATA_HTML%} <i>Made by <a href='https://github.com/ayoubfletcher/ASO-Google-Play'>Ayoub Fletcher</a> with LOVE ❤️.</i><p>Honorable Mention <b id='honor'>Re-skinning</b> 🕷️.</p><div id='support-me'><a href='https://www.paypal.me/ayoubfletcher'>☕ Buy Me A Coffee</a></div></div>";
const desc_html_template = "<ul id='description'><div class='content'>{%SHORT_DESCRIPTION%}</div></ul>";
const aso_html_loading_template = "<div id='aso-data-loading'>LOADING DATA 👾 ...</div>";
const download_app_template =
	"<a id='download_apk' href='https://apkpure.com/{%PACKAGE_NAME%}/{%PACKAGE_NAME%}/download?from=details'>Download APK</a>";
const app_html_template =
	"<ul id='app-data'>" + download_app_template +" <div class='header'> App Information</div><li> <div class='top'> <div class='icon app-installs'></div><div class='value'>{%APP_INSTALLS%}</div><div class='title'>App Installs</div></div></li><li> <div class='top'> <div class='icon app-age'></div><div class='value'>{%APP_AGE%}</div><div class='title'>App Age</div></div></li><li> <div class='top'> <div class='icon app-ranking'></div><div class='value'>{%RANKING%}</div><div class='title'>Ranking</div></div></li><li> <div class='top'> <div class='icon app-size'></div><div class='value'>{%APP_SIZE%}</div><div class='title'>App Size</div></div></li><li> <div class='top'> <div class='icon app-update'></div><div class='value'>{%LAST_UPDATE%}</div><div class='title'>Last Update</div></div></li><li> <div class='top'> <div class='icon app-android'></div><div class='value'>{%ANDROID_VERSION%}</div><div class='title'>Android Version</div></div></li><li> <div class='top'> <div class='icon app-maturity'></div><div class='value'>{%ANDROID_MATURITY%}</div><div class='title'>Maturity</div></div></li><li> <div class='top'> <div class='icon app-libraries'></div><div class='value'>{%ANDROID_LIBRARIES%}</div><div class='title'>Libraries</div></div></li></ul>";
const dev_html_template =
	"<ul id='dev-data'> <div class='header'> Developer Information</div><li> <div class='top'> <div class='icon dev-age'></div><div class='value'>{%DEVELOPER_AGE%}</div><div class='title'>Active since</div></div></li><li> <div class='top'> <div class='icon dev-total-apps'></div><div class='value'>{%TOTAL_APPS%}</div><div class='title'>Total apps</div></div></li><li> <div class='top'> <div class='icon dev-total-installs'></div><div class='value'>{%TOTAL_INSTALLS%}</div><div class='title'>Installs</div></div></li><li> <div class='top'> <div class='icon dev-average-rating'></div><div class='value'>{%AVERAGE_RATING%}</div><div class='title'>Average rating</div></div></li><li> <div class='top'> <div class='icon dev-recent-rating'></div><div class='value'>{%RECENT_RATING%}</div><div class='title'>Recent rating</div></div></li><li> <div class='top'> <div class='icon dev-total-rating'></div><div class='value'>{%TOTAL_RATING%}</div><div class='title'>Rating total</div></div></li></ul>";
const feature_image_template = "<div id='aso-feature-image'><i>Feature Image:</i><img src='{%FEATURE_IMAGE%}' /></div>";
const related_apps_template = "<div id='related-apps'><div class='header'>Related Apps</div>{%RELATED_APPS%}</div>";
const addition_sources_template =
	"<div id='addition-links'> <div class='header'> ASO Tools</div> <a href='https://www.similarweb.com/app/google-play/{%PACKAGE_NAME%}/statistics'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/SimilarWeb_logo.svg/2000px-SimilarWeb_logo.svg.png'/></a> <a href='https://www.appannie.com/apps/google-play/app/{%PACKAGE_NAME%}/keywords/'><img src='https://static-t.aa-cdn.net/mkt/assets/img/aa-header-logo.png'/></a> <a href='https://www.apptweak.com/applications/android/{%PACKAGE_NAME%}?country=us'><img src='https://www.apptweak.com/assets/logo.svg'/></a> <a class='bg-blue-round' href='https://www.applyzer.com/main.php?mmenu=rankings&submenu=getRanking&app={%PACKAGE_NAME%}&market=4'><img src='https://www.applyzer.com/_elements/APPlyzerLogoHead.svg'/></a> <a href='https://www.appbrain.com/app/{%PACKAGE_NAME%}'><img src='https://s.appbrain.com/static/201902081521271/images/appbrain_logo.png'/> AppBrain</a></div>";

/**
 * Messages feedback change if you want to.
 */
const app_not_found_msg = 'SORRY, APP PAGE NOT FOUND ON APPBRAIN 😓!';
const cloudflare_detection_msg =
	"Sorry, you've been arrested by 👮(CloudFlare). You are charged in extracting data from appbrain, to prevent from going to the jail visit app page directly on app brain from the link below and prove them that you are not a 🤖 and refresh the page or do whatever you want i warned you 🤷‍.<br><div id='addition-links' style='margin-top: 10px; margin-bottom: 0;'><a href='https://www.appbrain.com/app/{%PACKAGE_NAME%}'><img src='https://s.appbrain.com/static/201902081521271/images/appbrain_logo.png'> AppBrain</a></div>";
const fetching_app_info_msg = 'GETTING APP INFORMATIONS FROM APPBRAIN 👺 ...';
const fetching_dev_info_msg = 'GETTING DEVELOPER INFORMATIONS FROM APPBRAIN 🕵️‍♀️ ...';
let error_msg = '';

/**
 * Promise method to get http request
 * @param url Target url
 */
function getHttpRequest(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(response) {
				if (response.status == 200) {
					resolve(response.responseText);
				} else {
					reject(response.status);
				}
			}
		});
	});
}

/**
 * Extract fields from selector of appbrain
 * @param selector Selector of html
 */
function extractField(selector) {
	if (selector.find('.infotile-text-solo').length) {
		const valueTxt = selector.find('.infotile-text-solo').text().trim();
		if (valueTxt.length && valueTxt !== '?') {
			return valueTxt;
		} else {
			return 'Unknown';
		}
	} else {
		const valueTxt =
			selector.find('.infotile-text').text().trim() + ' ' + selector.find('.infotile-subtext').text().trim();
		if (valueTxt.trim().length && valueTxt.trim() !== '?') {
			return valueTxt;
		} else {
			return 'Unknown';
		}
	}
}

/**
 * Extract the related apps
 * @param html_src html src
 */
function extractRelatedApps(html_src) {
	const selector = $($(html_src).find('.app-tiles-block')[0]);
	selector.find('a').each((_, x) => {
		const pkgName = $(x).attr('href').split('/')[$(x).attr('href').split('/').length - 1];
		if (pkgName !== undefined) {
			$(x).attr('href', 'https://play.google.com/store/apps/details?id=' + pkgName);
		}
	});
	return selector.html();
}

/**
 * Generte the aso data
 */
function generateASO() {
	// Inject loading
	const elemTarget = $('h1').parent().parent().parent().parent().parent();
	const aso_html = aso_html_template.replace('{%DATA_HTML%}', aso_html_loading_template);
	// Injecting styles
	$(styles_html).insertAfter(elemTarget);
	$(aso_html).insertAfter(elemTarget);
	// Get the pacakge name and the developer name
	const package_name = location.href.split('?id=')[1].split('&')[0];
	const developer = $($('a[itemprop="genre"]').parent().parent().find('a')[0]).text();
	// Initialize containers of the data
	var app = null;
	var dev = null;
	// Get the data
	new Promise((resolve, reject) => {
		// Extract app information
		if (controls.app) {
			$('#aso-data-loading').text(fetching_app_info_msg);
			getHttpRequest(app_brain_url + package_name)
				.then((result) => {
					if ($(result).find('h1').text() == 'Uh oh! Page not found!') {
						reject();
					} else {
						let data = $(result).find('.infotiles');
						// extract the data of app
						app = {
							installs: extractField(data.find('.infotile-top-installs').parent()),
							age: extractField(data.find('.infotile-top-age').parent()),
							ranking: extractField(data.find('.infotile-top-ranking').parent()),
							size: extractField(data.find('.infotile-top-size').parent()),
							update: extractField(data.find('.infotile-top-lastupdated').parent()),
							android_version: extractField(data.find('.infotile-top-androidversion').parent()),
							libraries: extractField(data.find('.infotile-top-libraries').parent()),
							maturity: extractField(data.find('.infotile[tooltip="Google Play content rating."]')),
							short_description: $(result).find('.app-short-description').text(),
							related_apps: extractRelatedApps(result)
						};
					}
					resolve();
				})
				.catch((status_code) => {
					reject(status_code);
				});
		} else {
			resolve();
		}
	})
		.then((_) => {
			// Extract developer information
			if (controls.dev) {
				// Get the developer ifnormation
				return new Promise((resolve, reject) => {
					if (!app_not_found) {
						$('#aso-data-loading').text(fetching_dev_info_msg);
						getHttpRequest(dev_barin_url + developer)
							.then((result) => {
								let data = $(result).find('.infotiles');
								// extract the data of developer
								dev = {
									age: extractField(data.find('.infotile-top-age').parent()),
									total_apps: extractField(data.find('.infotile-top-appcount').parent()),
									total_installs: extractField(data.find('.infotile-top-total-installs').parent()),
									average_rating: extractField(data.find('.infotile-top-rating').parent()),
									total_rating: extractField(data.find('.infotile-top-rating-count').parent()),
									rating_recent: extractField(data.find('.infotile-top-recent-rating').parent())
								};
								resolve();
							})
							.catch((_) => {
								resolve();
							});
					}
				});
			} else {
				return Promise.resolve();
			}
		})
		// Inject data in to the dom
		.then((_) => {
			// Inject the data into page
			injectData(app, dev, package_name);
		})
		.catch((status_code) => {
			if (status_code === 503) {
				console.log(status_code);
				error_msg = cloudflare_detection_msg.replace(/{%PACKAGE_NAME%}/g, package_name);
				$('#aso-data-loading').text(cloudflare_detection_msg);
			} else {
				error_msg = app_not_found_msg;
				// Inject the data into page
				$('#aso-data-loading').text(app_not_found_msg);
			}
			app_not_found = true;
			injectData(app, dev, package_name);
		});
}

/**
 * Unescape text
 * @param {str} text Text to unescape
 */
function unescapeText(text) {
	const elementDiv = document.createElement('div');
	elementDiv.innerHTML = text;
	return elementDiv.innerText;
}

/**
 * Retrieve short description of the app
 */
function shortDescription() {
	const metas = document.getElementsByTagName('meta');
	const scripts = document.getElementsByTagName('script');
	// Check if description was protected
	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i].innerHTML.indexOf("key: 'ds:5', isError:  false") > 0) {
			var scriptBlock = scripts[i].innerHTML.split(',[null,');
			return scriptBlock[1].substring(1, scriptBlock[1].indexOf('"]'));
		}
	}
	// Get description if was on metas
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute('name') == 'description') {
			return metas[i].getAttribute('content');
		}
	}
}

/**
 * Retrieve feature image of the app
 */
function getFeatureImage() {
	const metas = document.getElementsByTagName('meta');
	// Get feature image if was on metas
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute('property') == 'og:image') {
			return metas[i].getAttribute('content');
		}
	}
}

/**
 * Inject the data into the DOM of the page
 * @param app App object
 * @param developer Developer object
 */
function injectData(app, developer, packageName) {
	// Add the app information
	let app_html = '';
	let related_apps = '';
	if (app !== null) {
		// App html
		app_html = app_html_template
			.replace('{%APP_INSTALLS%}', app.installs)
			.replace('{%APP_AGE%}', app.age)
			.replace('{%RANKING%}', app.ranking)
			.replace('{%APP_SIZE%}', app.size)
			.replace('{%LAST_UPDATE%}', app.update)
			.replace('{%ANDROID_VERSION%}', app.android_version)
			.replace('{%ANDROID_LIBRARIES%}', app.libraries)
			.replace('{%ANDROID_MATURITY%}', app.maturity);
		// Related apps
		if (controls.related_apps && controls.app) {
			related_apps = related_apps_template.replace('{%RELATED_APPS%}', app.related_apps);
		}
	}
	// Adding  the developer information
	let dev_html = '';
	if (developer != null) {
		dev_html = dev_html_template
			.replace('{%DEVELOPER_AGE%}', developer.age)
			.replace('{%TOTAL_APPS%}', developer.total_apps)
			.replace('{%TOTAL_INSTALLS%}', developer.total_installs)
			.replace('{%AVERAGE_RATING%}', developer.average_rating)
			.replace('{%RECENT_RATING%}', developer.rating_recent)
			.replace('{%TOTAL_RATING%}', developer.total_rating);
	}
	// Addng the short description
	let desc_html = '';
	if (controls.short_description) {
		let short_description = '';
		if (app != null) {
			short_description = app.short_description;
		} else {
			short_description = shortDescription();
		}
		desc_html = desc_html_template.replace('{%SHORT_DESCRIPTION%}', short_description);
	}

	// App not found
	let app_not_found_html = '';
	if (app_not_found) {
		app_not_found_html = aso_html_loading_template;
	}

	// Addition linsk
	let addition_likns = '';
	if (controls.addition_links) {
		addition_likns = addition_sources_template.replace(/{%PACKAGE_NAME%}/g, packageName);
	}

	// Conbining the data
	let aso_html = aso_html_template.replace(
		'{%DATA_HTML%}',
		desc_html + // Adding the short description
		app_html + // Adding the app information
		dev_html + // Adding the developer information
		related_apps + // Related Apps
		addition_likns + // Addition links
			app_not_found_html // Not found
	);

    // Add package to download
    aso_html = aso_html.replace(/{%PACKAGE_NAME%}/g, packageName);

	// Inject result
	$('#aso-data').html(aso_html);

	// Add the not found message
	if (app_not_found) {
		$('#aso-data-loading').html(error_msg);
	}

	// Inject feature image
	if (controls.feature_image) {
		const featureImage = getFeatureImage();
		if (featureImage != null) {
			// const topHeaderElem = $('#aso-data').parent().parent().parent();
			const feature_image_html = feature_image_template.replace('{%FEATURE_IMAGE%}', featureImage);
			$(feature_image_html).insertAfter('#aso-data');
		}
	}
	processing = false;
}

/**
 * Run method to reload the data after the ajax requests of page
 */
function run() {
	// Clean Appbrain
	if (location.href.indexOf('www.appbrain.com') > -1) {
		// Remove paywall
		document
			.querySelector('.paywall-overlay')
			.parentElement.removeChild(document.querySelector('.paywall-overlay'));
		// Remove the blur
		document.querySelector('.blurred').classList.remove('blurred');
	} else {
		// Save the current page url
		let current_app_url = location.href;
		// Check if the current id not the same
		if (document.getElementById('aso-data') == null && !processing) {
			processing = true;
			generateASO();
		}
		setInterval(function() {
			if (current_app_url != location.href) {
				location.reload();
			}
		}, INTERVAL_TIMER_CHECKER);
	}
}

/** Main method script */
(function() {
	'use strict';
	run();
})();
