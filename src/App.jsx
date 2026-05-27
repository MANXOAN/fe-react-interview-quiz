import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-react-interview-quiz-progress-recruiter-v1';

const QUESTIONS = [
  {
    id: 1,
    area: 'HTML/CSS',
    topic: 'Semantic HTML',
    question: 'Bạn nhận một landing page đang dùng toàn div/span cho header, menu, nội dung bài viết và footer. Khi review code, bạn sẽ góp ý gì?',
    options: ['Giữ nguyên vì div dễ style nhất', 'Đổi sang thẻ semantic như header, nav, main, article, section, footer nếu đúng ngữ nghĩa', 'Thêm nhiều class name là đủ cho SEO', 'Chuyển toàn bộ sang table để layout chắc hơn'],
    answer: 1,
    explanation: 'Nhà tuyển dụng muốn nghe bạn hiểu semantic HTML không phải học thuộc tên thẻ, mà biết dùng đúng ngữ nghĩa để cải thiện accessibility, SEO và maintainability.',
    example: '<main><article><h1>...</h1></article></main>',
  },
  {
    id: 2,
    area: 'HTML/CSS',
    topic: 'Form Accessibility',
    question: 'Form login có input email/password chỉ dùng placeholder, không có label. Vấn đề thực tế là gì?',
    options: ['Không vấn đề gì vì placeholder thay label tốt hơn', 'Screen reader và người dùng khó xác định tên field; nên dùng label liên kết htmlFor/id', 'Chỉ cần đổi màu placeholder', 'Dùng div giả input để custom đẹp hơn'],
    answer: 1,
    explanation: 'Placeholder không thay thế label. Label giúp click focus đúng input và hỗ trợ công nghệ trợ năng.',
    example: '<label htmlFor="email">Email</label><input id="email" />',
  },
  {
    id: 3,
    area: 'HTML/CSS',
    topic: 'Button in form',
    question: 'Trong form có nút “Huỷ” nhưng dev viết <button>Huỷ</button>. Bug nào có thể xảy ra?',
    options: ['Không có bug vì button mặc định là button', 'Nút Huỷ có thể submit form vì button trong form mặc định type="submit"', 'Button không render trong form', 'Chỉ ảnh hưởng CSS'],
    answer: 1,
    explanation: 'Câu này kiểm tra kinh nghiệm thực tế. Trong form, button mặc định là submit nếu không khai báo type.',
    example: '<button type="button">Huỷ</button><button type="submit">Lưu</button>',
  },
  {
    id: 4,
    area: 'HTML/CSS',
    topic: 'Flex vs Grid',
    question: 'Bạn làm dashboard có sidebar, header và content area. Khi nào chọn Grid, khi nào chọn Flex?',
    options: ['Grid cho layout tổng thể 2 chiều, Flex cho layout nhỏ 1 chiều như navbar/actions', 'Luôn dùng Flex cho mọi layout', 'Luôn dùng absolute để dễ căn', 'Grid chỉ dùng cho mobile'],
    answer: 0,
    explanation: 'Nhà tuyển dụng muốn nghe khả năng chọn công cụ theo bài toán: Grid cho layout hàng/cột, Flex cho sắp xếp một chiều.',
    example: 'Page shell dùng grid; header actions dùng flex.',
  },
  {
    id: 5,
    area: 'HTML/CSS',
    topic: 'Z-index / Stacking context',
    question: 'Modal z-index 9999 nhưng vẫn bị header đè. Bạn debug theo hướng nào?',
    options: ['Tăng lên 99999999 là xong', 'Kiểm tra stacking context của ancestor, overflow, transform/opacity/position và cân nhắc render modal bằng portal', 'Đổi modal thành inline-block', 'Xóa CSS reset'],
    answer: 1,
    explanation: 'Đây là case phỏng vấn rất thực tế. z-index chỉ so sánh trong cùng stacking context, không phải cứ số lớn là thắng.',
    example: 'createPortal(<Modal />, document.body)',
  },
  {
    id: 6,
    area: 'HTML/CSS',
    topic: 'Responsive',
    question: 'Một card grid bị vỡ trên mobile vì width cố định 320px và margin hard-code. Bạn xử lý thế nào?',
    options: ['Giữ fixed width vì desktop đẹp', 'Dùng layout responsive như repeat(auto-fit, minmax(...)), clamp/rem và breakpoint hợp lý', 'Dùng zoom: 80%', 'Ẩn bớt nội dung bằng display:none mọi nơi'],
    answer: 1,
    explanation: 'Câu này kiểm tra responsive thật, không phải chỉ biết media query. Cần layout linh hoạt trước, breakpoint sau.',
    example: 'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));',
  },
  {
    id: 7,
    area: 'JavaScript',
    topic: 'Truthy/Falsy',
    question: 'API trả total = 0 nhưng UI lại hiện “Không có dữ liệu tổng”. Code đang if(total). Bạn sửa ra sao?',
    options: ['Giữ nguyên vì 0 là truthy', 'Check total !== null && total !== undefined hoặc total != null tuỳ convention', 'Ép Boolean(total)', 'Dùng total || 1'],
    answer: 1,
    explanation: '0 là falsy nhưng vẫn là giá trị hợp lệ. Đây là lỗi hay gặp với count, page, discount, quantity.',
    example: 'if (total != null) renderTotal(total);',
  },
  {
    id: 8,
    area: 'JavaScript',
    topic: 'Nullish coalescing',
    question: 'discountPercent = 0 là hợp lệ. Dòng nào tránh fallback sai?',
    options: ['const discount = discountPercent || 10', 'const discount = discountPercent ?? 10', 'const discount = discountPercent && 10', 'const discount = !discountPercent ? 10 : 0'],
    answer: 1,
    explanation: '|| fallback với mọi falsy, còn ?? chỉ fallback khi null/undefined.',
    example: '0 ?? 10 // 0; 0 || 10 // 10',
  },
  {
    id: 9,
    area: 'JavaScript',
    topic: 'Array mutation',
    question: 'Bạn sort danh sách users lấy từ React state. Cách nào an toàn?',
    options: ['users.sort(...) rồi setUsers(users)', 'const sorted = [...users].sort(...)', 'users.splice(0).sort(...)', 'Không thể sort trong React'],
    answer: 1,
    explanation: 'sort mutate array gốc. Với state, cần tạo reference mới để tránh side effect và render sai.',
    example: 'const sorted = [...users].sort((a,b)=>a.name.localeCompare(b.name));',
  },
  {
    id: 10,
    area: 'JavaScript',
    topic: 'Event loop',
    question: 'Đoạn code log A, setTimeout B, Promise.then C, log D. Thứ tự đúng và vì sao?',
    options: ['A B C D vì timeout 0 chạy ngay', 'A D C B vì sync trước, microtask trước macrotask', 'A C D B vì Promise chặn sync', 'C A D B vì Promise ưu tiên nhất'],
    answer: 1,
    explanation: 'Sync chạy trước. Promise.then là microtask, setTimeout là macrotask/task.',
    example: "console.log('A'); setTimeout(()=>console.log('B')); Promise.resolve().then(()=>console.log('C')); console.log('D');",
  },
  {
    id: 11,
    area: 'JavaScript',
    topic: 'Promise.all vs allSettled',
    question: 'Trang home có 3 block độc lập: banner, news, recommendations. Một block fail vẫn muốn hiện block còn lại. Dùng gì?',
    options: ['Promise.all', 'Promise.allSettled', 'Promise.race', 'forEach async'],
    answer: 1,
    explanation: 'Promise.all reject ngay khi một promise fail. allSettled phù hợp khi các block độc lập và lỗi từng phần được chấp nhận.',
    example: 'const results = await Promise.allSettled([banner(), news(), recs()]);',
  },
  {
    id: 12,
    area: 'JavaScript',
    topic: 'Race condition',
    question: 'Search API: user gõ “a” rồi “abc”, response “a” về sau và ghi đè kết quả mới. Bạn xử lý thế nào?',
    options: ['Không xử lý vì API tự đúng', 'Debounce input và cancel/ignore request cũ bằng AbortController hoặc requestId', 'Gọi thêm API lần nữa', 'Lưu kết quả vào CSS'],
    answer: 1,
    explanation: 'Đây là case thực chiến. Cần tránh response cũ update state sau response mới.',
    example: 'useEffect(() => { const c = new AbortController(); fetch(url,{signal:c.signal}); return () => c.abort(); }, [keyword]);',
  },
  {
    id: 13,
    area: 'JavaScript',
    topic: 'Closure',
    question: 'setInterval trong useEffect luôn đọc count cũ. Khái niệm JS nào liên quan và cách xử lý?',
    options: ['Prototype; dùng class', 'Stale closure; dùng dependency đúng, functional update hoặc ref tuỳ case', 'Hoisting; đổi var thành let là xong mọi case', 'CSS cascade'],
    answer: 1,
    explanation: 'Callback giữ giá trị từ render cũ. Nhà tuyển dụng hay hỏi để xem bạn hiểu JS closure trong React.',
    example: 'setCount(prev => prev + 1)',
  },
  {
    id: 14,
    area: 'JavaScript',
    topic: 'Map/Set',
    question: 'Bạn cần lưu selectedIds và kiểm tra một id đã chọn chưa rất nhiều lần. Cấu trúc nào hợp lý?',
    options: ['Array và includes mọi nơi', 'Set để check membership nhanh và giữ unique', 'String nối bằng dấu phẩy', 'Object DOM'],
    answer: 1,
    explanation: 'Set phù hợp unique values và has/delete/add rõ nghĩa. Array vẫn dùng được nhưng kém rõ và có thể chậm hơn khi lớn.',
    example: 'const selected = new Set(ids); selected.has(userId);',
  },
  {
    id: 15,
    area: 'TypeScript',
    topic: 'unknown vs any',
    question: 'API response type là unknown. Trước khi dùng data.name, bạn làm gì?',
    options: ['Ép data as any rồi dùng luôn', 'Narrow bằng type guard hoặc validate bằng Zod/schema', 'Tắt strict mode', 'Dùng // @ts-ignore'],
    answer: 1,
    explanation: 'TS không validate runtime. unknown buộc bạn kiểm tra trước khi dùng, an toàn hơn any.',
    example: 'if (isUser(data)) console.log(data.name);',
  },
  {
    id: 16,
    area: 'TypeScript',
    topic: 'Generics',
    question: 'Bạn viết hàm getById dùng cho User, Product, Order đều có id. Type nào tốt?',
    options: ['function getById(items:any[], id:any):any', 'function getById<T extends { id: string | number }>(items:T[], id:T["id"]):T|undefined', 'function getById(items:string[], id:string):string', 'Không type được'],
    answer: 1,
    explanation: 'Generic constraint giữ type cụ thể của entity nhưng đảm bảo có id.',
    example: 'const user = getById(users, "u1"); // User | undefined',
  },
  {
    id: 17,
    area: 'TypeScript',
    topic: 'Utility types',
    question: 'UpdateUserPayload không gửi id và mọi field còn lại optional. Type nào đúng?',
    options: ['Pick<User, "id">', 'Partial<Omit<User, "id">>', 'Record<User, string>', 'Required<User>'],
    answer: 1,
    explanation: 'Omit bỏ id, Partial làm các field còn lại optional. Đây là pattern DTO rất hay gặp.',
    example: 'type UpdateUserPayload = Partial<Omit<User, "id">>;',
  },
  {
    id: 18,
    area: 'TypeScript',
    topic: 'Discriminated union',
    question: 'Vì sao state dạng {status:"loading"|"success"|"error"} tốt hơn nhiều boolean loading/success/error?',
    options: ['Vì code dài hơn', 'Tránh trạng thái mâu thuẫn và giúp TS narrow đúng từng case', 'Vì boolean không dùng được trong React', 'Vì React Query bắt buộc'],
    answer: 1,
    explanation: 'Discriminated union mô hình hoá các trạng thái hợp lệ, tránh vừa loading vừa error vừa có data.',
    example: 'type ApiState = {status:"loading"} | {status:"success", data:User[]} | {status:"error", message:string};',
  },
  {
    id: 19,
    area: 'TypeScript',
    topic: 'keyof / indexed access',
    question: 'Hàm updateField(obj, key, value) nên type thế nào để value đúng theo key?',
    options: ['key:string, value:any', 'function updateField<T,K extends keyof T>(obj:T,key:K,value:T[K])', 'key:keyof T, value:string', 'Không làm được'],
    answer: 1,
    explanation: 'K extends keyof T đảm bảo key hợp lệ, T[K] đảm bảo value khớp type của field.',
    example: 'updateField(user, "age", 20); updateField(user, "age", "20") // lỗi',
  },
  {
    id: 20,
    area: 'TypeScript',
    topic: 'React types',
    question: 'children của Card component nên type gì trong đa số trường hợp?',
    options: ['string', 'JSX.Element luôn luôn', 'React.ReactNode', 'any cho nhanh'],
    answer: 2,
    explanation: 'children có thể là string, number, null, element, fragment, array. ReactNode bao quát hơn JSX.Element.',
    example: 'type CardProps = { children: React.ReactNode };',
  },
  {
    id: 21,
    area: 'React',
    topic: 'Derived state',
    question: 'fullName tính từ firstName và lastName. Cách nào đúng tinh thần React hơn?',
    options: ['Lưu fullName vào state rồi sync bằng useEffect', 'Tính trực tiếp trong render hoặc useMemo nếu tính nặng', 'Gọi API để lấy fullName', 'Lưu vào localStorage'],
    answer: 1,
    explanation: 'Nếu dữ liệu tính được từ props/state hiện tại thì không cần state riêng. Tránh duplicate state và render thừa.',
    example: 'const fullName = `${firstName} ${lastName}`;',
  },
  {
    id: 22,
    area: 'React',
    topic: 'State immutability',
    question: 'Bạn cần cập nhật user.address.city trong state nested. Cách nào đúng?',
    options: ['user.address.city="HN"; setUser(user)', 'setUser(prev => ({...prev, address:{...prev.address, city:"HN"}}))', 'setUser(user.address.city)', 'Dùng document.querySelector'],
    answer: 1,
    explanation: 'React dựa vào reference để nhận biết thay đổi. Nested update cần copy từng cấp bị đổi.',
    example: 'setUser(prev => ({ ...prev, address: { ...prev.address, city: "HN" } }));',
  },
  {
    id: 23,
    area: 'React',
    topic: 'Keys',
    question: 'Todo list có input edit trong từng row. Dùng index làm key, xoá row đầu thì input nhảy sai. Vì sao?',
    options: ['Input không dùng được trong list', 'React reuse component theo index mới nên local state/input gắn nhầm item', 'CSS Grid lỗi', 'TypeScript lỗi'],
    answer: 1,
    explanation: 'Key là identity của item. Index không ổn định khi insert/delete/sort.',
    example: 'todos.map(todo => <TodoRow key={todo.id} todo={todo} />)',
  },
  {
    id: 24,
    area: 'React',
    topic: 'useEffect',
    question: 'Effect dùng keyword để gọi API nhưng dependency array để []. Bug thực tế là gì?',
    options: ['Không bug vì React tự detect', 'Keyword đổi nhưng effect không chạy lại, data stale hoặc gọi API với keyword cũ', 'Component không mount', 'TS tự thêm dependency'],
    answer: 1,
    explanation: 'Dependency array phải chứa reactive values dùng trong effect. Thiếu dependency gây stale closure/data.',
    example: 'useEffect(() => { fetchUsers(keyword); }, [keyword]);',
  },
  {
    id: 25,
    area: 'React',
    topic: 'Cleanup',
    question: 'Component subscribe WebSocket theo roomId. Khi roomId đổi cần làm gì?',
    options: ['Không cần cleanup', 'Cleanup unsubscribe room cũ trước khi subscribe room mới', 'Reload page', 'Dùng any'],
    answer: 1,
    explanation: 'Cleanup tránh duplicate subscription, memory leak và message từ room cũ.',
    example: 'return () => socket.leave(roomId);',
  },
  {
    id: 26,
    area: 'React',
    topic: 'StrictMode',
    question: 'Dev thấy API trong useEffect bị gọi 2 lần khi bật StrictMode. Bạn giải thích thế nào?',
    options: ['React production bị lỗi', 'StrictMode dev cố tình chạy setup/cleanup thêm để phát hiện side effect không an toàn', 'Do CSS load 2 lần', 'Do TypeScript build 2 lần'],
    answer: 1,
    explanation: 'Không nên hack bỏ StrictMode; cần effect idempotent, cleanup/cancel request hoặc dùng data fetching library đúng.',
    example: 'Dev-only behavior; production không double invoke theo cách đó.',
  },
  {
    id: 27,
    area: 'React',
    topic: 'Memoization',
    question: 'Child bọc React.memo nhưng vẫn re-render vì parent truyền filters={{keyword}}. Lý do?',
    options: ['React.memo không hoạt động', 'Object inline tạo reference mới mỗi render nên shallow compare thấy đổi', 'Keyword là string nên lỗi', 'Do CSS class'],
    answer: 1,
    explanation: 'React.memo shallow compare. Object/function inline làm props đổi về reference.',
    example: 'const filters = useMemo(() => ({ keyword }), [keyword]);',
  },
  {
    id: 28,
    area: 'React',
    topic: 'useCallback',
    question: 'Khi nào useCallback thật sự có ích?',
    options: ['Bọc mọi function cho chắc', 'Khi cần giữ function reference stable, ví dụ truyền xuống child memo hoặc dependency hook khác', 'Để function chạy nhanh hơn bên trong', 'Để tránh mọi API call'],
    answer: 1,
    explanation: 'useCallback cache reference, không làm logic trong function tự nhanh hơn.',
    example: 'const onDelete = useCallback((id) => remove(id), [remove]);',
  },
  {
    id: 29,
    area: 'React',
    topic: 'Performance',
    question: 'Table 10.000 records bị lag. Bạn đề xuất gì trước khi thêm useMemo khắp nơi?',
    options: ['Render hết và thêm CSS', 'Pagination/virtualization, debounce filter, profiler đo điểm nghẽn, memo row nếu cần', 'Đổi tất cả sang any', 'Dùng index key'],
    answer: 1,
    explanation: 'Cần giảm số DOM và đo performance thực tế, không tối ưu mù.',
    example: 'react-window/react-virtualized hoặc pagination server-side.',
  },
  {
    id: 30,
    area: 'React',
    topic: 'Controlled vs uncontrolled',
    question: 'Form search nhỏ cần validate realtime keyword. Controlled hay uncontrolled hợp hơn?',
    options: ['Controlled thường hợp vì value cần sync state và validate realtime', 'Uncontrolled bắt buộc mọi form', 'Dùng Redux cho từng ký tự', 'Dùng div thay input'],
    answer: 0,
    explanation: 'Controlled phù hợp form nhỏ hoặc field cần phản hồi ngay. Form rất lớn có thể dùng RHF/uncontrolled để giảm re-render.',
    example: '<input value={keyword} onChange={e=>setKeyword(e.currentTarget.value)} />',
  },
  {
    id: 31,
    area: 'State Management',
    topic: 'State placement',
    question: 'Khi quyết định state đặt ở đâu, nguyên tắc đầu tiên là gì?',
    options: ['Đưa tất cả lên global store', 'Đặt gần nơi dùng nhất, chỉ lift/global khi có nhu cầu chia sẻ thật', 'Đưa hết vào localStorage', 'Đưa hết vào URL'],
    answer: 1,
    explanation: 'Mid-level cần phân loại local, lifted, URL, client global, server state thay vì dùng một store cho mọi thứ.',
    example: 'Modal local trong page; auth user global; product list server state.',
  },
  {
    id: 32,
    area: 'State Management',
    topic: 'Server state vs client state',
    question: 'Product list từ API, sidebarOpen, theme, current page filter. Bạn phân loại state thế nào?',
    options: ['Tất cả Redux', 'Product list: server state; sidebar/theme: client state; filter/page: URL state nếu cần share/refresh', 'Tất cả localStorage', 'Tất cả useRef'],
    answer: 1,
    explanation: 'Câu này nhà tuyển dụng rất hay hỏi để xem bạn chọn công cụ theo ownership/phạm vi.',
    example: 'TanStack Query cho products; Zustand/Context cho theme; searchParams cho page/filter.',
  },
  {
    id: 33,
    area: 'State Management',
    topic: 'Context performance',
    question: 'Một Context chứa user, theme, notificationCount làm nhiều component re-render. Cách xử lý?',
    options: ['Tách context theo domain, memoize value hoặc dùng store có selector khi phù hợp', 'Đưa thêm state vào context', 'Tắt StrictMode', 'Dùng index key'],
    answer: 0,
    explanation: 'Context không tự tối ưu re-render. Provider value đổi làm consumer phụ thuộc update.',
    example: 'AuthContext riêng, ThemeContext riêng; useMemo cho value.',
  },
  {
    id: 34,
    area: 'State Management',
    topic: 'Redux Toolkit',
    question: 'Trong Redux Toolkit, vì sao reducer có thể viết state.value++?',
    options: ['Vì Redux giờ mutate thật', 'Vì RTK dùng Immer: viết như mutate draft nhưng tạo immutable update phía sau', 'Vì React không cần immutable', 'Vì TS bỏ qua'],
    answer: 1,
    explanation: 'Hiểu Immer giúp tránh trả lời sai kiểu “Redux Toolkit cho mutate trực tiếp”.',
    example: 'increment: state => { state.value += 1 }',
  },
  {
    id: 35,
    area: 'State Management',
    topic: 'Redux selector',
    question: 'useSelector(state => ({user: state.user, theme: state.theme})) có thể gây vấn đề gì?',
    options: ['Object mới mỗi lần, strict equality thấy đổi và re-render nhiều hơn', 'Không đọc được state', 'Redux cấm object', 'Chỉ lỗi CSS'],
    answer: 0,
    explanation: 'React-Redux useSelector mặc định so sánh ===. Trả object mới cần shallowEqual hoặc memoized selector/tách selector.',
    example: 'useSelector(selectUser); useSelector(selectTheme);',
  },
  {
    id: 36,
    area: 'State Management',
    topic: 'Zustand',
    question: 'Với Zustand, vì sao nên dùng useStore(s => s.user) thay vì useStore()?',
    options: ['Để component chỉ subscribe slice cần dùng, giảm re-render không liên quan', 'Vì useStore() không chạy', 'Để gọi API tự động', 'Để thay TS'],
    answer: 0,
    explanation: 'Selector là điểm quan trọng khi store lớn hơn. Lấy cả store dễ re-render khi bất kỳ field nào đổi.',
    example: 'const userName = useAuthStore(s => s.user?.name);',
  },
  {
    id: 37,
    area: 'State Management',
    topic: 'Logout cleanup',
    question: 'Khi logout, ngoài xoá token còn cần làm gì trong app có Query + global store?',
    options: ['Chỉ navigate login là đủ', 'Reset auth/permission/cart/modal store và clear query cache liên quan user', 'Đổi theme', 'Không cần làm gì'],
    answer: 1,
    explanation: 'Nếu không reset, user sau có thể thấy dữ liệu/cache của user trước.',
    example: 'queryClient.clear(); authStore.reset(); cartStore.reset();',
  },
  {
    id: 38,
    area: 'API / Data',
    topic: 'Axios architecture',
    question: 'Vì sao không nên axios.get trực tiếp rải rác trong component?',
    options: ['Khó quản lý baseURL/token/error/refresh/retry và component lẫn data logic', 'Axios không chạy trong component', 'React cấm async', 'TS không import được axios'],
    answer: 0,
    explanation: 'Nên có axiosClient/service/query hook để tách UI khỏi data access và dễ test.',
    example: 'userService.getUsers(params) + useUsersQuery(params)',
  },
  {
    id: 39,
    area: 'API / Data',
    topic: 'Axios 401 refresh',
    question: 'Nhiều request cùng bị 401 một lúc. Refresh token flow cần chú ý gì?',
    options: ['Mỗi request tự refresh token riêng càng tốt', 'Dùng isRefreshing/queue để refresh một lần rồi retry requests pending, tránh loop bằng _retry', 'Bỏ qua 401', 'Clear storage trước khi refresh'],
    answer: 1,
    explanation: 'Nếu refresh 10 lần cùng lúc dễ race condition. Đây là case mid-level rất thực tế.',
    example: 'isRefreshing + failedQueue + originalRequest._retry',
  },
  {
    id: 40,
    area: 'API / Data',
    topic: 'TanStack Query key',
    question: 'getUsers({page, keyword, role}) nhưng queryKey chỉ là ["users"]. Bug gì?',
    options: ['Cache có thể sai giữa các page/filter', 'queryFn không chạy bao giờ', 'Object không được dùng trong key', 'TS không compile'],
    answer: 0,
    explanation: 'queryKey phải chứa đủ input ảnh hưởng data. Thiếu key làm UI dùng nhầm cache.',
    example: '["users", { page, keyword, role }]',
  },
  {
    id: 41,
    area: 'API / Data',
    topic: 'TanStack Query staleTime',
    question: 'Danh mục tỉnh/thành ít thay đổi. Config TanStack Query nào hợp lý hơn?',
    options: ['staleTime dài để giảm refetch', 'staleTime 0 bắt buộc mọi data', 'gcTime 0 để nhanh hơn', 'Không được cache'],
    answer: 0,
    explanation: 'Data ít đổi nên set staleTime phù hợp. Realtime/nhạy cảm thì staleTime ngắn hơn.',
    example: 'staleTime: 1000 * 60 * 60',
  },
  {
    id: 42,
    area: 'API / Data',
    topic: 'Mutation invalidation',
    question: 'Sau createUser thành công, danh sách users vẫn cũ. Bạn xử lý thế nào?',
    options: ['invalidateQueries hoặc setQueryData query liên quan', 'Reload browser luôn', 'Xoá node_modules', 'Đổi key component'],
    answer: 0,
    explanation: 'Mutation thay đổi server state; cache liên quan cần invalidate/refetch hoặc update trực tiếp.',
    example: 'queryClient.invalidateQueries({ queryKey: ["users"] });',
  },
  {
    id: 43,
    area: 'API / Data',
    topic: 'Optimistic update',
    question: 'Delete item optimistic update nhưng API fail. Cần chuẩn bị gì?',
    options: ['Không cần rollback', 'Snapshot previous data, update tạm, rollback onError, invalidate onSettled', 'Chỉ đổi màu UI', 'Tắt cache'],
    answer: 1,
    explanation: 'Optimistic update phải có rollback để UI không nói khác server.',
    example: 'onMutate → previous; onError → setQueryData(previous); onSettled → invalidate',
  },
  {
    id: 44,
    area: 'API / Data',
    topic: 'CORS',
    question: 'Gọi API bị CORS error. FE xử lý đúng hướng nào?',
    options: ['Thêm mode:"no-cors" để đọc JSON', 'Kiểm tra server CORS allow origin/method/header/credentials; dev có thể dùng proxy', 'Đổi TypeScript type', 'Dùng React Router'],
    answer: 1,
    explanation: 'CORS là browser security policy, chủ yếu cần server trả header đúng. no-cors không giúp đọc response JSON.',
    example: 'Access-Control-Allow-Origin + credentials config đúng.',
  },
  {
    id: 45,
    area: 'Router',
    topic: 'URL state',
    question: 'Màn users có keyword, role, page. Muốn share link và refresh không mất filter, lưu ở đâu?',
    options: ['Local state', 'URL search params', 'useRef', 'CSS variable'],
    answer: 1,
    explanation: 'Filter/sort/page thường là URL state. Local state phù hợp trạng thái tạm như dropdown open.',
    example: '/users?page=2&role=admin&keyword=nam',
  },
  {
    id: 46,
    area: 'Router',
    topic: 'Protected route',
    question: 'Route /admin cần check role trước khi vào. FE check đủ bảo mật chưa?',
    options: ['Đủ vì user không sửa được JS', 'FE chỉ là UX; backend/API vẫn phải enforce permission', 'Đủ nếu dùng enum Role', 'Đủ nếu ẩn menu'],
    answer: 1,
    explanation: 'FE code nằm ở client. User có thể gọi API trực tiếp. Backend phải check quyền thật.',
    example: 'UI guard + server authorization middleware.',
  },
  {
    id: 47,
    area: 'Router',
    topic: 'SPA fallback',
    question: 'Deploy React SPA, refresh /dashboard/users bị 404. Nguyên nhân phổ biến?',
    options: ['Server/static hosting chưa rewrite mọi route về index.html', 'React Router không hỗ trợ route sâu', 'useState lỗi production', 'CSS chưa import'],
    answer: 0,
    explanation: 'BrowserRouter route nằm ở client. Server phải fallback index.html cho route không phải asset/API.',
    example: 'Netlify _redirects: /* /index.html 200',
  },
  {
    id: 48,
    area: 'Form / Validation',
    topic: 'React Hook Form',
    question: 'Form 80 input bị lag do mỗi field controlled bằng useState. Hướng xử lý?',
    options: ['Đưa mọi field vào Redux', 'Dùng React Hook Form/uncontrolled, tách field, validation mode hợp lý', 'useEffect cho từng field', 'Tắt validation hoàn toàn'],
    answer: 1,
    explanation: 'RHF giảm re-render không cần thiết, phù hợp form lớn. Nhưng vẫn cần thiết kế validation tốt.',
    example: '<input {...register("email")} />',
  },
  {
    id: 49,
    area: 'Form / Validation',
    topic: 'Controller',
    question: 'Khi nào dùng Controller trong React Hook Form?',
    options: ['Mọi input native đều bắt buộc', 'Khi tích hợp controlled component ngoài như MUI Select/DatePicker/custom input', 'Khi muốn tắt validation', 'Khi tạo route guard'],
    answer: 1,
    explanation: 'Native input thường dùng register đủ. Controller dùng cho component không expose ref/onChange theo cách RHF register cần.',
    example: '<Controller name="date" control={control} render={({field}) => <DatePicker {...field} />} />',
  },
  {
    id: 50,
    area: 'Form / Validation',
    topic: 'Zod',
    question: 'TypeScript đã có type rồi, vì sao vẫn cần Zod cho API/form?',
    options: ['Vì TS validate runtime', 'Vì TS không validate runtime; Zod kiểm tra dữ liệu thật khi chạy và infer type từ schema', 'Vì Zod thay backend hoàn toàn', 'Vì Zod render UI'],
    answer: 1,
    explanation: 'API/form data là runtime input không đáng tin. TS chỉ giúp compile-time.',
    example: 'const result = UserSchema.safeParse(data);',
  },
  {
    id: 51,
    area: 'Form / Validation',
    topic: 'Server errors',
    question: 'Login API trả lỗi “email không tồn tại”. Với RHF nên đưa lỗi vào đâu?',
    options: ['Ghi thẳng innerHTML', 'setError("email", { message }) hoặc setError("root", ...) tuỳ lỗi field/global', 'Throw trong render', 'Không hiển thị'],
    answer: 1,
    explanation: 'Client validation pass nhưng server có business error. setError giúp UI form hiển thị đúng vị trí.',
    example: 'setError("email", { message: "Email không tồn tại" });',
  },
  {
    id: 52,
    area: 'Testing',
    topic: 'Testing Library',
    question: 'Test submit button nên query thế nào nếu có thể?',
    options: ['document.querySelector(".btn-primary")', 'screen.getByRole("button", { name: /submit/i })', 'childNodes[3]', 'getByTestId cho mọi thứ'],
    answer: 1,
    explanation: 'Testing Library khuyến khích query giống cách user/screen reader thấy UI, ít phụ thuộc implementation.',
    example: 'await user.click(screen.getByRole("button", { name: /login/i }));',
  },
  {
    id: 53,
    area: 'Testing',
    topic: 'Async UI',
    question: 'Sau submit login, message thành công xuất hiện sau API. Dùng query nào?',
    options: ['screen.getByText ngay lập tức', 'await screen.findByText(/thành công/i)', 'queryByText không await', 'innerHTML.includes'],
    answer: 1,
    explanation: 'findBy là async, chờ element xuất hiện. getBy phù hợp khi element phải có ngay.',
    example: 'expect(await screen.findByText(/đăng nhập thành công/i)).toBeInTheDocument();',
  },
  {
    id: 54,
    area: 'Testing',
    topic: 'MSW',
    question: 'Vì sao MSW thường tốt hơn mock axios trực tiếp trong integration test UI?',
    options: ['Mock ở network layer, test gần hành vi thật và không phụ thuộc HTTP client', 'MSW thay backend production', 'MSW chỉ test CSS', 'MSW không mock error'],
    answer: 0,
    explanation: 'Nếu đổi Axios sang fetch, test MSW vẫn gần như giữ nguyên vì mock theo request/response.',
    example: 'server.use(http.get("/api/users", () => HttpResponse.json(users)));',
  },
  {
    id: 55,
    area: 'Git / Build',
    topic: 'Git revert vs reset',
    question: 'Bạn đã push commit lỗi lên branch chung. Cách an toàn để đảo ngược?',
    options: ['git revert <commit>', 'git reset --hard rồi force push ngay', 'Xoá repo', 'git stash'],
    answer: 0,
    explanation: 'revert tạo commit mới đảo ngược, không rewrite history của team. reset/force push branch chung rất nguy hiểm.',
    example: 'git revert abc123',
  },
  {
    id: 56,
    area: 'Git / Build',
    topic: 'Rebase',
    question: 'Branch feature cá nhân lệch main. Muốn PR history sạch, bạn thường làm gì?',
    options: ['git fetch rồi git rebase origin/main trên branch cá nhân', 'Xoá .git', 'Copy file thủ công', 'Force push main'],
    answer: 0,
    explanation: 'Rebase phù hợp branch cá nhân để replay commit lên main mới. Không rebase branch shared bừa bãi.',
    example: 'git fetch origin && git rebase origin/main',
  },
  {
    id: 57,
    area: 'Git / Build',
    topic: 'Conflict',
    question: 'Resolve conflict tốt không phải chỉ bấm accept current/incoming. Bạn cần làm gì?',
    options: ['Hiểu logic hai bên, giữ đúng requirement, chạy test/build sau khi resolve', 'Luôn chọn current', 'Luôn chọn incoming', 'Xoá file conflict'],
    answer: 0,
    explanation: 'Conflict là xung đột logic. Mid-level phải biết đọc context và giữ thay đổi đúng của cả hai phía.',
    example: 'Resolve → npm test/build → review diff trước khi commit.',
  },
  {
    id: 58,
    area: 'Git / Build',
    topic: 'Vite env',
    question: 'Migrate CRA sang Vite, REACT_APP_API_URL bị undefined. Vì sao?',
    options: ['Vite dùng import.meta.env và chỉ expose biến prefix VITE_', 'Vite không hỗ trợ env', 'React không đọc env', 'Chỉ production có env'],
    answer: 0,
    explanation: 'Đây là lỗi migrate rất hay gặp. Client env của Vite cần prefix VITE_.',
    example: 'import.meta.env.VITE_API_URL',
  },
  {
    id: 59,
    area: 'Git / Build',
    topic: 'Production build',
    question: 'Dev chạy ổn nhưng production build lỗi import file trên Linux. Nguyên nhân phổ biến?',
    options: ['Sai hoa/thường path import', 'React không hỗ trợ production', 'useState chỉ chạy local', 'CSS flexbox lỗi'],
    answer: 0,
    explanation: 'Windows/macOS có thể không phân biệt hoa thường, Linux thường phân biệt. CI build giúp bắt lỗi này.',
    example: "import UserCard from './UserCard' nhưng file là userCard.jsx",
  },
  {
    id: 60,
    area: 'Security',
    topic: 'XSS',
    question: 'Backend trả HTML do user nhập, FE muốn render bằng dangerouslySetInnerHTML. Bạn làm gì?',
    options: ['Render ngay vì TypeScript đã type string', 'Sanitize/whitelist HTML, backend cũng validate, cân nhắc CSP và chỉ render khi thật sự cần', 'Đổi thành any', 'Tin user input'],
    answer: 1,
    explanation: 'HTML user-generated có rủi ro XSS. TypeScript không bảo vệ runtime content khỏi script độc hại.',
    example: 'DOMPurify.sanitize(html) trước khi render.',
  },
  {
    id: 61,
    area: 'Security',
    topic: 'Token storage',
    question: 'Lưu access token trong localStorage có rủi ro gì?',
    options: ['Nếu bị XSS, script độc hại có thể đọc token', 'localStorage tự mã hoá tuyệt đối', 'Browser không hỗ trợ localStorage', 'Token tự hết hạn sau 1 giây'],
    answer: 0,
    explanation: 'Auth storage cần cân nhắc threat model. httpOnly cookie giảm đọc token bằng JS nhưng cần xử lý CSRF/SameSite.',
    example: 'localStorage tiện nhưng nhạy với XSS.',
  },
  {
    id: 62,
    area: 'Rendering',
    topic: 'CSR vs SSR vs SSG',
    question: 'Nhà tuyển dụng hỏi: “Chọn CSR, SSR, SSG hay ISR cho feature này?” Cách trả lời tốt là gì?',
    options: ['Luôn chọn SSR vì nghe cao cấp', 'Hỏi/đánh giá SEO, freshness, user-specific data, cache, interactivity, traffic rồi chọn kèm trade-off', 'Luôn chọn CSR vì dễ', 'Framework tự quyết hết'],
    answer: 1,
    explanation: 'Mid-level phải biết tiêu chí chọn strategy, không trả lời theo trend.',
    example: 'Landing ít đổi: SSG; product nhiều trang: ISR; dashboard private: CSR/SSR auth tuỳ UX.',
  },
  {
    id: 63,
    area: 'Rendering',
    topic: 'Hydration',
    question: 'SSR page render Date.now() trực tiếp trong JSX. Rủi ro gì?',
    options: ['Hydration mismatch vì server time và client time khác nhau', 'Date.now không tồn tại', 'CSS mất tác dụng', 'Tăng SEO tự động'],
    answer: 0,
    explanation: 'Hydration cần markup server/client khớp. Giá trị random/time/browser-only dễ mismatch.',
    example: 'Render fallback ổn định rồi update trong useEffect nếu cần.',
  },
  {
    id: 64,
    area: 'Rendering',
    topic: 'Next.js client component',
    question: 'Trong Next App Router, khi nào cần “use client”?',
    options: ['Mọi file đều cần', 'Khi dùng state, effect, event handler, browser APIs hoặc custom hook client-side', 'Khi fetch data ở server', 'Khi muốn SEO'],
    answer: 1,
    explanation: 'Không nên đặt use client quá rộng vì tăng client bundle. Chỉ client hoá phần cần tương tác.',
    example: 'Button mở modal cần use client; article static không cần.',
  },
  {
    id: 65,
    area: 'Rendering',
    topic: 'Build-time vs runtime data',
    question: 'Data này lấy lúc build hay lúc chạy? Câu hỏi này đang kiểm tra điều gì?',
    options: ['Bạn hiểu freshness, cache, SEO, user-specific data, rebuild/deploy và server cost', 'Bạn nhớ npm script', 'Bạn biết CSS selector', 'Bạn dùng Git branch gì'],
    answer: 0,
    explanation: 'Chọn sai thời điểm lấy data có thể gây data cũ, leak data user hoặc performance kém.',
    example: 'Blog public ít đổi: build/cache; profile user: runtime theo session.',
  },
  {
    id: 66,
    area: 'Rendering',
    topic: 'ISR',
    question: 'Product detail public có hàng chục nghìn sản phẩm, cần SEO và cập nhật định kỳ. Strategy nào đáng cân nhắc?',
    options: ['ISR/revalidation hoặc hybrid cache strategy', 'CSR trắng hoàn toàn cho SEO', 'Rebuild toàn bộ mỗi phút', 'Không cache gì cả'],
    answer: 0,
    explanation: 'ISR giữ lợi ích static/CDN nhưng không phải rebuild toàn site khi một product đổi.',
    example: 'Product page ISR; stock realtime fetch riêng.',
  },
  {
    id: 67,
    area: 'Architecture',
    topic: 'Component size',
    question: 'Component UserManagement 900 dòng chứa API, table, filter, modal, form, validation. Refactor thế nào?',
    options: ['Tách UserTable, UserFilter, UserFormModal, hooks data, service, types/constants theo responsibility', 'Đổi tên file BigUserManagement là đủ', 'Đưa hết vào Redux', 'Copy thành nhiều file giống nhau'],
    answer: 0,
    explanation: 'Câu này kiểm tra tư duy maintainability. UI, data logic, service và types nên có trách nhiệm rõ.',
    example: 'features/users/components + hooks + services + types',
  },
  {
    id: 68,
    area: 'Architecture',
    topic: 'Feature-based structure',
    question: 'UserTable chỉ dùng trong feature users. Có nên đưa vào shared/components ngay không?',
    options: ['Không nên shared quá sớm; để trong features/users/components trước', 'Có, mọi component phải shared', 'Có vì tên là Table', 'Không thể có components trong feature'],
    answer: 0,
    explanation: 'Shared nên chứa thứ thật sự dùng chung nhiều feature. Shared folder rất dễ thành bãi chứa.',
    example: 'shared/Button dùng nhiều nơi; UserTable thuộc features/users.',
  },
  {
    id: 69,
    area: 'Architecture',
    topic: 'Mock API',
    question: 'BE chưa xong API nhưng FE cần làm UI trước. Cách làm chuyên nghiệp?',
    options: ['Dừng hoàn toàn tới khi BE xong', 'Thống nhất API contract, tạo mock service/MSW, type response, sau đó thay endpoint thật', 'Hard-code mọi thứ trong JSX', 'Không cần hỏi contract'],
    answer: 1,
    explanation: 'FE mid-level cần biết làm song song với BE bằng contract/mock, giảm blocking và phát hiện requirement sớm.',
    example: 'MSW handlers theo OpenAPI/contract tạm.',
  },
  {
    id: 70,
    area: 'Architecture',
    topic: 'Debug production',
    question: 'Production trắng màn sau deploy React app. Bạn debug theo thứ tự nào?',
    options: ['Đổi màu background trước', 'Mở Console/Network, check JS runtime error, chunk 404, env/base path, route fallback, API/config', 'Đổ lỗi backend ngay', 'Xoá node_modules trên server'],
    answer: 1,
    explanation: 'Nhà tuyển dụng muốn thấy cách debug có hệ thống, không đoán mò.',
    example: 'Console error + Network 404/chunk + env + build logs.',
  },
  {
    id: 71,
    area: 'Interview',
    topic: 'Project explanation',
    question: 'Khi được hỏi “feature khó nhất em từng làm là gì?”, cấu trúc trả lời tốt?',
    options: ['Chỉ nói em làm nhiều lắm', 'Bối cảnh → vấn đề → quyết định kỹ thuật → trade-off → kết quả', 'Chỉ kể tên thư viện', 'Nói không nhớ'],
    answer: 1,
    explanation: 'Level 2.5+ không chỉ liệt kê tech. Cần chứng minh bạn biết giải quyết vấn đề và trade-off.',
    example: 'Ví dụ: tối ưu table 10k records: đo profiler → virtualization → kết quả render giảm X.',
  },
  {
    id: 72,
    area: 'Interview',
    topic: 'Technical trade-off',
    question: 'Nếu interviewer hỏi “Tại sao không dùng Redux cho tất cả?”, trả lời nào tốt?',
    options: ['Vì em ghét Redux', 'Vì cần phân loại state; không nên global hoá local/server state nếu không cần, tránh coupling và duplicate source of truth', 'Vì Redux không chạy với React', 'Vì Context thay mọi thứ'],
    answer: 1,
    explanation: 'Trả lời tốt phải dựa vào bài toán, không dựa vào sở thích. Đây là trọng tâm nhà tuyển dụng hay đánh giá.',
    example: 'Server state dùng Query, form draft local/RHF, auth/theme global nếu cần.',
  },
];

const AREAS = ['Tất cả', ...Array.from(new Set(QUESTIONS.map((q) => q.area)))];
const alphabet = ['A', 'B', 'C', 'D'];

function getScoreLabel(percent) {
  if (percent >= 85) return 'Rất ổn - có thể đi phỏng vấn thử';
  if (percent >= 70) return 'Khá tốt - ôn lại các câu sai';
  if (percent >= 50) return 'Nắm được nền nhưng còn nhiều lỗ hổng';
  return 'Cần ôn lại theo từng nhóm trước khi phỏng vấn';
}

export default function App() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [area, setArea] = useState('Tất cả');
  const [topic, setTopic] = useState('Tất cả');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const areaQuestions = useMemo(() => {
    return area === 'Tất cả' ? QUESTIONS : QUESTIONS.filter((q) => q.area === area);
  }, [area]);

  const topics = useMemo(() => ['Tất cả', ...Array.from(new Set(areaQuestions.map((q) => q.topic)))], [areaQuestions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter((q) => {
      const selected = answers[q.id];
      const topicOk = topic === 'Tất cả' || q.topic === topic;
      const modeOk = mode === 'all'
        || (mode === 'unanswered' && selected === undefined)
        || (mode === 'wrong' && selected !== undefined && selected !== q.answer)
        || (mode === 'correct' && selected === q.answer);
      const searchOk = !keyword || `${q.area} ${q.topic} ${q.question} ${q.explanation} ${q.example || ''}`.toLowerCase().includes(keyword);
      return topicOk && modeOk && searchOk;
    });
  }, [areaQuestions, topic, mode, search, answers]);

  const result = useMemo(() => {
    const correct = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    return { correct, total: QUESTIONS.length, percent: Math.round((correct / QUESTIONS.length) * 100) };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const areaCounts = useMemo(() => AREAS.reduce((acc, item) => {
    acc[item] = item === 'Tất cả' ? QUESTIONS.length : QUESTIONS.filter((q) => q.area === item).length;
    return acc;
  }, {}), []);

  function selectAnswer(id, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: optionIndex }));
  }

  function resetQuiz() {
    setAnswers({});
    setArea('Tất cả');
    setTopic('Tất cả');
    setMode('all');
    setSearch('');
    setSubmitted(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-shell">
      <div className="page">
        <header className="hero card glass">
          <div className="hero-copy">
            <span className="eyebrow">FE React Interview Quiz · recruiter-style</span>
            <h1>Câu hỏi FE React đúng kiểu nhà tuyển dụng</h1>
            <p>
              Bộ câu hỏi đã bỏ kiểu sinh máy móc “Theo docs...”. Mỗi câu tập trung vào case thực tế, quyết định kỹ thuật,
              trade-off và lỗi hay gặp ở level khoảng 2.5+ năm.
            </p>
            <div className="source-box">
              <span>HTML/CSS: semantic, accessibility, layout, responsive, stacking context</span>
              <span>JavaScript/TypeScript: event loop, async, closure, generic, utility types, runtime validation</span>
              <span>React: state, effects, keys, memoization, performance, forms</span>
              <span>State/API: Redux Toolkit, Zustand, TanStack Query, Axios, URL state</span>
              <span>Build/Deploy/Security: Vite, Git, SPA fallback, XSS, token storage, rendering strategy</span>
            </div>
          </div>
          <div className="score-card">
            <span>Tiến độ</span>
            <strong>{answeredCount}/{QUESTIONS.length}</strong>
            <div className="progress"><i style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }} /></div>
            {submitted && (
              <div className="final-score">
                <b>{result.percent}%</b>
                <small>Đúng {result.correct}/{result.total} · {getScoreLabel(result.percent)}</small>
              </div>
            )}
          </div>
        </header>

        <section className="toolbar card glass">
          <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Tìm: event loop, Redux, hydration, Axios, form, XSS..." />
          <div className="chips row-scroll">
            {[
              ['all', 'Tất cả'],
              ['unanswered', 'Chưa làm'],
              ['wrong', 'Câu sai'],
              ['correct', 'Câu đúng'],
            ].map(([value, label]) => (
              <button key={value} onClick={() => setMode(value)} className={mode === value ? 'active magenta' : ''}>{label}</button>
            ))}
          </div>
          <div className="label">Vùng ôn tập</div>
          <div className="chips row-scroll">
            {AREAS.map((item) => (
              <button key={item} onClick={() => { setArea(item); setTopic('Tất cả'); }} className={area === item ? 'active green' : ''}>
                {item} <em>{areaCounts[item]}</em>
              </button>
            ))}
          </div>
          <div className="label">Chủ đề cụ thể</div>
          <div className="chips row-scroll">
            {topics.map((item) => (
              <button key={item} onClick={() => setTopic(item)} className={topic === item ? 'active cyan' : ''}>{item}</button>
            ))}
          </div>
          <div className="actions">
            {!submitted ? <button className="submit" onClick={() => setSubmitted(true)}>Nộp bài</button> : <button className="reset" onClick={resetQuiz}>Làm lại</button>}
          </div>
        </section>

        <main className="questions">
          {filtered.map((q) => {
            const selected = answers[q.id];
            const hasAnswered = selected !== undefined;
            const isCorrect = selected === q.answer;
            return (
              <article key={q.id} className="question card glass">
                <div className="q-head">
                  <div>
                    <div className="badges"><span>Câu {q.id}</span><span>{q.topic}</span><span>{q.area}</span></div>
                    <h2>{q.question}</h2>
                  </div>
                  {hasAnswered && <strong className={isCorrect ? 'ok' : 'bad'}>{isCorrect ? 'Đúng' : 'Sai'}</strong>}
                </div>
                <div className="options">
                  {q.options.map((option, index) => {
                    const className = hasAnswered && index === q.answer ? 'right' : hasAnswered && selected === index && selected !== q.answer ? 'wrong' : selected === index ? 'chosen' : '';
                    return (
                      <button key={option} className={className} onClick={() => selectAnswer(q.id, index)}>
                        <b>{alphabet[index]}</b><span>{option}</span>
                      </button>
                    );
                  })}
                </div>
                {hasAnswered && (
                  <div className={isCorrect ? 'feedback good' : 'feedback danger'}>
                    <p><b>Bạn chọn:</b> {q.options[selected]}</p>
                    <p><b>Đáp án đúng:</b> {q.options[q.answer]}</p>
                    <p><b>Vì sao nhà tuyển dụng hỏi câu này:</b> {q.explanation}</p>
                    {q.example && <p className="example"><b>Ví dụ:</b> {q.example}</p>}
                  </div>
                )}
              </article>
            );
          })}
        </main>
      </div>
    </div>
  );
}
