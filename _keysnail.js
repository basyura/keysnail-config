// ========================== KeySnail Init File =========================== //

// この領域は, GUI により設定ファイルを生成した際にも引き継がれます
// 特殊キー, キーバインド定義, フック, ブラックリスト以外のコードは, この中に書くようにして下さい
// ========================================================================= //
//{{%PRESERVE%
//util.setBoolPref("extensions.keysnail.keyhandler.low_priority", false);
//
// for autopager
style.register(<><![CDATA[
    .autopagerize_page_separator {
        display:none;
    }
    .autopagerize_link {
        text-decoration : none !important;
        color     : #8ec1da !important;
    }
    .autopagerize_page_info {
        background-color : #8ec1da;
        font-size : 6px;
        height    : 4px;
        color     : #8ec1da !important;
		text-align:right;
   }
   @-moz-document domain("plus.google.com") {
     div.a-Eo-T {
       position:fixed;
       top:0;
       width:100%;
     }
     body {
       padding-top:30px;
     }
   }

]]></>.toString() , style.XHTML);

//
//}}%PRESERVE%
// ========================================================================= //

// ========================= Special key settings ========================== //

key.quitKey              = "C-j";
key.helpKey              = "undefined";
key.escapeKey            = "C-q";
key.macroStartKey        = "undefined";
key.macroEndKey          = "undefined";
key.universalArgumentKey = "undefined";
key.negativeArgument1Key = "undefined";
key.negativeArgument2Key = "undefined";
key.negativeArgument3Key = "undefined";
key.suspendKey           = "undefined";

// ================================= Hooks ================================= //

function kb_quit(aEvent) {
    if (key.currentKeySequence.length) {
        return;
    }
    command.closeFindBar();
    if (util.isCaretEnabled()) {
        let marked = aEvent.originalTarget.ksMarked;
        let type = typeof marked;
        if (type === "number" || type === "boolean" && marked) {
            command.resetMark(aEvent);
        } else {
            let elem = document.commandDispatcher.focusedElement;
            if (elem) {
                elem.blur();
            }
            gBrowser.focus();
            _content.focus();
        }
    } else {
        goDoCommand("cmd_selectNone");
    }
    if (KeySnail.windowType == "navigator:browser") {
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
    }
}

hook.setHook('KeyBoardQuit', kb_quit);


/*
hook.addToHook(
	'LocationChange',
	function (aNsURI) {
		if (!aNsURI || !aNsURI.spec) {
			return;
		}
		document.addEventListener(
			"DOMContentLoaded",
			function () {
				let (elem = document.commandDispatcher.focusedElement) elem && elem.blur();
				gBrowser.focus();
				content.focus();
			},
			true);
	});

*/

// original code from Firemacs
hook.addToHook(
'LocationChange',
function (aNsURI) {
	if (!aNsURI || !aNsURI.spec) {
		return;
	}
	//const wikipediaRegexp = "^http://[a-zA-Z]+\\.wikipedia\\.org/";
	const wikipediaRegexp = "^http://[a-zA-Z]+[(\.wikipedia\.org/)(\.twitter\.com/)]";
	if (aNsURI.spec.match(wikipediaRegexp)) {
		var doc = content.document;
		if (doc && !doc.__ksAccesskeyKilled__) {
			doc.addEventListener(
				"DOMContentLoaded",
				function () {
					doc.removeEventListener("DOMContentLoaded", arguments.callee, true);
					var nodes = doc.evaluate('//*[@accesskey]', doc,
											 null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					for (let i = 0; i < nodes.snapshotLength; i++) {
						let node = nodes.snapshotItem(i);
						if(node.getAttribute('accesskey') == "u") {
							continue;
						}
						let clone = node.cloneNode(true);
						clone.removeAttribute('accesskey');
						node.parentNode.replaceChild(clone, node);
					}
					doc.__ksAccesskeyKilled__ = true;
				}, true);
		}
	}
});



// ============================== Black list =============================== //

hook.addToHook("LocationChange", function (aNsURI) {
    var URL = aNsURI ? aNsURI.spec : null;
    key.suspendWhenMatched(URL, key.blackList);
});

key.blackList = [
//    'http://b.hatena.ne.jp/basyura/*',
//    'http://smart.fm/*'
];

// ============================= Key bindings ============================== //


key.setGlobalKey('C-f', function (ev) {
    setTimeout(function() {
        getBrowser().mTabContainer.advanceSelectedTab(1, true);
      } , 100)
}, 'ひとつ右のタブへ');

key.setGlobalKey('C-b', function () {
    getBrowser().mTabContainer.advanceSelectedTab(-1, true);
	ev.cancelBubble = true;
}, 'ひとつ左のタブへ');

key.setEditKey('C-f', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_RIGHT, true);
}, '右');

key.setEditKey('C-a', function (ev) {
    command.beginLine(ev);
}, '行頭');

key.setEditKey('C-b', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_LEFT, true);
}, '左');

key.setEditKey('C-e', function (ev) {
  command.endLine(ev);
}, '行末');

key.setGlobalKey('C-e', function (ev) {
    //noop
}, '');

key.setEditKey('C-p', function (aEvent) {
   if(!command.gFindBar.hidden) {
        command.iSearchBackward();
        return;
    }
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_UP, true);
}, '上');

key.setEditKey('C-n', function (aEvent) {
    if(!command.gFindBar.hidden) {
        command.iSearchForward();
        return;
    }
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_DOWN, true);
}, '下');




key.setGlobalKey('C-n', function () {
    setTimeout(function() {
        command.iSearchForward();
      } , 100)
}, 'インクリメンタル検索', true);

key.setGlobalKey('C-p', function () {
    command.iSearchBackward();
}, '逆方向インクリメンタル検索', true);


var use_smooth_scroll = false;

key.setGlobalKey('C-d', function (ev, arg) {
    if (!use_smooth_scroll) {
      for (var i = 0 ; i < 8 ; i++) {
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_DOWN, true);
      }
      return;
    }
    for (var i = 0 ; i < 10 ; i++) {
      (function () {
          var n = i;
          setTimeout(function() {
              key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_DOWN, true)
            } , 20 * n);
        })();
    }
}, 'down');

key.setGlobalKey('C-u', function (ev, arg) {
    if (!use_smooth_scroll) {
      for (var i = 0; i < 8; i++) {
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_UP, true);
      }
      return;
    }
    for (var i = 0 ; i < 10 ; i++) {
      (function () {
        var n = i;
        setTimeout(function() {
            key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_UP, true)
          } , 20 * n);
      })();
    }
	//ev.cancelBubble = true;
}, 'up');

key.setGlobalKey('C-.', function () {
    userscript.reload();
}, '設定ファイルを再読み込み');

key.setGlobalKey('C-w', function (ev) {
    setTimeout(function () {
      getBrowser().removeTab(getBrowser().selectedTab);
    } , 100);
}, 'タブ / ウィンドウを閉じる');


key.setGlobalKey('M-:', function () {
    command.interpreter();
}, 'コマンドインタプリタ');

key.setViewKey('j', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_DOWN, true);
}, '一行スクロールダウン');

key.setViewKey('k', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_UP, true);
}, '一行スクロールアップ');

key.setViewKey('l' , function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_RIGHT, true);
  } , '右へ');

key.setViewKey('h' , function (ev) {
    key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_LEFT, true);
  } , '左へ');

key.setViewKey(['g', 'g'], function () {
    goDoCommand("cmd_scrollTop");
}, 'ページ先頭へ移動');

key.setViewKey('G', function () {
    goDoCommand("cmd_scrollBottom");
}, 'ページ末尾へ移動');

key.setViewKey('e', function (aEvent, aArg) {
    ext.exec("hok-start-foreground-mode", aArg);
}, 'Hit a Hint を開始', true);

key.setViewKey('E', function (aEvent, aArg) {
    ext.exec("hok-start-background-mode", aArg);
}, 'リンクをバックグラウンドで開く Hit a Hint を開始', true);
key.setViewKey('C-e', function (aEvent, aArg) {
    ext.exec("hok-start-background-mode", aArg);
}, 'リンクをバックグラウンドで開く Hit a Hint を開始', true);

key.setEditKey('C-h', function () {
    goDoCommand("cmd_deleteCharBackward");
}, '前の一文字を削除');
key.setEditKey('C-d', function () {
	goDoCommand("cmd_deleteCharForward");
}, '次の一文字を削除');
key.setEditKey('C-c', function (aEvent) {
    command.copyRegion(aEvent);
}, '選択中のテキストをコピー');

key.setViewKey('C-c', function () {
    goDoCommand("cmd_copy");
}, '選択中のテキストをコピー');

key.setViewKey('H', function () {
	BrowserBack();
}, '戻る');
key.setViewKey('L', function () {
	BrowserForward();
}, '進む');

key.setEditKey('C-v', function (aEvent) {
	goDoCommand("cmd_paste");
}, '貼り付け (Yank)');

key.setEditKey('C-w', function (ev) {
    command.deleteBackwardWord(ev);
}, '前の一単語を削除');

key.setEditKey('C-x', function (aEvent) {
    goDoCommand("cmd_copy");
    goDoCommand("cmd_delete");
    command.resetMark(aEvent);
}, '選択中のテキストを切り取り (Kill region)');

key.setEditKey('C-z', function () {
    display.echoStatusBar("Undo!", 2000);
    goDoCommand("cmd_undo");
}, 'アンドゥ');

key.setEditKey('C-u', function () {
    display.echoStatusBar("Undo!", 2000);
    goDoCommand("cmd_undo");
}, 'アンドゥ');

key.setGlobalKey('C-r', function () {
    BrowserReload();
}, '更新');

key.setGlobalKey('C-l', function (ev) {
    command.focusToById("urlbar");
}, 'ロケーションバー');

key.setViewKey('C-k' , function (ev) {
    var uri = getBrowser().currentURI;
    if (uri.path == "/") {
        return;
    }
    var pathList = uri.path.split("/");
    if (!pathList.pop()) {
        pathList.pop();
    }
    loadURI(uri.prePath + pathList.join("/") + ("/"));
}, '一つ上へ');


key.setEditKey('C-k' , function(ev) {
    goDoCommand('cmd_selectEndLine');
    goDoCommand('cmd_copy');
    goDoCommand('cmd_delete');
  });

plugins.options["zou_search.user"] = "basyura";

key.setViewKey(':', function () {
	try {
		if (document.getElementById("keysnail-prompt") != undefined) { 
			prompt.finish(true,true);
		}
	} catch(e) {
	}
    shell.input();
}, 'Command System');

key.setViewKey("t",
    function (ev, arg) {
        ext.exec("twitter-client-display-timeline", arg);
    }, "TL を表示", true);

key.setGlobalKey(["C-c", "C-t"],
    function (ev, arg) {
        ext.exec("twitter-client-tweet", arg);
    }, "つぶやく", true);

plugins.options["twitter_client.popup_new_statuses"] = true;

(function () {
     function arrange(seed) {
         let colors = [
             ["%FG%" , "#e2e2e2"],
             ["%BG%" , "#151515"],
             ["%FG_SELECTED%" , "#e2e2e2"],
             ["%BG_SELECTED%" , "rgba(60,76,82,0.7)"],
             //
             ["%FG_MESSAGE%" , "#61b5d4"],
             //
             ["%FG_HOVER%" , "#61b5d4"],
             ["%BG_HOVER%" , "#232323"],
             //
         ];
 
         colors.forEach(function ([k, v]) { seed = seed.replace(k, v, "g"); } );
         return seed;
     }
 
     let ooo = {
         "twitter_client": {
             "normal_tweet_style" : "color:%FG%;",
             "my_tweet_style" : "color:#7ad3f2;",
             "reply_to_me_style" : "color:#f279d2;",
             "retweeted_status_style" : "color:#d2f279;",
             "selected_row_style" : "color:%FG%; background-color:%BG_SELECTED%;",
             "selected_user_style" : "color:%FG%; background-color:rgba(60,76,82,0.4);",
             "selected_user_reply_to_style" : "color:%FG%; background-color:rgba(82,60,76,0.4);",
             "selected_user_reply_to_reply_to_style" : "color:%FG%; background-color:rgba(79,60,82,0.4);",
             "search_result_user_name_style" : "color:%FG_MESSAGE%;"
         }
     };
 
     // style.register(<><![CDATA[
     // #hBookmark-status-count label {
     // display: inline !important;
     // -moz-opacity: 1 !important;
     // cursor: pointer !important;
     // }
 
     // #hBookmark-status-count image {
     // display: none !important;
     // }
     // ]]></>.toString());
 
     style.prompt["default"] = "color:#e2e2e2;";
     style.prompt["description"] = "color:#abbac0;";
     style.prompt["url"] = "color:#98d3e7;text-decoration:underline;";
     style.prompt["engine"] = "color:#1782de;";
     style.prompt["bookmark"] = "color:#f14b0d;";
     style.prompt["history"] = "color:#62e500;";
 
     style.js["function"] = "color:#1782de;";
     style.js["object"] = "color:#f14b0d;";
     style.js["string"] = "color:#62e500;";
     style.js["xml"] = "color:#6621dd;";
     style.js["number"] = "color:#b616e7;";
     style.js["boolean"] = "color:#e63535;";
     style.js["undefined"] = "color:#e000a5;";
     style.js["null"] = "color:#07d8a8;";
 
     for (let [prefix, opts] in Iterator(ooo))
         for (let [k, v] in Iterator(opts))
             plugins.options[prefix + "." + k] = arrange(v);
 
     style.register(arrange(<><![CDATA[
/* おまじない */
#keysnail-prompt,
#keysnail-prompt textbox,
listbox#keysnail-completion-list,
listbox#keysnail-completion-list listitem,
#keysnail-completion-list listheader
{
    -moz-appearance : none !important;
    border : none !important;
}
 
/* 基本スタイル */
#keysnail-prompt,
#keysnail-prompt textbox,
listbox#keysnail-completion-list,
#keysnail-completion-list listheader,
#keysnail-twitter-client-user-tweet
{
    font-family : Monaco, Consolas, monospace !important;
    background-color : %BG% !important;
    color : %FG% !important;
}
 
description.ks-text-link { color : #98d3e7 !important; }
description.ks-text-link:hover { color : #248baf !important; }
 
/*
listbox#keysnail-completion-list {
background-image : url("file:///home/masa/Desktop/ildjarn.png") !important;
background-position : right bottom !important;
background-attachment : fixed !important;
background-repeat : no-repeat !important;
}
*/
 
/* 選択中行のスタイル */
#keysnail-completion-list listitem[selected="true"],
listbox#keysnail-completion-list:focus > listitem[selected="true"]
{
    background-color : %BG_SELECTED% !important;
    color : %FG_SELECTED% !important;
}
 
/* プロンプト入力エリアへマウスオーバーした際, 背景色を変更 */
#keysnail-prompt textbox:hover
{
    background-color : %BG_HOVER% !important;
}
 
/* プロンプトのメッセージ */
.keysnail-prompt-label {
    color : %FG_MESSAGE% !important;
}
 
/* 下部へ線を引く */
listbox#keysnail-completion-list {
    border-bottom : 1px solid %FG% !important;
    margin : 0 !important;
}
 
/* ヘッダ */
#keysnail-completion-list listheader {
    font-weight : bold !important;
    padding : 2px !important;
    color : %FG_HOVER% !important;
    border-bottom : 1px solid %FG_HOVER% !important;
    -moz-border-bottom-colors : %FG_HOVER% !important;
    margin-bottom : 4px !important;
}
]]></>.toString()));
 })();

style.register(<><![CDATA[
      @-moz-document url-prefix("http://b.hatena.ne.jp/") {
        .entry-summary, .entry-data {display:none}
        .entry-comment-fold, .others {background-color:white}
        .entry-image {width:32px;height : 32px;}
        .entry-image-block {display:none;}
        .trigger {display:none;}

      }
    ]]></>.toString(), style.XHTML);

style.register(<><![CDATA[
@-moz-document url-prefix("http://twitter.com/") {
	#introduce_retweet_banner {
		display : none !important;
	}
	ol.statuses > li.last-on-page, ol.statuses > li.last-on-refresh {
		border-bottom:10px solid #8ec1da !important;
	}
}
]]></>.toString(), style.XHTML);


style.register(<><![CDATA[
  #urlbar *|input {
    ime-mode: inactive !important;
  }
  tabbrowser .tabs-newtab-button { display: none !important; }
  tabbrowser .tabs-container> stack { display: none; }

  #urlbar dropmarker {display:none !important;}

  menu[container="true"]>menupopup[placespopup="true"]>menuseparator:nth-last-child(-n+2),
  menu[container="true"]>menupopup[placespopup="true"]>menuseparator:nth-last-child(-n+2) + menuitem{
  visibility:collapse !important;
  }
  toolbarbutton[container="true"]>menupopup[placespopup="true"]>menuseparator:nth-last-child(-n+2),
  toolbarbutton[container="true"]>menupopup[placespopup="true"]>menuseparator:nth-last-child(-n+2) + menuitem{
  visibility:collapse !important;
  }

  #placesContext>menuitem[id="placesContext_openContainer:tabs"],
  #placesContext>menuitem[id="placesContext_openContainer:tabs"]:not([hidden])+menuitem+#placesContext_openSeparator {
  visibility:collapse !important;
  }

  #stop-button:not([disabled=true]) + #reload-button,
  #stop-button[disabled=true]
  {
      display:none !important;
  }

  #star-button
  {
  display: none !important;
  }
]]></>.toString());

style.register(<><![CDATA[
      @-moz-document url-prefix("http://www.yahoo.co.jp/") {
        #searchbox, #header, #toptxt, #sub, #pickupservice, #application, #companybox, #composite, #favoriteservice, #spotlight, #selectionR, #video, #cgmboxR, #announce, #event, #tct, #footer { display : none; }
      }
    ]]></>.toString() , style.XHTML);


/*
style.register(<><![CDATA[
      @-moz-document url-prefix("http://www.livedoor.com/") {
        #header, .member-outer,  #extra, .boxhead, #today-site, #feature-ad, .boxhead-blogos, #blogos-box, .wrapper-sub, #servicelist, #media, #news-special, #lite, #biz
        { display : none; }
      }
    ]]></>.toString() , style.XHTML);

style.register(<><![CDATA[
      @-moz-document url-prefix("http://dailynews.yahoo.co.jp") {
        body { display : none; }
      }
    ]]></>.toString() , style.XHTML);

style.register(<><![CDATA[
      @-moz-document url-prefix("http://headlines.yahoo.co.jp/") ,
                     url-prefix("http://zasshi.news.yahoo.co.jp/") {
        #sub, .adCt, #contents-header, #uhd, .yjmthproplogoarea, .yjmthloginarea, #subNav, #ynRelatedArticleList, #center1, #ynFreshEye, #ynAffinityList, #ynDetailPageNavigation, #pos-sqb, #ynRelatedTopics, #center2, #bottomNav, #yjPluginAFP01, .yjstdPlug, #footer, #ynRating, #ynSportsMod, #ynSocialBookmark, #ynRelatedBlog, #commentshow, .cptHeaderComment, .cptSort  { display : none !important; };
      }
      .yjmth {
        text-align : left !important;
        position : absolute;
        left  : 10px;
        top   : 0px;
      }
    ]]></>.toString() , style.XHTML);

    */

style.register(<><![CDATA[
      @-moz-document url-prefix("http://reader.livedoor.com/reader/") {
        #header,#ads_top, .adsWrapper, #total_unread_count, #myfeed, #my_menu, #reader_logo { display : none }
        #menu {
          position : absolute !important;
          left : 0px !important;
        }
        #message_box {
          left : 0px !important;
          top  : -6px !important;
        }
      }
    ]]></>.toString() , style.XHTML);


style.register(<><![CDATA[
      @-moz-document url-prefix("http://www.atmarkit.co.jp/") {
        #rightcol, #header, #btm-ttwpjob, .btmlist, #btmRss, #frec, #mailmagForm ,#footer, { display : none; }
      }
    ]]></>.toString() , style.XHTML);

/*
style.register(<><![CDATA[
      @-moz-document url-prefix("http://news.livedoor.com/topics") {
        body { display : none !important; }
      }
    ]]></>.toString() , style.XHTML);
style.register(<><![CDATA[
      @-moz-document url-prefix("http://news.livedoor.com") {
        #functionHeader, #logo, #tagline, #navigation, #aside, #content-nav, #prtextBox, #content-nav, .prtextBox, #article-social-tool, #article-social-comment, #article-breadcrumb, .contentBox, .title-box, #photo-news, #amazon-ranking, #yahoo-shopping, #footer, .relativeword-dl, .section, .keyword-desc, .clearfix, #newsHeader, #subColumn, #newsFooter, #ldFooter, #commonFooter, .gotop, .adsense-newstop, .LDservice-link, #headerBanner, .large-showcase , #become
        { display : none !important; }
        #contentHeader {
          position : absolute;
          top  : -15px;
          left : -240px; -50px;
        }
      }
    ]]></>.toString() , style.XHTML);
*/

style.register(<><![CDATA[
      @-moz-document url-prefix("http://2ch.xn--o9j0bk.gaasuu.com/entry") {
        body { display : none !important; }
      }
    ]]></>.toString() , style.XHTML);





function defineGoogleSearchCommand(names, description , site) {
  shell.add(names , description ,
    function (args, extra) {
	  let words = extra.left;
	  if(site != undefined) {
		  words += " site:" + site;
	  }
      let words = encodeURIComponent(words);
      let url = "http://www.google.co.jp/search?q=" + words + "&ie=utf-8&oe=utf-8";
      gBrowser.loadOneTab(url, null, null, null, extra.bang);
    },
    {
      bang      : true,
      literal   : 0,
      completer : function (args, extra) {
        let engines = [util.suggest.ss.getEngineByName("Google")];
        return completer.fetch.suggest(engines, true)(extra.left || "", extra.whole || "");
      },
    },
    true);
}


defineGoogleSearchCommand(
  ["google"] , 
  M({ja: "Google 検索", en: "Google Search"})
);

key.setGlobalKey('C-s' , function (ev, arg) {
    setTimeout(function() {
        shell.input("google ");
      } , 100);
  }, 'Google word');

key.setGlobalKey(['C-x','C-d'], function (ev, arg) {
    setTimeout(function() {
        shell.input("goodic ");
      } , 100)
}, 'goodic');

key.setGlobalKey('C-j' , function(){
    //noop
  }, 'noop');

/*
defineGoogleSearchCommand(
  ["rubyapi"] , 
  M({ja: "Ruby API 検索", en: "ruby api search"}) , 
  "http://doc.okkez.net/188/"
);
*/

key.setGlobalKey(['C-x','C-r'], function (ev, arg) {
    shell.input("rurema ");
  });
shell.add("rurema" , M({ja: "るりまサーチ", en: "rurema search"}) ,
  function(argx , extra) {
    let list  = extra.left.split(/\s+/)
    let url = "http://doc.ruby-lang.org/ja/search/version:1.9.2/";
    for(let i = 0 ; i < list.length ; i++) {
      url += 'query:' + encodeURIComponent(list[i]) + '/';
    }
    gBrowser.loadOneTab(url, null, null, null, extra.bang);
  },
  {
    bang      : true,
    literal   : 0,
    completer : function (args, extra) {
      let engines = [util.suggest.ss.getEngineByName("Google")];
      return completer.fetch.suggest(engines, true)(extra.left || "", extra.whole || "");
    },
  },
  true);

let ruby_completes = null;
shell.add("refe" , M({ja: "Ruby リファレンス検索", en: "ruby reference search"}) ,
  function (args, extra) {
    function generate_url(word) {
      let site   = "http://doc.okkez.net/188";
      let clazz  = word.split("#")[0];
      let method = word.split("#")[1];
      //let clazz  = word.split("\.")[0];
      //let method = word.split("\.")[1];
      // not match. search by google with site: .
      if(ruby_completes["classes"].indexOf(clazz) == -1) {
        let w = encodeURIComponent(word + " site:" + site);
        return "http://www.google.co.jp/search?q=" + w + "&ie=utf-8&oe=utf-8";
      }
      // no method. open clazz's
      if(method == undefined) {
        return site + "/view/class/" + clazz;
      }
      // try to find clazz's method
      let url = site + "/view/method/" + clazz + "/i/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      // try to find object's method
      url = site + "/view/method/Object/i/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      /*
      // try to find singleton's method
      url = site + "/view/method/" + clazz + "/s/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      // try to find module's method
      url = site + "/view/method/" + clazz + "/m/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      // try to find special method
      url = site + "/view/method/" + clazz + "/v/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      // try to find const
      url = site + "/view/method/" + clazz + "/c/" + encode_method(method);
      if(isAvailable(url)) {
        return url;
      }
      */
      // open clazz's 
      return site + "/view/class/" + clazz;
    }
    function isAvailable(url) {
      var http = new XMLHttpRequest();
      http.open("HEAD" , url , false);
      http.setRequestHeader("accept-language" , "ja");
      http.setRequestHeader("Cache-Control"   , "no-cache");
      http.setRequestHeader("content-type"    , "application/x-www-form-urlencoded");
      http.send();
      return http.status == 200;
    }
    function encode_method(method) {
      return encodeURIComponent(method).replace("%","=");
    }
    // open tab
    let url = generate_url(extra.left)
    gBrowser.loadOneTab(url, null, null, null, extra.bang);
  },
  {
    bang      : true,
    literal   : 0,
    completer : function (args, extra) {
    function get_completes() {
      var http = new XMLHttpRequest();
      http.open("GET" , "http://basyura.org/ruby_completes/1.8.8.txt" , false);
      http.setRequestHeader("accept-language" , "ja");
      http.setRequestHeader("Cache-Control"   , "no-cache");
      http.setRequestHeader("content-type"    , "application/x-www-form-urlencoded");
      http.send();
      return http.responseText;
    }
    if (ruby_completes == null) {
	  //alert("get completes file");
      ruby_completes = eval("(" + get_completes() + ")");
    }
    if(extra.left.indexOf("#") != -1) {
      let clazz = extra.left.split("#")[0];
      let list  = ruby_completes[clazz];
      if(list != undefined) {
            return completer.matcher.substring(list)(extra.left || "");
      }
    }
      return completer.matcher.substring(ruby_completes["classes"])(extra.left || "");
    }
  },
  true
);



shell.add("goodic", M({ja: "Goo 辞書", en: "Goo dic"}),
	function (args, extra) {
		gBrowser.loadOneTab(
			util.format("http://dictionary.goo.ne.jp/search.php?MT=%s&kind=all&mode=0&IE=UTF-8",
	  				    encodeURIComponent(args[0])),
     	null, null, null, extra.bang);
	}, { bang : true });


shell.add("generatefeed", M({ja: "Page2Feed", en: "Page2feed"}),
	function (args, extra) {
		let url = "http://ic.edge.jp/page2feed/preview/"
		if(args.length != 0) {
			url =  + args[0];
		}
		else {
			url += content.document.location.href;
		}
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });

shell.add("twitterAPI", "twitter api",
	function (args, extra) {
		let url = "http://watcher.moe-nifty.com/memo/docs/twitterAPI.txt"
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });

shell.add("javadoc" , "javadoc" ,
	function (args, extra) {
		let url = "http://java.sun.com/j2se/1.5.0/ja/docs/ja/api/";
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });

shell.add("jqueryAPI" , "jqueryAPI" ,
	function (args, extra) {
		let url = "http://semooh.jp/jquery/";
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });


shell.add("railsAPI" , "railsAPI" ,
	function (args, extra) {
		let url = "http://railsapi.com/doc/rails-v3.0.0/";
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });
 


shell.add("keycode" , "keycode" ,
	function (args, extra) {
		let url = "http://www.programming-magic.com/file/20080205232140/keycode_table.html"
    	gBrowser.loadOneTab(url, null, null, null, extra.bang);
	}, { bang : true });

/*
let bookmarks = [
	["twitterAPI" , "http://watcher.moe-nifty.com/memo/docs/twitterAPI.txt"],
	["javadoc"    , "http://java.sun.com/j2se/1.5.0/ja/docs/ja/api/"],
];


for(let i = 0 ; i < bookmarks.length ; i++) {
	shell.add(bookmarks[i][0] , bookmarks[i][0] ,
		function(url) {
			return function() {
				gBrowser.loadOneTab(bookmarks[i][0], null, null, null, extra.bang);
			};
		}(bookmarks[i][1]), { bang : true });
}
					*/

///// Plugin : Site local keymap
plugins.options["site_local_keymap.local_keymap"] = {
	"^http://b.hatena.ne.jp/" : [
		["j" , null],
		["k" , null]
	],
	"^http://smart.fm/" : [
		["j" , null],
		["k" , null]
	],
	"^https://mail.google.com/" : [
		["j" , null],
		["k" , null]
	],
	"^http://mail.google.com/" : [
		["j" , null],
		["k" , null]
	],
	"^http://reader.livedoor.com/reader/" : [
    ["C-d" , function(){}],
    ["C-u" , function(){}],
    ["j"   , null],
    ["ku"  , null],
	],
  "^http://www.slideshare.net/" : [
    ['n', function () ext.exec("slideshare-next")],
    ['p', function () ext.exec("slideshare-previous")],
    ['f', function () ext.exec("slideshare-toggle-fullscreen")]
  ],
}



// 新しいタブで開く
plugins.options["bmany.default_open_type"] = "tab";
key.setViewKey('b', function (ev, arg) {
    ext.exec("bmany-list-all-bookmarks", arg, ev);
}, 'ブックマーク');

/*
key.setViewKey('B', function (ev, arg) {
    ext.exec("bmany-list-bookmarklets", arg, ev);
}, "bmany - ブックマークレットを一覧表示");

key.setViewKey([':', 'k'], function (ev, arg) {
    ext.exec("bmany-list-bookmarks-with-keyword", arg, ev);
}, "bmany - キーワード付きブックマークを一覧表示");
*/

key.setGlobalKey(["C-x", "C-b"], function (ev, arg) {
    ext.exec("list-hateb-items", arg);
}, "はてなブックマークのアイテムを一覧表示", true);

key.setViewKey("c", function (ev, arg) {
    ext.exec("list-hateb-comments", arg);
}, "はてなブックマークのコメントを一覧表示", true);


key.setGlobalKey(['C-x','C-i'] , function (ev, arg) {
    var key = 'qh9hyQwfEL1P'
    var d = content.document;
    var z = d.createElement('script');
    var b = d.body;
    var l = d.location;
    try{
      if(!b) {
        throw(0);
      }
      d.title = '(Saving...) ' + d.title;
      var url = l.protocol + '//www.instapaper.com/j/' + key + '?u=' + 
        encodeURIComponent(l.href) + '&t=' + (new Date().getTime());
      z.setAttribute('src' , url);
      b.appendChild(z);
    }
    catch(e){
      alert('Please wait until the page has loaded. ');
    }
  });

key.setGlobalKey(['C-x','C-i'] , function (ev) {
  ext.exec("ril-append");
}, 'リンクをバックグラウンドで開く Hit a Hint を開始', true);
key.setGlobalKey(['C-x','C-l'] , function (ev) {
  ext.exec("ril-show-reading-list");
}, 'リンクをバックグラウンドで開く Hit a Hint を開始', true);


key.setGlobalKey(['C-x', 'j'], function (ev, arg) {
    ext.exec("JsReferrence-open-prompt", arg, ev);
}, 'JsReferrenceのプロンプトを開く', true);
key.setGlobalKey(['C-x', 'r'], function (ev, arg) {
    ext.exec("JsReferrence-reIndex", arg, ev);
}, 'JsReferrenceののインデックスを作り直す', true);


plugins.options["heaven.dotnet.references"] = [
  { name : "dotnet",
    param : {
      rootDocUrl : "http://msdn.microsoft.com/ja-jp/library/gg145045.aspx"
    }
  }
];

key.setViewKey(['C-x', 'C-n'], function(ev, arg){
    plugins.heavens.dotnet.open();
}, '.NET Documentcを開く');
