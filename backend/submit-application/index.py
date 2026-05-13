import json
import os
import urllib.request
import re


def handler(event: dict, context) -> dict:
    """Принимает заявку КУРБАН ПАТИ и отправляет её в Telegram."""

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
    surname = body.get("surname", "—")
    age = body.get("age", "—")
    phone = body.get("phone", "—")
    telegram_raw = body.get("telegram", "—")
    fmt = body.get("format", "—")
    transfer = body.get("transfer", "—")
    address = body.get("address", "—")

    telegram = telegram_raw.strip()
    if telegram and telegram != "—":
        telegram = re.sub(r"[^\w]", lambda m: "_" if m.group() == "_" else "", telegram)
        if telegram:
            telegram = "@" + telegram.lstrip("@")

    format_label = "С ночёвкой" if fmt == "sleep" else "Без ночёвки"
    transfer_label = "Да" if transfer == "yes" else "Нет"

    message = (
        "🎀 Новая заявка — КУРБАН ПАТИ\n\n"
        f"👤 Имя: {name} {surname}\n"
        f"🎂 Возраст: {age}\n"
        f"📞 Телефон: {phone}\n"
        f"✈️ Telegram: {telegram}\n"
        f"🏩 Формат: {format_label}\n"
        f"🚗 Трансфер: {transfer_label}\n"
        f"📬 Адрес: {address}"
    )

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    if not bot_token or not chat_id:
        return {"statusCode": 500, "headers": cors, "body": json.dumps({"ok": False, "error": "Bot not configured"})}

    tg_req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        data=json.dumps({"chat_id": chat_id, "text": message}).encode(),
        headers={"Content-Type": "application/json"},
    )
    tg_resp = json.loads(urllib.request.urlopen(tg_req, timeout=10).read())
    if not tg_resp.get("ok"):
        return {"statusCode": 500, "headers": cors, "body": json.dumps({"ok": False, "error": "Telegram error"})}

    return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}
