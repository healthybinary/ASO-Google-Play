// ==UserScript==
// @name         Direct Download From fmovies
// @namespace    http://maxyspark.com/
// @version      0.1
// @description  Direct Download From fmovies
// @author       MaxySpark
// @match        http://fmovies.to/*
// @match        https://fmovies.to/*
// @match        http://9anime.to/*
// @grant        none
// @author       MaxySpark
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.pathname;
    var host = window.location.hostname;
    var node;
    window.onload = function() {
        console.log("Script Is loaded!");
        setTimeout(function(){
          if(host==="fmovies.to") {
            //alert("Here");
                var dLink = document.querySelectorAll("#player > #jw > .jw-media > video")[0].src;
                var dButton = document.createElement("button");
                if(dLink) {
                 node = document.createTextNode("Click Here To Downoad");
              } else {
                 node = document.createTextNode("Download Link Not Found");
              }
                dButton.appendChild(node);
                var mainDiv = document.querySelectorAll("div.widget")[2];
                var element = document.querySelectorAll("div.mt.row")[0];
                dButton.setAttribute("id","downButton");
                dButton.setAttribute("src",dLink);
                dButton.style.height = "40px";
                dButton.style.backgroundColor = "blueviolet";
                dButton.style.fontSize = "1.5em";
                dButton.style.fontWeight = "bold";
                dButton.style.fontFamily = "monospace";
                dButton.style.borderRadius = "5px";
                dButton.style.color = "azure";
                mainDiv.insertBefore(dButton,element);
              console.log("DOWNLOAD LINK - ");
              console.log(dLink);
              //console.log(dButton);
              document.querySelectorAll("button#downButton")[0].setAttribute("onClick","window.open(this.getAttribute('src'),'_blank');");
          }
            if(host==="9anime.to") {
            //alert("Here");
                var dLink2 = document.querySelectorAll("#player > #jw > .jw-media > video")[0].src;
                var dButton2 = document.createElement("button");
                if(dLink2) {
                 node = document.createTextNode("Click Here To Downoad");
              } else {
                 node = document.createTextNode("Download Link Not Found");
              }
                dButton2.appendChild(node);
                var mainDiv2 = document.querySelectorAll("div.container.player-wrapper")[0];
                var element2 = document.querySelectorAll("div.container.player-wrapper > div.container")[0];
                dButton2.setAttribute("id","downButton");
                dButton2.setAttribute("src",dLink2);
                dButton2.style.height = "40px";
                dButton2.style.backgroundColor = "blueviolet";
                dButton2.style.fontSize = "1.5em";
                dButton2.style.fontWeight = "bold";
                dButton2.style.fontFamily = "monospace";
                dButton2.style.borderRadius = "5px";
                dButton2.style.color = "azure";
                mainDiv2.insertBefore(dButton2,element2);
              console.log("DOWNLOAD LINK - ");
              console.log(dLink2);
              //console.log(dButton2);
              document.querySelectorAll("button#downButton")[0].setAttribute("onClick","window.open(this.getAttribute('src'),'_blank');");
          }
        }, 10000);

    };


})();
