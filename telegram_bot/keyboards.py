"""
Клавиатуры для бота
"""
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder


def get_start_keyboard() -> InlineKeyboardMarkup:
    """
    Клавиатура после команды /start
    """
    builder = InlineKeyboardBuilder()
    builder.button(text="💳 Оплатить курс", callback_data="pay")
    return builder.as_markup()


def get_payment_keyboard() -> InlineKeyboardMarkup:
    """
    Клавиатура после показа реквизитов
    """
    builder = InlineKeyboardBuilder()
    builder.button(text="✅ Я оплатил", callback_data="paid")
    builder.button(text="💬 Задать вопрос", callback_data="question")
    builder.adjust(1)
    return builder.as_markup()


def get_question_keyboard(support_username: str) -> InlineKeyboardMarkup:
    """
    Клавиатура для связи с поддержкой
    """
    builder = InlineKeyboardBuilder()
    builder.button(
        text="Написать в поддержку",
        url=f"https://t.me/{support_username}"
    )
    builder.button(text="🔙 Назад", callback_data="back_to_payment")
    builder.adjust(1)
    return builder.as_markup()