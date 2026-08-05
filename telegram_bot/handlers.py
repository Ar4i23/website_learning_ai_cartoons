"""
Обработчики команд и кнопок бота
"""
import logging

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from config import PRICE, CURRENCY, COURSE_LINK, SUPPORT_USERNAME
from keyboards import get_start_keyboard, get_question_keyboard
from messages import WELCOME_MESSAGE, PAYMENT_MESSAGE, COURSE_ACCESS_MESSAGE, SUPPORT_MESSAGE
from yookassa_api import create_payment, get_payment

router = Router()


class PaymentState(StatesGroup):
    waiting = State()


def payment_keyboard(payment_url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💳 Перейти к оплате", url=payment_url)],
        [InlineKeyboardButton(text="✅ Я оплатил", callback_data="paid")],
        [InlineKeyboardButton(text="💬 Задать вопрос", callback_data="question")],
    ])


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        WELCOME_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=get_start_keyboard(),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "pay")
async def callback_pay(callback: CallbackQuery, state: FSMContext):
    await callback.answer("Создаю платёж…")
    try:
        amount = f"{float(PRICE):.2f}"
        data = await create_payment(
            amount=amount,
            description="Оплата курса «Обучение ИИ-мультикам»",
            return_url="https://t.me/antonovaai_multiki_bot",
        )
    except Exception as e:
        logging.error(f"YooKassa create payment error: {e}")
        await callback.message.answer(
            "⚠️ Не удалось создать платёж. Попробуйте ещё раз или напишите в поддержку."
        )
        return

    await state.set_state(PaymentState.waiting)
    await state.update_data(payment_id=data["id"])

    payment_url = data["confirmation"]["confirmation_url"]
    await callback.message.edit_text(
        PAYMENT_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=payment_keyboard(payment_url),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "paid")
async def callback_paid(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    payment_id = data.get("payment_id")

    if not payment_id:
        await callback.answer("Сначала нажмите «💳 Оплатить курс» в главном меню.", show_alert=True)
        return

    payment = await get_payment(payment_id)
    status = payment.get("status")

    if status == "succeeded":
        await state.clear()
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
        await callback.answer("Платёж отменён или не найден. Попробуйте оплатить ещё раз.", show_alert=True)


@router.callback_query(F.data == "question")
async def callback_question(callback: CallbackQuery):
    await callback.message.edit_text(
        SUPPORT_MESSAGE.format(support_username=SUPPORT_USERNAME),
        reply_markup=get_question_keyboard(SUPPORT_USERNAME),
        parse_mode="HTML",
    )
    await callback.answer()


@router.callback_query(F.data == "back_to_payment")
async def callback_back(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    payment_id = data.get("payment_id")
    if not payment_id:
        await callback.answer("Платёж не найден. Нажмите /start и начните заново.", show_alert=True)
        return
    payment = await get_payment(payment_id)
    payment_url = payment.get("confirmation", {}).get("confirmation_url")
    if not payment_url:
        await callback.answer("Ссылка устарела. Нажмите /start и начните заново.", show_alert=True)
        return
    await callback.message.edit_text(
        PAYMENT_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=payment_keyboard(payment_url),
        parse_mode="HTML",
    )
    await callback.answer()