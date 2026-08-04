"""
Обработчики команд и кнопок бота
"""
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart

from config import CARD_NUMBER, CARD_HOLDER, PRICE, CURRENCY, COURSE_LINK, SUPPORT_USERNAME
from keyboards import get_start_keyboard, get_payment_keyboard, get_question_keyboard
from messages import WELCOME_MESSAGE, PAYMENT_MESSAGE, COURSE_ACCESS_MESSAGE, SUPPORT_MESSAGE

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    """
    Обработчик команды /start
    """
    await message.answer(
        WELCOME_MESSAGE.format(price=PRICE, currency=CURRENCY),
        reply_markup=get_start_keyboard(),
        parse_mode="HTML"
    )


@router.callback_query(F.data == "pay")
async def callback_pay(callback: CallbackQuery):
    """
    Обработчик кнопки "Оплатить курс"
    """
    await callback.message.edit_text(
        PAYMENT_MESSAGE.format(
            card_number=CARD_NUMBER,
            card_holder=CARD_HOLDER,
            price=PRICE,
            currency=CURRENCY
        ),
        reply_markup=get_payment_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()


@router.callback_query(F.data == "paid")
async def callback_paid(callback: CallbackQuery):
    """
    Обработчик кнопки "Я оплатил"
    """
    await callback.message.edit_text(
        COURSE_ACCESS_MESSAGE.format(course_link=COURSE_LINK),
        parse_mode="HTML"
    )
    await callback.answer()


@router.callback_query(F.data == "question")
async def callback_question(callback: CallbackQuery):
    """
    Обработчик кнопки "Задать вопрос"
    """
    await callback.message.edit_text(
        SUPPORT_MESSAGE.format(support_username=SUPPORT_USERNAME),
        reply_markup=get_question_keyboard(SUPPORT_USERNAME),
        parse_mode="HTML"
    )
    await callback.answer()


@router.callback_query(F.data == "back_to_payment")
async def callback_back_to_payment(callback: CallbackQuery):
    """
    Возврат к реквизитам оплаты
    """
    await callback.message.edit_text(
        PAYMENT_MESSAGE.format(
            card_number=CARD_NUMBER,
            card_holder=CARD_HOLDER,
            price=PRICE,
            currency=CURRENCY
        ),
        reply_markup=get_payment_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()