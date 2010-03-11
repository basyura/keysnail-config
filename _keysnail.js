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
    command.yank(aEvent);
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
