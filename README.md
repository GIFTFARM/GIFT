# GIFT FARM - Мини-веб-приложение для Telegram с интеграцией блокчейна TON

GIFT FARM - это мини-веб-приложение для Telegram, которое позволяет пользователям подключать свой криптокошелёк TON Keeper, отслеживать NFT на кошельке, выбирать NFT из определённых коллекций, получать пассивный доход виртуальной монеты GIFT и покупать подписку для увеличения скорости фарма и удобства использования.

## Основные функции

- **Подключение TON Keeper**: Пользователи могут подключить свой криптокошелёк TON Keeper.
- **Отслеживание NFT**: Автоматическое отслеживание всех NFT на подключённом кошельке пользователя.
- **Выбор NFT**: Выбор NFT из определённых коллекций.
- **Пассивный доход**: Пассивный доход виртуальной монеты GIFT при нажатии на кнопку «Начать фарм» (1 NFT приносит 1 монету в час в течение 12 часов).
- **Офлайн-фарминг**: Фарминг продолжается даже когда пользователь не находится в приложении.
- **Сбор монет**: Кнопка «Собрать монеты» для сбора накопленных виртуальных монет GIFT.
- **Повторный запуск фарма**: Возможность повторного запуска фарма после сбора монет.
- **Подписка PRO**: Кнопка покупки подписки, которая открывает доступ к следующим преимуществам:
  - увеличение скорости фарма в 1,5 раза;
  - возможность поставить/собрать фарм для всех NFT подарков одной кнопкой.

## Технические особенности

- **Офлайн-фарминг**: Приложение сохраняет время начала фарминга и рассчитывает накопленные токены даже когда пользователь не находится в приложении.
- **Интеграция с TON**: Использование библиотек @ton/ton, @ton/core, @ton/crypto и tonconnectui для работы с блокчейном TON.
- **Реферальная система**: Пользователи могут приглашать друзей и получать 5% от их фарма.
- **Билеты**: За каждый полный цикл фарминга (12 часов) пользователь получает билет.

## Начало работы

Для запуска проекта в режиме разработки:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть результат.

## Технологии

- Next.js
- React
- Tailwind CSS
- TON Connect
- TON SDK (@ton/ton, @ton/core, @ton/crypto)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
