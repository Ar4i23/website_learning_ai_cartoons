"""
Главный файл запуска бота
"""
import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN
from handlers import router

# Настройка логирования
logging.basicConfig(level=logging.INFO)


async def main():
    """
    Главная функция бота
    """
    # Создаем бота и диспетчер
    bot = Bot(token=BOT_TOKEN)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)
    
    # Регистрируем роутер с обработчиками
    dp.include_router(router)
    
    logging.info("🤖 Бот запущен! Ожидаю команды...")
    
    # Запускаем polling
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())