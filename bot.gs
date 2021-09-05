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

  if (data.events[0].message.text == "遊ぼう") {
    var reply_message = "今週の予定は";
  } else {
    var reply_message = "「遊ぼう」と送ると今週の予定を返信するよ";
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

function getCalendar() {
  const id = "*****";
  const calendar = CalendarApp.getCalendarById(id);
  console.log(calendar.getName());
}

// POST送信されたデータをGASで受信するイベントハンドラ
function doPost(e) {
  // JSONをパースする
  var json = JSON.parse(e.postData.contents);
  // 返信する
  reply(json);
}
