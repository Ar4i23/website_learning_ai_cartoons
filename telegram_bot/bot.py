"""
Главный файл запуска бота
"""
import asyncio
import logging
from aiogram import Bot, Dispatcher

from config import BOT_TOKEN, validate_config
from handlers import router

# Настройка логирования
logging.basicConfig(level=logging.INFO)


async def main():
    """
    Главная функция бота
    """
    validate_config()

    # Создаем бота и диспетчер
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()
    
    # Регистрируем роутер с обработчиками
    dp.include_router(router)
    
    logging.info("🤖 Бот запущен! Ожидаю команды...")
    
    # Запускаем polling
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
