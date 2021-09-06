//Channel Access Token
var access_token = "*****";

/**
 * reply_tokenを使ってreplyする
 */
function reply(data) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + access_token,
  };

  if (data.events[0].message.text == "シフト教えて！") {
    var start_message = [
      "今後のシフトはこんな感じ！",
      "いいよ〜",
      "こんな感じかな",
      "どうぞ〜",
    ];
    var rand_int = Math.floor(Math.random() * start_message.length);
    reply_message = getCalendar(
      start_message[rand_int] + "\n----------------\n"
    ); //返信
  }

  var postData = {
    replyToken: data.events[0].replyToken,
    messages: [
      {
        type: "text",
        text: reply_message, //　返信するメッセージ
      },
    ],
  };

  var options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData),
  };

  return UrlFetchApp.fetch(url, options);
}

// 返信用に予定データを整える
function TimeDataProcessing(start, end) {
  var date = Utilities.formatDate(start, "JST", "yyyy/MM/dd"); // 日付
  var week = ["日", "月", "火", "水", "木", "金", "土"];
  var day_of_week = week[start.getDay()]; // 曜日
  var start_time = Utilities.formatDate(start, "JST", "HH:mm"); // 開始時間
  var end_time = Utilities.formatDate(end, "JST", "HH:mm"); // 終了時間
  return date + "(" + day_of_week + ")" + " " + start_time + "-" + end_time;
}

// カレンダーから予定を取得しメッセージとして返す
function getCalendar(message) {
  const id = "*****@gmail.com";
  const calendar = CalendarApp.getCalendarById(id);
  const startDate = new Date();
  // 予定を取得する期間
  const endDate = new Date(Date.parse(startDate) + 30 * 60 * 60 * 24 * 1000);
  // 予定をGoogleカレンダーから取得
  const events = calendar.getEvents(startDate, endDate);

  for ([i, event] of events.entries()) {
    var event_title = event.getTitle();
    var time = TimeDataProcessing(event.getStartTime(), event.getEndTime());
    if (i == events.length - 1) {
      message += event_title + "\n" + time + "\n";
    } else {
      message += event_title + "\n" + time + "\n";
    }
  }
  return message;
}

// POST送信されたデータをGASで受信するイベントハンドラ
function doPost(e) {
  // JSON文字列をGASが取り扱える形式に解析(JSONをパースする)
  var json = JSON.parse(e.postData.contents);
  // 返信する
  reply(json);
}
