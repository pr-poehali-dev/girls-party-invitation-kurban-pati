import json
import os
import urllib.request
import urllib.parse
import urllib.error
import re
import time
import base64
from datetime import datetime


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _get_access_token(email: str, private_key_pem: str) -> str:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    now = int(time.time())
    header = _b64url(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = _b64url(json.dumps({
        "iss": email,
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600,
    }).encode())

    signing_input = f"{header}.{claim}".encode()
    key = serialization.load_pem_private_key(private_key_pem.encode(), password=None)
    signature = _b64url(key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256()))
    jwt = f"{header}.{claim}.{signature}"

    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt,
    }).encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return json.loads(resp.read())["access_token"]
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        raise RuntimeError(f"Google OAuth error {e.code}: {err_body}")


def _append_to_sheet(spreadsheet_id: str, access_token: str, row: list):
    url = (
        f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}"
        f"/values/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS"
    )
    body = json.dumps({"values": [row]}).encode()
    req = urllib.request.Request(
        url, data=body,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
    )
    urllib.request.urlopen(req, timeout=15)


def handler(event: dict, context) -> dict:
    """Принимает заявку КУРБАН ПАТИ, отправляет в Telegram и записывает в Google Sheets."""

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

    # --- Telegram ---
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

    # --- Google Sheets ---
    gs_email = os.environ.get("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
    gs_key_raw = os.environ.get("GOOGLE_PRIVATE_KEY", "")
    gs_key = gs_key_raw.replace("\\n", "\n").replace("\r\n", "\n")
    gs_id = os.environ.get("GOOGLE_SPREADSHEET_ID", "")

    if gs_email and gs_key and gs_id:
        token = _get_access_token(gs_email, gs_key)
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        row = [now_str, name, surname, str(age), phone, telegram, format_label, transfer_label, address]
        _append_to_sheet(gs_id, token, row)

    return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}