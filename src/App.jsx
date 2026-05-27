import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-react-interview-quiz-v5';

const AREAS = [
  { id: 'all', label: 'Tất cả', icon: '✨' },
  { id: 'html-css', label: 'HTML/CSS', icon: '🌐' },
  { id: 'js-ts', label: 'JavaScript / TypeScript', icon: '🟨' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'state', label: 'State Management', icon: '🧠' },
  { id: 'api-router', label: 'API / Router', icon: '🔌' },
  { id: 'form-test', label: 'Form / Testing', icon: '🧪' },
  { id: 'rendering', label: 'Rendering / Build Data', icon: '🚀' },
  { id: 'git-build-security', label: 'Git / Build / Security', icon: '🛠️' },
  { id: 'project', label: 'Project / Interview', icon: '📦' },
];

const WRONG_BY_AREA = {
  'html-css': ['Chỉ cần nhìn giống design là đủ', 'Dùng div và !important cho nhanh', 'Không liên quan SEO/accessibility'],
  'js-ts': ['Ép any hoặc bỏ qua runtime behavior', 'Chỉ là cú pháp, không tạo bug thực tế', 'Dùng một cách cho mọi case'],
  react: ['Đưa mọi logic vào useEffect/global store', 'Mutate trực tiếp state/props', 'Bọc mọi thứ bằng memo là tối ưu chuẩn'],
  state: ['Đưa toàn bộ state vào Redux/Zustand', 'Persist mọi thứ vào localStorage', 'Không cần phân biệt local/client/server/URL state'],
  'api-router': ['Gọi API trực tiếp rải rác trong JSX', 'Reload page sau mọi mutation là chuẩn SPA', 'FE route guard là bảo mật cuối cùng'],
  'form-test': ['Dùng any và chỉ test className là đủ', 'Bỏ qua lỗi server vì client đã validate', 'Chỉ snapshot toàn app'],
  rendering: ['Luôn chọn SSR vì nghe senior', 'Dùng SSG cho dữ liệu private từng user', 'Không cần quan tâm cache/hydration'],
  'git-build-security': ['Force push branch chung cho nhanh', 'Đưa secret vào client env', 'Không cần chạy build trước deploy'],
  project: ['Gom toàn bộ logic vào một component lớn', 'Chỉ kể tên thư viện, không nói trade-off', 'Không cần thống nhất API contract với backend'],
};

const RAW_QUESTIONS = [
  // HTML / CSS
  ['html-css','HTML','Cơ bản','Semantic HTML nên hiểu thế nào trong phỏng vấn FE?','Dùng thẻ đúng ý nghĩa nội dung như header, nav, main, section, article, footer để browser, SEO và assistive tech hiểu cấu trúc trang','<main><article><h1>Tiêu đề</h1></article></main>','MDN HTML / Accessibility'],
  ['html-css','HTML','Cơ bản','Vì sao placeholder không thay thế label trong form?','Placeholder không phải accessible name ổn định, biến mất khi nhập và gây UX/accessibility kém; input nên có label liên kết htmlFor/id','<label htmlFor="email">Email</label><input id="email" />','MDN Forms'],
  ['html-css','HTML','Thực tế','Icon button chỉ có hình thùng rác nên làm thế nào?','Dùng button thật và cung cấp accessible name như aria-label để screen reader hiểu hành động','<button aria-label="Xóa người dùng">🗑</button>','MDN Accessibility'],
  ['html-css','HTML','Cơ bản','button trong form không khai báo type mặc định là gì?','Mặc định là submit, nên nút phụ như Hủy/Đóng cần type="button" để tránh submit ngoài ý muốn','<button type="button">Hủy</button>','MDN Button'],
  ['html-css','HTML','Thực tế','async và defer khác nhau thế nào?','async chạy ngay khi tải xong và không giữ thứ tự; defer đợi HTML parse xong và giữ thứ tự script','<script defer src="app.js"></script>','MDN Script'],
  ['html-css','CSS','Cơ bản','CSS selector gồm những nhóm nào hay dùng?','Type, class, id, attribute, pseudo-class, pseudo-element và combinators dùng để chọn element áp style','.card > h2:first-child, input[type="email"], button:hover','MDN CSS Selectors'],
  ['html-css','CSS','Cơ bản','Specificity trong CSS tính theo ý tưởng nào?','Inline style > id > class/attribute/pseudo-class > type/pseudo-element, sau đó xét cascade/layer/order nếu cùng trọng số','#app .btn thắng .btn trong cùng điều kiện cascade','MDN Specificity'],
  ['html-css','CSS','Cơ bản','Cascade, specificity và inheritance khác nhau thế nào?','Cascade chọn rule thắng; specificity là trọng số selector; inheritance là một số property con nhận từ cha như color/font','color thường inherit, margin không inherit','MDN Cascade'],
  ['html-css','CSS','Cơ bản','box-sizing: border-box có tác dụng gì?','width/height bao gồm content + padding + border, giúp layout dễ dự đoán hơn','* { box-sizing: border-box }','MDN Box Model'],
  ['html-css','CSS','Cơ bản','display block, inline, inline-block khác nhau thế nào?','block chiếm dòng riêng; inline đi theo dòng và khó set width/height; inline-block đi theo dòng nhưng set được box size','span inline, div block, button inline-block','MDN Display'],
  ['html-css','CSS','Cơ bản','Flexbox phù hợp layout nào?','Layout một chiều theo main axis/cross axis như navbar, button group, căn giữa item','display:flex; justify-content:center; align-items:center','MDN Flexbox'],
  ['html-css','CSS','Cơ bản','Grid phù hợp layout nào?','Layout hai chiều theo hàng và cột như dashboard, gallery, card grid','grid-template-columns: 280px 1fr','MDN Grid'],
  ['html-css','CSS','Thực tế','justify-content và align-items trong Flexbox khác nhau thế nào?','justify-content căn theo main axis, align-items căn theo cross axis; flex-direction đổi thì trục cũng đổi','flex-direction: row thì justify ngang, align dọc','MDN Flexbox'],
  ['html-css','CSS','Thực tế','position absolute định vị theo phần tử nào?','Theo ancestor gần nhất có position khác static; nếu không có thì theo initial containing block','.parent{position:relative}.child{position:absolute;top:0}','MDN Position'],
  ['html-css','CSS','Thực tế','Modal z-index 9999 vẫn bị header đè thì kiểm tra gì?','Kiểm tra stacking context của ancestor như transform/opacity/position z-index và cân nhắc render modal bằng portal ra body','transform trên parent có thể tạo stacking context','MDN z-index'],
  ['html-css','CSS','Thực tế','Mobile-first CSS là gì?','Viết style mặc định cho màn nhỏ trước, rồi dùng min-width media query để nâng layout cho màn lớn','@media (min-width:768px){.grid{grid-template-columns:repeat(3,1fr)}}','MDN Responsive Design'],
  ['html-css','CSS','Thực tế','CSS variables dùng để làm gì?','Lưu design tokens như color/spacing/radius và có thể thay đổi theo theme/scope/runtime',':root{--primary:#2563eb}.btn{background:var(--primary)}','MDN Custom Properties'],

  // JavaScript / TypeScript
  ['js-ts','JavaScript','Cơ bản','Primitive type và reference type khác nhau thế nào?','Primitive copy theo value; object/array/function copy theo reference, nên mutate object có thể ảnh hưởng nơi khác','const b = a; b.name = "B" có thể đổi a.name nếu a là object','MDN JS Data Types'],
  ['js-ts','JavaScript','Cơ bản','== và === khác nhau thế nào?','== ép kiểu ngầm; === so sánh cả value và type nên thường an toàn hơn trong logic quan trọng','0 == false nhưng 0 !== false','MDN Equality'],
  ['js-ts','JavaScript','Cơ bản','Truthy/falsy cần chú ý case nào trong UI?','0, "", false là falsy nhưng có thể là giá trị hợp lệ như count=0, discount=0; cần check nullish nếu chỉ loại null/undefined','count != null thay vì if(count)','MDN Boolean'],
  ['js-ts','JavaScript ES6','Cơ bản','let/const/var khác nhau thế nào?','let/const block-scoped và có temporal dead zone; var function-scoped và hoist thành undefined','if(true){let x=1} // ngoài block không truy cập được x','MDN Declarations'],
  ['js-ts','JavaScript ES6','Cơ bản','const có làm object immutable sâu không?','Không; const khóa binding, object/array bên trong vẫn có thể mutate nếu không freeze hoặc dùng immutable pattern','const arr=[]; arr.push(1) hợp lệ','MDN const'],
  ['js-ts','JavaScript ES6','Cơ bản','Rest và spread khác nhau thế nào?','Rest gom phần còn lại; spread trải array/object/iterable ra. Object spread chỉ shallow copy','function sum(...nums){}; const next={...user}','MDN Rest / Spread'],
  ['js-ts','JavaScript ES6','Cơ bản','Destructuring default value chạy khi nào?','Default chỉ dùng khi giá trị là undefined, không chạy với null','const { page = 1 } = { page: undefined }','MDN Destructuring'],
  ['js-ts','JavaScript ES6','Cơ bản','Arrow function khác function thường ở this thế nào?','Arrow không có this riêng, lấy this từ lexical scope; không phù hợp object method cần this dynamic','const obj={ say:()=>this.name }','MDN Arrow Functions'],
  ['js-ts','JavaScript','Cơ bản','slice và splice khác nhau thế nào?','slice trả mảng mới và không mutate; splice mutate mảng gốc','const copy = arr.slice(); arr.splice(1,1)','MDN Array'],
  ['js-ts','JavaScript','Cơ bản','sort() trong JS array có mutate không?','Có, sort mutate mảng gốc; trong React nên copy trước hoặc dùng toSorted nếu hỗ trợ','const sorted=[...users].sort(...)','MDN Array sort'],
  ['js-ts','JavaScript','Cơ bản','find và filter khác nhau thế nào?','find trả item đầu tiên match hoặc undefined; filter trả mảng các item match','users.find(u=>u.id===id); users.filter(u=>u.active)','MDN Array'],
  ['js-ts','JavaScript','Cơ bản','some và every khác nhau thế nào?','some true nếu ít nhất một phần tử thỏa; every true nếu tất cả thỏa','permissions.some(p=>p==="admin")','MDN Array'],
  ['js-ts','JavaScript','Thực tế','reduce thường dùng để làm gì?','Gom array thành một giá trị/cấu trúc mới như total, groupBy, map by id','orders.reduce((acc,o)=>({...acc,[o.id]:o}),{})','MDN Array reduce'],
  ['js-ts','JavaScript Async','Cơ bản','Promise.all và allSettled khác nhau thế nào?','Promise.all reject ngay khi một promise fail; allSettled đợi tất cả và trả trạng thái từng promise','Promise.allSettled([banner,news,recommendations])','MDN Promise'],
  ['js-ts','JavaScript Async','Cơ bản','Promise.then thường chạy trước setTimeout(...,0) vì sao?','Promise callback là microtask, setTimeout là task/macrotask; microtask được xử lý trước task tiếp theo','sync → microtask → timer task','MDN Event Loop'],
  ['js-ts','JavaScript Async','Thực tế','Debounce và throttle khác nhau thế nào?','Debounce đợi ngừng thao tác rồi chạy; throttle giới hạn tần suất chạy trong một khoảng thời gian','search input dùng debounce, scroll/resize dùng throttle','MDN Events'],
  ['js-ts','JavaScript Async','Thực tế','AbortController giúp gì khi search API?','Hủy request cũ khi keyword đổi/unmount để tránh response cũ ghi đè response mới','const controller = new AbortController(); fetch(url,{signal:controller.signal})','MDN AbortController'],
  ['js-ts','TypeScript','Cơ bản','TypeScript kiểm tra type ở thời điểm nào?','Compile-time/dev-time; khi chạy trên browser code đã là JavaScript nên không tự validate runtime data','TS không đảm bảo API response runtime đúng shape','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','unknown khác any thế nào?','unknown bắt buộc narrowing trước khi sử dụng, an toàn hơn any vì không cho gọi property/method tùy tiện','if(typeof value === "string") value.toUpperCase()','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','type và interface nên trả lời sao?','Cả hai mô tả shape object; interface có declaration merging/extends; type linh hoạt hơn với union/conditional/mapped types','type Status="idle"|"loading"; interface User{id:string}','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','Generic dùng để làm gì?','Viết code tái sử dụng mà vẫn giữ type chính xác thay vì dùng any','function getById<T extends {id:string}>(items:T[], id:string):T|undefined','TypeScript Handbook'],
  ['js-ts','TypeScript','Thực tế','keyof, typeof và T[K] dùng thế nào?','keyof lấy union key; typeof lấy type từ value; T[K] lấy type property theo key','function get<T,K extends keyof T>(obj:T,key:K):T[K]{return obj[key]}','TypeScript Handbook'],
  ['js-ts','TypeScript','Thực tế','Partial, Required, Pick, Omit, Record khác nhau thế nào?','Partial optional hóa; Required bắt buộc; Pick lấy field; Omit bỏ field; Record tạo object map','type UpdateUser = Partial<Omit<User,"id">>','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','Discriminated union giải quyết vấn đề gì?','Model state theo từng trạng thái hợp lệ, tránh boolean mâu thuẫn và giúp narrowing rõ','{status:"success",data} | {status:"error",message}','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','never dùng để exhaustive check thế nào?','Trong default switch gán value còn lại vào never để TS báo khi thiếu variant','default: const _x: never = state','TypeScript Handbook'],
  ['js-ts','TypeScript React','Thực tế','children trong React TypeScript nên type gì?','Thường dùng React.ReactNode vì children có thể là string, number, element, null hoặc array','type Props={children:React.ReactNode}','React + TS'],
  ['js-ts','TypeScript React','Thực tế','onChange input nên type event thế nào?','React.ChangeEvent<HTMLInputElement>, dùng e.currentTarget.value để lấy value đã type tốt','function onChange(e: React.ChangeEvent<HTMLInputElement>){}','React + TS'],

  // React core / hooks / lifecycle
  ['react','React Core','Cơ bản','Component trong React nên hiểu là gì?','Function/class nhận input là props và trả React element mô tả UI; render nên pure theo props/state','function UserCard({user}){return <div>{user.name}</div>}','React Docs'],
  ['react','React Core','Cơ bản','Props và state giống và khác nhau thế nào?','Props là dữ liệu parent truyền xuống, readonly với child; state là dữ liệu nội bộ thay đổi qua setter và gây render lại','<UserCard user={user}/>; const [open,setOpen]=useState(false)','React Docs'],
  ['react','React Core','Cơ bản','Vì sao không nên mutate state trực tiếp?','React dựa vào reference để nhận biết thay đổi; mutate trực tiếp dễ không render hoặc render sai','setUser(prev=>({...prev,name:"An"}))','React Docs'],
  ['react','React Core','Cơ bản','Key trong list dùng để làm gì?','Giúp React nhận diện item giữa các lần render để reconcile chính xác khi thêm/xóa/sort','users.map(u=><Row key={u.id} user={u}/>)','React Docs'],
  ['react','React Core','Cơ bản','Vì sao không nên dùng index làm key cho list có thêm/xóa/sort?','Index thay đổi theo vị trí, React có thể reuse nhầm component và làm sai local state/input','Dùng item.id ổn định thay vì index','React Docs'],
  ['react','React Core','Cơ bản','Controlled và uncontrolled input khác nhau thế nào?','Controlled value do React state quản lý; uncontrolled value nằm trong DOM và đọc qua ref/FormData khi cần','<input value={name} onChange={...}/>','React Docs'],
  ['react','React Forms','Cơ bản','Checkbox controlled dùng prop nào?','Dùng checked thay vì value để điều khiển trạng thái checkbox/radio','<input type="checkbox" checked={active} onChange={e=>setActive(e.currentTarget.checked)}/>','React Forms'],
  ['react','React Forms','Thực tế','defaultValue khác value trong input React thế nào?','defaultValue chỉ set ban đầu cho uncontrolled input; value biến input thành controlled theo state/props','<input defaultValue={user.name}/> không tự đổi khi user đổi sau mount','React Docs'],
  ['react','React Core','Thực tế','Conditional rendering với && hay gặp lỗi gì?','Nếu vế trái là 0, React có thể render số 0; nên viết điều kiện boolean rõ ràng','{items.length > 0 && <List/>}','React Docs'],
  ['react','React Core','Thực tế','Derived state nào nên tránh?','Không nên dùng useEffect + useState để lưu dữ liệu tính được trực tiếp từ props/state hiện tại','const fullName = firstName + " " + lastName','React Docs: You Might Not Need an Effect'],
  ['react','React Core','Thực tế','State as a snapshot nghĩa là gì?','Mỗi render nhìn thấy một phiên bản state cố định; setState lên lịch render mới chứ không đổi biến state hiện tại ngay','setCount(count+1); console.log(count) vẫn là snapshot hiện tại','React Docs'],
  ['react','React Core','Thực tế','Vì sao setCount(count+1) gọi 3 lần có thể chỉ tăng 1?','Cả 3 lần dùng cùng snapshot count; nếu phụ thuộc state cũ hãy dùng updater function','setCount(p=>p+1); setCount(p=>p+1); setCount(p=>p+1)','React Docs'],
  ['react','React Core','Thực tế','Batching trong React là gì?','React gom nhiều state updates lại để giảm số lần render, đặc biệt trong cùng event/async context ở React 18+','setA(1); setB(2) thường render một lần','React Docs'],
  ['react','React Core','Thực tế','React preserve hay reset state dựa vào gì?','Dựa vào type, vị trí trong tree và key. Đổi key/type khiến React xem là instance mới và reset state','<ProfileForm key={userId} />','React Docs'],
  ['react','React Events','Cơ bản','onClick={handleSubmit()} sai ở đâu?','Nó gọi function ngay trong lúc render; onClick cần function reference để chạy khi click','<button onClick={handleSubmit}>Save</button>','React Docs'],
  ['react','React Events','Cơ bản','preventDefault và stopPropagation khác nhau thế nào?','preventDefault chặn hành vi mặc định; stopPropagation chặn event nổi lên parent handler','form submit thường preventDefault','React Docs'],
  ['react','React Hooks','Cơ bản','useEffect nên dùng chủ yếu cho việc gì?','Đồng bộ component với hệ thống bên ngoài như API, timer, event listener, subscription, third-party widget','useEffect(()=>{window.addEventListener(...); return cleanup},[])','React Docs'],
  ['react','React Hooks','Cơ bản','Khi nào không nên dùng useEffect?','Khi chỉ tính dữ liệu từ props/state hiện tại hoặc xử lý logic trực tiếp trong event handler','const visible = users.filter(...)','React Docs'],
  ['react','React Hooks','Cơ bản','Cleanup function trong useEffect chạy khi nào?','Trước khi effect chạy lại và khi component unmount, dùng để dọn timer/listener/subscription/request','return () => clearInterval(id)','React Docs'],
  ['react','React Hooks','Thực tế','Vì sao không nên khai báo callback useEffect là async trực tiếp?','Async function trả Promise, trong khi effect cần trả cleanup function hoặc undefined; nên tạo async function bên trong','useEffect(()=>{async function run(){} run(); return cleanup},[])','React Docs'],
  ['react','React Hooks','Thực tế','Effect fetch theo keyword cần cleanup/ignore response cũ vì sao?','Tránh race condition khi request cũ trả về sau request mới và ghi đè UI sai','AbortController hoặc biến ignore trong cleanup','React Docs'],
  ['react','React Hooks','Thực tế','Dependency array của useEffect nên chứa gì?','Các reactive values được đọc trong effect như props, state, function/object khai báo trong component','useEffect(()=>fetchUser(userId),[userId])','React Docs'],
  ['react','React Hooks','Thực tế','Stale closure là gì?','Callback/effect giữ giá trị cũ của state/props do được tạo từ render cũ hoặc thiếu dependency','setInterval đọc count cũ nếu không dùng updater/ref/deps đúng','React Docs'],
  ['react','React Hooks','Thực tế','useMemo và useCallback khác nhau thế nào?','useMemo memo value/kết quả tính toán; useCallback memo function reference','useMemo(()=>expensive(items),[items]); useCallback(fn,[id])','React Docs'],
  ['react','React Hooks','Thực tế','useRef khác useState ở điểm nào?','Đổi ref.current không gây re-render; state đổi thì render lại UI','timerRef.current = setTimeout(...)','React Docs'],
  ['react','React Hooks','Thực tế','useReducer nên dùng khi nào?','State phức tạp, nhiều action/transition, hoặc next state phụ thuộc previous state rõ ràng','dispatch({type:"submit"})','React Docs'],
  ['react','React Hooks','Thực tế','dispatch từ useReducer có ổn định reference không?','Có, dispatch ổn định nên thường tiện khi truyền qua Context hoặc dependency','const [state, dispatch] = useReducer(reducer, initial)','React Docs'],
  ['react','React Hooks','Nâng cao','useLayoutEffect khác useEffect ở đâu?','useLayoutEffect chạy sau DOM update nhưng trước browser paint, hợp đo layout/chống flicker; useEffect chạy sau paint','measure tooltip position trước paint','React Docs'],
  ['react','React Hooks','Nâng cao','useImperativeHandle và forwardRef dùng khi nào?','Khi child cần expose imperative methods như focus/reset/scrollTo cho parent qua ref','useImperativeHandle(ref,()=>({focus:()=>inputRef.current?.focus()}))','React Docs'],
  ['react','React Hooks','Nâng cao','useTransition khác debounce ở đâu?','useTransition phân loại update urgent/non-urgent trong React render; debounce trì hoãn gọi function theo thời gian','input cập nhật ngay, filter list lớn trong startTransition','React Docs'],
  ['react','React Hooks','Nâng cao','useDeferredValue dùng khi nào?','Trì hoãn value ít khẩn cấp để phần render nặng không làm input lag','const deferredKeyword = useDeferredValue(keyword)','React Docs'],
  ['react','React Hooks','Nâng cao','useId dùng để làm gì và không dùng cho gì?','Tạo id ổn định cho accessibility/SSR hydration; không dùng làm key cho list data','const id = useId(); <label htmlFor={id}>','React Docs'],
  ['react','React Hooks','Nâng cao','useSyncExternalStore dùng cho bài toán nào?','Subscribe vào external store ngoài React an toàn với concurrent rendering; thường dùng khi viết state library','subscribe/getSnapshot pattern','React Docs'],
  ['react','React Hooks','Nâng cao','flushSync dùng khi nào?','Hiếm khi cần ép DOM update đồng bộ trước khi đọc DOM hoặc gọi imperative API; không nên lạm dụng vì mất lợi ích batching','flushSync(()=>setOpen(true)); inputRef.current.focus()','React DOM Docs'],
  ['react','React Performance','Thực tế','React.memo không hiệu quả khi nào?','Khi parent truyền object/function inline mới mỗi render hoặc component quá nhẹ không đáng memo','<Child options={{pageSize:10}}/> tạo object mới','React Docs'],
  ['react','React Performance','Thực tế','Re-render có luôn là bug không?','Không; nhiều re-render nhẹ là bình thường. Chỉ tối ưu khi đo bằng Profiler/thực tế thấy chậm hoặc UX xấu','Dùng React DevTools Profiler trước khi thêm memo','React Docs'],
  ['react','React Performance','Thực tế','Virtualization giải quyết vấn đề gì?','Chỉ render phần item đang hiển thị thay vì toàn bộ list lớn, giảm DOM nodes và render cost','react-window/TanStack Virtual cho table lớn','React Performance Patterns'],
  ['react','React Performance','Thực tế','Table 10.000 records bị lag xử lý thế nào?','Pagination, virtualization, debounce filter/search, memo row đúng chỗ, tránh tính toán nặng trong render','Không render toàn bộ DOM nếu chỉ thấy 30 rows','Performance Patterns'],
  ['react','React Performance','Nâng cao','Custom comparator trong React.memo có rủi ro gì?','So sánh sai hoặc bỏ sót function/prop có thể làm component stale UI/stale closure rất khó debug','memo(Chart, (prev,next)=>prev.data===next.data)','React Docs'],
  ['react','React Advanced','Thực tế','Portal có làm mất Context không?','Không; portal đổi vị trí DOM nhưng vẫn thuộc React tree nên Context và React event propagation vẫn hoạt động','Modal render vào document.body vẫn đọc ThemeContext','React Docs'],
  ['react','React Advanced','Thực tế','Error Boundary bắt lỗi nào?','Bắt lỗi render/lifecycle trong subtree; không tự bắt async Promise/event handler/network error nếu không xử lý riêng','<ErrorBoundary><Widget/></ErrorBoundary>','React Docs'],
  ['react','React Advanced','Thực tế','Suspense boundary nên đặt ở đâu?','Quanh phần có thể chờ/lazy để fallback cục bộ, tránh che trắng toàn trang không cần thiết','Page shell giữ, chart lazy có skeleton riêng','React Docs'],
  ['react','React Advanced','Thực tế','React.lazy load chunk lỗi thì Suspense có bắt lỗi không?','Suspense xử lý trạng thái pending; lỗi reject/load chunk cần Error Boundary xử lý','<ErrorBoundary><Suspense fallback={<Spinner/>}><LazyPage/></Suspense></ErrorBoundary>','React Docs'],
  ['react','React Advanced','Nâng cao','Render phase và commit phase khác nhau thế nào?','Render phase tính UI mới và có thể bị pause/abort; commit phase apply DOM/effects thật sự','Không side effect trong render body','React Docs'],
  ['react','React Advanced','Nâng cao','StrictMode double render/effect trong dev giúp phát hiện gì?','Side effect không pure trong render, effect thiếu cleanup, logic phụ thuộc mount một lần không an toàn','Effect mở subscription mà thiếu cleanup sẽ lộ lỗi','React Docs'],
  ['react','React Advanced','Nâng cao','Server Component và Client Component khác nhau trọng tâm ở đâu?','Server Component chạy server, không dùng state/effect/event; Client Component chạy client để xử lý tương tác/browser APIs','Server fetch product list, client xử lý add-to-cart','React / Next Docs'],
  ['react','React Advanced','Nâng cao','Hydration mismatch thường tránh bằng cách nào?','Đảm bảo server render và client render ban đầu giống nhau; defer browser-only value sang useEffect/client boundary','Không render Date.now()/Math.random trực tiếp trong SSR markup','React DOM Docs'],
  ['react','React Patterns','Thực tế','Composition trong React giải quyết gì so với inheritance?','Ghép component nhỏ qua props/children để tái sử dụng UI/logic rõ hơn thay vì kế thừa class phức tạp','<Card><UserInfo /></Card>','React Docs'],
  ['react','React Patterns','Nâng cao','Compound component pattern là gì?','Nhóm component con phối hợp qua context/props để tạo API UI như Tabs.List, Tabs.Trigger, Tabs.Content','<Tabs><Tabs.List/><Tabs.Content value="profile"/></Tabs>','React Patterns'],
  ['react','React Patterns','Nâng cao','Render props pattern là gì?','Chia sẻ logic bằng cách truyền function render UI dựa trên state/behavior component cung cấp','<MouseTracker>{pos => <Tooltip x={pos.x}/>}</MouseTracker>','React Patterns'],
  ['react','React Patterns','Nâng cao','HOC là gì và hiện nay thường thay bằng gì?','Function nhận component và trả component mới; nhiều case hiện nay thay bằng custom hook/composition','const Protected = withAuth(Page)','React Patterns'],
  ['react','React Lifecycle','Thực tế','Class component lifecycle cơ bản gồm nhóm nào?','Mounting, updating, unmounting và error handling; vẫn cần biết để đọc codebase cũ','componentDidMount, componentDidUpdate, componentWillUnmount','React Docs'],
  ['react','React Lifecycle','Thực tế','componentDidMount/Update/WillUnmount map sang hooks thế nào?','Không map máy móc 1-1; effect setup sau render, cleanup trước setup mới/unmount theo dependency','useEffect(()=>{subscribe(); return unsubscribe},[roomId])','React Docs'],
  ['react','React Lifecycle','Nâng cao','shouldComponentUpdate dùng để làm gì?','Quyết định class component có cần render lại theo next props/state; tương tự ý tưởng React.memo ở function component','shouldComponentUpdate(nextProps){return nextProps.id!==this.props.id}','React Docs'],
  ['react','React Lifecycle','Nâng cao','getDerivedStateFromProps/sync props vào state có nên dùng thường xuyên không?','Không, dễ tạo duplicate state và lệch dữ liệu; chỉ dùng case hiếm có lý do rõ','Không copy props.userName vào state chỉ để render','React Docs'],

  // State management
  ['state','State Management','Cơ bản','Nguyên tắc đầu tiên khi đặt state ở đâu là gì?','Đặt state gần nơi dùng nhất; chỉ nâng lên hoặc global hóa khi nhiều component thật sự cần chia sẻ','Modal open trong một page để local/page state','React Docs'],
  ['state','State Management','Cơ bản','Local, lifted, global, URL và server state khác nhau thế nào?','Local trong component; lifted share gần; global share xa; URL share/refresh/bookmark; server state là remote data cần cache/refetch','modalOpen local, filter URL, productList server state','State Architecture'],
  ['state','State Management','Cơ bản','Client state và server state khác nhau quan trọng nhất ở đâu?','Client state do UI/app sở hữu; server state thuộc remote server, async, có stale/cache/refetch/sync vấn đề','theme là client state, users list là server state','TanStack Query Docs'],
  ['state','State Management','Cơ bản','Single source of truth nghĩa là gì?','Một dữ liệu quan trọng nên có một nguồn chính, tránh copy nhiều nơi rồi sync thủ công gây lệch','Server data ở Query, UI state local/global tùy phạm vi','State Architecture'],
  ['state','State Management','Thực tế','Khi nào không cần state management library?','Khi state chủ yếu local/parent-child gần nhau và props/composition đủ rõ','SearchBox và UserTable chung keyword thì parent giữ keyword','React Docs'],
  ['state','State Management','Thực tế','Filter table nên dùng local state hay URL state?','Draft đang gõ có thể local; filter đã apply/page/sort nên ở URL nếu cần share/refresh/back-forward','?page=1&keyword=abc&role=admin','URL State'],
  ['state','State Management','Thực tế','Input đang gõ từng ký tự có nên sync global store liên tục?','Thường không; giữ local/form state và chỉ commit lên global/URL khi submit/apply/debounce nếu cần','keywordDraft local, applyKeyword lên URL','State Architecture'],
  ['state','State Management','Thực tế','Selected rows trong table nên đưa vào global store không?','Thường không; để local/page state, chỉ global nếu nhiều khu vực xa nhau thật sự cần biết selection','const [selectedRowIds,setSelectedRowIds]=useState([])','State Patterns'],
  ['state','State Management','Thực tế','Global loading state có nên bật cho mọi API request không?','Không máy móc; loading nên scoped theo query/action, global loading chỉ cho navigation/blocking action thật sự cần','Table loading riêng, submit button loading riêng','State Patterns'],
  ['state','State Management','Thực tế','Vì sao nhiều boolean isLoading/isSuccess/isError dễ gây bug?','Có thể tạo trạng thái mâu thuẫn; union/status state hoặc state machine mô hình hóa trạng thái hợp lệ hơn','{status:"loading"}|{status:"success",data}|{status:"error",message}','React State Structure'],
  ['state','State Management','Thực tế','State normalization là gì và khi nào cần?','Lưu entity dạng ids/entities để tránh duplicate và update từng item dễ hơn khi dữ liệu có quan hệ/nhiều list detail','users: { ids:["u1"], entities:{u1:{id:"u1"}} }','Redux Toolkit'],
  ['state','State Management','Thực tế','Persist middleware nên dùng khi nào?','Khi state là preference/draft/cart guest cần sống qua reload và không nhạy cảm; cần partialize/version/migrate rõ','persist theme, language, guestCart; không persist password','Zustand Persist'],
  ['state','State Management','Thực tế','Khi logout ngoài xóa token còn cần gì?','Reset auth/user/permission/client stores, clear server-state cache user-specific, unsubscribe realtime và clear persisted data liên quan user','authStore.reset(); queryClient.clear(); socket.close()','State Patterns'],
  ['state','State Management','Thực tế','Permission state đổi thì FE nên làm gì?','Refetch currentUser/permissions hoặc invalidate query/store liên quan, sau đó cập nhật UI/route guard','queryClient.invalidateQueries({queryKey:["currentUser"]})','State Patterns'],
  ['state','State Management','Thực tế','Auth state FE nên gồm gì?','Thông tin user/session phục vụ UI, trạng thái login, permissions/roles; token xử lý theo strategy an toàn','Không lưu password; backend vẫn enforce quyền','Auth Patterns'],
  ['state','State Management','Thực tế','Cart guest user và logged-in user khác nhau thế nào?','Guest cart thường client persisted; logged-in cart thường server state cần sync API/cache và merge khi login','merge local cart lên server khi login','Ecommerce State'],
  ['state','State Management','Thực tế','Multi-step form/wizard state nên đặt đâu?','Parent/wizard provider hoặc form library; persist draft có chọn lọc nếu requirement cần refresh không mất','WizardProvider + RHF FormProvider','Form State'],
  ['state','State Management','Thực tế','Notification badge realtime nên quản lý thế nào?','Subscription WebSocket/SSE có cleanup; unread count ở query cache hoặc global store tùy source of truth','useNotificationSocket cleanup khi logout','Realtime State'],
  ['state','Context','Cơ bản','Context giải quyết vấn đề gì tốt nhất?','Truyền data qua nhiều cấp component để tránh prop drilling, hợp theme/locale/current user ít đổi','<ThemeContext.Provider value={theme}>','React Context'],
  ['state','Context','Thực tế','Context có phải state manager tối ưu cho mọi global state không?','Không; Context truyền value tốt nhưng update value có thể làm consumer re-render, thiếu selector mặc định','Theme hợp Context, data update liên tục cân nhắc store selector','React Context'],
  ['state','Context','Thực tế','Tách StateContext và DispatchContext có lợi gì?','Component chỉ dùng dispatch không re-render khi state value đổi vì dispatch ổn định','TodoStateContext + TodoDispatchContext','Context Performance'],
  ['state','Context','Thực tế','Context value={{user,setUser}} gây vấn đề gì?','Mỗi render tạo object mới khiến consumer có thể re-render; nên memoize value hoặc tách context','const value = useMemo(()=>({user,setUser}),[user])','Context Performance'],
  ['state','Redux Toolkit','Cơ bản','Redux Toolkit createSlice giúp gì?','Tạo reducer và action creators cùng lúc, giảm boilerplate Redux cũ','createSlice({name:"counter",initialState,reducers:{increment(){}}})','Redux Toolkit Docs'],
  ['state','Redux Toolkit','Cơ bản','Vì sao trong RTK reducer có thể viết state.value++?','RTK dùng Immer, cho phép mutate draft nhưng tạo immutable update phía sau','state.items.push(action.payload)','Redux Toolkit Docs'],
  ['state','Redux Toolkit','Thực tế','configureStore làm sẵn gì?','Gộp reducers, thêm default middleware/thunk, bật DevTools và check mutate/serializable trong dev','configureStore({reducer:{auth,users}})','Redux Toolkit Docs'],
  ['state','Redux Toolkit','Thực tế','extraReducers dùng khi nào?','Khi slice cần phản ứng action bên ngoài slice như createAsyncThunk lifecycle hoặc logout toàn app','builder.addCase(fetchUsers.fulfilled,...)','Redux Toolkit Docs'],
  ['state','Redux Toolkit','Thực tế','createAsyncThunk tự sinh lifecycle nào?','pending, fulfilled, rejected để reducer set loading/data/error','createAsyncThunk("users/fetch", async()=>api.getUsers())','Redux Toolkit Docs'],
  ['state','Redux Toolkit','Thực tế','RTK Query khác createAsyncThunk thế nào?','RTK Query chuyên data fetching/cache/invalidation; createAsyncThunk chỉ tạo async lifecycle action, cache tự quản lý','Server state list/detail thường hợp RTK Query hơn thunk thủ công','RTK Query Docs'],
  ['state','Redux Toolkit','Thực tế','createEntityAdapter hỗ trợ gì?','Quản lý collection normalized với ids/entities và CRUD reducers/selectors có sẵn','usersAdapter.upsertMany(state, users)','Redux Toolkit Docs'],
  ['state','React Redux','Thực tế','useSelector trả object mới mỗi lần gây vấn đề gì?','Component có thể re-render mỗi store update vì mặc định so sánh strict === reference equality','useSelector(s=>({name:s.user.name,role:s.user.role})) cần shallowEqual/memoized selector','React Redux Docs'],
  ['state','React Redux','Thực tế','Vì sao nên tạo useAppDispatch/useAppSelector trong TS?','Để dispatch và selector có type RootState/AppDispatch đúng, đặc biệt khi dispatch thunk','useDispatch.withTypes<AppDispatch>()','React Redux Docs'],
  ['state','Redux Toolkit','Thực tế','Redux khuyến khích state/action serializable vì sao?','DevTools, logging, time-travel, persistence và debug ổn định hơn','Không lưu DOM node/function/AbortController vào Redux state','Redux Docs'],
  ['state','Zustand','Cơ bản','Zustand nổi bật ở điểm nào?','Store nhỏ gọn dựa trên hooks, ít boilerplate, selector trực tiếp và không quá opinionated','const user = useStore(s=>s.user)','Zustand Docs'],
  ['state','Zustand','Thực tế','Trong Zustand vì sao nên dùng selector thay vì useStore()?','Component chỉ subscribe phần state cần thiết, giảm re-render không liên quan','useStore(s=>s.user.name)','Zustand Docs'],
  ['state','Zustand','Thực tế','shallow trong Zustand dùng khi nào?','Khi selector trả object/array gồm nhiều field và muốn so sánh shallow để giảm re-render','useStore(s=>({user:s.user,theme:s.theme}), shallow)','Zustand Docs'],
  ['state','Zustand','Thực tế','Update nested object trong Zustand cần chú ý gì?','Vẫn cần immutable update hoặc dùng Immer middleware; không mutate nested object trực tiếp bừa bãi','set(s=>({user:{...s.user,profile:{...s.user.profile,name}}}))','Zustand Docs'],
  ['state','Zustand','Thực tế','Slices pattern trong Zustand giải quyết gì?','Chia store lớn thành nhiều slice logic như authSlice/cartSlice/uiSlice để dễ maintain','create((...a)=>({...createAuthSlice(...a),...createCartSlice(...a)}))','Zustand Docs'],
  ['state','State Management','Nâng cao','Khi dùng TanStack Query cùng Zustand/Redux, ranh giới tốt là gì?','Query quản lý server state; Zustand/Redux quản lý client global state như theme, modal, auth UI, cart local','products list ở Query; sidebarOpen ở Zustand','State Architecture'],
  ['state','State Management','Nâng cao','Dữ liệu currentUser nên là server state hay client global state?','Có thể là server state cache bằng Query/RTK Query và derive auth UI; tránh duplicate source of truth không kiểm soát','useQuery(["currentUser"]); auth store giữ session actions','Auth State'],
  ['state','State Management','Nâng cao','Optimistic UI cần chuẩn bị gì?','Snapshot data cũ, update tạm UI/cache, rollback onError và invalidate/refetch khi settled','Like count tăng ngay, fail thì rollback','Optimistic Updates'],
  ['state','State Management','Nâng cao','State machine nên dùng cho flow nào?','Flow nhiều trạng thái/transition rõ như checkout, upload, payment, onboarding, call video','idle → uploading → success/error','State Machines'],

  // API / Router / Form / Test / Rendering / Git
  ['api-router','Axios','Cơ bản','Vì sao nên tạo axiosClient riêng?','Centralize baseURL, timeout, headers, token, interceptors, error handling thay vì lặp ở component','const api = axios.create({baseURL, timeout:10000})','Axios Docs'],
  ['api-router','Axios','Thực tế','Request interceptor thường dùng làm gì?','Gắn token/language/request id trước khi gửi request; không gọi React hooks trong interceptor','config.headers.Authorization = `Bearer ${token}`','Axios Docs'],
  ['api-router','Axios','Thực tế','Nhiều request cùng bị 401 thì refresh token flow cần chú ý gì?','Dùng isRefreshing/queue để chỉ refresh một lần rồi retry requests pending, tránh loop/race','_retry flag + pending queue','Axios Docs'],
  ['api-router','TanStack Query','Cơ bản','TanStack Query chủ yếu quản lý gì?','Server state: cache, loading, error, stale/refetch, retry, mutation cho dữ liệu từ server','useQuery({queryKey:["users"], queryFn:getUsers})','TanStack Query Docs'],
  ['api-router','TanStack Query','Thực tế','queryKey nên chứa gì?','Đủ input ảnh hưởng data như id, page, pageSize, keyword, filter để cache đúng','["users", {page, keyword, role}]','TanStack Query Docs'],
  ['api-router','TanStack Query','Thực tế','enabled dùng khi nào?','Cho dependent query chỉ chạy khi điều kiện đủ như userId/token đã có','useQuery({queryKey:["user",id], queryFn, enabled:!!id})','TanStack Query Docs'],
  ['api-router','TanStack Query','Thực tế','staleTime khác gcTime thế nào?','staleTime là thời gian data còn fresh; gcTime là thời gian cache inactive được giữ trước khi dọn','provinces staleTime dài hơn','TanStack Query Docs'],
  ['api-router','TanStack Query','Thực tế','invalidateQueries dùng để làm gì?','Đánh dấu query stale và refetch data liên quan sau mutation','onSuccess:()=>queryClient.invalidateQueries({queryKey:["users"]})','TanStack Query Docs'],
  ['api-router','TanStack Query','Nâng cao','Optimistic update trong Query chạy theo bước nào?','cancel query → snapshot previous data → setQueryData tạm → rollback onError → invalidate onSettled','onMutate lưu previousTodos','TanStack Query Docs'],
  ['api-router','TanStack Router','Cơ bản','TanStack Router mạnh ở điểm nào?','Type-safe route params/search/navigation, loaders, beforeLoad, nested routes và tích hợp tốt với Query','validateSearch + typed navigate','TanStack Router Docs'],
  ['api-router','TanStack Router','Thực tế','Search params trong router phù hợp state nào?','Filter, sort, pagination, tab chính, keyword cần share/refresh/back-forward không mất','/users?page=1&role=admin','TanStack Router Docs'],
  ['api-router','TanStack Router','Thực tế','beforeLoad khác loader thế nào?','beforeLoad chạy trước loader, thường dùng auth/redirect/context; loader dùng load data cho route','beforeLoad check role, loader fetch users','TanStack Router Docs'],
  ['form-test','React Hook Form','Cơ bản','React Hook Form phù hợp nhất khi nào?','Form nhiều field, cần validation, muốn giảm re-render nhờ uncontrolled/ref strategy','useForm + register','React Hook Form Docs'],
  ['form-test','React Hook Form','Thực tế','Controller dùng khi nào trong RHF?','Khi tích hợp controlled component bên ngoài như MUI Select, DatePicker, custom input không register/ref đơn giản','<Controller name="role" control={control} render={...}/>', 'React Hook Form Docs'],
  ['form-test','React Hook Form','Thực tế','Load edit form từ API xong muốn set toàn bộ values thì dùng gì?','Dùng reset(data) để reset values và form state đúng thay vì setValue từng field trong render','useEffect(()=>reset(user),[user,reset])','React Hook Form Docs'],
  ['form-test','Zod','Cơ bản','Zod dùng với form/API response có lợi gì?','Validate runtime schema và infer TypeScript type từ schema, giảm lệch giữa validation và type','type FormValues = z.infer<typeof schema>','Zod Docs'],
  ['form-test','Zod','Thực tế','parse và safeParse khác nhau thế nào?','parse throw error nếu invalid; safeParse trả object success/data hoặc error để branch không cần exception','const result = schema.safeParse(data)','Zod Docs'],
  ['form-test','Testing','Cơ bản','React Testing Library khuyến khích test theo hướng nào?','Test behavior giống cách user tương tác, không phụ thuộc implementation detail','screen.getByRole("button", { name:/submit/i })','Testing Library Docs'],
  ['form-test','Testing','Thực tế','getBy, queryBy, findBy khác nhau thế nào?','getBy sync và throw nếu không thấy; queryBy trả null; findBy async chờ element xuất hiện','await screen.findByText(/thành công/i)','Testing Library Docs'],
  ['form-test','Testing','Thực tế','MSW tốt hơn mock axios trực tiếp ở điểm nào?','Mock ở network layer, test gần behavior thật hơn và không phụ thuộc HTTP client implementation','Đổi Axios sang fetch test vẫn ít đổi','MSW / Testing Library'],
  ['rendering','Rendering','Cơ bản','SPA và CSR có phải một khái niệm không?','Không hoàn toàn. SPA là mô hình một trang điều hướng client-side; CSR là cách render UI ở client. Nhiều SPA dùng CSR','Vite React thường là SPA + CSR','Rendering Concepts'],
  ['rendering','Rendering','Cơ bản','SSR là gì?','Server render HTML theo request/runtime rồi client hydrate để có tương tác','request /profile → server render HTML → client hydrate','Next.js Docs'],
  ['rendering','Rendering','Cơ bản','SSG là gì?','Render HTML/static assets ở build time rồi serve từ CDN/static hosting, hợp public content ít đổi','blog/docs/landing page','Next.js Docs'],
  ['rendering','Rendering','Thực tế','ISR giải quyết gì so với SSG thuần?','Cho phép cập nhật static content sau build theo thời gian hoặc on-demand mà không rebuild toàn bộ site','product page revalidate 60s','Next.js Docs'],
  ['rendering','Hydration','Thực tế','Hydration là gì?','React attach event handlers/state vào HTML server-rendered để UI trở nên tương tác','hydrateRoot(document.getElementById("root"), <App/>)','React DOM Docs'],
  ['rendering','Hydration','Thực tế','Đọc localStorage trực tiếp trong render SSR rủi ro gì?','Server không có localStorage và output server/client có thể khác gây hydration mismatch','Đọc trong useEffect hoặc client-only boundary','React DOM Docs'],
  ['rendering','Build Data','Thực tế','Data lấy lúc build hay lúc chạy kiểm tra điều gì?','Hiểu freshness, cache, SEO, user-specific data, deploy/rebuild và server cost','Public ít đổi build-time; private/realtime runtime','Rendering Strategy'],
  ['rendering','Build','Thực tế','Vite SPA build output là gì?','Static files HTML/CSS/JS/assets trong dist; server cần rewrite route về index.html nếu dùng BrowserRouter','npm run build → dist','Vite Docs'],
  ['rendering','Deployment','Thực tế','Refresh /users/1 bị 404 khi deploy SPA do đâu?','Server/static hosting chưa rewrite mọi route về index.html cho client router xử lý','Netlify/Vercel/Nginx fallback config','React Router Docs'],
  ['rendering','Rendering','Nâng cao','Khi chọn CSR/SSR/SSG/ISR nên phân tích tiêu chí nào?','SEO, freshness, user-specific data, cache, interactivity, traffic, infra/deploy và security','Landing SSG; product ISR; dashboard CSR/SSR auth; checkout dynamic','Rendering Strategy'],
  ['git-build-security','Git','Cơ bản','git fetch và git pull khác nhau thế nào?','fetch tải remote changes nhưng chưa merge vào branch hiện tại; pull = fetch + merge/rebase theo cấu hình','git fetch origin rồi xem diff/log trước khi merge','Git SCM'],
  ['git-build-security','Git','Cơ bản','merge và rebase khác nhau thế nào?','Merge giữ lịch sử nhánh và có thể tạo merge commit; rebase replay commit để history linear hơn','Rebase branch cá nhân, tránh rebase branch shared bừa','Git SCM'],
  ['git-build-security','Git','Cơ bản','reset và revert khác nhau thế nào?','reset có thể rewrite history; revert tạo commit mới đảo ngược thay đổi, an toàn hơn cho branch shared','Commit đã merge main thường dùng git revert','Git SCM'],
  ['git-build-security','Git','Thực tế','Đang code dở cần sang hotfix gấp thì làm gì?','stash push hoặc commit WIP trên branch riêng, sau đó checkout hotfix branch','git stash push -m "wip feature A"','Git SCM'],
  ['git-build-security','Git','Thực tế','Rebase conflict nên xử lý flow nào?','Sửa conflict đúng logic → git add → git rebase --continue → chạy test/build → push --force-with-lease nếu branch cá nhân đã push','Không accept current/incoming bừa','Git SCM'],
  ['git-build-security','Vite','Cơ bản','Biến môi trường Vite expose client cần prefix gì?','VITE_; nhưng mọi biến expose client đều có thể bị xem nên không đưa secret','import.meta.env.VITE_API_URL','Vite Docs'],
  ['git-build-security','Security','Cơ bản','XSS là gì?','Tấn công chèn/chạy script độc hại trên trang người dùng; cần escape/sanitize/CSP và cẩn thận dangerouslySetInnerHTML','Không render HTML user nhập nếu chưa sanitize','OWASP'],
  ['git-build-security','Security','Thực tế','FE ẩn nút Delete nếu không phải admin có đủ bảo mật không?','Không. FE chỉ ẩn/hiện UI; backend/API vẫn phải enforce quyền thật sự','User có thể gọi API trực tiếp bằng DevTools/Postman','OWASP'],
  ['project','Project Structure','Thực tế','Feature-based structure nghĩa là gì?','Tổ chức code theo domain/feature như auth, users, orders; mỗi feature chứa components/hooks/services/types liên quan','features/users/components/UserTable.tsx','Project Architecture'],
  ['project','Project Structure','Thực tế','Vì sao không nên gọi API rải rác trực tiếp trong component?','Component bị lẫn UI và data/business logic, khó test/maintain; nên tách service/query hook/UI','userService + useUsersQuery + UserTable','Project Architecture'],
  ['project','Clean Code','Thực tế','Component 900 dòng nên refactor thế nào?','Tách UI component, custom hooks, services, validation schema, types/constants theo trách nhiệm','UserTable, UserFilter, UserFormModal, useUsers','Clean Code'],
  ['project','Interview','Thực tế','Khi kể feature khó nhất từng làm nên nói cấu trúc nào?','Bối cảnh → vấn đề → cách xử lý → trade-off → kết quả','Nói rõ impact thay vì chỉ liệt kê thư viện','Interview Patterns'],
];

function normalizeText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function semanticKey(question) {
  const t = normalizeText(question.topic);
  const q = normalizeText(question.question);
  if (t.includes('git') && q.includes('fetch') && q.includes('pull')) return 'git:fetch-vs-pull';
  if (t.includes('git') && q.includes('merge') && q.includes('rebase')) return 'git:merge-vs-rebase';
  if (t.includes('git') && q.includes('reset') && q.includes('revert')) return 'git:reset-vs-revert';
  if (t.includes('react') && q.includes('props') && q.includes('state')) return 'react:props-vs-state';
  if (t.includes('react') && q.includes('controlled') && q.includes('uncontrolled')) return 'react:controlled-vs-uncontrolled';
  if (t.includes('react') && q.includes('usememo') && q.includes('usecallback')) return 'react:usememo-vs-usecallback';
  if (t.includes('react') && q.includes('key') && q.includes('index')) return 'react:index-key-risk';
  if (t.includes('tanstack query') && q.includes('querykey')) return 'query:query-key';
  return `${t}:${q}`;
}

function getQuestionArea(topic) {
  const t = topic.toLowerCase();
  if (t.includes('html') || t.includes('css') || t.includes('browser')) return 'html-css';
  if (t.includes('javascript') || t.includes('typescript')) return 'js-ts';
  if (t.includes('state') || t.includes('redux') || t.includes('zustand') || t.includes('context')) return 'state';
  if (t.includes('react') && !t.includes('hook form') && !t.includes('router') && !t.includes('testing')) return 'react';
  if (t.includes('axios') || t.includes('api') || t.includes('auth') || t.includes('router') || t.includes('tanstack query') || t.includes('tanstack router')) return 'api-router';
  if (t.includes('form') || t.includes('testing') || t.includes('zod')) return 'form-test';
  if (t.includes('rendering') || t.includes('hydration') || t.includes('build data') || t.includes('deployment') || t.includes('ssr') || t.includes('ssg') || t.includes('isr')) return 'rendering';
  if (t.includes('git') || t.includes('vite') || t.includes('security')) return 'git-build-security';
  return 'project';
}

function makeQuestion(row, index) {
  const [area, topic, level, question, correct, example, source] = row;
  const wrongs = WRONG_BY_AREA[area] || WRONG_BY_AREA.project;
  const rotate = index % 4;
  const options = [...wrongs.slice(0, 3)];
  options.splice(rotate, 0, correct);
  return {
    id: index + 1,
    area,
    topic,
    level,
    question,
    options,
    answer: rotate,
    correct,
    example,
    source,
    explanation: `${correct}. Ví dụ thực tế: ${example}. Điểm phỏng vấn cần nhấn mạnh là chọn đúng công cụ theo bài toán, nói được trade-off và tránh lỗi phổ biến: ${wrongs[0]}.`,
  };
}

function dedupeQuestions(questions) {
  const map = new Map();
  for (const q of questions) {
    const key = semanticKey(q);
    const old = map.get(key);
    const score = q.explanation.length + q.example.length + (q.level === 'Nâng cao' ? 40 : q.level === 'Thực tế' ? 20 : 0);
    const oldScore = old ? old.explanation.length + old.example.length + (old.level === 'Nâng cao' ? 40 : old.level === 'Thực tế' ? 20 : 0) : -1;
    if (!old || score > oldScore) map.set(key, q);
  }
  return Array.from(map.values()).map((q, index) => ({ ...q, id: index + 1 }));
}

const QUESTIONS = dedupeQuestions(RAW_QUESTIONS.map(makeQuestion));
const alphabet = ['A', 'B', 'C', 'D'];

function levelClass(level) {
  if (level === 'Cơ bản') return 'bg-blue-600 text-white';
  if (level === 'Thực tế') return 'bg-emerald-600 text-white';
  return 'bg-violet-600 text-white';
}

function scoreLabel(percent) {
  if (percent >= 85) return 'Rất ổn - có nền tảng phỏng vấn mạnh';
  if (percent >= 70) return 'Khá tốt - cần vá thêm vài lỗ hổng';
  if (percent >= 50) return 'Trung bình - nên ôn lại phần sai nhiều';
  return 'Cần ôn lại nền tảng trước khi phỏng vấn';
}

export default function FEReactInterviewQuiz() {
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [area, setArea] = useState('all');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  const areaQuestions = useMemo(() => {
    if (area === 'all') return QUESTIONS;
    return QUESTIONS.filter((q) => q.area === area || getQuestionArea(q.topic) === area);
  }, [area]);

  const topics = useMemo(() => ['all', ...Array.from(new Set(areaQuestions.map((q) => q.topic)))], [areaQuestions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter((q) => {
      const selected = answers[q.id];
      const matchTopic = topic === 'all' || q.topic === topic;
      const matchMode =
        mode === 'all' ||
        (mode === 'unanswered' && selected === undefined) ||
        (mode === 'wrong' && selected !== undefined && selected !== q.answer) ||
        (mode === 'correct' && selected === q.answer);
      const haystack = `${q.topic} ${q.level} ${q.question} ${q.correct} ${q.explanation} ${q.example} ${q.source}`.toLowerCase();
      return matchTopic && matchMode && (!keyword || haystack.includes(keyword));
    });
  }, [answers, areaQuestions, mode, search, topic]);

  const counts = useMemo(() => {
    return AREAS.reduce((acc, item) => {
      acc[item.id] = item.id === 'all' ? QUESTIONS.length : QUESTIONS.filter((q) => q.area === item.id || getQuestionArea(q.topic) === item.id).length;
      return acc;
    }, {});
  }, []);

  const result = useMemo(() => {
    const correct = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    const total = QUESTIONS.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
    setArea('all');
    setTopic('all');
    setMode('all');
    setSearch('');
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function choose(questionId, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#11131a]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">⚛️</span>
            <div>
              <div className="text-sm md:text-lg">FE React Interview Quiz</div>
              <div className="text-xs font-medium text-slate-400">Câu hỏi thực tế cho level React 2.5+ năm</div>
            </div>
          </div>
          <div className="ml-auto hidden w-full max-w-md rounded-full border border-white/10 bg-white/5 px-4 py-2 md:block">
            <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Tìm React, Redux, Zustand, event loop..." />
          </div>
          {!submitted ? (
            <button onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500">Nộp bài</button>
          ) : (
            <button onClick={resetQuiz} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">Làm lại</button>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl md:grid-cols-[290px_1fr]">
        <aside className="hidden border-r border-white/10 md:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4">
            <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500">Tiến độ</div>
              <div className="mt-2 text-3xl font-black">{answeredCount}/{QUESTIONS.length}</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, (answeredCount / QUESTIONS.length) * 100)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              {AREAS.map((item) => (
                <button key={item.id} onClick={() => { setArea(item.id); setTopic('all'); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${area === item.id ? 'bg-blue-600/25 text-blue-100' : 'text-slate-300 hover:bg-white/5'}`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 font-semibold">{item.label}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{counts[item.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-3 py-5 md:px-8">
          <div className="mb-4 block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 md:hidden">
            <input value={search} onChange={(e) => setSearch(e.currentTarget.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Tìm kiếm câu hỏi..." />
          </div>

          <section className="mb-5 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-500/10 p-5 shadow-2xl shadow-black/20 md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">Đã lọc trùng semantic, không lặp kiểu fetch vs pull 2 lần</div>
                <h1 className="text-2xl font-black md:text-4xl">Ôn phỏng vấn FE React 2.5+ năm</h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">Tập trung vào câu hỏi nhà tuyển dụng hay hỏi: nền tảng HTML/CSS/JS/TS, React lifecycle/hooks/performance, Redux Toolkit, Zustand, TanStack Query/Router, rendering, Git, build và case dự án thực tế.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-black/25 p-3"><div className="text-2xl font-black">{QUESTIONS.length}</div><div className="text-xs text-slate-400">Câu hỏi</div></div>
                <div className="rounded-2xl bg-black/25 p-3"><div className="text-2xl font-black">{result.correct}</div><div className="text-xs text-slate-400">Đúng</div></div>
                <div className="rounded-2xl bg-black/25 p-3"><div className="text-2xl font-black">{submitted ? `${result.percent}%` : '--'}</div><div className="text-xs text-slate-400">Điểm</div></div>
              </div>
            </div>
            {submitted && <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-semibold text-cyan-100">{scoreLabel(result.percent)}</div>}
          </section>

          <div className="sticky top-16 z-20 mb-5 rounded-2xl border border-white/10 bg-[#11131a]/95 p-3 backdrop-blur">
            <div className="grid gap-3 md:grid-cols-3">
              <select value={area} onChange={(e) => { setArea(e.currentTarget.value); setTopic('all'); }} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none">
                {AREAS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
              <select value={topic} onChange={(e) => setTopic(e.currentTarget.value)} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none">
                {topics.map((item) => <option key={item} value={item}>{item === 'all' ? 'Chủ đề: Tất cả' : item}</option>)}
              </select>
              <select value={mode} onChange={(e) => setMode(e.currentTarget.value)} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none">
                <option value="all">Trạng thái: Tất cả</option>
                <option value="unanswered">Chưa làm</option>
                <option value="wrong">Câu sai</option>
                <option value="correct">Câu đúng</option>
              </select>
            </div>
            <div className="mt-3 text-sm text-slate-400">Hiển thị <b className="text-white">{filtered.length}</b>/<b className="text-white">{QUESTIONS.length}</b> câu</div>
          </div>

          <div className="space-y-4">
            {filtered.map((q) => {
              const selected = answers[q.id];
              const hasAnswered = selected !== undefined;
              const isCorrect = selected === q.answer;
              const showFeedback = hasAnswered || submitted;
              return (
                <article key={q.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#171922] shadow-xl shadow-black/20">
                  <div className="border-b border-white/10 bg-white/[0.03] p-4 md:p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">#{q.id}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${levelClass(q.level)}`}>{q.level}</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">{q.topic}</span>
                      {hasAnswered && <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${isCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'}`}>{isCorrect ? 'Đúng' : 'Sai'}</span>}
                    </div>
                    <h2 className="text-base font-black leading-7 md:text-xl">{q.question}</h2>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      {q.options.map((option, index) => {
                        const isSelected = selected === index;
                        const isAnswer = q.answer === index;
                        let cls = 'border-white/10 bg-[#0f1118] hover:border-blue-400/60 hover:bg-blue-500/10';
                        if (showFeedback && isAnswer) cls = 'border-emerald-400/70 bg-emerald-500/10 text-emerald-100';
                        if (showFeedback && isSelected && !isAnswer) cls = 'border-rose-400/70 bg-rose-500/10 text-rose-100';
                        if (!showFeedback && isSelected) cls = 'border-blue-400/80 bg-blue-500/10 text-blue-100';
                        return (
                          <button key={`${q.id}-${option}`} onClick={() => choose(q.id, index)} className={`flex min-h-[64px] gap-3 rounded-2xl border p-3 text-left text-sm leading-6 transition ${cls}`}>
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-black">{alphabet[index]}</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showFeedback && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f1118] p-4 text-sm leading-7 text-slate-300">
                        {hasAnswered && <p><b className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>Bạn chọn:</b> {q.options[selected]}</p>}
                        <p><b className="text-blue-300">Đáp án đúng:</b> {q.correct}</p>
                        <p className="mt-2"><b className="text-white">Giải thích:</b> {q.explanation}</p>
                        <div className="mt-3 overflow-x-auto rounded-xl bg-black/30 px-3 py-2 font-mono text-xs text-cyan-100"><b className="font-sans text-cyan-300">Ví dụ:</b> {q.example}</div>
                        <p className="mt-2 text-xs text-slate-500">Nguồn định hướng: {q.source}</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
