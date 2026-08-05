"""
Работа с API ЮKassa
"""
import base64
import uuid
import aiohttp

from config import YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY

API_URL = "https://api.yookassa.ru/v3"


def _headers():
    credentials = f"{YOOKASSA_SHOP_ID}:{YOOKASSA_SECRET_KEY}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
        "Idempotence-Key": str(uuid.uuid4()),
    }


async def create_payment(amount: str, description: str, return_url: str) -> dict:
    """Создаёт платёж и возвращает данные с id и ссылкой на оплату"""
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{API_URL}/payments",
            headers=_headers(),
            json={
                "amount": {"value": amount, "currency": "RUB"},
                "capture": True,
                "confirmation": {"type": "redirect", "return_url": return_url},
                "description": description,
            },
        ) as resp:
            data = await resp.json()
            if resp.status != 200:
                raise Exception(f"YooKassa error {resp.status}: {data}")
            return data


async def get_payment(payment_id: str) -> dict:
    """Проверяет статус платежа"""
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{API_URL}/payments/{payment_id}",
            headers=_headers(),
        ) as resp:
            return await resp.json()