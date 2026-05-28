import React, { useMemo, useState } from 'react';

const item = (category, level, question, answer, example = '') => ({ category, level, question, answer, example });

const BANK = [
  item('JavaScript', 'Cơ bản', 'JavaScript trong frontend dùng để làm gì?', 'JavaScript xử lý logic chạy trên browser: event, form, DOM, gọi API, render dữ liệu, xử lý async và tương tác người dùng. Với React, JavaScript là nền tảng để hiểu component, state, props, hooks và rendering.', 'Validate form, gọi API users, xử lý click button.'),
  item('JavaScript', 'Cơ bản', 'Primitive type và reference type khác nhau thế nào?', 'Primitive copy theo value như string, number, boolean. Object, array, function copy theo reference, nên nếu mutate object thì nơi khác giữ cùng reference cũng bị ảnh hưởng.', 'const b = a; b.name = "An" có thể đổi a.name nếu a là object.'),
  item('JavaScript', 'Cơ bản', '== và === khác nhau thế nào?', '== có ép kiểu ngầm nên dễ gây kết quả khó đoán. === so sánh cả type và value, thường nên dùng trong code thực tế.', '0 == false là true, nhưng 0 === false là false.'),
  item('JavaScript', 'Trung bình', 'Truthy và falsy cần chú ý gì khi render UI?', 'Falsy gồm false, 0, chuỗi rỗng, null, undefined, NaN. Trong UI, 0 hoặc chuỗi rỗng có thể là dữ liệu hợp lệ nên không nên check if(value) bừa.', 'Số lượng sản phẩm = 0 vẫn cần hiển thị 0.'),
  item('JavaScript', 'Trung bình', 'Closure là gì?', 'Closure là function ghi nhớ scope nơi nó được tạo ra. Closure xuất hiện rất nhiều trong callback, debounce, event handler, setTimeout và React hooks.', 'Callback trong setInterval có thể giữ state cũ nếu viết effect sai.'),
  item('JavaScript', 'Trung bình', 'Hoisting là gì?', 'Hoisting là cách JavaScript xử lý khai báo trước khi thực thi. var được hoist với undefined, function declaration có thể gọi trước, let và const có temporal dead zone.', 'console.log(a); var a = 1; kết quả là undefined.'),
  item('JavaScript', 'Trung bình', 'Event loop là gì?', 'Event loop điều phối call stack, microtask và macrotask. Sync code chạy trước, sau đó microtask như Promise, rồi mới tới macrotask như setTimeout.', 'Thứ tự thường gặp: sync -> Promise.then -> setTimeout.'),
  item('JavaScript', 'Trung bình', 'Promise.all và Promise.allSettled khác nhau thế nào?', 'Promise.all fail-fast khi một promise lỗi. Promise.allSettled chờ tất cả xong và trả trạng thái từng promise, hợp dashboard có nhiều block độc lập.', 'Banner lỗi không nhất thiết làm hỏng cả trang dashboard.'),
  item('JavaScript', 'Thực tế', 'Debounce và throttle khác nhau thế nào?', 'Debounce đợi người dùng ngừng thao tác rồi chạy. Throttle giới hạn số lần chạy trong một khoảng thời gian. Search input thường dùng debounce, scroll thường dùng throttle.', 'Search user debounce 300ms trước khi gọi API.'),
  item('JavaScript', 'Thực tế', 'AbortController dùng để làm gì?', 'AbortController giúp hủy request hoặc tác vụ async có hỗ trợ signal. Trong search API, nó tránh response cũ ghi đè response mới khi user gõ nhanh.', 'Khi keyword đổi, hủy request keyword cũ.'),
  item('JavaScript', 'Thực tế', 'Array map, forEach, filter, find, some, every, reduce khác nhau thế nào?', 'map trả array mới, forEach chỉ lặp side effect, filter trả array lọc, find trả item đầu tiên, some/every trả boolean, reduce gom array thành một giá trị.', 'Dùng reduce để tạo object usersById.'),
  item('JavaScript', 'Thực tế', 'sort có mutate array không?', 'Có. sort thay đổi array gốc. Trong React nên copy array trước khi sort để tránh mutate state.', 'const sorted = [...users].sort(compareFn).'),

  item('JavaScript ES6+', 'Cơ bản', 'let, const và var khác nhau thế nào?', 'let và const là block scoped, có temporal dead zone. var là function scoped. const không cho gán lại binding nhưng object bên trong vẫn có thể thay đổi.', 'const arr = []; arr.push(1) vẫn hợp lệ.'),
  item('JavaScript ES6+', 'Cơ bản', 'Arrow function khác function thường ở this thế nào?', 'Arrow function không có this riêng, nó lấy this từ lexical scope. Function thường có this tùy cách gọi.', 'Arrow không phù hợp làm method cần this động trong object.'),
  item('JavaScript ES6+', 'Cơ bản', 'Destructuring dùng để làm gì?', 'Destructuring lấy dữ liệu từ object hoặc array ra biến ngắn gọn. Rất hay dùng với props, response API và hooks.', 'const { id, name } = user; const [open, setOpen] = useState(false).'),
  item('JavaScript ES6+', 'Cơ bản', 'Rest và spread khác nhau thế nào?', 'Rest gom phần còn lại. Spread trải dữ liệu ra vị trí mới. Object spread và array spread chỉ shallow copy.', 'function sum(...nums){}; const next = { ...user, name: "An" }.'),
  item('JavaScript ES6+', 'Trung bình', 'Optional chaining và nullish coalescing dùng khi nào?', 'Optional chaining tránh lỗi khi truy cập null hoặc undefined. Nullish coalescing chỉ fallback khi giá trị là null hoặc undefined, không fallback với 0 hoặc chuỗi rỗng.', 'user?.profile?.name ?? "Chưa có tên".'),
  item('JavaScript ES6+', 'Trung bình', 'ES module import/export giúp gì?', 'ES module giúp chia code thành file nhỏ, import/export rõ ràng, hỗ trợ tree-shaking và tổ chức project tốt hơn.', 'export function getUsers(){}; import { getUsers } from "./api".'),

  item('TypeScript', 'Cơ bản', 'TypeScript là gì?', 'TypeScript là JavaScript có thêm hệ thống kiểu tĩnh ở giai đoạn phát triển. Nó giúp phát hiện lỗi sớm, autocomplete tốt, refactor an toàn và mô tả rõ props, API, form, state.', 'Type sai props sẽ báo ngay trong editor hoặc lúc build.'),
  item('TypeScript', 'Cơ bản', 'any và unknown khác nhau thế nào?', 'any tắt kiểm tra type và dễ che lỗi. unknown an toàn hơn vì bắt buộc kiểm tra hoặc narrowing trước khi dùng.', 'Dữ liệu từ API nên coi là unknown nếu chưa validate.'),
  item('TypeScript', 'Trung bình', 'Generic là gì?', 'Generic giúp viết code tái sử dụng mà vẫn giữ type cụ thể. Nó tốt hơn any vì không làm mất type safety.', 'function identity<T>(value: T): T { return value; }'),
  item('TypeScript', 'Trung bình', 'keyof và typeof dùng khi nào?', 'keyof lấy danh sách key của một type. typeof trong type context lấy type từ một value. Hay dùng cho table columns, form fields, route config.', 'type UserKey = keyof User.'),
  item('TypeScript', 'Nâng cao', 'Discriminated union là gì?', 'Discriminated union là union có field chung để phân biệt từng case, ví dụ status hoặc type. Rất hợp async state, reducer, API result.', 'loading, success, error state nên biểu diễn bằng union.'),
  item('TypeScript React', 'Thực tế', 'Type props và children trong React như thế nào?', 'Props nên được khai báo bằng type hoặc interface rõ ràng. children thường dùng React.ReactNode vì có thể là string, number, element, null hoặc array.', 'type Props = { title: string; children: React.ReactNode }.'),
  item('TypeScript React', 'Thực tế', 'Type useState với null hoặc array rỗng thế nào?', 'Nếu initial là null hoặc array rỗng, nên truyền generic rõ để TypeScript không infer quá hẹp như null hoặc never[].', 'useState<User | null>(null); useState<User[]>([]).'),

  item('React', 'Cơ bản', 'React là gì?', 'React là thư viện JavaScript để xây UI theo component, declarative rendering và one-way data flow. UI được mô tả theo state và props.', 'Component UserCard nhận user và render thông tin user.'),
  item('React', 'Cơ bản', 'JSX là gì?', 'JSX là cú pháp mô tả UI trong JavaScript, được compile thành React element. JSX không phải HTML thuần nên dùng className, htmlFor, onClick camelCase.', '<button className="btn">Save</button>.'),
  item('React', 'Cơ bản', 'Props và state khác nhau thế nào?', 'Props là input từ parent truyền xuống và readonly với child. State là dữ liệu nội bộ component, thay đổi qua setter và làm render lại.', 'props user, state open modal.'),
  item('React', 'Trung bình', 'Controlled và uncontrolled component khác nhau thế nào?', 'Controlled input do React state điều khiển qua value hoặc checked. Uncontrolled input lưu value trong DOM và đọc qua ref hoặc FormData.', 'Form nhiều field có thể dùng React Hook Form theo hướng uncontrolled/ref.'),
  item('React', 'Trung bình', 'Key trong list dùng để làm gì?', 'Key giúp React nhận diện item giữa các lần render để reconcile đúng. Không nên dùng index nếu list có thêm, xóa, sort hoặc local state.', 'users.map(user => <Row key={user.id} />).'),
  item('React', 'Trung bình', 'useEffect dùng để làm gì?', 'useEffect dùng để đồng bộ component với external system như API, timer, event listener, subscription. Không nên dùng effect cho dữ liệu tính được từ props/state.', 'fullName = firstName + lastName không cần useEffect.'),
  item('React', 'Trung bình', 'Dependency array của useEffect nên chứa gì?', 'Nên chứa các reactive values được đọc trong effect như props, state, function hoặc object trong component scope. Thiếu dependency gây stale closure.', 'fetch user theo userId thì dependency có userId.'),
  item('React', 'Trung bình', 'useMemo, useCallback và React.memo khác nhau thế nào?', 'useMemo memo value, useCallback memo function reference, React.memo memo component render theo shallow compare props. Không nên lạm dụng nếu chưa đo performance.', 'Memo row trong table lớn khi thật sự cần.'),
  item('React', 'Nâng cao', 'Render phase và commit phase khác nhau thế nào?', 'Render phase tính UI mới và nên pure. Commit phase cập nhật DOM thật và chạy effect. Không nên gọi API hoặc mutate dữ liệu trong render body.', 'Side effect nên nằm trong event handler hoặc effect.'),
  item('React', 'Nâng cao', 'Error Boundary bắt lỗi nào?', 'Error Boundary bắt lỗi render/lifecycle trong subtree. Nó không tự bắt lỗi async, event handler hoặc network error nếu không xử lý riêng.', 'Bọc chart widget để một widget lỗi không làm trắng cả page.'),
  item('React', 'Nâng cao', 'Portal dùng khi nào?', 'Portal render UI ra DOM node khác như document.body nhưng vẫn thuộc React tree. Dùng cho modal, tooltip, dropdown, toast để tránh overflow hoặc z-index parent.', 'createPortal modal vào body.'),
  item('React', 'Nâng cao', 'StrictMode double effect trong dev có phải bug không?', 'Không. StrictMode cố ý chạy thêm trong dev để phát hiện effect thiếu cleanup hoặc side effect không an toàn.', 'Subscription phải return cleanup.'),
  item('React Performance', 'Thực tế', 'Table 10.000 records bị lag xử lý thế nào?', 'Đo bằng Profiler trước, sau đó dùng pagination hoặc virtualization, debounce filter, memo row đúng chỗ và tránh tính toán nặng trong render.', 'TanStack Virtual hoặc react-window.'),

  item('State Management', 'Cơ bản', 'Local state, global state, URL state và server state khác nhau thế nào?', 'Local state nằm trong component. Global client state share xa. URL state cần share/refresh/back-forward. Server state là dữ liệu remote cần cache, refetch và đồng bộ.', 'modalOpen local, theme global, filter URL, users list server state.'),
  item('State Management', 'Cơ bản', 'Context API dùng để làm gì?', 'Context truyền value qua nhiều cấp component để tránh prop drilling. Hợp theme, locale, current user ít đổi. Không phải state manager tối ưu cho mọi global state.', 'ThemeContext hoặc LocaleContext.'),
  item('Redux', 'Trung bình', 'Redux là gì?', 'Redux là state container quản lý client global state qua store, action, reducer và dispatch. Redux mạnh ở predictability, convention, middleware và DevTools.', 'dispatch action add item vào cart.'),
  item('Redux Toolkit', 'Trung bình', 'Redux Toolkit là gì?', 'Redux Toolkit là bộ công cụ chính thức giúp viết Redux ít boilerplate hơn. Nó có configureStore, createSlice, createAsyncThunk, createEntityAdapter, RTK Query và Immer.', 'createSlice tự sinh action và reducer.'),
  item('Redux Toolkit', 'Trung bình', 'createSlice dùng để làm gì?', 'createSlice gom name, initialState, reducers và tự tạo action creators. Nhờ Immer có thể viết mutate draft trong reducer nhưng vẫn tạo immutable update.', 'state.value++ trong reducer RTK là hợp lệ.'),
  item('Redux Toolkit', 'Trung bình', 'createAsyncThunk dùng khi nào?', 'Dùng để tạo async action có pending, fulfilled, rejected. Hợp khi cần async flow thủ công nhưng không cần cache server state phức tạp.', 'fetchUsers pending set loading, fulfilled set data.'),
  item('Redux Toolkit', 'Nâng cao', 'RTK Query khác createAsyncThunk thế nào?', 'RTK Query chuyên server state: cache, dedupe request, generated hooks, invalidation, polling. createAsyncThunk chỉ tạo lifecycle action, cache phải tự quản.', 'useGetUsersQuery(params).'),
  item('Redux Toolkit', 'Nâng cao', 'createEntityAdapter dùng làm gì?', 'createEntityAdapter giúp quản lý collection normalized dạng ids và entities, có CRUD reducers/selectors sẵn.', 'usersAdapter.upsertMany(state, users).'),

  item('AJAX / REST API', 'Cơ bản', 'AJAX là gì?', 'AJAX là kỹ thuật gửi nhận dữ liệu bất đồng bộ với server mà không reload toàn bộ trang. Ngày nay thường dùng fetch hoặc Axios.', 'Search autocomplete gọi API khi user gõ.'),
  item('AJAX / REST API', 'Cơ bản', 'RESTful API là gì?', 'RESTful API thiết kế quanh resource, HTTP method, status code và stateless request. URL đại diện tài nguyên, method đại diện hành động.', 'GET /users, POST /users, PATCH /users/:id, DELETE /users/:id.'),
  item('AJAX / REST API', 'Trung bình', 'GET, POST, PUT, PATCH, DELETE khác nhau thế nào?', 'GET lấy dữ liệu, POST tạo hoặc trigger action, PUT thay thế toàn bộ resource, PATCH cập nhật một phần, DELETE xóa resource.', 'PATCH chỉ gửi field cần đổi.'),
  item('AJAX / REST API', 'Trung bình', 'HTTP status code frontend cần nắm?', '2xx thành công, 400 lỗi request, 401 chưa xác thực, 403 không đủ quyền, 404 không tìm thấy, 409 conflict, 422 validation, 500 lỗi server.', '401 xử lý đăng nhập lại, 403 báo không có quyền.'),
  item('Axios', 'Cơ bản', 'Axios instance dùng để làm gì?', 'Axios instance gom baseURL, timeout, headers mặc định, interceptor và error handling ở một nơi, tránh gọi HTTP rải rác trong component.', 'apiClient.get("/users").'),
  item('Axios', 'Trung bình', 'Axios interceptor dùng để làm gì?', 'Request interceptor chuẩn hóa request trước khi gửi. Response interceptor chuẩn hóa error, xử lý hết phiên đăng nhập hoặc retry theo convention dự án. Không nên nhét JSX hoặc hook trực tiếp vào interceptor.', 'Normalize error thành message và fieldErrors cho UI.'),
  item('TanStack Query', 'Cơ bản', 'TanStack Query quản lý gì?', 'TanStack Query quản lý server state: loading, error, cache, stale data, refetch, retry, mutation, invalidation, optimistic update. Nó không thay thế local UI state.', 'users list dùng useQuery, modalOpen dùng useState.'),
  item('TanStack Query', 'Trung bình', 'queryKey nên thiết kế thế nào?', 'queryKey là identity của cache. Nó cần chứa đủ input ảnh hưởng data như id, page, keyword, filter để không dùng nhầm cache.', '["users", { page, keyword, role }].'),
  item('TanStack Query', 'Trung bình', 'enabled dùng khi nào?', 'enabled giúp query chỉ chạy khi đủ điều kiện như có id, có session, hoặc query trước đã có data.', 'enabled: Boolean(userId).'),
  item('TanStack Query', 'Trung bình', 'staleTime và gcTime khác nhau thế nào?', 'staleTime là thời gian data còn fresh. gcTime là thời gian cache inactive được giữ trước khi bị dọn.', 'Danh mục tỉnh thành có thể staleTime dài.'),
  item('TanStack Query', 'Nâng cao', 'Optimistic update cần xử lý gì?', 'Cần snapshot dữ liệu cũ, update tạm UI/cache, rollback nếu request lỗi và invalidate/refetch khi hoàn tất để đồng bộ lại với server.', 'Like count tăng ngay, fail thì rollback.'),
  item('TanStack Router', 'Trung bình', 'TanStack Router mạnh ở điểm nào?', 'TanStack Router mạnh ở type-safe route params, search params, navigate, nested route, loader, beforeLoad và context trong TypeScript app.', 'validateSearch parse page và sort từ URL.'),

  item('Rendering', 'Cơ bản', 'SPA là gì?', 'SPA là Single Page Application: app tải một HTML chính rồi điều hướng client-side mà không reload toàn bộ document. React Router thường dùng cho SPA.', 'Vite React + BrowserRouter.'),
  item('Rendering', 'Cơ bản', 'CSR là gì? CRS có phải CSR không?', 'CSR là Client-Side Rendering. HTML ban đầu ít nội dung, browser tải JS bundle rồi React render UI ở client. Nếu viết CRS thường là nhầm CSR.', 'index.html -> main.js -> React render -> gọi API.'),
  item('Rendering', 'Cơ bản', 'SSR là gì?', 'SSR là Server-Side Rendering: server render HTML theo request, gửi HTML có nội dung về browser, sau đó client hydrate để tương tác.', 'Trang product render HTML server để tốt hơn cho SEO.'),
  item('Rendering', 'Cơ bản', 'SSG là gì?', 'SSG là Static Site Generation: HTML được tạo sẵn lúc build và serve từ CDN/static hosting. Hợp landing, blog, docs, content public ít đổi.', 'Blog/documentation site.'),
  item('Rendering', 'Trung bình', 'ISR là gì?', 'ISR là Incremental Static Regeneration: vẫn serve static page nhưng có cơ chế revalidate sau build theo thời gian hoặc on-demand.', 'Product page public revalidate 60s.'),
  item('Rendering', 'Trung bình', 'Hydration là gì?', 'Hydration là quá trình React gắn event handler và state vào HTML đã render từ server để UI tương tác được.', 'Server có HTML, client hydrate button click.'),
  item('Rendering', 'Nâng cao', 'Hydration mismatch do đâu?', 'Do HTML server render và client render ban đầu khác nhau. Hay gặp khi render Date.now, Math.random, dữ liệu browser-only hoặc khác timezone.', 'Đọc browser storage trong effect thay vì render server.'),
  item('Rendering', 'Trung bình', 'Khi chọn CSR, SSR, SSG, ISR cần phân tích gì?', 'Cần xét SEO, freshness, user-specific data, auth, cacheability, interactivity, traffic, server cost và deploy constraints.', 'Landing SSG, product ISR, dashboard CSR hoặc SSR auth-aware.'),
  item('Rendering', 'Thực tế', 'Refresh route sâu bị 404 khi deploy SPA do đâu?', 'Server/static hosting chưa rewrite mọi route về index.html, nên route như /users/1 bị tìm như file thật.', 'Cần fallback về index.html.'),

  item('HTML/CSS', 'Cơ bản', 'HTML5 cần nắm gì?', 'Cần nắm semantic tags, form, label, input, button, accessibility cơ bản, meta viewport, async/defer và SEO cơ bản.', 'Dùng button thật thay div onClick cho action.'),
  item('HTML/CSS', 'Cơ bản', 'CSS3 cần nắm gì?', 'Cần nắm box model, cascade, specificity, flex, grid, position, responsive, pseudo-class, pseudo-element, transition và custom properties.', 'Grid cho layout hai chiều, Flex cho layout một chiều.'),
  item('HTML/CSS', 'Trung bình', 'SCSS và Tailwind CSS khác nhau thế nào?', 'SCSS mở rộng CSS bằng variables, nesting, mixins. Tailwind là utility-first CSS. Dù dùng gì vẫn phải hiểu CSS gốc.', 'Tailwind: md:grid-cols-2 hover:bg-blue-500.'),
  item('Responsive / Performance', 'Trung bình', 'Responsive Design là gì?', 'Responsive Design giúp UI thích ứng nhiều kích thước màn hình bằng fluid layout, media query, flexible grid, responsive image và mobile-first mindset.', 'Mobile-first dùng min-width breakpoint.'),
  item('Responsive / Performance', 'Trung bình', 'Browser Compatibility là gì?', 'Đảm bảo app chạy đúng trên browser/version mục tiêu. Cần kiểm tra API/CSS support, polyfill, transpilation target và test thật.', 'Kiểm tra support của :has hoặc container query.'),
  item('Responsive / Performance', 'Trung bình', 'Tối ưu tốc độ tải trang gồm gì?', 'Giảm bundle size, code splitting, lazy load, tối ưu ảnh, cache, CDN, preload tài nguyên quan trọng, giảm render blocking và tối ưu API.', 'Lazy load route admin và nén ảnh WebP/AVIF.'),
  item('PWA', 'Cơ bản', 'PWA là gì?', 'Progressive Web App là web app có trải nghiệm gần native hơn: installable, offline support, service worker, manifest và caching.', 'manifest.json + service worker.'),
  item('PWA', 'Trung bình', 'Service Worker là gì?', 'Service worker là script chạy nền giữa app và network, có thể intercept request, cache response, hỗ trợ offline, background sync và push notification.', 'Service worker có lifecycle install, activate, fetch.'),
  item('PWA', 'Trung bình', 'Caching strategy trong PWA gồm gì?', 'Cache First hợp asset ít đổi, Network First hợp data cần mới, Stale While Revalidate vừa trả cache nhanh vừa cập nhật nền.', 'Static asset dùng Cache First, API news dùng Network First.'),
  item('PWA', 'Trung bình', 'Workbox là gì?', 'Workbox là bộ thư viện giúp tạo service worker, precache, runtime cache và caching strategy dễ hơn viết thủ công.', 'Dùng Workbox để cấu hình Stale While Revalidate.'),

  item('Auth / JWT', 'Cơ bản', 'JWT là gì?', 'JWT là JSON Web Token gồm header, payload và signature. Thường dùng cho xác thực hoặc ủy quyền. Payload chỉ encode, không phải mã hóa mặc định.', 'Không nên đặt dữ liệu nhạy cảm trong payload.'),
  item('Auth / JWT', 'Trung bình', 'Access token và refresh token khác nhau thế nào?', 'Access token sống ngắn và dùng gọi API. Refresh token sống dài hơn để lấy access token mới và cần bảo vệ kỹ hơn.', 'Access token vài phút, refresh token lâu hơn.'),
  item('Auth / JWT', 'Trung bình', 'FE ẩn nút theo role có đủ bảo mật không?', 'Không. FE chỉ cải thiện UX. Backend vẫn phải kiểm tra quyền ở API vì user có thể gọi request trực tiếp.', 'Ẩn nút Delete không thay thế permission check server.'),
];

const CATEGORIES = ['Tất cả', ...Array.from(new Set(BANK.map(i => i.category)))];
const LEVELS = ['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao', 'Thực tế'];

function badge(level) {
  if (level === 'Cơ bản') return 'bg-blue-600 text-white';
  if (level === 'Trung bình') return 'bg-emerald-600 text-white';
  if (level === 'Nâng cao') return 'bg-violet-600 text-white';
  return 'bg-cyan-400 text-slate-950';
}

export default function AppTheoryFull() {
  const [category, setCategory] = useState('Tất cả');
  const [level, setLevel] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return BANK.filter(i => {
      const okCategory = category === 'Tất cả' || i.category === category;
      const okLevel = level === 'Tất cả' || i.level === level;
      const text = `${i.category} ${i.level} ${i.question} ${i.answer} ${i.example}`.toLowerCase();
      return okCategory && okLevel && (!keyword || text.includes(keyword));
    });
  }, [category, level, search]);

  const counts = useMemo(() => CATEGORIES.reduce((acc, c) => {
    acc[c] = c === 'Tất cả' ? BANK.length : BANK.filter(i => i.category === c).length;
    return acc;
  }, {}), []);

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">FE Interview Theory Full</div>
            <h1 className="text-xl font-black md:text-2xl">Hỏi & hiển thị lý thuyết luôn</h1>
            <p className="text-sm text-slate-400">Đủ JS/ES6, TypeScript, React, Redux Toolkit, Axios, TanStack, SPA/CSR/SSR/SSG/ISR, Performance, PWA.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
            <div className="text-2xl font-black text-cyan-200">{BANK.length}</div>
            <div className="text-xs text-slate-400">mục lý thuyết</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Tìm kiếm</div>
            <input value={search} onChange={e => setSearch(e.currentTarget.value)} className="w-full rounded-2xl border border-white/10 bg-[#121722] px-4 py-3 text-sm outline-none placeholder:text-slate-500" placeholder="Tìm react, redux, csr, axios..." />
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Level</div>
            <select value={level} onChange={e => setLevel(e.currentTarget.value)} className="w-full rounded-2xl border border-white/10 bg-[#121722] px-4 py-3 text-sm outline-none">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Chủ đề</div>
            <div className="space-y-1">
              {CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${category === c ? 'bg-blue-600/25 text-blue-100 ring-1 ring-blue-400/30' : 'text-slate-300 hover:bg-white/5'}`}><span>{c}</span><span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{counts[c]}</span></button>)}
            </div>
          </div>
        </aside>

        <main>
          <section className="mb-5 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-500/10 p-5 md:p-7">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">Full FE theory bank</div>
            <h2 className="mt-3 text-2xl font-black md:text-4xl">Ôn lý thuyết FE React 2.5+ năm</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Không trắc nghiệm. Mỗi mục có câu hỏi, ý trả lời và ví dụ thực tế để luyện nói phỏng vấn.</p>
            <div className="mt-4 text-sm text-slate-400">Đang hiển thị <b className="text-white">{filtered.length}</b>/<b className="text-white">{BANK.length}</b> mục.</div>
          </section>

          <div className="space-y-4">
            {filtered.map((i, index) => <article key={`${i.category}-${i.question}`} className="rounded-3xl border border-white/10 bg-[#171922] p-5 shadow-xl shadow-black/20">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${badge(i.level)}`}>{i.level}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">{i.category}</span>
              </div>
              <h3 className="text-lg font-black leading-7 text-white md:text-xl">{i.question}</h3>
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-slate-200"><b className="text-cyan-200">Lý thuyết trả lời:</b> {i.answer}</div>
              {i.example && <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-cyan-100"><span className="font-sans font-bold text-cyan-300">Ví dụ:</span> {i.example}</div>}
            </article>)}
          </div>
        </main>
      </div>
    </div>
  );
}
