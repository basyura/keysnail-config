// ========================== KeySnail Init File =========================== //

// この領域は, GUI により設定ファイルを生成した際にも引き継がれます
// 特殊キー, キーバインド定義, フック, ブラックリスト以外のコードは, この中に書くようにして下さい
// ========================================================================= //
//{{%PRESERVE%
//}}%PRESERVE%
// ========================================================================= //

// ========================= Special key settings ========================== //

key.quitKey              = "C-g";
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

hook.setHook('KeyBoardQuit', function (aEvent) {
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
});



// ============================== Black list =============================== //

hook.addToHook("LocationChange", function (aNsURI) {
    var URL = aNsURI ? aNsURI.spec : null;
    key.suspendWhenMatched(URL, key.blackList);
});

key.blackList = [
    'http://b.hatena.ne.jp/basyura/*',
    'http://smart.fm/*'
];

// ============================= Key bindings ============================== //

key.setGlobalKey('C-f', function () {
    getBrowser().mTabContainer.advanceSelectedTab(1, true);
}, 'ひとつ右のタブへ');

key.setGlobalKey('C-d', function (ev, arg) {
    for (var i = 0; i < 8; i++) {
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_DOWN, true);
    }
}, 'down');

key.setGlobalKey('C-u', function (ev, arg) {
    for (var i = 0; i < 8; i++) {
        key.generateKey(ev.originalTarget, KeyEvent.DOM_VK_UP, true);
    }
}, 'up');

key.setGlobalKey('C-.', function () {
    userscript.reload();
}, '設定ファイルを再読み込み');

key.setGlobalKey('C-w', function (ev) {
    getBrowser().removeTab(getBrowser().selectedTab);
}, 'タブ / ウィンドウを閉じる');

key.setGlobalKey('C-n', function () {
    command.iSearchForward();
}, 'インクリメンタル検索', true);

key.setGlobalKey('C-b', function () {
    getBrowser().mTabContainer.advanceSelectedTab(-1, true);
}, 'ひとつ左のタブへ');

key.setGlobalKey('C-p', function () {
    command.iSearchBackward();
}, '逆方向インクリメンタル検索', true);

key.setGlobalKey('M-:', function () {
    command.interpreter();
}, 'コマンドインタプリタ');

key.setViewKey('j', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_DOWN, true);
}, '一行スクロールダウン');

key.setViewKey('k', function (aEvent) {
    key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_UP, true);
}, '一行スクロールアップ');

key.setViewKey(['g', 'g'], function () {
    goDoCommand("cmd_scrollTop");
}, 'ページ先頭へ移動');

key.setViewKey('G', function () {
    goDoCommand("cmd_scrollBottom");
}, 'ページ末尾へ移動');

key.setViewKey('e', function (aEvent, aArg) {
    ext.exec("hok-start-foreground-mode", aArg);
}, 'Hit a Hint を開始', true);

key.setEditKey('C-h', function () {
    goDoCommand("cmd_deleteCharBackward");
}, '前の一文字を削除');

key.setEditKey('C-c', function (aEvent) {
    command.copyRegion(aEvent);
}, '選択中のテキストをコピー');

key.setViewKey('C-c', function () {
    goDoCommand("cmd_copy");
}, '選択中のテキストをコピー');


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

key.setGlobalKey('C-r', function () {
    BrowserReload();
}, '更新');


plugins.options["zou_search.user"] = "basyura";

key.setViewKey(':', function () {
    shell.input();
}, 'Command System');

key.setViewKey("t",
    function (ev, arg) {
        ext.exec("twitter-client-display-timeline", arg);
    }, "TL を表示", true);



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

function defineGoogleSearchCommand(names, description , site) {
  shell.add(names , description ,
    function (args, extra) {
      let words = encodeURIComponent(extra.left + " site:" + site);
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

/*
defineGoogleSearchCommand(
  ["rubyapi"] , 
  M({ja: "Ruby API 検索", en: "ruby api search"}) , 
  "http://doc.okkez.net/188/"
);
*/






let ruby_completes = [
"ARGF","Array","Bignum","Binding","Class","Comparable","Continuation","Data","Dir",
"ENV","Enumerable","Enumerator","Errno","FalseClass",
"File","File::Constants","File::Stat","FileTest","Fixnum","Float","GC","Hash","IO","Integer",
"Kernel","Marshal","MatchData","Math","Method","Module","NilClass","Numeric","Object",
"ObjectSpace","Precision","Proc","Process","Process::GID","Process::Status",
"Process::Sys","Process::UID","Range","Regexp","Signal",
"String","Struct","Struct::Tms","Symbol","Thread","ThreadGroup","Time","TrueClass",
"UnboundMethod","ArgumentError","EOFError","Errno::E2BIG","Errno::EACCES","Errno::EADDRINUSE",
"Errno::EADDRNOTAVAIL","Errno::EADV","Errno::EAFNOSUPPORT","Errno::EAGAIN","Errno::EALREADY",
"Errno::EBADE","Errno::EBADF","Errno::EBADFD","Errno::EBADMSG","Errno::EBADR","Errno::EBADRQC",
"Errno::EBADSLT","Errno::EBFONT","Errno::EBUSY","Errno::ECHILD","Errno::ECHRNG","Errno::ECOMM",
"Errno::ECONNABORTED","Errno::ECONNREFUSED","Errno::ECONNRESET","Errno::EDEADLK","Errno::EDEADLOCK",
"Errno::EDESTADDRREQ","Errno::EDOM","Errno::EDOTDOT","Errno::EDQUOT","Errno::EEXIST","Errno::EFAULT",
"Errno::EFBIG","Errno::EHOSTDOWN","Errno::EHOSTUNREACH","Errno::EIDRM","Errno::EILSEQ",
"Errno::EINPROGRESS","Errno::EINTR","Errno::EINVAL","Errno::EIO","Errno::EISCONN","Errno::EISDIR",
"Errno::EISNAM","Errno::EL2HLT","Errno::EL2NSYNC","Errno::EL3HLT","Errno::EL3RST","Errno::ELIBACC",
"Errno::ELIBBAD","Errno::ELIBEXEC","Errno::ELIBMAX","Errno::ELIBSCN","Errno::ELNRNG","Errno::ELOOP",
"Errno::EMFILE","Errno::EMLINK","Errno::EMSGSIZE","Errno::EMULTIHOP","Errno::ENAMETOOLONG",
"Errno::ENAVAIL","Errno::ENETDOWN","Errno::ENETRESET","Errno::ENETUNREACH","Errno::ENFILE",
"Errno::ENOANO","Errno::ENOBUFS","Errno::ENOCSI","Errno::ENODATA","Errno::ENODEV","Errno::ENOENT",
"Errno::ENOEXEC","Errno::ENOLCK","Errno::ENOLINK","Errno::ENOMEM","Errno::ENOMSG","Errno::ENONET",
"Errno::ENOPKG","Errno::ENOPROTOOPT","Errno::ENOSPC","Errno::ENOSR","Errno::ENOSTR","Errno::ENOSYS",
"Errno::ENOTBLK","Errno::ENOTCONN","Errno::ENOTDIR","Errno::ENOTEMPTY","Errno::ENOTNAM","Errno::ENOTSOCK",
"Errno::ENOTTY","Errno::ENOTUNIQ","Errno::ENXIO","Errno::EOPNOTSUPP","Errno::EOVERFLOW","Errno::EPERM",
"Errno::EPFNOSUPPORT","Errno::EPIPE","Errno::EPROTO","Errno::EPROTONOSUPPORT","Errno::EPROTOTYPE",
"Errno::ERANGE","Errno::EREMCHG","Errno::EREMOTE","Errno::EREMOTEIO","Errno::ERESTART","Errno::EROFS",
"Errno::ERROR","Errno::ESHUTDOWN","Errno::ESOCKTNOSUPPORT","Errno::ESPIPE","Errno::ESRCH","Errno::ESRMNT",
"Errno::ESTALE","Errno::ESTRPIPE","Errno::ETIME","Errno::ETIMEDOUT","Errno::ETOOMANYREFS",
"Errno::ETXTBSY","Errno::EUCLEAN","Errno::EUNATCH","Errno::EUSERS","Errno::EWOULDBLOCK","Errno::EXDEV",
"Errno::EXFULL","Errno::EXXX","Exception","FloatDomainError","IOError","IndexError","Interrupt",
"LoadError","LocalJumpError","NameError","NoMemoryError","NoMethodError","NotImplementedError",
"RangeError","RegexpError","RuntimeError","ScriptError","SecurityError","SignalException",
"StandardError","StopIteration","SyntaxError","SystemCallError","SystemExit","SystemStackError",
"ThreadError","TypeError","ZeroDivisionError","fatal"];

shell.add("rubyapi" , M({ja: "Ruby API 検索", en: "ruby api search"}) ,
    function (args, extra) {
      let site = "http://doc.okkez.net/188";
      for(let i = 0 ; i < ruby_completes.length ; i++) {
        if(ruby_completes[i] == extra.left) {
          let url = site + "/view/class/" + extra.left;
          gBrowser.loadOneTab(url, null, null, null, extra.bang);
          return;
        }
      }
      let words = encodeURIComponent(extra.left + " site:" + site);
      let url = "http://www.google.co.jp/search?q=" + words + "&ie=utf-8&oe=utf-8";
      gBrowser.loadOneTab(url, null, null, null, extra.bang);
    },
    {
      bang      : true,
      literal   : 0,
      completer : function (args, extra) {
        return completer.matcher.substring(ruby_completes)(extra.left || "");
      }
    },
  true
);

