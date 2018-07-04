'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.setWorkspaceTheme', () => {
        // find all themes
        const themeArrays = vscode.extensions.all
            .map(e => e.packageJSON.contributes)
            .filter(e =>{return !!(e && e.themes)})
            .map(e=>e.themes)
        const themes = [].concat(...themeArrays) as any[]
        // show all themes
        const options = themes.map(theme=>theme.label)
        const reset = 'Restore Default Theme'
        options.unshift(reset)
        vscode.window.showQuickPick(options, {
            placeHolder: 'Select a theme for this workspace'
        })
            .then(
                item => {
                    // handle selection
                    const workbenchConfig = vscode.workspace.getConfiguration()
                    if(item == reset) {
                        workbenchConfig.update('workbench.colorTheme', undefined)
                        // vscode.window.showInformationMessage('Workspace theme set to default')
                    } else {
                        workbenchConfig.update('workbench.colorTheme', item)
                        // vscode.window.showInformationMessage('Selected workspace theme: ' + item)
                    }
                }, 
                error => {
                    vscode.window.showErrorMessage('Could not set workspace theme ' + error)
                }
            )
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}