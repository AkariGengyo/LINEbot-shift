//Channel Access Token
var access_token =
  "lV8S2FjgWF0aN+82iGpYdSZ4Rs7vj9K4ieiCutY5iUsqE8NvRumWS3+Yx4ReNjkhiMMCC3y6qI3D9UJ3cxF0LiN/8qs+vZnlN5UblOTq4wc0omGJsloIMhQ5ZwDjJe/3bYJJwkegkjHCdMBvU5zXPwdB04t89/1O/w1cDnyilFU=";

/**
 * reply_tokenを使ってreplyする
 */
function reply(data) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + access_token,
  };
  var j = [{ type: "text", text: "peach" }];
  console.log("j", j);
  console.log("makeCalendar()", makeCalendar());
  if (data.events[0].message.text == "シフト教えて！") {
    reply_message = getCalendar(); // テキストで返信する日程
  }

  var postData = {
    replyToken: data.events[0].replyToken,
    messages: [
      {
        type: "flex",
        altText: "This is a Flex Message",
        contents: {
          type: "bubble",
          styles: {
            header: {
              backgroundColor: "#79B4B7",
            },
          },
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "シフト情報",
                color: "#ffffff",
                weight: "bold",
                size: "lg",
              },
            ],
          },
          hero: {
            type: "box",
            layout: "horizontal",
            spacing: "md",
            contents: [
              {
                type: "box",
                layout: "vertical",
                spacing: "md",
                contents: makeCalendar(),
              },
            ],
          },
          body: {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: reply_message,
                wrap: true,
              },
            ],
          },
          // "footer": {
          // "type": "box",
          // "layout": "vertical",
          // "contents": [
          //   {
          //     "type": "text",
          //     "text": "footer"
          //   }
          // ]
          // }
        },
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
function getCalendar() {
  const id = "gen.akari.1453@gmail.com";
  const calendar = CalendarApp.getCalendarById(id);
  const startDate = new Date();
  // 予定を取得する期間
  const endDate = new Date(Date.parse(startDate) + 30 * 60 * 60 * 24 * 1000);
  // 予定をGoogleカレンダーから取得
  const events = calendar.getEvents(startDate, endDate);
  var message = "";
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
// JSON型のカレンダーを作成して返す
function makeCalendar() {
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth(); // 今月の値-1
  var start_day_of_week = new Date(year, month, 1).getDay(); // 今月のスタートの曜日の数
  var end_date = new Date(year, month + 1, 0).getDate(); // 月の末日

  // カレンダーを埋める日付の配列
  var day = [];
  for (var i = 0; i < 42; i++) {
    // 日付がないマス
    if (i < start_day_of_week || end_date + start_day_of_week - 1 < i) {
      day.push(" ");
    } else {
      day.push(String(i + 1 - start_day_of_week));
    }
  }

  var week = ["日", "月", "火", "水", "木", "金", "土"];
  // カレンダー縦方向(_h)
  var contents_json_array_h = [
    { type: "separator" },
    {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: year + "年　" + String(month + 1) + "月",
        },
      ],
    },
    { type: "separator" },
  ];
  var contents_h;
  for (var h_i = 0; h_i < 7; h_i++) {
    // カレンダー横方向(_w)
    var contents_json_array_w = [];
    var contents_w;
    for (var w_i = 0; w_i < 7; w_i++) {
      contents_w = {};
      contents_w.type = "text";
      // 1行目は曜日を表示
      if (h_i == 0) {
        contents_w.text = week[w_i];
      } else {
        contents_w.text = day[w_i + (h_i - 1) * 7];
      }
      contents_json_array_w.push(contents_w);
      // 仕切り（縦）
      if (w_i != 6) {
        contents_w = {};
        contents_w.type = "separator";
        contents_json_array_w.push(contents_w);
      }
    }
    contents_h = {};
    contents_h.type = "box";
    contents_h.layout = "horizontal";
    contents_h.spacing = "md";
    contents_h.contents = contents_json_array_w; // カレンダー横方向の部分で作成した配列
    contents_json_array_h.push(contents_h);
    // 仕切り（横）
    contents_h = {};
    contents_h.type = "separator";
    contents_json_array_h.push(contents_h);
  }
  return contents_json_array_h;
}

// POST送信されたデータをGASで受信するイベントハンドラ
function doPost(e) {
  // JSON文字列をGASが取り扱える形式に解析
  var json = JSON.parse(e.postData.contents);
  // 返信する
  reply(json);
}
