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
    // キーシーケンス入力中なら無視
    if (key.currentKeySequence.length)
        return;

    // 検索バーを閉じる    
    command.closeFindBar();

    if (util.isCaretEnabled())
    {
        let marked = aEvent.originalTarget.ksMarked;
        let type = typeof marked;
        if (type === "number" || type === "boolean" && marked)
        {
            // マークされてるときは、マークの解除だけ
            command.resetMark(aEvent);
        }
        else
        {
            // それ以外はフォーカスをコンテンツへ
            let elem = document.commandDispatcher.focusedElement;
            if (elem) elem.blur();
            gBrowser.focus();
            _content.focus();
        }
    }
    else
    {
        // テキスト編集してなければ選択の解除だけ
        goDoCommand("cmd_selectNone");
    }
    
    // ブラウザ画面なら ESC キーイベントも投げておく
    if (KeySnail.windowType == "navigator:browser")
        key.generateKey(aEvent.originalTarget, KeyEvent.DOM_VK_ESCAPE, true);
});

// ============================= Key bindings ============================== //

key.setGlobalKey('C-l', function page_focus() {
    gBrowser.focus();
    _content.focus();
}, 'フォーカスを元に戻す');

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

key.setGlobalKey(['C-x', 'C-s'], function () {
    userscript.reload();
}, '設定ファイルを再読み込み');

key.setGlobalKey(['C-x', 'C-f'], function (ev) {
    var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
    var mainWindow = wm.getMostRecentWindow("navigator:browser");
    mainWindow.getFindBar().openFindBar();
}, '検索バー');

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

key.setGlobalKey('C-g', function () {
    getBrowser().focus();
}, 'BODYへフォーカス', true);

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

key.setEditKey('C-h', function () {
    goDoCommand("cmd_deleteCharBackward");
}, '前の一文字を削除');
