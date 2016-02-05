var constants_1 = require("../initializers/constants");
var _ = require('lodash');
var table_1 = require("../models/table");
//
// 生のデータをtitle, row, columnの指定によって階層化する。
// メタデータyear, area, gender以外の生テーブル名時に、
// 動作がかわる。
// 生テーブルは同時に2つ指定できない（お互いにつながりをもたないため）
//
function group(params) {
    var title = params.title, column = params.column, row = params.row, table = params.table, data = params.data;
    var titleMap = detectKeyMap(title);
    var columnMap = detectKeyMap(column);
    var rowMap = detectKeyMap(row);
    var tableMap = detectKeyMap(table);
    // 率の計算と、値をオブジェクト化
    _.each(data, function (raw) {
        var total = _.reduce(tableMap, function (a, _a) {
            var key = _a.key;
            return a + raw[key];
        }, 0);
        _.each(tableMap, function (_a) {
            var key = _a.key;
            raw[key] = {
                src: raw,
                number: raw[key],
                par: par(raw[key], total)
            };
        });
    });
    // タイトルごとにまとめる
    var titleGrouped = {};
    _.each(data, function (d) {
        _.each(titleMap, function (_a) {
            var key = _a.key, name = _a.name;
            var content = d.number;
            if (constants_1.default.isIncludedTable(title)) {
                content = d[key];
            }
            else {
                if (d[title].content != key) {
                    return;
                }
            }
            var store = findOrCreate(titleGrouped, key, []);
            var year = d.year, gender = d.gender, area = d.area;
            store.push({ year: year, gender: gender, area: area, data: d, content: content });
        });
    });
    // タイトルごとにまとめられたデータを、rowごちのまとめる。
    var rowGroped = {};
    _.each(titleGrouped, function (dataList, key) {
        var store = findOrCreate(rowGroped, key, {});
        _.each(dataList, function (d) {
            if (constants_1.default.isIncludedTable(row)) {
                _.each(rowMap, function (_a) {
                    var key = _a.key, name = _a.name;
                    var s = findOrCreate(store, key, []);
                    var year = d.year, gender = d.gender, area = d.area, data = d.data;
                    var content = data[key];
                    s.push({ year: year, gender: gender, area: area, data: data, content: content });
                });
            }
            else {
                var s = findOrCreate(store, d[row].content, []);
                s.push(d);
            }
        });
    });
    console.log({ rowGroped: rowGroped });
    return rowGroped;
}
//
// 生のデータをTable[]形式に変換
//
function normalize(params) {
    var title = params.title, column = params.column, row = params.row, table = params.table, data = params.data;
    if (!data || !data.length) {
        return [];
    }
    var grouped = group(params);
    var titleMap = detectKeyMap(title);
    var columnMap = detectKeyMap(column);
    var rowMap = detectKeyMap(row);
    var tableMap = detectKeyMap(table);
    var chartDataListStore = {};
    _.each(titleMap, function (_a) {
        var key = _a.key, name = _a.name;
        var store = findOrCreate(chartDataListStore, key, { table: new table_1.default(name) });
        var titleData = grouped[key];
        //console.log({titleData})
        if (!titleData) {
            return;
        }
        var existColumn = {};
        _.each(rowMap, function (_a) {
            var key = _a.key, name = _a.name;
            var raw = titleData[key];
            if (!raw) {
                return;
            }
            var groupedRaw;
            if (!constants_1.default.isIncludedTable(column)) {
                groupedRaw = _.groupBy(raw, function (r) { return r[column].content; });
            }
            var rowData = {};
            _.each(columnMap, function (_a) {
                var key = _a.key, name = _a.name;
                var content;
                if (constants_1.default.isIncludedTable(column)) {
                    existColumn[key] = true;
                    content = raw[0].data[key];
                }
                else {
                    if (!groupedRaw[key]) {
                        return;
                    }
                    existColumn[key] = true;
                    content = groupedRaw[key][0].content;
                }
                rowData[key] = content;
            });
            store.table.addRow(name, rowData);
        });
        var columnNames = {};
        _.each(columnMap, function (_a) {
            var key = _a.key, name = _a.name;
            if (existColumn[key]) {
                columnNames[key] = { key: key, name: name };
            }
        });
        store.table.column = columnNames;
    });
    //chartDataListStore = _.map(chartDataListStore, (v, k)=> v);
    //_.map(chartDataListStore, (c)=> console.log(c));
    return _.map(chartDataListStore, function (v, k) { return v.table; });
}
exports.normalize = normalize;
//
// dataのkeyとname対応を取得する
//
function detectKeyMap(title) {
    return detectTableKeyMap(title) || detectSplitterMap(title);
}
function detectTableKeyMap(table) {
    return constants_1.default[(table + "Props")];
}
function detectSplitterMap(split) {
    return constants_1.default.splitters[split];
}
//
// オブジェクト内にkeyプロパティが存在する場合はそれを、
// 存在しない場合はinitialを挿入してそれを返す。
//
function findOrCreate(hash, key, initial) {
    if (!hash[key]) {
        hash[key.toString()] = initial;
    }
    return hash[key];
}
//
// 率の計算
//
function par(n, total) {
    return Math.round(n / total * 1000) / 10;
}
//# sourceMappingURL=normalizer.js.map