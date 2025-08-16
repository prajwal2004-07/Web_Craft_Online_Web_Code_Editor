let htmlEditor, cssEditor, jsEditor;

function initializeEditors() {
    // Initialize CodeMirror for HTML
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-code'), {
        mode: 'xml',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseTags: true,
        matchTags: true
    });

    // Initialize CodeMirror for CSS
    cssEditor = CodeMirror.fromTextArea(document.getElementById('css-code'), {
        mode: 'css',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true
    });

    // Initialize CodeMirror for JavaScript
    jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true
    });

    // Load saved code or set default "Hello World" code
    const savedHtml = localStorage.getItem('htmlCode') || '<h1>Hello, World!</h1>\n<p>Welcome to the Code Editor!</p>';
    const savedCss = localStorage.getItem('cssCode') || 'h1 { color: blue; }\np { font-size: 16px; }';
    const savedJs = localStorage.getItem('jsCode') || 'console.log("Hello, World!");';
    
    htmlEditor.setValue(savedHtml);
    cssEditor.setValue(savedCss);
    jsEditor.setValue(savedJs);

    // Save code to local storage on change
    htmlEditor.on('change', () => {
        localStorage.setItem('htmlCode', htmlEditor.getValue());
        run();
    });
    cssEditor.on('change', () => {
        localStorage.setItem('cssCode', cssEditor.getValue());
        run();
    });
    jsEditor.on('change', () => {
        localStorage.setItem('jsCode', jsEditor.getValue());
        run();
    });
}

function run() {
    let output = document.getElementById('output');
    output.contentDocument.body.innerHTML = htmlEditor.getValue() + "<style>" + cssEditor.getValue() + "</style>";
    output.contentWindow.eval(jsEditor.getValue());
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function downloadCode() {
    const htmlContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    const jsContent = jsEditor.getValue();
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Code</title>
    <style>${cssContent}</style>
</head>
<body>
    ${htmlContent}
    <script>${jsContent}</script>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
}

// Load theme from local storage
window.onload = () => {
    initializeEditors();
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    run(); // Initial run to display preloaded code
};

// Before unload warning
window.addEventListener('beforeunload', function (e) {
    let message = "Are you sure you want to leave? Your code is saved in local storage.";
    e.returnValue = message;
});