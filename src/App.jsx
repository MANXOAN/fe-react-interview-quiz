import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-react-interview-quiz-progress-v1';

const AREAS = [
  ['all', 'Tất cả'],
  ['html-css', 'HTML/CSS'],
  ['js', 'JavaScript / ES6+ / Event Loop'],
  ['ts', 'TypeScript'],
  ['react', 'React'],
  ['state', 'State / Redux / Zustand'],
  ['api', 'Axios / TanStack / Form / Zod'],
  ['rendering', 'SPA / SSR / SSG / ISR'],
  ['testing-build', 'Testing / Git / Vite / Security'],
];

const SOURCES = [
  'React Docs: state, effects, hooks, memoization, Strict Mode, Suspense, transitions',
  'MDN Web Docs: HTML/CSS, JavaScript ES6+, Promise, async/await, event loop, browser APIs',
  'TypeScript Handbook: narrowing, generics, utility types, conditional types, template literal types',
  'Redux Toolkit Docs: configureStore, createSlice, createAsyncThunk, createEntityAdapter, RTK Query',
  'React-Redux Docs: Provider, useSelector, useDispatch, typed hooks',
  'TanStack Query/Router Docs: query keys, staleTime, mutation, invalidation, loaders, search params, beforeLoad',
  'Axios Docs: instances, request config, interceptors, cancellation, error handling',
  'React Hook Form + Zod Docs: register, Controller, resolver, field arrays, schema validation',
  'Testing Library Docs: query priority, user-event, findBy, waitFor, behavior-focused tests',
  'Git SCM + Vite + Next.js Docs: branching, rebase, build, env, CSR, SSR, SSG, ISR, hydration',
];

const CONCEPTS = [
  ['html-css','Semantic HTML','MDN HTML','Dùng thẻ đúng ý nghĩa như header, nav, main, section, article, footer để browser, SEO và assistive tech hiểu cấu trúc trang.','Dùng div/span cho mọi thứ khiến code khó đọc và accessibility kém.','<main><article><h1>React interview</h1></article></main>'],
  ['html-css','Accessible form','MDN HTML Forms','Input nên có label liên kết bằng htmlFor/id; button trong form cần type rõ ràng để tránh submit ngoài ý muốn.','Chỉ dùng placeholder thay label hoặc quên type="button" trong form.','<label htmlFor="email">Email</label><input id="email" type="email" />'],
  ['html-css','Icon button','MDN Accessibility','Icon-only button cần accessible name như aria-label và nên dùng button thật để có keyboard/focus mặc định.','Dùng div onClick cho nút xoá/sửa khiến người dùng bàn phím và screen reader khó dùng.','<button aria-label="Xóa người dùng" type="button">🗑</button>'],
  ['html-css','Flexbox','MDN CSS Flexbox','Flexbox phù hợp layout một chiều như navbar, button group, căn giữa item theo hàng/cột.','Dùng flex để ép mọi layout hai chiều lớn như dashboard phức tạp.','display:flex; align-items:center; justify-content:space-between;'],
  ['html-css','CSS Grid','MDN CSS Grid','Grid phù hợp layout hai chiều như dashboard, gallery, card list có hàng và cột rõ.','Dùng absolute/margin hard-code cho layout tổng thể làm responsive dễ vỡ.','display:grid; grid-template-columns:240px 1fr;'],
  ['html-css','Stacking context','MDN CSS z-index','z-index chỉ so sánh trong cùng stacking context; transform, opacity, position + z-index có thể tạo context mới.','Tăng z-index rất lớn nhưng không kiểm tra parent stacking context hoặc portal.','Modal nên render qua portal/body khi bị overflow/z-index parent chặn.'],
  ['html-css','Responsive units','MDN CSS Values','rem, %, minmax, clamp và media/container queries giúp UI scale tốt hơn width/height cứng.','Set pixel cố định cho mọi màn hình khiến mobile vỡ layout.','grid-template-columns:repeat(auto-fit,minmax(240px,1fr));'],
  ['js','let const var','MDN JavaScript','let/const block-scoped và có TDZ; var function-scoped và hoist thành undefined.','Dùng var trong loop/callback dẫn tới bug scope khó thấy.','for (let i=0;i<3;i++) setTimeout(()=>console.log(i));'],
  ['js','const binding','MDN JavaScript','const khóa binding chứ không làm object immutable sâu; property bên trong vẫn có thể đổi.','Nghĩ const object thì không thể mutate property.','const user={name:"A"}; user.name="B";'],
  ['js','Primitive vs reference','MDN JavaScript','Primitive copy theo value; object, array, function copy theo reference.','Shallow copy object rồi mutate nested field làm đổi cả object gốc.','const copy={...user}; copy.address.city="HN";'],
  ['js','Equality and coercion','MDN Equality','=== so sánh cả type/value; == ép kiểu ngầm và dễ tạo bug.','Dùng == cho logic permission/status/flag quan trọng.','0 == false // true; 0 === false // false'],
  ['js','Truthy falsy','MDN Boolean','Falsy gồm false, 0, -0, empty string, null, undefined, NaN.','if(count) làm mất trường hợp count=0 hợp lệ.','if (count !== null && count !== undefined) {...}'],
  ['js','Nullish coalescing','MDN ??','?? chỉ fallback khi null/undefined; || fallback với mọi falsy như 0, false, empty string.','Dùng || cho discountPercent=0 hoặc page=0 hợp lệ.','const page = query.page ?? 1;'],
  ['js','Optional chaining','MDN Optional chaining','?. tránh throw khi truy cập qua null/undefined nhưng không thay thế validation dữ liệu.','Lạm dụng ?. để che API contract sai làm UI trống khó debug.','user?.profile?.name'],
  ['js','Rest and spread','MDN Rest/Spread','Rest gom phần còn lại; spread trải array/object/iterable ra, object spread chỉ shallow copy.','Tưởng spread là deep clone và mutate nested state trực tiếp.','const next={...user,name:"Nam"};'],
  ['js','Array methods','MDN Array','map biến đổi, filter lọc, reduce gom data, find lấy item đầu tiên, some/every kiểm tra điều kiện.','Dùng forEach để return array mới hoặc filter()[0] khi chỉ cần find.','orders.reduce((acc,o)=>({...acc,[o.status]:[...(acc[o.status]||[]),o]}),{})'],
  ['js','Mutating array methods','MDN Array','sort, splice, push mutate mảng gốc; slice/map/filter không mutate.','sort trực tiếp trên React state array rồi set lại cùng reference.','const sorted=[...users].sort((a,b)=>a.name.localeCompare(b.name));'],
  ['js','Map Set WeakMap','MDN Collections','Map cho key linh hoạt, Set giữ unique values, WeakMap lưu metadata theo object không giữ strong reference.','Dùng object thường cho key là object/function rồi bị stringify sai.','const unique=[...new Set(ids)];'],
  ['js','Prototype and class','MDN Prototype/Class','class trong JS là cú pháp thuận tiện trên prototype-based inheritance.','Nghĩ class JS hoàn toàn giống Java và không liên quan prototype chain.','class User { say(){ return this.name } }'],
  ['js','Modules','MDN Modules','ES modules import/export tĩnh giúp bundler phân tích dependency graph và tree-shaking.','Dùng import động/tùy tiện khi không cần làm bundle khó tối ưu.','import { debounce } from "./utils";'],
  ['js','Closure','MDN Closures','Closure là function nhớ lexical scope nơi nó được tạo; rất quan trọng cho debounce, callback, hooks.','Không hiểu closure dẫn tới stale closure trong useEffect/timer.','function counter(){let n=0; return()=>++n}'],
  ['js','Promise all','MDN Promise','Promise.all chạy song song và reject nếu một promise reject; allSettled đợi mọi promise settle.','await tuần tự các request độc lập làm page chậm.','const [a,b]=await Promise.all([fetchA(),fetchB()]);'],
  ['js','Event loop','MDN Execution Model','JS chạy run-to-completion; microtask như Promise.then chạy trước task như setTimeout.','Nghĩ setTimeout 0 chạy trước Promise.then.','console.log(1); Promise.resolve().then(()=>console.log(2)); setTimeout(()=>console.log(3));'],
  ['js','Async await','MDN async function','await tạm dừng async function và phần sau chạy tiếp qua promise job, không block toàn bộ main thread.','Nghĩ await biến JS thành sync blocking thật.','async function f(){ console.log(1); await 0; console.log(2) }'],
  ['js','AbortController','MDN AbortController','AbortController hủy request cũ khi query đổi hoặc component unmount, giảm race condition.','Để response search cũ ghi đè response mới.','const c=new AbortController(); fetch(url,{signal:c.signal});'],
  ['ts','Structural typing','TypeScript Handbook','TypeScript chủ yếu structural typing: hợp shape là assign được, không cần cùng tên type.','Nghĩ tên type khác thì luôn không tương thích.','type A={x:number}; type B={x:number};'],
  ['ts','Union and intersection','TypeScript Handbook','Union là hoặc; intersection là và/gộp shape, cần cẩn thận khi property conflict.','Dùng intersection cho type conflict mà không kiểm tra never.','type Admin = User & { role:"admin" }'],
  ['ts','Narrowing','TypeScript Handbook','Narrowing làm hẹp type qua typeof, in, instanceof, equality, control flow và type guard.','Ép as any/as User thay vì guard dữ liệu unknown.','if (typeof value === "string") value.toUpperCase();'],
  ['ts','Discriminated union','TypeScript Handbook','Union có field literal chung như status/type giúp switch case an toàn và tránh state mâu thuẫn.','Dùng nhiều boolean loading/success/error dễ vừa success vừa error.','{status:"success",data} | {status:"error",message}'],
  ['ts','Generic constraint','TypeScript Handbook','Generic giúp tái sử dụng logic mà vẫn giữ type; constraint đảm bảo field cần dùng tồn tại.','Dùng any thay generic hoặc truy cập item.id trên T không constraint.','function getId<T extends {id:string}>(x:T){return x.id}'],
  ['ts','keyof indexed access','TypeScript Handbook','keyof lấy union key; T[K] lấy type value theo key, hợp cho form/update helpers.','Cho key:string và value:any khiến update sai field không bị bắt.','function get<T,K extends keyof T>(obj:T,key:K):T[K]{return obj[key]}'],
  ['ts','Utility types','TypeScript Handbook','Partial, Pick, Omit, Record, Required, Exclude, Extract, NonNullable giúp biến đổi type phổ biến.','Viết lại DTO thủ công rồi lệch với domain type.','type UpdateUser = Partial<Omit<User,"id">>'],
  ['ts','Conditional and infer','TypeScript Handbook','Conditional type và infer cho phép suy luận type con trong type phức tạp.','Dùng infer như runtime logic.','type Item<T> = T extends Array<infer U> ? U : never'],
  ['ts','Awaited ReturnType','TypeScript Handbook','Awaited<ReturnType<typeof fn>> lấy type data resolve từ async function.','Copy type response thủ công rồi lệch với service.','type User = Awaited<ReturnType<typeof fetchUser>>'],
  ['ts','satisfies','TypeScript 4.9','satisfies check object thỏa shape nhưng giữ literal inference cụ thể.','Dùng as ép type làm mất check config.','const routes = {...} satisfies Record<string,RouteConfig>'],
  ['ts','React typing','React + TS','React.ReactNode hợp cho children; event nên dùng React.ChangeEvent/FormEvent đúng element.','Dùng any cho event/children hoặc JSX.Element cho mọi children.','type Props={children:React.ReactNode}'],
  ['react','Props and state','React Docs','Props là input readonly; state là memory nội bộ làm component re-render khi đổi.','Mutate props/state trực tiếp thay vì setter/immutable update.','const [count,setCount]=useState(0)'],
  ['react','Immutable update','React Docs','Update object/array state cần tạo reference mới ở nhánh đổi.','push/splice/sort trực tiếp trên state.','setUser(p=>({...p,address:{...p.address,city:"HN"}}))'],
  ['react','Keys','React Docs','Key là identity ổn định để React reconcile list đúng khi add/remove/sort.','Dùng index làm key cho list có input/checkbox và reorder.','items.map(item => <Row key={item.id} />)'],
  ['react','Derived state','React Docs','Nếu tính được từ props/state hiện tại thì không cần state/effect riêng.','Dùng useEffect để set fullName từ firstName/lastName.','const fullName = `${firstName} ${lastName}`'],
  ['react','Controlled vs uncontrolled','React Docs','Controlled input lấy value từ state; uncontrolled để DOM/form lib quản lý value.','Dùng controlled cho form rất lớn mà không tối ưu hoặc dùng ref cho mọi validate realtime.','<input value={email} onChange={e=>setEmail(e.target.value)} />'],
  ['react','useEffect','React Docs','useEffect dùng để đồng bộ external systems như API, timer, listener, subscription.','Dùng effect cho mọi calculation trong render hoặc thiếu dependencies.','useEffect(()=>{ const id=setInterval(...); return()=>clearInterval(id); },[])'],
  ['react','Strict Mode','React Docs','Strict Mode trong dev cố tình chạy thêm setup/cleanup để phát hiện side effect lỗi.','Thấy effect chạy 2 lần rồi hack bỏ cleanup.','StrictMode chỉ là dev check.'],
  ['react','Memoization','React Docs','useMemo cache value, useCallback cache function reference, React.memo shallow compare props.','Bọc mọi thứ bằng memo khi chưa đo performance.','const onDelete=useCallback(id=>remove(id),[remove])'],
  ['react','useRef','React Docs','useRef lưu mutable value không gây render hoặc truy cập DOM.','Dùng ref để giữ UI state cần render.','inputRef.current?.focus()'],
  ['react','useReducer','React Docs','useReducer hợp state nhiều action/transition phức tạp.','Dùng reducer cho boolean open/close đơn giản làm thừa.','dispatch({type:"increment"})'],
  ['react','Concurrent hooks','React Docs','useTransition/useDeferredValue giúp ưu tiên update quan trọng và trì hoãn render nặng.','Dùng chúng thay debounce/API cache trong mọi case.','startTransition(()=>setFiltered(bigList))'],
  ['react','Error Boundary and Portal','React Docs','Error Boundary bắt lỗi render subtree; Portal render modal/tooltip ra DOM node khác.','Nghĩ ErrorBoundary bắt mọi async error hoặc render modal trong parent bị overflow chặn.','createPortal(<Modal/>, document.body)'],
  ['state','State placement','React Docs','Đặt state gần nơi dùng nhất, chỉ lift/global khi thật sự cần share.','Đưa mọi state lên Redux/Zustand.','Search input local; auth user global.'],
  ['state','Context','React Docs','Context truyền dữ liệu sâu như theme/locale/auth, nhưng không tự tối ưu mọi re-render.','Dùng Context làm cache API thay TanStack Query.','<ThemeContext.Provider value={value}>'],
  ['state','Client vs server state','TanStack Query Docs','Client state do UI sở hữu; server state nằm remote, async, stale/cache/refetch.','Đưa toàn bộ API data vào global client store.','Product list: query; sidebarOpen: client store.'],
  ['state','URL state','Router Docs','Filter/page/sort/search nên ở URL nếu cần share/bookmark/refresh không mất.','Đưa hover/password/draft nhạy cảm lên URL.','/users?page=2&role=admin'],
  ['state','Redux flow','Redux Docs','UI dispatch action, reducer tính next state, store update, UI đọc lại theo one-way data flow.','Component sửa store trực tiếp hoặc gọi API trong reducer.','dispatch(counterActions.increment())'],
  ['state','configureStore','Redux Toolkit Docs','configureStore setup reducer, middleware mặc định, DevTools và dev checks.','Tự viết createStore cũ cho project mới không cần thiết.','configureStore({ reducer:{auth,users} })'],
  ['state','createSlice','Redux Toolkit Docs','createSlice sinh reducer/action creators và dùng Immer cho draft mutation.','Tưởng state.value++ mutate state thật.','const slice=createSlice({name,initialState,reducers})'],
  ['state','createAsyncThunk','Redux Toolkit Docs','createAsyncThunk sinh pending/fulfilled/rejected cho async logic.','Không xử lý rejected/loading state hoặc không dùng rejectWithValue cho server errors.','builder.addCase(fetchUsers.fulfilled,...)'],
  ['state','createEntityAdapter','Redux Toolkit Docs','Entity adapter quản lý collection normalized ids/entities và CRUD selectors/reducers.','Lưu trùng entity ở list/detail nhiều nơi.','adapter.upsertMany(state, users)'],
  ['state','React Redux hooks','React-Redux Docs','Provider cấp store; useSelector đọc state; useDispatch dispatch action; typed hooks giúp TS tốt hơn.','Selector trả object mới mỗi lần gây re-render.','const user=useAppSelector(s=>s.auth.user)'],
  ['state','RTK Query','Redux Toolkit Docs','RTK Query quản lý server state trong hệ sinh thái Redux, có hooks và tag invalidation.','Đưa server cache vào slice thủ công khi RTK Query đã đủ.','api.endpoints.getUsers.useQuery()'],
  ['state','Zustand','Zustand Docs','Zustand store gọn, selector giúp component subscribe đúng slice, persist lưu chọn lọc.','useStore() lấy cả store hoặc persist token/server state bừa bãi.','useAuthStore(s=>s.user?.name)'],
  ['api','Axios instance','Axios Docs','axios.create tạo instance có baseURL, timeout, headers, interceptors.','Gọi axios.get rải rác trong component.','const api=axios.create({baseURL,timeout:15000})'],
  ['api','Axios interceptors','Axios Docs','Request interceptor gắn token; response interceptor normalize/handle error/refresh token.','Gọi React hooks trong interceptor hoặc không eject interceptor tạo trong component.','api.interceptors.request.use(config=>config)'],
  ['api','Axios error and cancel','Axios Docs','Phân biệt error.response/error.request/setup; dùng AbortController signal để hủy request cũ.','Alert chung mọi lỗi và để response cũ ghi đè response mới.','api.get(url,{signal:controller.signal})'],
  ['api','TanStack Query key','TanStack Query Docs','queryKey phải ổn định và chứa đủ input ảnh hưởng data.','Dùng ["users"] cho mọi page/filter hoặc Date.now trong key.','["users", {page, keyword}]'],
  ['api','TanStack staleTime gcTime','TanStack Query Docs','staleTime là độ fresh; gcTime là thời gian giữ cache inactive.','Nhầm staleTime với thời gian xóa cache.','staleTime: 60_000'],
  ['api','TanStack mutation','TanStack Query Docs','useMutation cho create/update/delete, sau đó invalidate hoặc update cache.','Dùng useQuery cho POST submit.','useMutation({mutationFn:createUser,onSuccess:()=>invalidate})'],
  ['api','Optimistic update','TanStack Query Docs','Optimistic update cần snapshot, update tạm, rollback khi error, invalidate khi settled.','Update UI trước mà không rollback nếu fail.','onMutate lưu previousTodos'],
  ['api','React Hook Form','React Hook Form Docs','register cho uncontrolled input, Controller cho controlled UI libs, reset cho edit form.','Controlled state cho 80 input làm form lag hoặc setValue từng field trong render.','<input {...register("email")} />'],
  ['api','Zod','Zod Docs','parse throw, safeParse trả result; refine/transform/coerce/optional-nullable-nullish xử lý runtime validation.','Chỉ dựa TypeScript type cho dữ liệu API/form runtime.','const result = UserSchema.safeParse(data)'],
  ['api','Router params','React Router / TanStack Router Docs','Dynamic params lấy id/slug; search params cho filter/page; beforeLoad guard auth/permission.','Lưu filter URL vào local state rồi refresh mất.','/users/:id?page=2'],
  ['rendering','SPA CSR','React/Vite Docs','SPA/CSR tải HTML chính rồi JS render UI ở client.','Dùng CSR thuần cho mọi trang SEO/public content.','Vite React admin dashboard thường CSR tốt.'],
  ['rendering','SSR','React DOM / Next Docs','SSR render HTML ở server theo request rồi hydrate ở client.','Nghĩ SSR luôn làm app interactive nhanh hơn.','Server render profile theo cookie/session.'],
  ['rendering','SSG ISR','Next Docs','SSG render static HTML ở build time; ISR cập nhật static page sau build bằng revalidation.','Dùng SSG cho private per-user dashboard hoặc rebuild toàn bộ site mỗi phút.','Blog dùng SSG, product detail dùng ISR.'],
  ['rendering','Hydration','React DOM Docs','Hydration attach React vào HTML server-rendered để có tương tác.','Render Date.now/localStorage khác server gây mismatch.','hydrateRoot(container, <App />)'],
  ['rendering','Server Client Components','Next Docs','Server Component fetch data/secret ở server; Client Component cho state/event/browser API.','Đặt use client ở layout gốc không cần thiết.','use client chỉ ở component có onClick/useState.'],
  ['rendering','Build runtime data','Next/Vite Docs','Build-time data lấy khi build; runtime/request data lấy theo user/request/interaction.','Cache chung dữ liệu cá nhân hoặc mong build-time data tự fresh từng request.','getStaticProps/generateStaticParams vs SSR/client fetch.'],
  ['rendering','Streaming','Next Docs','Streaming gửi từng phần HTML khi sẵn sàng, kết hợp Suspense/loading UI.','Chờ toàn bộ data chậm rồi mới gửi HTML.','loading.js trong App Router.'],
  ['rendering','CRA vs Vite','React Blog / Vite Docs','CRA deprecated cho app mới; Vite/build tool hiện đại hoặc framework được khuyến nghị.','Tạo app mới bằng CRA vì nghĩ vẫn recommended.','npm create vite@latest'],
  ['testing-build','Testing Library queries','Testing Library Docs','Ưu tiên query giống user: getByRole, getByLabelText, getByText; test behavior, không test implementation detail.','Query bằng className/DOM index làm test giòn.','screen.getByRole("button", {name:/submit/i})'],
  ['testing-build','Async testing','Testing Library Docs','findBy chờ element xuất hiện; waitFor chờ assertion bất kỳ đúng; userEvent mô phỏng user tốt hơn fireEvent.','Dùng getBy ngay cho UI sau API hoặc fireEvent cho mọi thao tác.','await screen.findByText(/success/i)'],
  ['testing-build','MSW','MSW/Testing Library','MSW mock network layer, test gần behavior thật và không phụ thuộc Axios/fetch implementation.','Mock HTTP client quá sát chi tiết.','server.use(http.get("/api/users", ...))'],
  ['testing-build','Git basics','Git SCM','Branch là con trỏ tới commit; HEAD là vị trí checkout; fetch khác pull; revert an toàn hơn reset trên branch shared.','Rebase branch shared bừa bãi hoặc force push main.','git fetch && git rebase origin/main'],
  ['testing-build','Vite env build','Vite Docs','Vite expose env client qua import.meta.env.VITE_*; build tạo dist static và cần base path đúng.','Dùng process.env.REACT_APP_* như CRA hoặc deploy subpath sai base.','import.meta.env.VITE_API_URL'],
  ['testing-build','Security','OWASP','XSS cần escape/sanitize/CSP; FE role check chỉ là UX; token storage cần cân nhắc XSS/CSRF.','Tin TypeScript string hoặc ẩn nút delete là đủ bảo mật.','Backend phải check permission cho API delete.'],
];

const QUESTION_TEMPLATES = [
  c => ({ question: `Theo docs, ${c.title} nên hiểu thế nào?`, correct: c.core }),
  c => ({ question: `Trong dự án thực tế, ${c.title} giúp xử lý vấn đề gì?`, correct: `Áp dụng khi cần ${c.core.charAt(0).toLowerCase() + c.core.slice(1)}` }),
  c => ({ question: `Sai lầm phổ biến với ${c.title} là gì?`, correct: c.pitfall }),
  c => ({ question: `Khi phỏng vấn về ${c.title}, câu trả lời nào tốt nhất?`, correct: `Nêu khái niệm, ví dụ thực tế, trade-off và lỗi thường gặp: ${c.core}` }),
];

const EXTRA_QUESTIONS = [
  ['state','State / Redux / TanStack','Redux Toolkit + TanStack Query Docs','Chọn Redux hay TanStack Query','Thường không copy API product list đã cache bằng TanStack Query vào Redux vì sẽ tạo hai source of truth.','Copy server state vào nhiều store rồi tự sync thủ công.','products: useQuery; sidebar/theme/auth UI: Zustand/Redux/Context.'],
  ['rendering','SSR / SSG / ISR','Next.js Docs','Chọn rendering strategy','Trang product public nhiều trang cần SEO và cập nhật định kỳ nên cân nhắc SSG/ISR hoặc hybrid cache strategy.','Dùng CSR trắng hoàn toàn cho mọi product public mà không cân nhắc SEO/cache.','Product detail dùng ISR, phần stock realtime fetch riêng.'],
  ['js','JavaScript Event Loop','MDN Execution Model','Thứ tự event loop','Thứ tự 1, 4, 3, 2 vì sync chạy trước, microtask Promise chạy trước task setTimeout.','Nghĩ setTimeout 0 luôn chạy ngay trước Promise.then.','Sync → microtask queue → task queue.'],
  ['ts','TypeScript Runtime Boundary','TypeScript Handbook + Zod Docs','TypeScript không validate runtime','API trả unknown thì nên dùng type guard hoặc schema validator như Zod trước khi dùng data.name.','Ép data as any/User rồi dùng ngay, dễ runtime crash khi API sai shape.','const parsed = UserSchema.safeParse(data);'],
];

function stableHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash;
}

function makeWrongOptions(concept, seed) {
  const pool = [
    `Bỏ qua ${concept.title} vì thư viện/framework sẽ tự xử lý mọi trường hợp.`,
    `Dùng any hoặc ép kiểu để tránh phải hiểu ${concept.title}.`,
    `Áp dụng ${concept.title} cho mọi tình huống mà không cần phân tích trade-off.`,
    `Chỉ cần nhớ cú pháp, không cần hiểu runtime behavior của ${concept.title}.`,
    `Đưa toàn bộ logic liên quan ${concept.title} vào global store để tiện gọi.`,
    `Xử lý ${concept.title} bằng CSS hoặc DOM thủ công thay vì đúng API/convention.`,
    `Dùng lại pattern cũ trong mọi dự án, không kiểm tra docs/version hiện tại.`,
  ];
  const start = seed % pool.length;
  return [pool[start], pool[(start + 2) % pool.length], pool[(start + 4) % pool.length]];
}

function buildQuestion(concept, index, variant) {
  const picked = QUESTION_TEMPLATES[variant](concept);
  const wrongs = makeWrongOptions(concept, index + variant);
  const raw = [picked.correct, ...wrongs];
  const shift = stableHash(`${concept.title}-${variant}`) % 4;
  const options = [...raw.slice(shift), ...raw.slice(0, shift)];
  return {
    id: index * QUESTION_TEMPLATES.length + variant + 1,
    area: concept.area,
    topic: concept.topic,
    source: concept.source,
    title: concept.title,
    question: picked.question,
    options,
    answer: options.indexOf(picked.correct),
    explanation: `${concept.core} Lỗi cần tránh: ${concept.pitfall}`,
    example: concept.example,
  };
}

const conceptObjects = CONCEPTS.map(c => ({ area: c[0], topic: c[1], source: c[2], title: c[3], core: c[4], pitfall: c[5], example: c[6] }));
const generated = conceptObjects.flatMap((concept, index) => QUESTION_TEMPLATES.map((_, variant) => buildQuestion(concept, index, variant)));
const extra = EXTRA_QUESTIONS.map((c, idx) => {
  const concept = { area:c[0], topic:c[1], source:c[2], title:c[3], core:c[4], pitfall:c[5], example:c[6] };
  return buildQuestion(concept, generated.length + idx, idx % QUESTION_TEMPLATES.length);
});
const ALL_QUESTIONS = [...generated, ...extra].slice(0, 452).map((q, index) => ({ ...q, id: index + 1 }));

function getScoreLabel(percent) {
  if (percent >= 85) return 'Rất ổn - nền tảng phỏng vấn mạnh';
  if (percent >= 70) return 'Khá tốt - cần vá vài lỗ hổng';
  if (percent >= 50) return 'Trung bình - nên ôn lại nhóm sai nhiều';
  return 'Cần ôn lại nền tảng trước khi phỏng vấn';
}

export default function App() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [submitted, setSubmitted] = useState(false);
  const [area, setArea] = useState('all');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const areaQuestions = useMemo(() => area === 'all' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.area === area), [area]);
  const topics = useMemo(() => ['all', ...Array.from(new Set(areaQuestions.map(q => q.topic)))], [areaQuestions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter(q => {
      const selected = answers[q.id];
      const topicOk = topic === 'all' || q.topic === topic;
      const modeOk = mode === 'all' || (mode === 'unanswered' && selected === undefined) || (mode === 'wrong' && selected !== undefined && selected !== q.answer) || (mode === 'correct' && selected === q.answer);
      const searchOk = !keyword || `${q.topic} ${q.title} ${q.question} ${q.explanation} ${q.example} ${q.source}`.toLowerCase().includes(keyword);
      return topicOk && modeOk && searchOk;
    });
  }, [areaQuestions, topic, mode, search, answers]);

  const result = useMemo(() => {
    const correct = ALL_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    return { correct, total: ALL_QUESTIONS.length, percent: Math.round((correct / ALL_QUESTIONS.length) * 100) };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const areaCounts = AREAS.reduce((acc, [id]) => {
    acc[id] = id === 'all' ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q => q.area === id).length;
    return acc;
  }, {});

  function choose(id, answer) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: answer }));
  }

  function resetQuiz() {
    setAnswers({}); setSubmitted(false); setArea('all'); setTopic('all'); setMode('all'); setSearch('');
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-shell">
      <div className="page">
        <header className="hero card glass">
          <div className="hero-copy">
            <span className="eyebrow">FE React Interview Quiz · 2.5+ years</span>
            <h1>Bộ trắc nghiệm FE React theo docs</h1>
            <p>{ALL_QUESTIONS.length} câu hỏi thực tế, bám theo docs chính thức và case phỏng vấn: JS ES6+, event loop, TypeScript, React, Redux Toolkit, TanStack, Axios, RHF, Zod, Git, Vite, SSR/SSG/ISR.</p>
            <div className="source-box">{SOURCES.map(source => <span key={source}>{source}</span>)}</div>
          </div>
          <div className="score-card">
            <span>Tiến độ</span><strong>{answeredCount}/{ALL_QUESTIONS.length}</strong>
            <div className="progress"><i style={{ width: `${(answeredCount / ALL_QUESTIONS.length) * 100}%` }} /></div>
            {submitted && <div className="final-score"><b>{result.percent}%</b><small>Đúng {result.correct}/{result.total} · {getScoreLabel(result.percent)}</small></div>}
          </div>
        </header>

        <section className="toolbar card glass">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm: Redux Toolkit, event loop, ES6, ISR, Axios..." />
          <div className="chips row-scroll">{['all','unanswered','wrong','correct'].map(value => <button key={value} onClick={() => setMode(value)} className={mode === value ? 'active magenta' : ''}>{value === 'all' ? 'Tất cả' : value === 'unanswered' ? 'Chưa làm' : value === 'wrong' ? 'Câu sai' : 'Câu đúng'}</button>)}</div>
          <div className="label">Vùng ôn tập</div>
          <div className="chips row-scroll">{AREAS.map(([id, label]) => <button key={id} onClick={() => { setArea(id); setTopic('all'); }} className={area === id ? 'active green' : ''}>{label} <em>{areaCounts[id]}</em></button>)}</div>
          <div className="label">Chủ đề cụ thể</div>
          <div className="chips row-scroll">{topics.map(t => <button key={t} onClick={() => setTopic(t)} className={topic === t ? 'active cyan' : ''}>{t === 'all' ? 'Tất cả chủ đề' : t}</button>)}</div>
          <div className="actions">{!submitted ? <button className="submit" onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Nộp bài</button> : <button className="reset" onClick={resetQuiz}>Làm lại</button>}</div>
        </section>

        <main className="questions">
          {filtered.map(q => {
            const selected = answers[q.id]; const done = selected !== undefined; const correct = selected === q.answer;
            return <article key={q.id} className="question card glass">
              <div className="q-head"><div><div className="badges"><span>Câu {q.id}</span><span>{q.topic}</span><span>Docs-driven</span></div><h2>{q.question}</h2></div>{done && <strong className={correct ? 'ok' : 'bad'}>{correct ? 'Đúng' : 'Sai'}</strong>}</div>
              <div className="options">{q.options.map((option, idx) => { const cls = done && idx === q.answer ? 'right' : done && idx === selected && selected !== q.answer ? 'wrong' : selected === idx ? 'chosen' : ''; return <button key={option} className={cls} onClick={() => choose(q.id, idx)}><b>{String.fromCharCode(65 + idx)}</b><span>{option}</span></button>; })}</div>
              {done && <div className={correct ? 'feedback good' : 'feedback danger'}><p><b>Bạn chọn:</b> {q.options[selected]}</p><p><b>Đáp án đúng:</b> {q.options[q.answer]}</p><p><b>Giải thích:</b> {q.explanation}</p><p className="example"><b>Ví dụ:</b> {q.example}</p><small>Nguồn định hướng: {q.source}</small></div>}
            </article>;
          })}
        </main>
      </div>
    </div>
  );
}
