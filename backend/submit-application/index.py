import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    """Принимает заявку с сайта КУРБАН ПАТИ и отправляет её в Telegram."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    cors = {"Access-Control-Allow-Origin": "*"}

    body = json.loads(event.get("body") or "{}")

    name = body.get("name", "—")
    age = body.get("age", "—")
    phone = body.get("phone", "—")
    telegram = body.get("telegram", "—")
    fmt = body.get("format", "—")
    transfer = body.get("transfer", "—")
    address = body.get("address", "—")

    format_label = "С ночёвкой (2500₽)" if fmt == "sleep" else "Без ночёвки (1500₽)"
    transfer_label = "Да" if transfer == "yes" else "Нет"

    message = (
        "🎀 *Новая заявка — КУРБАН ПАТИ*\n\n"
        f"👤 *Имя:* {name}\n"
        f"🎂 *Возраст:* {age}\n"
        f"📞 *Телефон:* {phone}\n"
        f"✈️ *Telegram:* {telegram}\n"
        f"🏩 *Формат:* {format_label}\n"
        f"🚗 *Трансфер:* {transfer_label}\n"
        f"📬 *Адрес:* {address}"
    )

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    if bot_token and chat_id:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = json.dumps({
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown",
        }).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=10)

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": True}),
    }
