// ==UserScript==
// @name         ASO Google Play
// @namespace    https://github.com/ayoubfletcher
// @version      3.0.7
// @description  ASO Google Play Helper tool, it's a tool to simplify and helping in ASO and analyzing Android apps in google play.
// @icon         https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/icon-script.png
// @author       Ayoub Fletcher
// @match        https://play.google.com/store/apps/details?id=*
// @match        https://www.appbrain.com/app/*
// @match		 https://appstorespy.com/apps/play/*
// @grant        GM_xmlhttpRequest
// @connect      appbrain.com
// @connect      appstorespy.com
// @downloadURL  https://github.com/ayoubfletcher/ASO-Google-Play/raw/master/aso-google-play.user.js
// @updateURL    https://github.com/ayoubfletcher/ASO-Google-Play/raw/master/aso-google-play.user.js
// @supportURL   https://github.com/ayoubfletcher/ASO-Google-Play/issues
// @copyright    2019+, Ayoub Fletcher, https://github.com/ayoubfletcher/
// @homepage 	 https://github.com/ayoubfletcher/
// @contactURL 	 https://github.com/ayoubfletcher/
// @contributionURL https://github.com/ayoubfletcher/ASO-Google-Play#donate
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getValue
// @grant GM_setValue

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
 *    JUST KIDDING GOOD LUCK BUDDY SORRY FOR WASTING YOUR TIME BUT I'M JUST HAVING FUN PLAYING WITH THOSE EMOJIS “ヽ(´▽｀)ノ”.   *
 *            IF YOU GOT ANY ISSUE WITH THE SCRIPT SEND ME A MESSAGE THROUGH PAYPAL (¬‿¬) OR THROUGH GITHUB REPO.             *
 *******************************************************************************************************************************/

// The status of the generating
let processing = false;

// Interval checker to reload the page if an ajax call has been accrued no need to change
const INTERVAL_TIMER_CHECKER = 500;

/**
 * HTML Template for styling and showing the elements
 * If you want to style just do it
 */
let aso_style_code = `<style>.pop-up-display{position:fixed;z-index:99999999;width:100%;height:100%;top:0;left:0;color:#fff;display:none;justify-content:center;align-items:center;text-align:center}.pop-up-display.show{display:flex!important}.pop-up-display .content{background:#131313;padding:20px;position:relative;box-shadow:0 0 15px #131313;max-height:600px;overflow-y:auto}.pop-up-display .content .close{position:absolute;top:10px;right:10px;display:flex;justify-content:center;align-items:center;background:#fff;height:30px;width:30px;border-radius:50%;color:#0e0e0e;cursor:pointer;box-shadow:0 0 5px #868686}#app-data .icon{height:50px;background-position:50% 50%;background-repeat:no-repeat;background-size:contain;position:relative}#app-data .top-app-release_date{border-right:1px solid #bb1919;border-bottom:1px solid #bb1919;border-left:1px solid #bb1919}#app-data .top-app-release_date .app-release_date{background-color:#bb1919;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-age.png)}#app-data .top-app-age{border-right:1px solid #04b5b0;border-bottom:1px solid #04b5b0;border-left:1px solid #04b5b0}#app-data .top-app-age .app-age{background-color:#04b5b0;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-age.png)}#app-data .top-app-installs{border-right:1px solid #069bf7;border-bottom:1px solid #069bf7;border-left:1px solid #069bf7}#app-data .top-app-installs .app-installs{background-color:#069bf7;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-installs.png)}#app-data .top-app-ranking{border-right:1px solid #f4460a;border-bottom:1px solid #f4460a;border-left:1px solid #f4460a}#app-data .top-app-ranking .app-ranking{background-color:#f4460a;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-ranking.png)}#app-data .top-app-size{border-right:1px solid #ea6e00;border-bottom:1px solid #ea6e00;border-left:1px solid #ea6e00}#app-data .top-app-size .app-size{background-color:#ea6e00;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-size.png)}#app-data .top-app-update{border-right:1px solid #e6a509;border-bottom:1px solid #e6a509;border-left:1px solid #e6a509}#app-data .top-app-update .app-update{background-color:#e6a509;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-update.png)}#app-data .top-app-android_version{border-right:1px solid #eb008b;border-bottom:1px solid #eb008b;border-left:1px solid #eb008b}#app-data .top-app-android_version .app-android_version{background-color:#eb008b;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-android_version.png)}#app-data .top-app-maturity{border-right:1px solid #a812cc;border-bottom:1px solid #a812cc;border-left:1px solid #a812cc}#app-data .top-app-maturity .app-maturity{background-color:#a812cc;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-maturity.png)}#app-data .top-app-libraries_count{border-right:1px solid #053aa8;border-bottom:1px solid #053aa8;border-left:1px solid #053aa8}#app-data .top-app-libraries_count .app-libraries_count{background-color:#053aa8;background-image:url(https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/app-libraries_count.png)}#related-apps .app-tile{display:inline-block;color:#666;text-decoration:none;border-style:solid;border-width:1px;border-color:#e4e4e4;background-color:#f7f7f7;margin:.2rem;width:8rem;padding:.2rem;text-align:left;white-space:nowrap;font-size:.9rem;line-height:1.3rem;vertical-align:top}#related-apps .app-tile>{overflow:hidden}#related-apps .app-tile img{display:block;width:7rem;height:7rem;margin:0 auto .8rem}#related-apps .app-tile>div{overflow:hidden}#related-apps .app-tile .td{vertical-align:middle}#related-apps .app-tile-title{font-weight:700;text-align:center}#related-apps .app-tile-developer{margin-bottom:.4rem;text-align:center}#related-apps .table-div{display:table}#related-apps .td{display:table-cell}#related-apps .app-tile-rating{width:2rem;height:2rem;color:#fff;text-align:center;line-height:2rem;font-weight:700;border-radius:50%;margin-right:.6rem}#related-apps .app-tile-info{font-size:.9rem;line-height:1rem}#aso-data-container{padding:10px 0;text-align:center}#aso-data-container #app-data i{margin-top:10px}#aso-data-container #app-data li{display:inline-block;width:110px;margin:0 3px;margin-bottom:10px;background:#f7f7f7}#aso-data-container #app-data .value{text-align:center;padding:15px 5px;font-family:Arial;font-size:15px;font-weight:700;color:#666}#aso-data-container #app-data .title{text-align:center!important;padding:5px;font-family:Arial;font-size:13px;color:#999;border-top:1px solid #e1e1e1}#app-libraries .content{display:flex;justify-content:space-evenly;flex-wrap:wrap;column-gap:40px;align-items:baseline}#app-libraries .content .section{padding:10px 20px;border:1px solid #c8c8c8;margin:10px}#app-libraries .content .section-content{display:flex;flex-direction:column}#app-libraries .content .section-content .library-item{display:flex;align-items:center;column-gap:10px;margin-bottom:10px}#app-libraries .content .section-content img{height:30px;width:auto}#app-libraries h3{font-size:17px;margin-bottom:10px;font-weight:700;border-bottom:1px solid #c8c8c8;padding-bottom:10px}#aso-data-table .aso-data-table-container{display:flex;align-items:center;justify-content:center}#aso-data-table .aso-data-table-container table{border-collapse:collapse;text-align:center;font-size:16px;width:100%}#aso-data-table .aso-data-table-container table td,#aso-data-table .aso-data-table-container table th{border:1px solid #ddd;padding:8px}#aso-data-table .aso-data-table-container table tr{background-color:#fff}#aso-data-table .aso-data-table-container table tr:hover{background-color:#ddd}#aso-data-table .aso-data-table-container table th{padding:12px;background-color:#00695c;color:#fff}#aso-data #change-logs .app-changelog{display:flex;flex-wrap:wrap;justify-content:center;row-gap:10px;column-gap:10px}#aso-data #change-logs .app-changelog li{margin:0;width:100px;row-gap:15px;padding:15px;border:1px solid #c5c5c5;border-radius:5px;display:flex;flex-direction:column}#aso-data #change-logs .app-changelog li .app-changelog-type-box{color:#fff;background:#1d1d1d;padding:5px 10px}#aso-data #change-logs .app-changelog li .app-changelog-type-box-update{color:#fff;background:#e6a509;padding:5px 10px}#aso-data #change-logs .app-changelog li .app-changelog-type-box-downloads{color:#fff;background:#069bf7;padding:5px 10px}#aso-data #change-logs .app-changelog li .app-changelog-type-box-new-app{color:#fff;background:#4b7335;padding:5px 10px}#aso-data #change-logs .app-changelog li.expandable-hidden{display:none}#add-later{display:flex;flex-direction:column;position:fixed;right:25px;bottom:25px;align-items:flex-end}#add-later button{padding:10px 20px;margin:5px 0;border:none;border-radius:5px;color:#fff;box-shadow:0 1px 5px #292929;cursor:pointer;transition:background .2s ease-in-out}#add-later button.add-to-list{background:#2e7d32}#add-later button.add-to-list:hover{background:#122e13}#add-later button.show-list{background:#0277bd}#add-later button.show-list:hover{background:#04283d}#add-later button.faq-btn{background:#c50a52}#add-later button.faq-btn:hover{background:#500421}#add-later button.remove-from-list{background:#c62828}#add-later button.remove-from-list:hover{background:#470f0f}#show-list h3{font-size:16px;font-weight:700;color:#fff;margin:0}#show-list p{margin:10px;color:#b5b5b5}#show-list table{margin:30px 0;color:#1d1d1d}#show-list table tbody{font-weight:700}#show-list table tbody a{color:#018a7a;transition:.3s ease-in-out}#show-list table tbody a:hover{color:#003630}#show-list table tbody .delete{color:#d50000;cursor:pointer;transition:color .3s ease-in-out}#show-list table tbody .delete:hover{color:#250303}#show-list .btn{padding:5px 10px;border:none;border-radius:5px;color:#fff;background:#0277bd;transition:background .3s ease-in-out;cursor:pointer;font-size:14px}#show-list .btn.btn-danger{background:#c62828}#show-list .btn.btn-danger:hover{background:#5f1313}#show-list .btn.btn-primary{background:#00695c}#show-list .btn.btn-primary:hover{background:#012c27}#faq-list ul{list-style:none;margin:0;padding:0}#faq-list ul li{display:block;padding:10px;width:500px;background:#ddd;color:#000;margin:10px 0}#faq-list ul li p{font-size:17px;text-align:left;padding:10px;margin:0}#app-keywords .content{display:flex;flex-wrap:wrap;align-items:center;justify-content:center}#app-keywords .content span{margin:5px;padding:5px 10px;background:#bb0561;color:#fff}#aso-data-container .header{font-size:18px;padding:20px 10px;color:#666;text-transform:uppercase;font-family:Arial;font-weight:700;position:relative}#aso-data-container a{font-weight:700}#aso-data-container .expande-toggle{display:none;margin-top:10px;cursor:pointer;padding:5px 10px;background:#00899b;color:#fff;text-decoration:none;border-radius:4px;transition:background .3s ease-in-out}#aso-data-container .expande-toggle:hover{background:#01272c}#aso-data-container .expandable-hidden{display:none}#aso-data-loading{padding:10px;text-align:center;margin-bottom:10px;font-weight:700}#honor{color:#2c1912}#app-data,#dev-data{text-align:center;padding:5px}#description{width:100%;float:left;margin-bottom:20px}#description .content{color:#fff;padding:10px;background:#666;font-family:Arial;font-size:15px;text-align:center}#download_apk{font-size:14px;height:36px;line-height:34px;padding:0 20px;border-radius:4px;box-shadow:0 1px 0 rgba(0,0,0,.05);box-sizing:border-box;transition:all .2s;background-color:#fff;border:1px solid rgba(0,0,0,.17);color:#fff;cursor:pointer;display:inline-block;font-family:Roboto,sans-serif;font-size:14px;height:36px;line-height:34px;min-width:40px;padding:0 20px;position:relative;text-align:center;text-decoration:none;white-space:nowrap;vertical-align:middle;background-color:#546e7a;font-weight:700}#download_apk:hover{box-shadow:0 1px 0 0 rgba(0,0,0,.27);cursor:pointer;background-color:#29434e}#aso-feature-image{padding-bottom:20px;text-align:center}#aso-feature-image i{display:block;margin-bottom:10px;font-weight:700}#addition-links{margin-bottom:20px}#addition-links img{height:20px}#addition-links a{margin:5px;font-size:14px;font-weight:700}#addition-links .bg-blue-round{background:#007bff;border-radius:5px;display:inline-block;padding:5px}.copy-txt::after{content:"📋";transition:background .5s;color:#fff;padding:5px 10px;cursor:pointer;position:absolute;right:10px;top:3px}#credits{text-align:center}#credits a{color:#06263a;transition:color .5s}#credits a:hover{color:#061b31}#credits .social{margin:20px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;row-gap:10px;column-gap:10px}#support-me{margin:15px;display:flex;justify-content:center;align-items:center}#support-me a{width:135px;height:40px;display:block;margin:10px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAAoCAYAAADUrekxAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAF8mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4wLWMwMDAgNzkuMTM1N2M5ZSwgMjAyMS8wNy8xNC0wMDozOTo1NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wOS0yN1QxMzo1NjozNCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDktMjdUMTQ6MDE6MDErMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDktMjdUMTQ6MDE6MDErMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZWFlOWMwYjItNTg1Ny1lMzRiLTg2NDktMWNlM2IwNGIzNzBhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjkxNjE1N2QtOTE1NC0xODQ1LWJiZWItZTk3M2MyMjFlNmIxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MjM4NTU3MTctOWUyYi1hZTQxLTkwMGItMjQ2YTQzYjc0NWNjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMzg1NTcxNy05ZTJiLWFlNDEtOTAwYi0yNDZhNDNiNzQ1Y2MiIHN0RXZ0OndoZW49IjIwMjEtMDktMjdUMTM6NTY6MzQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWFlOWMwYjItNTg1Ny1lMzRiLTg2NDktMWNlM2IwNGIzNzBhIiBzdEV2dDp3aGVuPSIyMDIxLTA5LTI3VDE0OjAxOjAxKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+BzhFFQAADdBJREFUeNrtXAl4TdcW3tdMzKSoIRFjhBASIVRFPV5rnqePiqGm8IqiikaLGJ8SMSREEjMxhQw0NaUlKe2nWtW+1lTzFEMV9UrXW/8+2SfnxnVFX3pvWnd93/ruufuec+4+Z/9nrX8N94rk5GQRHx8vkpKSfPfv3x+/Zs2a62FhYXdWrFiR5tAXQ7HeWHes/yeffOKbmJgoli5dKsSBAwfEoUOHAvlDatKkCeXJk4eEEGQymRz6gijWG+uO9V+3bh19/vnngSEhIULwRgtGDxUv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)}#cache-notice{padding:14px;color:#664d03;border:1px solid #fff3cd;text-align:center;background:#ffecb5;margin:10px;font-size:15px;display:none}#cache-notice button{background:#9b1d1d;color:#fff;border:none;padding:5px 10px;cursor:pointer;transition:background .3s ease-in-out;border-radius:5px;margin-top:10px}#cache-notice button:hover{background:#420c0c}#cache-notice #clear-cache-appbrain,#cache-notice #clear-cache-appstore{display:none}#error-notice{padding:16px;color:#88171a;border:1px solid #f59999;text-align:center;background:#fddfdf;margin:10px;font-size:15px;display:none}#error-notice h3{font-size:20px;font-weight:700;margin-bottom:20px}#error-notice a{color:#0875b2;transition:color .3s}#error-notice a:hover{color:#093c5a}#aso-feature-image img{padding:5px;border:1px solid #d4d4d4;border-radius:4px}</style>`;
let aso_html_code = aso_style_code + `<div id=aso-data-container><div id=credits style=margin-bottom:10px><i>Made by <a href=https://github.com/ayoubfletcher/ASO-Google-Play/ target=_blank>Ayoub Fletcher</a> with LOVE ❤️.</i></div><div id=aso-data-loading>LOADING DATA 👾 ...</div><div class=aso-content style=display:none><div id=aso-data><div id=error-notice><h3>Errors</h3><div class=errors-container></div></div><div id=cache-notice><div class=content><p>Current "[PACKAGE_NAME]" has been pulled from Tamermonkey cache. Cache been used to lower the repeated and unnecessary requests to appbrain server. To delete the current item from the cache click the button below and next request will go straight to the server for live feed.</p><button id=clear-cache-appbrain>Purge AppBrain Cache</button> <button id=clear-cache-appstore>Purge AppStoreSpy Cache</button><br><button id=clear-cache>Purge Cache</button></div></div><div id=description style=position:relative><div class=content></div></div><a id=download_apk href="" target=_blank>Download APK</a><div id=app-data><div class=header>App Information (AppBrain.Com)</div><div class=content><ul><li><div class=top-app-installs><div class="icon app-installs"></div><div class=value></div><div class=title>App Installs</div></div></li><li><div class=top-app-age><div class="icon app-age"></div><div class=value></div><div class=title>App Age</div></div></li><li><div class=top-app-ranking><div class="icon app-ranking"></div><div class=value></div><div class=title>Ranking</div></div></li><li><div class=top-app-size><div class="icon app-size"></div><div class=value></div><div class=title>App Size</div></div></li><li><div class=top-app-update><div class="icon app-update"></div><div class=value></div><div class=title>Last Update</div></div></li><li><div class=top-app-android_version><div class="icon app-android_version"></div><div class=value></div><div class=title>Android Version</div></div></li><li><div class=top-app-libraries_count><div class="icon app-libraries_count"></div><div class=value></div><div class=title>Libraries</div></div></li></ul></div><div class=header>App Information (AppStoreSpy.Com)</div><div class=content-appstore><ul><li><div class=top-app-installs><div class="icon app-installs"></div><div class=value></div><div class=title>Installs</div></div></li><li><div class=top-app-age><div class="icon app-age"></div><div class=value></div><div class=title>Age</div></div></li><li><div class=top-app-release_date><div class="icon app-release_date"></div><div class=value></div><div class=title>App Age</div></div></li><li><div class=top-app-size><div class="icon app-size"></div><div class=value></div><div class=title>App Size</div></div></li><li><div class=top-app-update><div class="icon app-update"></div><div class=value></div><div class=title>Last Update</div></div></li><li><div class=top-app-android_version><div class="icon app-android_version"></div><div class=value></div><div class=title>Version</div></div></li></ul></div></div><div id=related-apps><div class=header>Related Apps</div><div class=content></div><a href=/app/guide-for-pubg-mobile-2020/com.PUBG.Guide class="app-tile hover-shadow" title="Guide For PUBG MOBILE 2020"></a></div><div id=change-logs><div class=header>Change Logs</div><div class=content><div class=section><div class=expandable><button class=expande-toggle>View More</button></div></div></div></div><div id=app-keywords><div class=header>App Keywords</div><div class=content></div></div><div id=play-rankings><div class=header>Google Play Rankings (AppBrain.Com)</div><div class=content><div class=section><div id=aso-data-table><div class=aso-data-table-container></div></div></div></div></div><div id=app-libraries><div class=header>Libraries</div><div class=content></div><button class=expande-toggle>View More</button></div></div></div><div id=addition-links><div class=header>ASO Tools</div><a href=https://www.similarweb.com/app/google-play/[PACKAGE_NAME]/statistics><img src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/icon-similarweb.png></a><a href=https://www.appannie.com/apps/google-play/app/[PACKAGE_NAME]/keywords/ ><img src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/icon-appannie.png> </a><a href="https://www.apptweak.com/applications/android/[PACKAGE_NAME]?country=us"><img src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/apptweak.svg></a><a class=bg-blue-round href=https://appstorespy.com/apps/play/[PACKAGE_NAME]/[PACKAGE_NAME] style=color:#fff;font-weight:300>appstore<b>spy</b></a> <a href=https://www.appbrain.com/app/[PACKAGE_NAME]><img src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/appbrain_logo.png> AppBrain</a></div><div id=credits><i>Made by <a href=https://github.com/ayoubfletcher/ASO-Google-Play/ target=_blank>Ayoub Fletcher</a> with LOVE ❤️.</i><div class=social><a href=https://www.facebook.com/ayoub.fletcher/ target=_blank><img height=50 width=50 src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/facebook-icon.png alt=""> </a><a href=https://www.instagram.com/ayoub.fletcher/ target=_blank><img height=50 width=50 src=https://raw.githubusercontent.com/ayoubfletcher/ASO-Google-Play/master/static/instagram-icon.png alt=""></a></div><p>Honorable Mention <b id=honor>Re-skinning</b> 👑.</p><p class="alert alert-success">A special thanks for that guy who considered donating much much appreciated, so much love ❤️.</p><div id=support-me><a href=https://www.paypal.me/ayoubfletcher target=_blank></a></div></div><div id=aso-feature-image><i>Feature Image:</i><img src=""></div><div id=add-list-container></div></div>`;
let aso_add_later_code = aso_style_code + `<div id=add-later><button class=add-to-list>Add To List</button> <button class=show-list>(0) Show List</button> <button class=faq-btn>🤔 FAQ - الأسئلة الشائعة</button></div><div id=faq-list class=pop-up-display><div class=content><h3>FAQ &amp; الأسئلة الشائعة</h3><ul><li><h3>Who made this script?</h3><p>- I'm a Moroccan developer goes with name <a href=https://github.com/ayoubfletcher>Ayoub Fletcher</a>. Who keeps improving his coding skills and giving back to the community, and to help guys who wanna start their journey, wish ya good luck.</p></li><li><h3>How do you make money if the script is free, it must be a malware?</h3><p>- Well, the script is entirely free to kick start your own journey in the android development. The entire source code for the script is hosted on <a href=https://github.com/ayoubfletcher/ASO-Google-Play>Girhub Repo</a>, please feel free to audit it yourself or ask other developers for a hand to help ya with it.</p></li><li><h3>Seriously how do you make money from the script, what's the catch?</h3><p>- Well as i've said the entire source code is free, and there is no string attached to it. No tracking, nothing everyhing you use is hosted in your browser nothing is sent to our backend. The only way script can generate income is by the donate button, currently I'm only using PayPal as the only way for donation. Other than that i don't make any penny out of the script.</p></li><li><h3>How can i trust someone i don't know, no offence.</h3><p>- Well you don't have to trust me, the trust is been earned not given so i have to earn your trust. The code is open source, everything that runs in the script is there i don't inject any script any tracking stuff. If you don't know me ask friends about me, and they gonna tell ya. For the code please feel free to check it, the code is clean and no obfuscation to try hiding malware code or anything.</p></li><li><h3>I cannot read the code, how am i supposed to audit it?</h3><p>- Well you don't have to trust me, send the code to any of your developers friends or hire someone to check it for ya, there's so many high skilled developers out there, can audit the script for you. Just ask them nicely and they will help ya with it. On the top of that the code doesn't use any obfuscation to hijack the code whatsoever.</p></li><li><h3>Should i donate you to use the script?</h3><p>- Well you don't have too, but if you do it's a genuinely welcome thing and it will make my day :D., Currently accepting PayPal, Profitable niches trust me i'll keep them private :P.</p></li><li><h3>Speical Thanks</h3><p>- Special thanks for the guys who considered donating for the project, really appreciated much love. As many of you know that maintaining a project requires time and resources so thank you for your support much love ❤️.</p></li><li><h3>Do you have any social media presence, YouTube ..?</h3><p>- Well YouTube i don't have it yet, i know it's dumb but soon maybe i'm gonna start a channel about coding probably. Or dancing on TikTok if i got depressed about money, you never know :P</p></li><li><h3>I would like to contact you, where can i reach you?</h3><p>- Well feel free to say hi on social media accounts, <a href=https://www.facebook.com/ayoub.fletcher/ >Facebook</a>, <a href=https://www.instagram.com/ayoub.fletcher/ >Instagram</a>.</p></li></ul></div></div><div id=show-list class=pop-up-display><div class=content><h3>Saved Later:</h3><p>The list is empty, add items to the list to be shown here.</p><div id=aso-data-table><div class=aso-data-table-container><table><thead><tr><th>App</th><th>Package Name</th><th>URL Saved</th><th>Google Play URL</th><th>Delete</th></tr></thead><tbody></tbody></table></div></div><button id=clear-list class="btn btn-danger">Clear</button> <button id=export-list class="btn btn-primary">Export</button></div></div>`;

/**
 * Messages feedback change if you want to.
 */
const app_not_found_msg = "SORRY, APP PAGE NOT FOUND ON APPBRAIN 😓, we have recieved a 404 status page!";
const fetching_app_info_msg = "GETTING APP INFORMATIONS FROM APPBRAIN 👺🕵️‍♀️ ...";
const app_brain_limit_error = `You have reached your daily pageview limit for AppBrain. We gathered what we can from the page, so consider changing IPs AKA proxies. That ain't my fault it's the way they operate the only way to keep that thing running and bypassing that limit is by purchasing one of their subscription plans which start at $57.50 per month, or changing IPs, or by creating a custom API for it, for you own information that cost money. To make the API operate ain't free. Even making and maintaining that script is costing (time=MONEY), but we gave back to the community of android developers. Feel free to contact me or opening an issue on <a href="https://github.com/ayoubfletcher/ASO-Google-Play">Github Repo</a> if had any issue with the script.`;
let error_msg = "";

/**
 * Promise method to get http request
 * @param url Target url
 */
function getHttpRequest(url) {
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			method: "GET",
			headers: {
				"User-Agent": navigator.userAgent,
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9",
			},
			url: url,
			onload: function (response) {
				resolve(response);
			},
		});
	});
}

/**
 *
 * @param {Str} htmlStr HTML string to be converted
 * @returns node element
 */
function evaluateHtml(htmlStr) {
	var div = document.createElement("div");
	div.innerHTML = htmlStr;
	return div;
}

function parseHtml(htmlStrDom) {
	const domParser = new DOMParser();
	return domParser.parseFromString(htmlStrDom, "text/html");
}

/**
 * Extract fields from selector of appbrain
 * @param selector Selector of html
 */
function extractField(selector) {
	if (selector == null) {
		return;
	}
	var elemTextSolo = selector.parentElement.querySelector(".infotile-text-solo");
	if (elemTextSolo != null && elemTextSolo.length) {
		const valueTxt = elemTextSolo.innerText.trim();
		if (valueTxt.length && valueTxt !== "?") {
			return valueTxt;
		} else {
			return "Unknown";
		}
	} else {
		const mainInfoElem = selector.parentElement.querySelector(".infotile-text");
		const subInfoElem = selector.parentElement.querySelector(".infotile-subtext");
		let valueTxt = mainInfoElem.innerText.trim();

		if (subInfoElem != null) {
			valueTxt += ` ${subInfoElem.innerText.trim()}`;
		}
		if (valueTxt.trim().length && valueTxt.trim() !== "?") {
			return valueTxt;
		} else {
			return "Unknown";
		}
	}
}

/**
 * Extract the related apps
 * @param html_src html src
 */
function extractRelatedApps(resultDom) {
	const selector = resultDom.querySelector(".app-tiles-block");
	selector.querySelectorAll("a").forEach((elem) => {
		const pkgName = elem.getAttribute("href").split("/")[
			elem.getAttribute("href").split("/").length - 1
		];
		if (pkgName !== undefined) {
			elem.getAttribute(
				"href",
				"https://play.google.com/store/apps/details?id=" + pkgName
			);
		}
	});
	selector.querySelectorAll("script").forEach((elem) => {
		elem.remove();
	});
	selector.querySelectorAll("img").forEach((imgElem) => {
		imgElem.setAttribute("src", imgElem.getAttribute("data-src"));
		imgElem.removeAttribute("data-src");
	});
	selector.querySelectorAll('a').forEach(elem => {
		const pkg_name = elem.href.split('/')[[elem.href.split('/').length - 1]];
		elem.href = `https://play.google.com/store/apps/details?id=${pkg_name}`;
	});
	return selector.innerHTML;
}

function scrapeAppBrain(package_name) {
	return new Promise((resolve, reject) => {
		getHttpRequest(`https://www.appbrain.com/app/${package_name}`).then(response => {

			if(response.status !== 200) {
				resolve({
					status: response.status,
					data: null
				})
				return;
			}

			const resultDom = parseHtml(response.responseText);

			if(resultDom.querySelector("h1").innerText == "Uh oh! Page not found!") {
				resolve({
					status: 404,
					data: null
				})
				return;
			}
		
			// Removing JavaScript code to prevent JS injection
			resultDom.querySelectorAll("script").forEach((elem) => {
				elem.remove();
			});
			let data = resultDom.querySelector(".infotiles");
			// extract the data of app
			let app = {
				app_data: {
					installs: extractField(
						data.querySelector(".infotile-top-installs")
					),
					age: extractField(
						data.querySelector(".infotile-top-age")
					),
					ranking: extractField(
						data.querySelector(".infotile-top-ranking")
					),
					size: extractField(
						data.querySelector(".infotile-top-size")
					),
					update: extractField(
						data.querySelector(".infotile-top-lastupdated")
					),
					android_version: extractField(
						data.querySelector(".infotile-top-androidversion")
					),
					libraries_count: extractField(
						data.querySelector(".infotile-top-libraries")
					),
				},
				related_apps: extractRelatedApps(resultDom),
				google_rankings: extractGooglePlayRankings(resultDom),
				libraries: extractLibraries(resultDom),
				changeLogs: extractChangeLogs(resultDom),
				short_description: null,
				keywords: extractKeywords(resultDom),
				is_limited: resultDom.querySelector(".blurred") != null
			};
		
			const shortDescElem = resultDom.querySelector(".app-short-description");
			if (shortDescElem != null) {
				app.short_description = shortDescElem.innerText;
			}
			
			resolve({
				status: 200,
				data: app
			})
		})
	});
}

function scrapeAppStoreSpy(package_name) {
	return new Promise((resolve, reject) => {
		getHttpRequest(`https://appstorespy.com/apps/play/${package_name}/${package_name}`).then(response => {
			if(response.status !== 200) {
				resolve({
					status: response.status,
					app: null
				})
				return;
			}

			const reusltDom = parseHtml(response.responseText);

			const tableElem = reusltDom.querySelector('table');

			let app = {
				installs: null,
				age: null,
				update: null,
				android_version: null,
				release_date: null,
				size: null
			};

			tableElem.querySelectorAll('tbody tr').forEach(elem => {
				const tdTxt = elem.querySelector('td').innerText;
				let thTxt = elem.querySelector('th');
				if(thTxt != null) {
					thTxt = thTxt.innerText.trim();
					if(tdTxt.startsWith('Installs')) {
						app.installs = thTxt;
					} else if(tdTxt.startsWith('Age')) {
						app.age = thTxt;
					} else if(tdTxt.startsWith('Updated')) {
						app.update = thTxt;
					} else if(tdTxt.startsWith('Version')) {
						app.android_version = thTxt;
					} else if(tdTxt.startsWith('Release date')) {
						app.release_date = thTxt;
					} else if(tdTxt.startsWith('Size')) {
						app.size = thTxt;
					}
				}
			})
			resolve({
				status: 200,
				data: {
					app
				}
			})
		})
	})
}

/**
 * Generte the aso data
 */
function generateASO() {
	// Inject loading
	const elem_target = document.querySelector("h1").parentElement.parentElement
		.parentElement.parentElement.parentElement;

	// Get the pacakge name and the developer name
	const package_name = location.href.split("?id=")[1].split("&")[0];

	aso_html_code = aso_html_code.replace(/\[PACKAGE_NAME]/g, package_name);
	aso_html_code = aso_html_code.replace(
		/\[APP_NAME]/g,
		document.querySelector("h1").innerText
	);

	elem_target.parentNode.insertBefore(
		evaluateHtml(aso_html_code),
		elem_target.nextSibling
	);

	document.querySelector('#download_apk').href = `https://apkpure.com/${package_name}/${package_name}/download?from=details`;

	document.querySelector(
		"#aso-data-loading"
	).innerText = fetching_app_info_msg;

	const cache_name = `cache_${package_name}`;
	
	let app_data = GM_getValue(cache_name);
	
	const request_data = [];
	if(app_data != null) {
		if(app_data.app_brain != null) {
			app_data.app_brain.is_cached = true
			request_data.push(Promise.resolve(app_data.app_brain))
		} else {
			request_data.push(scrapeAppBrain(package_name));
		}
		if(app_data.app_store != null) {
			app_data.app_store.is_cached = true
			request_data.push(Promise.resolve(app_data.app_store))
		} else {
			request_data.push(scrapeAppStoreSpy(package_name))
		}
	} else {
		request_data.push(scrapeAppBrain(package_name));
		request_data.push(scrapeAppStoreSpy(package_name));
	}
	
	Promise.all(request_data).then(values => {
		let [ app_brain, app_store ] = values;

		if(app_brain.status === 200 || app_store.status === 200) {
			GM_setValue(cache_name, {
				app_brain,
				app_store
			});
		}
	
		injectData({
			app_brain,
			app_store
		})
	})
}

/**
 * Unescape text
 * @param {str} text Text to unescape
 */
function unescapeText(text) {
	const elementDiv = document.createElement("div");
	elementDiv.innerHTML = text;
	return elementDiv.innerText;
}

/**
 * Retrieve short description of the app
 */
function getShortDescription() {
	const metas = document.getElementsByTagName("meta");
	const scripts = document.getElementsByTagName("script");
	// Get description if was on metas
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute("name") == "description") {
			return metas[i].getAttribute("content");
		}
	}
	// Check if description was protected
	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i].innerHTML.indexOf("key: 'ds:5', isError:  false") > 0) {
			const scriptBlock = scripts[i].innerHTML.split(",[null,");
			try {
				scriptBlock[1].substring(1, scriptBlock[1].indexOf('"]'));
			} catch (e) { }
		}
	}
}

/**
 * Retrieve feature image of the app
 */
function getFeatureImage() {
	const metas = document.getElementsByTagName("meta");
	// Get feature image if was on metas
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute("property") == "og:image") {
			return metas[i].getAttribute("content");
		}
	}
}

function extractGooglePlayRankings(resultDom) {
	const selector = resultDom.querySelector('.data-table-container');
	if (selector == null) {
		return `Looks like there's not ranking for this application.`;
	}

	selector.querySelectorAll('a').forEach(elem => {
		elem.parentNode.innerHTML = elem.innerText;
	})
	return selector.innerHTML;
}

function extractLibraries(resultDom) {
	const selector = resultDom.querySelector('#app-libraries').nextElementSibling;
	const libraries = [];

	selector.querySelectorAll('.col-sm-4').forEach(elem => {
		const currentData = {
			title: elem.querySelector('h3').innerText,
			libs: []
		}
		elem.querySelectorAll('.app-library-item').forEach(field => {
			currentData.libs.push({
				image: field.querySelector('img').getAttribute('data-src'),
				name: field.innerText
			});
		})

		libraries.push(currentData);
	})
	return libraries;
}

function extractChangeLogs(resultDom) {
	const selector = resultDom.querySelector('#changelog .app-changelog');
	if (selector == null) {
		return;
	}
	return selector.parentNode.innerHTML;
}

function extractKeywords(resultDom) {
	const selector = resultDom.querySelector('.app-description-tags .tag-cloud');
	if (selector == null) {
		return `Sorry, no keywords has been found on AppBrain page.`;
	}
	return selector.innerHTML;
}

function initGplayJS() {
	
        document.querySelectorAll("#aso-data-container .expande-toggle").forEach(function (elem) {
            const expandableHiddenElems = elem.parentNode.querySelectorAll(".expandable-hidden");
            if (expandableHiddenElems.length > 1) {
                elem.style.display = 'inline-block';
            }

            elem.addEventListener('click', function (e) {
                e.preventDefault();
                const currentBtn = e.target;
                const expandableHiddenElems = currentBtn.parentNode.querySelectorAll(
                    ".expandable-hidden"
                );

                const isShowMore = currentBtn.classList.toggle('isShown');
                currentBtn.innerHTML = isShowMore ? 'View less' : 'View More';
                if (isShowMore) {
                    expandableHiddenElems.forEach((elem) => {
                        elem.style.display = "flex";
                    });
                } else {
                    expandableHiddenElems.forEach((elem) => {
                        elem.style.display = "none";
                    });
                }
            })
        })
    
}

function initAddToListJS() {
	document.querySelector('body').insertBefore(evaluateHtml(aso_add_later_code), document.querySelector('body').children[document.querySelector('body').children.length-1]);

	
        let package_name;
        if(location.href.indexOf('play.google.com') > -1) {
            package_name = location.href.split("?id=")[1].split("&")[0];
        } else if (location.href.indexOf('appbrain.com/app/') > -1 || location.href.indexOf('appstorespy.com') > -1) {
            package_name = location.href.split('/')[location.href.split('/').length-1].split('?')[0].split('#')[0];
        } else {
            package_name = 'com.example.debugging';
        }

        const clearCacheBtn = document.querySelector('#clear-cache');
        if(clearCacheBtn != null) {
            clearCacheBtn.addEventListener('click', function(e) {
                e.preventDefault();
                GM_deleteValue(`cache_${package_name}`);
                document.querySelector('#cache-notice .content').innerHTML = `The cache has been purged for "${package_name}" from the Tampermonkey database, next page will go straight to the AppBrain & AppStoreSpy webpage.`;
            });

            document.querySelector('#clear-cache-appstore').addEventListener('click', function(e) {
                e.preventDefault();
                const current_data = GM_getValue(`cache_${package_name}`);
                current_data.app_store = null;
                GM_setValue(`cache_${package_name}`, current_data);
                document.querySelector('#cache-notice .content').innerHTML = `The AppStoreSpy cache has been purged for "${package_name}" from the Tampermonkey database, next page will go straight to the AppStoreSpy webpage.`;
            });

            document.querySelector('#clear-cache-appbrain').addEventListener('click', function(e) {
                    e.preventDefault();
                    const current_data = GM_getValue(`cache_${package_name}`);
                    current_data.app_brain = null;
                    GM_setValue(`cache_${package_name}`, current_data);
                    document.querySelector('#cache-notice .content').innerHTML = `The AppBrain cache has been purged for "${package_name}" from the Tampermonkey database, next page will go straight to the AppBrain webpage.`;
                });
        }
        

        document.querySelector('#export-list').addEventListener('click', function(e) {
            e.preventDefault();
            let currentList = GM_getValue('save_later');
            let csvContent = "data:text/csv;charset=utf-8,";

            csvContent += 'App,Package Name,URL Saved,Google Play URL\n';
            currentList.forEach(function(row) {
                csvContent += `${row.name},${row.package_name},${row.url},${row.google_play}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            let currentTimeName = new Date(Date.now()).toLocaleString().replace(/\/|:/g, '-').replace(/,|\s/g, '_').replace(/__/g, '_');
            link.setAttribute('download', `data_export_${currentTimeName}.csv`);
            link.click();
        })

        document.querySelector('#add-later .add-to-list').addEventListener('click', function(e) {
            e.preventDefault();
            const isRemovedFromList = e.target.classList.toggle('remove-from-list');

            if(isRemovedFromList) {
                e.target.innerHTML = 'Remove From List'
            } else {
                e.target.innerHTML = 'Add To List'
            }
    
            let currentList = GM_getValue('save_later');
            if(currentList == null) {
                currentList = []; 
            }

            if(isRemovedFromList) {
                currentList.push({
                    name: document.querySelector('h1').innerText,
                    package_name: package_name,
                    url: location.href,
                    google_play: `https://play.google.com/store/apps/details?id=${package_name}`
                });
			} else {
				currentList = currentList.filter(item => item.package_name !== package_name);
			}
            GM_setValue('save_later', currentList);
            updateDisplay();
        })

        document.querySelector('#add-later .faq-btn').addEventListener('click', function(e) {
            document.querySelector('#faq-list').classList.toggle('show');
        })

        window.addEventListener('click', function(e) {
            let isPopupWithin = false;
            ['#add-later .faq-btn', '#add-later .show-list'].forEach(selectorName => {
                if(document.querySelector(selectorName) === e.target) {
                    isPopupWithin = true;
                }
            })
            const contentPopupElem = document.querySelector('.pop-up-display.show .content');
            if(contentPopupElem != null) {
                if(!contentPopupElem.contains(e.target) && !isPopupWithin) {
                    contentPopupElem.parentElement.classList.remove('show');
                }
            }
        })

        document.querySelector('#add-later .show-list').addEventListener('click', function(e) {
            document.querySelector('#show-list').classList.toggle('show');
        })
        
        document.querySelector('#clear-list').addEventListener('click', function(e) {
            e.preventDefault();
            GM_setValue('save_later', []);

            updateDisplay();
        })

        function initDeleteListenersTable() {
            document.querySelectorAll('#show-list .delete').forEach(function(elem) {
                elem.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentItemId = e.target.getAttribute('data-id');

                    let currentList = GM_getValue('save_later');
                    currentList = currentList.filter(item => item.package_name !== currentItemId);
                    GM_setValue('save_later', currentList);

                    updateDisplay();
                })
            })
        }

        function updateDisplay() {
            let currentList = GM_getValue('save_later');
            if(currentList == null) {
                currentList = [];   
            }
            let currentCount = currentList.length;
            document.querySelector('#add-later .show-list').innerHTML = `(${currentCount}) Show List`;

            const isAlreadyExists = currentList.some(item => item.package_name === package_name);
            const btnElem = document.querySelector('#add-later .add-to-list');
            if(isAlreadyExists) {
                btnElem.classList.add('remove-from-list');
                btnElem.innerHTML = 'Remove From List';
            } else {
                btnElem.classList.remove('remove-from-list');
                btnElem.innerHTML = 'Add To List';
            }
            
            const showListDisplay = document.querySelector('#show-list');
            if(currentList.length > 0) {
                showListDisplay.querySelector('p').style.display = 'none';
                showListDisplay.querySelector('table').style.display = 'block';
                
                const elementsHtml = currentList.map(item => {
                    return `<tr>
                        <td>${item.name}</td>
                        <td>${item.package_name}</td>
                        <td>
                            <a href="${item.url}">URL</a>
                        </td>
                        <td>
                            <a href="${item.google_play}">URL</a>
                        </td>
                        <td class="delete" data-id="${item.package_name}">X</td>
                    </tr>`;
                }).join('');
                showListDisplay.querySelector('table tbody').innerHTML = elementsHtml;
                showListDisplay.querySelectorAll('button').forEach(elem => {
                    elem.style.display = 'inline-block';
                })
                initDeleteListenersTable();
            } else {
                showListDisplay.querySelector('p').style.display = 'block';
                showListDisplay.querySelector('table').style.display = 'none';

                showListDisplay.querySelectorAll('button').forEach(elem => {
                    elem.style.display = 'none';
                })
            }
        }

        document.querySelectorAll('.pop-up-display .content').forEach(elem => {
            let closeElem = elem.querySelector('.close');
            if(closeElem == null) {
                closeElem = document.createElement('span');
                closeElem.classList.add('close');
                closeElem.innerHTML = 'X';
                closeElem.addEventListener('click', function(e) {
                    e.preventDefault();
                    elem.parentElement.classList.remove('show');
                });
                elem.appendChild(closeElem);
            }
        })

         updateDisplay();
        initDeleteListenersTable();
    
}

/**
 * Inject the data into the DOM of the page
 * @param app App object
 * @param developer Developer object
 */
function injectData(app_data) {

	const {app_brain, app_store} = app_data;

	const app_brain_data = app_brain.data;
	const app_store_data = app_store.data;

	// Addng the short description
	let short_description = "";
	if (app_brain_data != null) {
		short_description = app_brain_data.short_description;
		delete app_brain_data.short_description;
	} else {
		short_description = getShortDescription();
	}
	document.querySelector(
		"#description .content"
	).innerHTML = short_description;

	let is_results_cached = false;
	let errors = [];

	// Add the app information
	if (app_brain_data != null) {
		// Related apps
		const relatedDom = document.querySelector("#related-apps");
		relatedDom.insertBefore(
			evaluateHtml(app_brain_data.related_apps),
			relatedDom.querySelector(".header").nextSibling
		);

		// Rankings
		document.querySelector('#aso-data #play-rankings .aso-data-table-container').innerHTML = app_brain_data.google_rankings;

		// Libraries
		let libsHtml
		if (app_brain_data.libraries != null && app_brain_data.libraries.length > 0) {
			let x = 0;
			libsHtml = app_brain_data.libraries.map(value => {
				x += 1;
				const className = x > 1 ? "expandable-hidden" : "";
				const sectionHtml = value.libs.map(libVal => {
					return `<div class="library-item"><img src="${libVal.image}" />${libVal.name}</div>`;
				});
				return `<div class="${className}"><div class="section"><h3>${value.title}</h3><div class="section-content">${value.libs.length > 0? sectionHtml.join(''): 'Nothing has been found!'}</div></div></div>`
			}).join('');

		} else {
			libsHtml = `Looks like libraries has not been detected yet!`;
		}
		document.querySelector('#app-libraries .content').innerHTML = libsHtml;

		// Change Logs
		if (app_brain_data.changeLogs != null) {
			const changeLogsExandableElem = document.querySelector('#change-logs .expande-toggle');
			changeLogsExandableElem.parentNode.insertBefore(evaluateHtml(app_brain_data.changeLogs), changeLogsExandableElem);
			const junkElem = document.querySelector('.expandable-toggle');
			if(junkElem != null) {
				junkElem.parentNode.removeChild(junkElem);
			}
		} else {
			document.querySelector('#change-logs .content .section').innerHTML = 'No changelog data has been found on the page!';
		}

		let is_app_data_exists = false;
		for (let property in app_brain_data.app_data) {
			const currentVal = app_brain_data.app_data[property];
			const selector = document.querySelector(`#app-data .content .top-app-${property}`);
			if (currentVal != null && currentVal != '') {
				selector.querySelector(".value").innerHTML = app_brain_data.app_data[property];
				is_app_data_exists = true;
			}
		}
		
		const app_data_container = document.querySelector('#app-data .content');
		// Notice
		if (!is_app_data_exists) {
			app_data_container.innerHTML = `The IP has been hit by rate limiting please try again later or use a proxy on browser`;
		}


		app_data_container.querySelectorAll('li').forEach(elem => {
			if(elem.querySelector('.value').innerHTML.trim() === '') {
				app_data_container.querySelector('ul').removeChild(elem);
			}
		})
		
		if(app_brain.is_cached) {
			is_results_cached = true;
			document.querySelector('#cache-notice #clear-cache-appbrain').style.display = 'inline-block';
		}

		// Keywords
		document.querySelector('#app-keywords .content').innerHTML = app_brain_data.keywords;

		// Limit Check
		if(app_brain_data.is_limited) {
			errors.push(app_brain_limit_error);
		}

		initGplayJS();
	} else {
		switch(app_brain.status) {
			case 404:
				errors.push(`We have recieved a 404 erro page not found when requesting AppBrain.Com!`);
				break;
			default:
				errors.push(`Looks like there was a problem when requesting the AppBrain Page ${app_brain.status} Error Status!`);
				break;
		}

		["app-libraries", "change-logs", "app-data", "related-apps", "play-rankings", "app-keywords"].forEach(selectorName => {
			const selector = document.querySelector(`#${selectorName} .content`);
			if (selector != null ) {
				selector.innerHTML = `There was an error when the page has been request, the page returns ${app_brain.status} Status Code!`;

			}
		});
	}

	// App Store
	if(app_store_data != null) {
		let is_app_data_exists = false;
		for (let property in app_store_data.app) {
			const currentVal = app_store_data.app[property];
			const selector = document.querySelector(`#app-data .content-appstore .top-app-${property}`);
			if (currentVal != null && currentVal != '') {
				selector.querySelector(".value").innerHTML = app_store_data.app[property];
				is_app_data_exists = true;
			} else {
				selector.parentElement.parentElement.removeChild(selector.parentElement);
			}
		}
		// Notice
		if (!is_app_data_exists) {
			document.querySelector('#app-data .content-appstore').innerHTML = `The IP has been hit by rate limiting please try again later or use a proxy on browser`;
		}

		if(app_store.is_cached) {
			is_results_cached = true;
			document.querySelector('#cache-notice #clear-cache-appstore').style.display = 'inline-block';
		}
	} else {
		switch(app_brain.status) {
			case 404:
				errors.push(`We have recieved a 404 erro page not found when requesting AppStoreSpy.Com!`);
				break;
			default:
				errors.push(`Looks like there was a problem when requesting the AppStoreSpy.Com Page ${app_brain.status} Error Status!`);
				break;
		}

		["app-data"].forEach(selectorName => {
			const selector = document.querySelector(`#${selectorName} .content-appstore`);
			if (selector != null ) {
				selector.innerHTML = `There was an error when the page has been request, the page returns ${app_store.status} Status Code!`;

			}
		});
	}

	if(is_results_cached) {
		document.querySelector('#aso-data-container #cache-notice').style.display = 'block';
	}

	if(errors.length > 0) {
		const errorElem = document.querySelector('#error-notice');
		const htmlErrors = errors.map(error => {
			return `<div class='content'>- ${error}</div>`;
		});
		errorElem.querySelector('.errors-container').innerHTML = htmlErrors;
		errorElem.style.display = 'block';
	}

	// Feature image
	const featureImage = getFeatureImage();
	if (featureImage != null) {
		document.querySelector('#aso-feature-image img').setAttribute('src', featureImage);
	}

	document.querySelector('#aso-data-container #aso-data-loading').style.display = 'none';
	document.querySelector('#aso-data-container .aso-content').style.display = 'block';

	processing = false;
}

function addDownloadLinkToAppBrain() {
	let dlDiv = '<div class=download-lins style=text-align:center;margin-bottom:50px><a class="btn btn-primary"href="https://apkpure.com/{%PACKAGE_NAME%}/{%PACKAGE_NAME%}/download?from=details" target="_blank">Download APK</a></div>';
	const package_name = location.href.split('/')[location.href.split('/').length-1].split('?')[0].split('#')[0];
	dlDiv = dlDiv.replace(/{%PACKAGE_NAME%}/g, package_name);
	// Create container
	const dl_div_elem = document.createElement('div');
	dl_div_elem.innerHTML = dlDiv;
	document.querySelector('#main_content').insertBefore(dl_div_elem, document.querySelector('.infotiles'));
}

/**
 * Run method to reload the data after the ajax requests of page
 */
function run() {
	// Clean Appbrain
	if (location.href.indexOf("www.appbrain.com") > -1) {
		// Remove paywall
		document
			.querySelector(".paywall-overlay")
			.parentElement.removeChild(document.querySelector(".paywall-overlay"));
		// Remove the blur
		if (document.querySelector(".blurred") != null) {
			document.querySelector(".blurred").classList.remove("blurred");
			// Add a notice for the paywall
			const mainContentElem = document.querySelector(".main-contents");
			const htmlCode = `<div class="alert alert-danger" style="text-align: center;">
				You have reached your daily pageview limit for AppBrain. This is a custom notice made by the script <a href="https://github.com/ayoubfletcher/ASO-Google-Play" target="_blank">Github Link</a>, We've hided that deadly paywall thing, that's why it doesn't show up.
			</div>`;
			mainContentElem.parentElement.insertBefore(evaluateHtml(htmlCode), mainContentElem);
		}
		
		// To add download to appbrain.
		addDownloadLinkToAppBrain();
		
	} else if(location.href.startsWith('https://play.google.com/')) {
		// Save the current page url
		let current_app_url = location.href;
		// Check if the current id not the same
		if (document.getElementById("aso-data") == null && !processing) {
			processing = true;
			generateASO();
		}
		setInterval(function () {
			if (current_app_url != location.href) {
				location.reload();
			}
		}, INTERVAL_TIMER_CHECKER);
	}
	initAddToListJS();
}

/** Main method script */
(function () {
	"use strict";
	/**
	 * BUG appears on Chrome
	 * Fixes for the bug "This document requires 'TrustedScript' assignment."
	 */
	if (window.trustedTypes && window.trustedTypes.createPolicy) {
		window.trustedTypes.createPolicy("default", {
			createHTML: (string, sink) => string,
		});
	}

	run();
})();
