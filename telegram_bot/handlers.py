"""Handlers for the course bot."""

import logging
from decimal import Decimal
from typing import Any, Dict

from aiogram import F, Router
from aiogram.filters import CommandStart
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, Message

from config import COURSE_LINK, CURRENCY, PRICE, SUPPORT_USERNAME
from keyboards import get_question_keyboard, get_start_keyboard
from messages import COURSE_ACCESS_MESSAGE, PAYMENT_MESSAGE, SUPPORT_MESSAGE, WELCOME_MESSAGE
from yookassa_api import create_payment, get_payment


router = Router()
PAYMENT_CALLBACK_PREFIX = "paid:"
QUESTION_CALLBACK_PREFIX = "question:"
BACK_CALLBACK_PREFIX = "back_to_payment:"


def payment_keyboard(payment_url: str, payment_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="💳 Перейти к оплате", url=payment_url)],
            [
                InlineKeyboardButton(
                    text="✅ Я оплатил",
                    callback_data=f"{PAYMENT_CALLBACK_PREFIX}{payment_id}",
                )
            ],
            [
                InlineKeyboardButton(
                    text="💬 Задать вопрос",
                    callback_data=f"{QUESTION_CALLBACK_PREFIX}{payment_id}",
                )
            ],
        ]
    )


async def _payment_belongs_to_user(payment: Dict[str, Any], user_id: int) -> bool:
    metadata = payment.get("metadata") or {}
    return metadata.get("telegram_user_id") == str(user_id)


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    await message.answer(
        WELCOME_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=get_start_keyboard(),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "pay")
async def callback_pay(callback: CallbackQuery) -> None:
    await callback.answer("Создаю платёж…")
    try:
        amount = format(Decimal(PRICE).quantize(Decimal("0.01")), "f")
        data = await create_payment(
            amount=amount,
            description="Оплата курса «Обучение ИИ-мультикам»",
            return_url="https://t.me/antonovaai_multiki_bot",
            metadata={"telegram_user_id": str(callback.from_user.id)},
        )
    except Exception:
        logging.exception("YooKassa create payment failed")
        await callback.message.answer(
            "⚠️ Не удалось создать платёж. Попробуйте ещё раз или напишите в поддержку."
        )
        return

    payment_url = data["confirmation"]["confirmation_url"]
    payment_id = data["id"]
    payment_message = PAYMENT_MESSAGE.format(price=PRICE, currency=CURRENCY)
    payment_markup = payment_keyboard(payment_url, payment_id)
    try:
        await callback.message.edit_text(
            payment_message,
            reply_markup=payment_markup,
            parse_mode="HTML",
        )
    except Exception:
        logging.exception("Could not edit the payment message")
        await callback.message.answer(
            payment_message,
            reply_markup=payment_markup,
            parse_mode="HTML",
        )


@router.callback_query(F.data.startswith(PAYMENT_CALLBACK_PREFIX))
async def callback_paid(callback: CallbackQuery) -> None:
    payment_id = callback.data[len(PAYMENT_CALLBACK_PREFIX) :]
    if not payment_id:
        await callback.answer("Не удалось определить платёж. Откройте /start и попробуйте ещё раз.", show_alert=True)
        return

    try:
        payment = await get_payment(payment_id)
    except Exception:
        logging.exception("YooKassa payment status check failed")
        await callback.answer(
            "Не удалось проверить платёж. Подождите немного и попробуйте ещё раз.",
            show_alert=True,
        )
        return

    if not await _payment_belongs_to_user(payment, callback.from_user.id):
        await callback.answer("Этот платёж не привязан к вашему аккаунту.", show_alert=True)
        return

    status = payment.get("status")
    if status == "succeeded":
        await callback.message.edit_text(
            COURSE_ACCESS_MESSAGE.format(course_link=COURSE_LINK),
            parse_mode="HTML",
        )
        await callback.answer("🎉 Оплата подтверждена!", show_alert=True)
    elif status == "pending":
        await callback.answer(
            "Оплата ещё не прошла. Если вы только что оплатили — подождите минуту и нажмите ещё раз.",
            show_alert=True,
        )
    else:
        await callback.answer("Платёж отменён или не найден. Попробуйте начать оплату заново.", show_alert=True)


@router.callback_query(F.data.startswith(QUESTION_CALLBACK_PREFIX))
async def callback_question(callback: CallbackQuery) -> None:
    payment_id = callback.data[len(QUESTION_CALLBACK_PREFIX) :]
    await callback.message.edit_text(
        SUPPORT_MESSAGE.format(support_username=SUPPORT_USERNAME),
        reply_markup=get_question_keyboard(SUPPORT_USERNAME, payment_id),
        parse_mode="HTML",
    )
    await callback.answer()


@router.callback_query(F.data.startswith(BACK_CALLBACK_PREFIX))
async def callback_back(callback: CallbackQuery) -> None:
    payment_id = callback.data[len(BACK_CALLBACK_PREFIX) :]
    if not payment_id:
        await callback.answer("Платёж не найден. Нажмите /start и начните заново.", show_alert=True)
        return

    try:
        payment = await get_payment(payment_id)
    except Exception:
        logging.exception("YooKassa payment lookup failed")
        await callback.answer("Не удалось открыть платёж. Попробуйте ещё раз.", show_alert=True)
        return

    if not await _payment_belongs_to_user(payment, callback.from_user.id):
        await callback.answer("Этот платёж не привязан к вашему аккаунту.", show_alert=True)
        return

    payment_url = (payment.get("confirmation") or {}).get("confirmation_url")
    if not payment_url:
        await callback.answer("Ссылка устарела. Нажмите /start и начните заново.", show_alert=True)
        return

    await callback.message.edit_text(
        PAYMENT_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=payment_keyboard(payment_url, payment_id),
        parse_mode="HTML",
    )
    await callback.answer()


@router.callback_query(F.data.in_({"paid", "question", "back_to_payment"}))
async def callback_legacy_button(callback: CallbackQuery) -> None:
    """Explain how to recover old buttons created before payment IDs were embedded."""
    await callback.answer(
        "Эта кнопка устарела. Нажмите /start, чтобы продолжить.",
        show_alert=True,
    )
