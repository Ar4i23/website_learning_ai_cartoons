"""
Конфигурация бота
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Токен бота
BOT_TOKEN = os.getenv("BOT_TOKEN")

# Реквизиты карты (запасной вариант)
CARD_NUMBER = os.getenv("CARD_NUMBER")
CARD_HOLDER = os.getenv("CARD_HOLDER")

# Цена курса
PRICE = os.getenv("PRICE", "2499")
CURRENCY = os.getenv("CURRENCY", "руб")

# Ссылка на курс
COURSE_LINK = os.getenv("COURSE_LINK", "https://t.me/durov")

# Username поддержки
SUPPORT_USERNAME = os.getenv("SUPPORT_USERNAME", "support")

# ID администратора
ADMIN_ID = int(os.getenv("ADMIN_ID", 0))

# ЮKassa
YOOKASSA_SHOP_ID = os.getenv("YOOKASSA_SHOP_ID", "")
YOOKASSA_SECRET_KEY = os.getenv("YOOKASSA_SECRET_KEY", "")