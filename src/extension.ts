import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('おめでとうございます、あなたの拡張機能 "vscode-fate-summoning" が現在アクティブです！');

    const servantClasses = {
        'セイバー': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/saber1.jpg',
        'アーチャー': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/archer1.jpg',
        'ランサー': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/lancer1.jpg',
        'ライダー': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/rider1.jpg',
        'キャスター': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/caster1.jpg',
        'アサシン': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/assassin1.jpg',
        'バーサーカー': 'https://huggingface.co/datasets/MakiAi/IconAssets/resolve/main/Fate/berserker1.jpg'
    };

    const noblePhantasms = [
        '対人宝具', '対軍宝具', '対城宝具', '対界宝具', '特殊宝具'
    ];

    function getWebviewContent(servantClass: keyof typeof servantClasses, noblePhantasm: string) {
        return `<!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;500;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: "Kaisei Decol", system-ui;
                    text-align: center;
                    background-color: #f0f0f0;
                    padding: 20px;
                }
                h1 {
                    color: #4a4a4a;
                    font-weight: 700;
                    font-size: 28px;
                    margin-bottom: 20px;
                }
                img {
                    max-width: 300px;
                    margin: 20px 0;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                p {
                    font-size: 18px;
                    color: #666;
                    margin: 10px 0;
                }
                .servant-class {
                    font-weight: 500;
                    color: #e74c3c;
                }
                .noble-phantasm {
                    font-weight: 500;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <h1>サーヴァント召喚結果</h1>
            <img src="${servantClasses[servantClass]}" alt="${servantClass}" />
            <p>あなたが召喚したサーヴァントのクラスは<span class="servant-class">${servantClass}</span>です。</p>
            <p>このサーヴァントの宝具は<span class="noble-phantasm">${noblePhantasm}</span>です。</p>
        </body>
        </html>`;
    }

    const disposable = vscode.commands.registerCommand('vscode-fate-summoning.summonServant', async () => {
        const servantClassCandidates = Object.keys(servantClasses) as (keyof typeof servantClasses)[];
        const servantClass = servantClassCandidates[Math.floor(Math.random() * servantClassCandidates.length)];
        const noblePhantasm = noblePhantasms[Math.floor(Math.random() * noblePhantasms.length)];

        const masterName = await vscode.window.showInputBox({
            title: 'マスターの名前を入力してください'
        });

        if (masterName !== undefined) {
            const panel = vscode.window.createWebviewPanel(
                'servantSummoning',
                `${masterName}のサーヴァント召喚結果`,
                vscode.ViewColumn.One,
                {}
            );

            panel.webview.html = getWebviewContent(servantClass, noblePhantasm);
            vscode.window.showInformationMessage(`${masterName}さん、${servantClass}クラスのサーヴァントを召喚しました！`);
        } else {
            vscode.window.showInformationMessage(`匿名のマスター、${servantClass}クラスのサーヴァントを召喚しました！`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
