# 🚚 SPA грузовых аукционов — тестовое задание 🚚

Решение тестового задания компании **Умная Логистика** на роль **Frontend Developer**.

SPA для работы с грузовыми аукционами по готовой OpenAPI-схеме: список, детальная карточка, история ставок и установка своей ставки. Backend заменён MSW-моками с изменяемым in-memory состоянием.

---

## Стек

- React + TypeScript + Vite
- TanStack Router / TanStack Query
- React Hook Form + Zod
- MobX (page models)
- MSW
- Feature-Sliced Design
- Ant Design
- Vitest (минимальные unit-тесты)

---

## Запуск

Требования: **Node.js 20+**, npm.

```bash
# установка зависимостей
npm install

# локальная разработка (MSW поднимается вместе с приложением)
npm run dev
```

Откройте адрес из терминала (обычно `http://localhost:5173`).

### Полезные команды

| Команда | Описание |
|--------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр production-сборки |
| `npm test` | Unit-тесты |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run lint` | ESLint |
| `npm run generate:api` | Регенерация типов из OpenAPI |

---

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Список аукционов + фильтры |
| `/auctions/:auctionId` | Детальная страница |
| `/auctions/:auctionId/bets` | История ставок и форма ставки |

Примеры id из моков: `a1`, `a2`, `a3`, `a7` (скрытая история ставок).

---

## Что реализовано

### Список аукционов
- загрузка через TanStack Query
- пагинация
- skeleton / empty / error states
- prefetch деталки по hover
- фильтры с синхронизацией в URL search params
- Zod-валидация search params с безопасными fallback
- адаптивная вёрстка

### Детальная страница
- основные данные, организатор, контакты
- маршрут, груз и требования к ТС, оплата
- параметры торгов: текущая / доступная цена, min / max / step
- учёт флагов: `can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`

### Ставки
- список ставок, участники, цены с/без НДС
- место, победитель, отмена и причина
- empty state и состояние «история скрыта»
- форма ставки (RHF + Zod) с учётом min / max / step
- mutation `POST /auctions/{uuid}/bets`
- invalidate list / detail / bets после успеха
- success / error toast, обработка 422
- MSW обновляет цену, статус пользователя и список ставок

### Архитектура
- FSD: `app` / `pages` / `widgets` / `features` / `entities` / `shared`
- page models на MobX + обёртки Query/Mutation
- фича `set-bet`, виджет `auctions-list`, shared `Panel`

### Моки
- OpenAPI: `openapi/openapi.auctions.v0.json`
- MSW handlers + in-memory store
- seed-аукционы под разные кейсы (Leading / Losing / FixPrice / hide history и т.д.)

---

## Работа с AI

Подробнее про работу с AI: [`AI_USAGE.md`](./AI_USAGE.md).

## Как проверяла результат

Проверка вручную в браузере (`npm run dev`) + unit-тесты (`npm test`).

### Сценарии, которые прошла

1. **Список**
   - загрузка, skeleton, пагинация (в т.ч. смена `per_page`)
   - фильтры (номер, статусы, тип, города, даты, доступность, участие, цена) и их отражение в URL
   - empty state при слишком узких фильтрах
   - переход в деталку / ставки с карточки
   - prefetch по наведению

2. **Деталка** (`a1` и др.)
   - отображение секций по ТЗ
   - скрытие контактов / адреса (`a7`)
   - кнопки «Сделать / Изменить / Смотреть ставки»

3. **Ставки**
   - длинный список + sticky-форма
   - успешная ставка → toast, обновление таблицы и текущей цены
   - валидация шага / min / max на клиенте
   - 422 от мока при недоступной ставке
   - `a7` — «история ставок скрыта»
   - отменённые ставки с причиной

4. **Автотесты**
   - parsing search params
   - request builder `toAuctionListRequest`
   - validation schema ставки
   - ViewModel-маппер primary action карточки

### Ограничения, которые остались

- нет реального backend — только MSW; состояние сбрасывается при перезагрузке страницы
- нет авторизации / ролей (текущий пользователь зашит в моках)
- нет e2e-тестов (Playwright/Cypress) — проверка сценариев ручная
- избранное и часть полей OpenAPI есть в DTO/моках, но не вынесены в отдельный UX

---

## Структура `src`

```
src/
  app/          # роутинг, провайдеры, тема
  pages/        # страницы + page models
  widgets/      # auctions-list
  features/     # set-bet
  entities/     # auction, bet
  shared/       # api, ui, lib, transports
  msw/          # handlers + worker
```

---

## Автор

Софья + Cursor — тестовое задание на Frontend Developer, Умная Логистика.
