# Seeat Church Retreat 2023

![Seeat](docs/KakaoTalk_Photo_2023-05-16-08-56-47.png)

수양회 운영 업무를 자동화하기 위한 간이 백오피스 툴입니다.
Remix Framework를 사용하여 퀵하게 만들어서 사용하였습니다.

## TODO

- [x] Auth
- [x] 포트 포워딩
- [x] 셔틀 현황 확인
- [ ] 수양관 라이더 확인
- [ ] 복귀 카풀 확인
- [ ] 씨앗모임 현황 확인
- [ ] 프리씨드 현황 확인
- [ ] 숙소 현황 확인

## 기술 스택

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)
