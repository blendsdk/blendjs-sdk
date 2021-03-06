var fs = require('fs');
var path = require('path');
require("shelljs/global");
/**
 * Utility class providing an abstraction for various file related operation
 */
Blend.defineClass('FileUtils', {
    singleton: true,
    /**
     * Make sure the path of a file exists. This function will look the dirname
     * of a given string and recursively will create the path
     * @param {type} pth
     * @returns {Boolean}
     */
    ensurePath: function (pth) {
        var folder = path.dirname(pth);
        try {
            mkdir('-p', folder);
            return true;
        } catch (e) {
            Logger.error(e);
            return false;
        }
    },
    /**
     * Encapsulates path.resolve function
     * @returns {unresolved}
     */
    resolve: function () {
        return path.resolve.apply(path, arguments);
    },
    /**
     * Copies a file from src to dest and runs a callback if provided
     * @param {type} src
     * @param {type} dst
     * @param {type} callback
     * @returns {Boolean}
     */
    copyFile: function (src, dst, callback) {
        var me = this;
        src = me.readFile(src);
        if (Blend.isFunction(callback)) {
            src = callback.apply(me, [src, dst]) || src;
        }
        if (me.ensurePath(dst)) {
            me.writeFile(dst, src);
            return true;
        } else {
            return false;
        }
    },
    /**
     * Writes data (string) to a file
     * @param {type} dst
     * @param {type} data
     * @returns {Boolean}
     */
    writeFile: function (dst, data) {
        var me = this;
        if (me.ensurePath(dst)) {
            fs.writeFileSync(dst, data);
            return true;
        } else {
            return false;
        }
    },
    /**
     * Read contents of a file
     * @param {type} src
     * @returns {readFile}
     */
    readFile: function (src) {
        return fs.readFileSync(src);
    },
    /**
     * Check if a file or directory is empty synchronously
     * @source https://github.com/codexar/npm-extfs/blob/master/extfs.js
     * @param {string} searchPath
     */
    isFolderEmpty: function (searchPath) {
        try {
            var stat = fs.statSync(searchPath);
        } catch (e) {
            return true;
        }
        if (stat.isDirectory()) {
            var items = fs.readdirSync(searchPath);
            return !items || !items.length;
        }
        var file = fs.readFileSync(searchPath);
        return !file || !file.length;
    },
    fileExists: function (file) {
        try {
            var stat = fs.statSync(file);
            return stat.isFile();
        } catch (e) {
            return false;
        }
    },
    folderExists: function (folder) {
        try {
            var stat = fs.statSync(folder);
            return stat.isDirectory();
        } catch (e) {
            return false;
        }
    },
    listDir: function () {
        return fs.readdirSync.apply(fs, arguments);
    },
    mkdir: function () {
        return mkdir.apply(mkdir, arguments);
    },
    dirname: function () {
        return path.dirname.apply(path, arguments);
    },
    rm: function () {
        return rm.apply(rm, arguments);
    },
    basename: function () {
        return path.basename.apply(path, arguments);
    },
    extension: function () {
        return path.extname.apply(path, arguments);
    }
});