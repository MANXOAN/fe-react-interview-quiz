# FE React Interview Quiz

Bộ quiz trắc nghiệm FE React dành cho level khoảng 2.5+ năm kinh nghiệm.

## Nội dung chính

- 452 câu hỏi được sinh từ các cụm chủ đề bám theo docs: HTML/CSS, JS ES6+, Event Loop, TypeScript Handbook, React Docs, Redux Toolkit/React-Redux/RTK Query, TanStack Query/Router, Axios, React Hook Form, Zod, Testing Library, Git, Vite, SSR/SSG/ISR và bảo mật FE.
- Có ví dụ thực tế cho từng câu.
- Lọc theo vùng kiến thức, chủ đề, câu đúng/sai/chưa làm.
- Search nhanh theo keyword.
- Lưu tiến độ bằng localStorage.
- Responsive mobile/tablet/desktop.

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Deploy

### Vercel

Import repo này vào Vercel:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

Repo có sẵn workflow `.github/workflows/deploy.yml`. Vào Settings → Pages → Source chọn GitHub Actions nếu cần.
