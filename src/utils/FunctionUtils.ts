export class FunctionUtils {

    private static STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    private static ARGUMENT_NAMES = /([^\s,]+)/g;

    public static getParametersNames(func) {
        var fnStr = func.toString().replace(FunctionUtils.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(FunctionUtils.ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    };
}