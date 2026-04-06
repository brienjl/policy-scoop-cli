export function textColor(color, text) {
    const error = '\x1b[31m';   // 'error'   red
    const success = '\x1b[32m'; // 'success' green
    const warning = '\x1b[33m'; // 'warning' yellow
    const info = '\x1b[34m';    // 'info'    blue
    const resetColor = '\x1b[0m';

    switch (color) {
        case 'error':
            return `${error}${text}${resetColor}`;
        case 'success':
            return `${success}${text}${resetColor}`;
        case 'warning':
            return `${warning}${text}${resetColor}`;
        case 'info':
            return `${info}${text}${resetColor}`;
        default:
            return text;
    }
}