"""Small async client for the YooKassa Payments API."""

import base64
import uuid
from typing import Any, Dict, Optional

import aiohttp

from config import YOOKASSA_SECRET_KEY, YOOKASSA_SHOP_ID


API_URL = "https://api.yookassa.ru/v3"
REQUEST_TIMEOUT = aiohttp.ClientTimeout(total=20)


class YooKassaAPIError(RuntimeError):
    """Raised when YooKassa returns an unsuccessful or invalid response."""


def _headers(*, idempotence_key: Optional[str] = None) -> Dict[str, str]:
    credentials = f"{YOOKASSA_SHOP_ID}:{YOOKASSA_SECRET_KEY}"
    encoded = base64.b64encode(credentials.encode()).decode()
    headers = {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
    }
    if idempotence_key:
        headers["Idempotence-Key"] = idempotence_key
    return headers


async def _request(
    method: str,
    path: str,
    *,
    json_body: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    headers = _headers(idempotence_key=str(uuid.uuid4()) if method == "POST" else None)
    async with aiohttp.ClientSession(timeout=REQUEST_TIMEOUT) as session:
        async with session.request(
            method,
            f"{API_URL}{path}",
            headers=headers,
            json=json_body,
        ) as response:
            try:
                data = await response.json()
            except (aiohttp.ContentTypeError, ValueError) as exc:
                response_text = await response.text()
                raise YooKassaAPIError(
                    f"YooKassa returned non-JSON HTTP {response.status}: {response_text[:300]}"
                ) from exc

            if response.status != 200:
                raise YooKassaAPIError(f"YooKassa HTTP {response.status}: {data}")
            return data


async def create_payment(
    amount: str,
    description: str,
    return_url: str,
    metadata: Dict[str, str],
) -> Dict[str, Any]:
    """Create a redirect payment linked to the Telegram user who started it."""
    return await _request(
        "POST",
        "/payments",
        json_body={
            "amount": {"value": amount, "currency": "RUB"},
            "capture": True,
            "confirmation": {"type": "redirect", "return_url": return_url},
            "description": description,
            "metadata": metadata,
        },
    )


async def get_payment(payment_id: str) -> Dict[str, Any]:
    """Fetch a payment and its status from YooKassa."""
    return await _request("GET", f"/payments/{payment_id}")
