This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# tab-ui


app/
├── components/         # 재사용 가능한 UI 컴포넌트
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useFetch.js
├── pages/              # 페이지 단위 컴포넌트
│   ├── home.js
│   ├── about.js
├── services/           # API 호출 및 비즈니스 로직
│   ├── api.js
│   ├── authService.js
├── store/              # Redux 상태 관리
│   ├── slices/         
│   │   ├── userSlice.js
│   ├── middlewares/    # (옵션) Custom middleware
│   ├── index.js        # Redux store 설정
├── utils/              # 헬퍼 함수
│   ├── dateUtils.js
│   ├── numberUtils.js
├── layout.js           # Next.js 레이아웃 파일
├── page.js             # 메인 엔트리 파일