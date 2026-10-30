const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

// 今月の開始日・終了日

const today = new Date();

const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

function toDateInput(date) {

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

let allHistory = [];

document.getElementById("result").innerHTML = `

<style>

.history-section {

    margin-top: 24px;

    text-align: left;

}

.history-table-wrap {

    overflow-x: auto;

    width: 100%;

}

.history-table {

    border-collapse: collapse;

    width: 100%;

    min-width: 560px;

    font-size: 13px;

}

.history-table th,

.history-table td {

    border: 1px solid #ddd;

    padding: 8px 6px;

    text-align: center;

    white-space: nowrap;

}

.history-table th {

    background: #f2f2f2;

}

.history-table tr:nth-child(even) {

    background: #fafafa;

}

.date-controls {

    text-align: left;

    margin-top: 16px;

}

.date-controls input {

    padding: 8px;

    margin: 5px 0 12px;

    width: 100%;

    box-sizing: border-box;

}

.date-controls button {

    width: 100%;

    padding: 12px;

    margin-top: 5px;

}

.history-total {

    font-weight: bold;

    margin: 10px 0;

}

</style>

<div class="history-section">

    <h2>期間指定</h2>

    <div class="date-controls">

        <label>開始日</label>

        <input type="date" id="startDate"

            value="${toDateInput(firstDay)}">

        <label>終了日</label>

        <input type="date" id="endDate"

            value="${toDateInput(lastDay)}">

        <button onclick="searchHistory()">

            集計・検索

        </button>

    </div>

</div>

<div id="summaryArea">

    集計データを取得しています...

</div>

<div id="historyArea"></div>

`;

loadHistory();

function loadHistory() {

    fetch(GAS_URL, {

        method: "POST",

        mode: "cors",

        body: JSON.stringify({

            action: "getLessonHistoryList",

            staffToken: localStorage.getItem("nikeal_staff_token")

        })

    })

    .then(response => response.text())

    .then(text => {

        const history = JSON.parse(text);

        if (!Array.isArray(history)) {

            throw new Error("履歴データの形式が正しくありません。");

        }

        allHistory = history;

        searchHistory();

    })

    .catch(error => {

        console.error(error);

        document.getElementById("summaryArea").innerHTML =

            "通信エラー：" + escapeHtml(error.message);

    });

}

// HTML表示用の文字エスケープ

function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, function(char) {

        return {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"

        }[char];

    });

}

// 日付を比較できる形式にする

function normalizeDate(value) {

    if (!value) return "";

    return String(value)

        .replace(/\//g, "-")

        .substring(0, 10);

}

// 金額表示

function yen(value) {

    return Number(value || 0).toLocaleString("ja-JP") + "円";

}

// 期間で絞り込む

function searchHistory() {

    const start = document.getElementById("startDate").value;

    const end = document.getElementById("endDate").value;

    if (start && end && start > end) {

        alert("終了日は開始日以降にしてください。");

        return;

    }

    const filtered = allHistory.filter(record => {

        const date = normalizeDate(record.date);

        if (!date) return false;

        if (start && date < start) return false;

        if (end && date > end) return false;

        return true;

    });

    displaySummary(filtered);

    displayHistory(filtered);

}

// 支払い方法を判定

function getPaymentType(method) {

    const value = String(method || "").trim();

    if (value === "ポイント") return "point";

    if (value === "キャッシュ" || value === "現金") return "cash";

    if (value === "月謝") return "monthly";

    return "other";

}

// 集計

function displaySummary(history) {

    const lessonGroups = {};

    const monthlyGroups = {};

    history.forEach(record => {

        const lessonName = record.lessonName || "未設定";

        const teacher = record.teacher || "未設定";

        const type = getPaymentType(record.paymentMethod);

        const key = JSON.stringify([lessonName, teacher]);

        if (type === "point" || type === "cash") {

            if (!lessonGroups[key]) {

                lessonGroups[key] = {

                    lessonName,

                    teacher,

                    pointCount: 0,

                    pointTotal: 0,

                    cashCount: 0,

                    cashTotal: 0

                };

            }

            const group = lessonGroups[key];

            if (type === "point") {

                group.pointCount++;

                group.pointTotal += Number(record.pointCost || 0);

            }

            if (type === "cash") {

                group.cashCount++;

                group.cashTotal += Number(record.cashPrice || 0);

            }

        }

        if (type === "monthly") {

            if (!monthlyGroups[key]) {

                monthlyGroups[key] = {

                    lessonName,

                    teacher,

                    dates: new Set(),

                    usageCount: 0,

                    total: 0

                };

            }

            const group = monthlyGroups[key];

            group.dates.add(normalizeDate(record.date));

            group.usageCount++;

            group.total += Number(record.cashPrice || 0);

        }

    });

    const lessonRows = Object.values(lessonGroups);

    const monthlyRows = Object.values(monthlyGroups);

    let html = `

        <div class="history-section">

            <h2>レッスン集計</h2>

            <div class="history-table-wrap">

            <table class="history-table">

                <tr>

                    <th>レッスン・担当</th>

                    <th>P回数</th>

                    <th>P合計</th>

                    <th>現金回数</th>

                    <th>現金合計</th>

                </tr>

    `;

    if (lessonRows.length === 0) {

        html += `<tr><td colspan="5">該当データなし</td></tr>`;

    }

    lessonRows.forEach(group => {

        html += `

            <tr>

                <td>${escapeHtml(group.lessonName)}<br>

                    ${escapeHtml(group.teacher)}</td>

                <td>${group.pointCount}回</td>

                <td>${group.pointTotal}pt</td>

                <td>${group.cashCount}回</td>

                <td>${yen(group.cashTotal)}</td>

            </tr>

        `;

    });

    html += `

            </table>

            </div>

        </div>

        <div class="history-section">

            <h2>月謝クラス集計</h2>

            <div class="history-table-wrap">

            <table class="history-table">

                <tr>

                    <th>クラス・担当</th>

                    <th>レッスン回数</th>

                    <th>利用件数</th>

                    <th>月謝合計</th>

                </tr>

    `;

    if (monthlyRows.length === 0) {

        html += `<tr><td colspan="4">該当データなし</td></tr>`;

    }

    monthlyRows.forEach(group => {

        html += `

            <tr>

                <td>${escapeHtml(group.lessonName)}<br>

                    ${escapeHtml(group.teacher)}</td>

                <td>${group.dates.size}回</td>

                <td>${group.usageCount}件</td>

                <td>${yen(group.total)}</td>

            </tr>

        `;

    });

    html += `

            </table>

            </div>

        </div>

    `;

    document.getElementById("summaryArea").innerHTML = html;

}

// 履歴一覧

function displayHistory(history) {

    let html = `

        <div class="history-section">

            <h2>レッスン履歴一覧</h2>

            <p>表示件数：${history.length}件</p>

            <div class="history-table-wrap">

            <table class="history-table">

                <tr>

                    <th>日付</th>

                    <th>会員</th>

                    <th>レッスン</th>

                    <th>担当</th>

                    <th>支払方法</th>

                    <th>金額</th>

                </tr>

    `;

    if (history.length === 0) {

        html += `<tr><td colspan="6">該当する履歴はありません。</td></tr>`;

    }

    history.forEach(record => {

        const type = getPaymentType(record.paymentMethod);

        let amount = "";

        if (type === "point") {

            amount = `${Number(record.pointCost || 0)}pt`;

        } else {

            amount = yen(record.cashPrice);

        }

        html += `

            <tr>

                <td>${escapeHtml(record.date)}</td>

                <td>${escapeHtml(record.memberName)}</td>

                <td>${escapeHtml(record.lessonName)}</td>

                <td>${escapeHtml(record.teacher)}</td>

                <td>${escapeHtml(record.paymentMethod)}</td>

                <td>${amount}</td>

            </tr>

        `;

    });

    html += `

            </table>

            </div>

        </div>

    `;

    document.getElementById("historyArea").innerHTML = html;

}

