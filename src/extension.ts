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
        const options = themes.map(function(theme) {
            return {
                id: theme.id ? theme.id : theme.label,
                label: theme.label
            }
        })
        const reset = { id: 'reset', label: 'Restore Default Theme' }
        options.unshift(reset)

        let timeout: ReturnType<typeof setTimeout>;

        //remember theme before opening theme chooser
        const workbenchConfig = vscode.workspace.getConfiguration()
        const originalTheme = workbenchConfig.get('workbench.colorTheme')

        const setWorkspaceTheme = function (item: any)
        {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                //handle cancel/escape
                if(item == undefined)
                {
                    workbenchConfig.update('workbench.colorTheme', originalTheme);
                    return;
                }

                // handle selection
                if(item.id == 'reset') {
                    workbenchConfig.update('workbench.colorTheme', undefined)
                    // vscode.window.showInformationMessage('Workspace theme set to default')
                } else {
                    workbenchConfig.update('workbench.colorTheme', item.id)
                    // vscode.window.showInformationMessage('Selected workspace theme: ' + item)
                }
            }, 500);
        }

        vscode.window.showQuickPick(options, {
            placeHolder: 'Select a theme for this workspace',
            onDidSelectItem: setWorkspaceTheme
        })
            .then(
                setWorkspaceTheme,
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