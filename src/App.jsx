import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-interview-quiz-v5-layout';

const AREAS = [
  ['all', 'Tất cả', '✨'],
  ['html-css', 'HTML/CSS', '🌐'],
  ['js-ts', 'JavaScript / TypeScript', '🟨'],
  ['react', 'React', '⚛️'],
  ['state', 'State Management', '🧠'],
  ['api-router', 'API / Router', '🔌'],
  ['form-test', 'Form / Testing', '🧪'],
  ['rendering', 'Rendering / Build Data', '🚀'],
  ['git-build-security', 'Git / Build / Security', '🛠️'],
  ['project', 'Project / Interview', '📦'],
];

const CONCEPTS = [
  ['html-css','HTML','Cơ bản','DOCTYPE','trang HTML bị render khác nhau giữa browser vì thiếu khai báo chuẩn','khai báo <!doctype html> ở đầu file để browser chạy standards mode','bỏ DOCTYPE khiến browser có thể vào quirks mode','standards mode giúp CSS/layout ổn định hơn giữa browser','kiểm tra view-source và DevTools document mode','MDN HTML','<!doctype html>'],
  ['html-css','HTML','Thực tế','Semantic HTML','landing page đang dùng toàn div/span cho header, nav, nội dung và footer','đổi sang header, nav, main, section, article, footer đúng ngữ nghĩa','dùng div cho mọi thứ làm code kém accessibility và SEO','semantic giúp browser, crawler và screen reader hiểu cấu trúc','review DOM structure và heading outline','MDN HTML','<main><article><h1>...</h1></article></main>'],
  ['html-css','HTML','Thực tế','Accessible form','form login chỉ có placeholder, không có label','dùng label liên kết htmlFor/id cho từng input','placeholder không thay thế label và biến mất khi nhập','label tốt cho screen reader, focus và UX','kiểm tra bằng keyboard và accessibility tree','MDN Forms','<label htmlFor="email">Email</label><input id="email" />'],
  ['html-css','HTML','Cơ bản','Button trong form','nút Hủy trong form vô tình submit form','khai báo type="button" cho nút không submit và type="submit" cho nút submit','button trong form mặc định là submit nếu không khai báo type','type rõ ràng tránh bug submit ngoài ý muốn','inspect form submit event và button type','MDN Button','<button type="button">Hủy</button>'],
  ['html-css','HTML','Thực tế','Icon button','nút xóa chỉ có icon thùng rác nên screen reader không đọc được','dùng button thật và thêm aria-label mô tả hành động','dùng div/span onClick làm mất keyboard/focus semantic','button có keyboard interaction và accessible name mặc định tốt hơn','tab qua UI và kiểm tra name của control','MDN Accessibility','<button aria-label="Xóa người dùng">🗑</button>'],
  ['html-css','HTML','Cơ bản','Image alt','ảnh sản phẩm không có alt làm SEO/accessibility kém','dùng alt mô tả ảnh; ảnh trang trí dùng alt rỗng','nhồi keyword hoặc bỏ alt cho ảnh nội dung','alt là text thay thế khi ảnh không hiển thị hoặc cho screen reader','kiểm tra image accessible name','MDN Images','<img src="shoe.jpg" alt="Giày chạy bộ màu đen" />'],
  ['html-css','HTML','Cơ bản','Script async/defer','script chặn parse HTML làm page load chậm','dùng defer cho script phụ thuộc DOM và cần giữ thứ tự','async không giữ thứ tự và chạy ngay khi tải xong','defer hợp app entry truyền thống, async hợp script độc lập','xem waterfall và DOMContentLoaded','MDN Script','<script defer src="app.js"></script>'],
  ['html-css','HTML','Cơ bản','Meta viewport','mobile layout bị zoom/scale lạ','thêm meta viewport width=device-width, initial-scale=1','thiếu viewport khiến responsive CSS hoạt động sai trên mobile','viewport cho browser biết cách map CSS pixels trên thiết bị','test bằng mobile emulator','MDN Viewport','<meta name="viewport" content="width=device-width, initial-scale=1" />'],
  ['html-css','CSS','Cơ bản','box-sizing','card width 300px nhưng thêm padding làm vỡ layout','dùng box-sizing:border-box để width bao gồm content + padding + border','content-box mặc định dễ làm element lớn hơn dự kiến','border-box giúp sizing dễ dự đoán hơn trong design system','inspect computed box model','MDN CSS Box Model','*,*::before,*::after{box-sizing:border-box}'],
  ['html-css','CSS','Cơ bản','Flexbox','navbar cần căn logo trái, actions phải và item giữa hàng','dùng flex cho layout một chiều hàng hoặc cột','dùng flex ép mọi dashboard hai chiều phức tạp','flex mạnh cho alignment/distribution trong một trục','inspect flex container và item sizing','MDN Flexbox','display:flex; align-items:center; justify-content:space-between;'],
  ['html-css','CSS','Cơ bản','CSS Grid','dashboard có sidebar, header và content theo hàng/cột','dùng grid cho layout hai chiều cấp page','dùng margin/absolute hard-code cho layout tổng thể','grid mô tả row/column rõ hơn khi layout 2 chiều','bật grid overlay DevTools','MDN Grid','display:grid; grid-template-columns:260px 1fr;'],
  ['html-css','CSS','Thực tế','Responsive grid','card list vỡ trên mobile vì width cố định','dùng repeat(auto-fit,minmax(...)) và breakpoint hợp lý','set pixel cứng cho mọi màn hình','layout linh hoạt trước, media query sau','test 320px, tablet và desktop','MDN Responsive','grid-template-columns:repeat(auto-fit,minmax(240px,1fr));'],
  ['html-css','CSS','Nâng cao','Stacking context','modal z-index 9999 vẫn bị header đè','kiểm tra stacking context do transform/opacity/position và cân nhắc portal','tăng z-index vô hạn nhưng không xem parent context','z-index chỉ so sánh trong cùng stacking context','inspect ancestor CSS và DOM placement','MDN z-index','createPortal(<Modal/>, document.body)'],
  ['html-css','CSS','Cơ bản','position absolute','tooltip bị đặt sai vị trí so với card','đảm bảo parent cần làm mốc có position:relative','nghĩ absolute luôn theo body','absolute định vị theo ancestor positioned gần nhất','inspect containing block','MDN Position','parent{position:relative}.tooltip{position:absolute}'],
  ['html-css','CSS','Thực tế','Specificity','CSS module bị override bởi selector global mạnh hơn','giảm specificity, dùng convention rõ và tránh !important bừa bãi','thêm !important khắp nơi làm CSS khó maintain','specificity quyết định rule nào thắng khi cùng property','DevTools xem matched CSS rules','MDN Specificity','.card .title {}'],
  ['html-css','CSS','Thực tế','Overflow scroll','dashboard cần content scroll riêng còn sidebar đứng yên','set height/min-height rõ cho layout cha và overflow:auto cho content','overflow hidden toàn app làm mất nội dung','scroll container cần chiều cao xác định','inspect scroll container và computed height','MDN Overflow','.content{overflow:auto; min-height:0;}'],
  ['html-css','CSS','Cơ bản','rem và clamp','typography khó scale theo thiết bị và user setting','dùng rem/clamp cho font/spacing linh hoạt','dùng px cứng cho mọi font size','rem tôn trọng root font-size, clamp tạo responsive range','test browser zoom và mobile','MDN CSS Values','font-size:clamp(1rem,2vw,1.25rem);'],
  ['js-ts','JavaScript','Cơ bản','Truthy/Falsy','count=0 nhưng UI hiểu là không có dữ liệu','check null/undefined rõ thay vì if(count)','dùng if(count) cho quantity/page/discount hợp lệ bằng 0','0 là falsy nhưng vẫn có thể là dữ liệu hợp lệ','log value và branch condition','MDN Boolean','if (count != null) render(count);'],
  ['js-ts','JavaScript','Cơ bản','Nullish coalescing','discountPercent=0 bị fallback thành 10','dùng ?? thay vì || khi 0/false/empty string là giá trị hợp lệ','dùng || cho mọi default value','?? chỉ fallback khi null hoặc undefined','test với 0, false, empty string','MDN Nullish','const d = discountPercent ?? 10;'],
  ['js-ts','JavaScript','Cơ bản','== và ===','logic permission sai vì ép kiểu ngầm','ưu tiên === để so sánh cả type và value','dùng == trong logic quan trọng','== coercion dễ gây kết quả bất ngờ','test 0==false và 0===false','MDN Equality','0 == false // true; 0 === false // false'],
  ['js-ts','JavaScript','Cơ bản','Closure','timer trong React luôn đọc state cũ','hiểu callback giữ lexical scope và dùng dependency/functional update/ref đúng','không hiểu closure dẫn tới stale closure','closure là function nhớ scope nơi được tạo','debug value trong từng render','MDN Closure','setCount(prev => prev + 1)'],
  ['js-ts','JavaScript','Nâng cao','Event loop','Promise.then chạy trước setTimeout 0 làm bạn đoán sai thứ tự log','hiểu sync code chạy trước, microtask trước macrotask','nghĩ setTimeout 0 chạy ngay lập tức','event loop xử lý microtask queue trước task queue','ghi thứ tự log và queue tương ứng','MDN Event Loop','sync → microtask Promise → task setTimeout'],
  ['js-ts','JavaScript','Thực tế','Promise.all','dashboard gọi 3 API độc lập nhưng await tuần tự làm chậm','dùng Promise.all để chạy song song nếu các request phụ thuộc nhau không có','await từng request độc lập làm thời gian cộng dồn','Promise.all fail nếu một promise reject','đo waterfall network','MDN Promise','const [a,b]=await Promise.all([getA(),getB()]);'],
  ['js-ts','JavaScript','Thực tế','Promise.allSettled','home có nhiều block, một block fail vẫn muốn hiện block khác','dùng Promise.allSettled để biết từng request fulfilled/rejected','dùng Promise.all làm fail toàn bộ UI không cần thiết','allSettled hợp dữ liệu độc lập chịu lỗi từng phần','hiển thị partial error theo block','MDN Promise','await Promise.allSettled([banner(), news(), recs()])'],
  ['js-ts','JavaScript','Thực tế','AbortController','search API response cũ ghi đè response mới','debounce và hủy/ignore request cũ bằng AbortController hoặc requestId','để request cũ setState sau request mới','abort giảm race condition và network thừa','kiểm tra network canceled và request order','MDN AbortController','fetch(url,{signal:controller.signal})'],
  ['js-ts','JavaScript','Cơ bản','Array mutation','sort trực tiếp trên state làm UI khó đoán','copy array trước khi sort/splice/push hoặc dùng method immutable','mutate state array rồi set cùng reference','sort/splice/push mutate array gốc','check reference trước/sau update','MDN Array','const sorted=[...users].sort(compare)'],
  ['js-ts','JavaScript','Cơ bản','reduce','cần group orders theo status','dùng reduce để gom array thành object/summary mới','lạm dụng reduce làm code khó đọc cho case đơn giản','reduce hợp aggregate/group/convert structure','viết type accumulator rõ ràng','MDN Array','orders.reduce((acc,o)=>({...acc,[o.status]:[...(acc[o.status]||[]),o]}),{})'],
  ['js-ts','JavaScript','Cơ bản','Map và Set','selectedIds check liên tục bằng array.includes trên list lớn','dùng Set cho unique và membership check rõ ràng','lưu chuỗi ids phân tách dấu phẩy','Set giữ unique values và có has/add/delete','đo complexity và readability','MDN Set','const selected=new Set(ids); selected.has(id);'],
  ['js-ts','JavaScript','Cơ bản','Object spread shallow','copy object bằng spread nhưng nested address vẫn bị mutate','copy từng cấp nested bị thay đổi hoặc dùng Immer','nghĩ spread là deep clone','object spread chỉ shallow copy cấp đầu','so sánh reference nested object','MDN Spread','{...user,address:{...user.address,city}}'],
  ['js-ts','JavaScript','Cơ bản','Optional chaining','UI im lặng trống vì dùng ?. khắp nơi dù API sai contract','dùng ?. cho field thật sự optional, còn data bắt buộc nên validate/handle error','lạm dụng ?. che lỗi dữ liệu','?. tránh throw với nullish nhưng không validate runtime','log response và schema expectation','MDN Optional chaining','user?.profile?.name'],
  ['js-ts','JavaScript','Cơ bản','Debounce','search gọi API mỗi ký tự khiến server và UI lag','debounce input trước khi gọi API hoặc apply filter','gọi API trực tiếp trên mọi keypress không kiểm soát','debounce đợi người dùng ngừng thao tác','test typing nhanh và số request','MDN Events','useDebounce(keyword, 300)'],
  ['js-ts','JavaScript','Cơ bản','Throttle','scroll handler chạy quá nhiều gây lag','throttle để giới hạn tần suất xử lý scroll/resize','debounce mọi scroll khiến UI phản hồi chậm','throttle chạy tối đa một lần trong khoảng thời gian','đo FPS và handler calls','MDN Events','throttle(onScroll, 100)'],
  ['js-ts','TypeScript','Cơ bản','unknown vs any','API response chưa tin cậy nhưng dev ép any rồi dùng ngay','dùng unknown và narrow bằng guard/schema trước khi truy cập','dùng any làm mất type safety','unknown buộc kiểm tra trước khi dùng','kiểm tra runtime boundary','TS Handbook','if (isUser(data)) data.name'],
  ['js-ts','TypeScript','Cơ bản','Generics','viết helper getById dùng cho User/Product/Order','dùng generic constraint T extends {id:string|number}','dùng any làm mất type return cụ thể','generic giữ type cụ thể mà vẫn tái sử dụng','hover type return trong IDE','TS Handbook','function getById<T extends {id:string|number}>(items:T[],id:T["id"]){...}'],
  ['js-ts','TypeScript','Cơ bản','Utility types','UpdateUserPayload không gửi id và field optional','dùng Partial<Omit<User,"id">>','copy type thủ công dễ lệch domain model','utility types giảm lặp và giữ đồng bộ type','kiểm tra DTO theo API contract','TS Handbook','type UpdateUser = Partial<Omit<User,"id">>'],
  ['js-ts','TypeScript','Nâng cao','Discriminated union','loading/data/error boolean có thể mâu thuẫn','model state bằng union có status/type literal','dùng nhiều boolean khiến state vừa success vừa error','union giúp TS narrow đúng từng trạng thái','switch status và exhaustive check','TS Handbook','{status:"success",data} | {status:"error",message}'],
  ['js-ts','TypeScript','Cơ bản','keyof và indexed access','updateField nhận key/value nhưng value sai type vẫn pass','dùng K extends keyof T và value:T[K]','key:string value:any làm mất an toàn','indexed access giữ value khớp key','thử update age bằng string','TS Handbook','function set<T,K extends keyof T>(obj:T,k:K,v:T[K]){}'],
  ['js-ts','TypeScript','Nâng cao','satisfies','config routes cần check shape nhưng vẫn giữ literal type','dùng satisfies thay vì as ép kiểu','dùng as làm mất kiểm tra object literal','satisfies check shape nhưng giữ inference cụ thể','hover type của config','TS 4.9','const routes = {...} satisfies Record<string,RouteConfig>'],
  ['js-ts','TypeScript','Nâng cao','Awaited ReturnType','muốn lấy type data resolve từ async service','dùng Awaited<ReturnType<typeof fn>>','copy type response thủ công dễ lệch','utility type giúp reuse signature có sẵn','đổi service return và xem type cập nhật','TS Handbook','type User = Awaited<ReturnType<typeof fetchUser>>'],
  ['js-ts','TypeScript React','Cơ bản','ReactNode','children có thể là string, element, null, array','type children là React.ReactNode trong đa số case','ép JSX.Element làm children string/null bị lỗi không cần thiết','ReactNode bao quát mọi thứ React render được','test children text và fragment','React TS','type Props={children:React.ReactNode}'],
  ['js-ts','TypeScript React','Cơ bản','React event type','onChange input đang dùng any','dùng React.ChangeEvent<HTMLInputElement> và e.currentTarget.value','dùng any làm mất type DOM event','currentTarget được type theo element gắn handler','hover e.currentTarget','React TS','function onChange(e:React.ChangeEvent<HTMLInputElement>){}'],
  ['react','React Core','Cơ bản','Props vs state','component sửa trực tiếp props nhận từ parent','props là input readonly, state là memory nội bộ update qua setter','mutate props/state trực tiếp','React render theo props/state flow một chiều','React DevTools xem props/state','React Docs','const [count,setCount]=useState(0)'],
  ['react','React Core','Cơ bản','Immutable state','nested state update nhưng UI không đổi','tạo object/array reference mới ở nhánh thay đổi','mutate state trực tiếp rồi set lại cùng reference','React dựa vào reference để nhận biết thay đổi','so sánh prev===next','React Docs','setUser(p=>({...p,address:{...p.address,city}}))'],
  ['react','React Core','Cơ bản','Key trong list','xóa item đầu làm input trong row nhảy sai','dùng key ổn định từ id dữ liệu','dùng index làm key cho list có add/remove/sort','key là identity cho reconciliation','test reorder/delete với input local','React Docs','items.map(item=><Row key={item.id} />)'],
  ['react','React Core','Thực tế','Derived state','fullName lưu state riêng rồi sync bằng effect','tính trực tiếp từ firstName/lastName hoặc useMemo nếu nặng','dùng effect để sync data tính được từ state hiện tại','tránh duplicate state và render thừa','tìm useEffect chỉ set derived state','React Docs','const fullName = `${first} ${last}`'],
  ['react','React Core','Cơ bản','Controlled input','form search cần validate realtime keyword','dùng controlled input với value/onChange','đưa từng ký tự vào Redux global store','controlled giúp UI/state/validation đồng bộ','check input lag và re-render scope','React Docs','<input value={keyword} onChange={e=>setKeyword(e.target.value)} />'],
  ['react','React Effects','Thực tế','useEffect purpose','component dùng effect cho mọi phép tính render','chỉ dùng effect để đồng bộ với external systems','lạm dụng effect làm data flow khó hiểu','effect là escape hatch cho API/timer/listener/subscription','tìm logic có thể tính trong render','React Docs','useEffect(()=>{window.addEventListener(...)},[])'],
  ['react','React Effects','Thực tế','Effect dependencies','effect gọi API theo keyword nhưng dependency thiếu keyword','đưa đủ reactive values vào dependency hoặc restructure logic','bỏ dependency để né gọi lại','thiếu dependency gây stale closure/data','bật eslint exhaustive-deps','React Docs','useEffect(()=>fetchUsers(keyword),[keyword])'],
  ['react','React Effects','Thực tế','Cleanup','WebSocket roomId đổi nhưng vẫn nhận message room cũ','cleanup unsubscribe/clear timer/abort request trước effect mới','không cleanup subscription','cleanup chạy trước effect kế tiếp và unmount','quan sát duplicate listener/messages','React Docs','return () => socket.leave(roomId)'],
  ['react','React Effects','Cơ bản','StrictMode effect double','dev thấy API gọi 2 lần khi bật StrictMode','hiểu StrictMode dev kiểm tra setup/cleanup; effect phải idempotent/cancel đúng','tắt StrictMode để che bug','StrictMode giúp phát hiện side effect không an toàn','so sánh dev/prod và cleanup','React Docs','StrictMode chỉ extra check trong dev'],
  ['react','React Performance','Thực tế','React.memo','child memo vẫn render vì prop object inline','giữ props stable bằng useMemo/useCallback hoặc truyền primitive','nghĩ React.memo deep compare mọi props','memo dùng shallow compare reference','Profiler xem props changed','React Docs','const filters=useMemo(()=>({keyword}),[keyword])'],
  ['react','React Performance','Cơ bản','useCallback','function truyền xuống child memo đổi mỗi render','dùng useCallback khi reference stability quan trọng','bọc mọi function bằng useCallback dù không cần','useCallback cache function reference không làm logic nhanh hơn','check child memo và dependency','React Docs','const onDelete=useCallback(id=>remove(id),[remove])'],
  ['react','React Hooks','Cơ bản','useRef','cần focus input và lưu timer id không render UI','dùng useRef cho DOM/mutable value không gây render','dùng ref cho state cần hiển thị ra UI','ref.current đổi không trigger render','test update ref vs state','React Docs','inputRef.current?.focus()'],
  ['react','React Hooks','Thực tế','useReducer','form/wizard có nhiều action liên quan nhau','dùng useReducer để gom transition logic rõ ràng','dùng reducer cho boolean đơn giản làm thừa','reducer hợp state phức tạp phụ thuộc previous state','liệt kê action và state transitions','React Docs','dispatch({type:"nextStep"})'],
  ['react','React Advanced','Nâng cao','useTransition','filter list lớn làm input gõ lag','đánh dấu update nặng là transition và kết hợp virtualization/debounce','dùng transition thay cho cache API mọi nơi','transition ưu tiên update khẩn cấp như typing','Profiler input latency','React Docs','startTransition(()=>setFilter(value))'],
  ['react','React Advanced','Thực tế','Portal','modal bị cắt bởi overflow của parent','render modal ra document.body bằng portal','đặt modal trong parent bị overflow hidden/z-index context','portal đổi vị trí DOM nhưng giữ React tree','inspect DOM modal mount point','React Docs','createPortal(<Modal/>, document.body)'],
  ['react','React Advanced','Thực tế','Error Boundary','một widget lỗi render làm trắng toàn page','bọc vùng rủi ro bằng Error Boundary','nghĩ Error Boundary bắt mọi async/event error','Error Boundary bắt lỗi render subtree','test component throw trong render','React Docs','<ErrorBoundary><Widget/></ErrorBoundary>'],
  ['react','React Advanced','Cơ bản','Suspense lazy','chart library nặng làm bundle ban đầu lớn','lazy load component nặng bằng React.lazy + Suspense','lazy mọi component nhỏ gây overhead','code splitting giảm initial bundle','xem network chunks','React Docs','const Chart = React.lazy(()=>import("./Chart"))'],
  ['react','React Architecture','Thực tế','Custom hook','logic fetch/debounce/subscription lặp ở nhiều component','tách reusable state/effect behavior vào custom hook','nhét JSX chính vào hook làm khó hiểu','custom hook tái sử dụng logic không phải UI markup chính','kiểm tra hook dependency và cleanup','React Docs','function useDebounce(value,delay){...}'],
  ['state','State','Thực tế','State placement','mọi state đều bị đưa lên global store','đặt state gần nơi dùng nhất, lift/global khi thật sự cần share','global hóa state local làm coupling và reset khó','state scope quyết định maintainability','vẽ cây component và nơi dùng state','React Docs','modal open local; auth user global'],
  ['state','State','Thực tế','Client vs server state','product list API và sidebarOpen cùng nằm trong Redux','product list là server state, sidebarOpen là client UI state','đưa toàn bộ API data vào global client store','server state có cache/stale/refetch vấn đề riêng','phân loại ownership của data','TanStack Query','products: query; sidebarOpen: Zustand/local'],
  ['state','State','Thực tế','URL state','filter/page mất khi refresh hoặc share link','đưa keyword/page/sort/filter vào URL search params','đưa hover/password/draft nhạy cảm lên URL','URL state hợp state điều hướng/shareable','refresh và back/forward test','Router Docs','/users?page=2&role=admin'],
  ['state','Context','Thực tế','Context performance','Context value lớn làm nhiều consumer render','tách context theo domain, memoize value hoặc dùng store selector','dùng một context chứa mọi thứ','Context không tự tối ưu mọi re-render','Profiler consumer renders','React Docs','AuthContext riêng, ThemeContext riêng'],
  ['state','Redux Toolkit','Cơ bản','createSlice','Redux code nhiều action type/reducer boilerplate','dùng createSlice để sinh reducer và action creators','viết Redux cũ thủ công cho mọi case mới','RTK giảm boilerplate và dùng Immer','Redux DevTools xem action','RTK Docs','createSlice({name,initialState,reducers:{...}})'],
  ['state','Redux Toolkit','Cơ bản','Immer trong RTK','reducer RTK viết state.value++ nên tưởng mutate thật','hiểu đó là mutate draft, Immer tạo immutable update','mutate state Redux bên ngoài reducer','Immer cho cú pháp ngắn nhưng vẫn immutable','inspect next state reference','RTK Docs','state.value += 1'],
  ['state','Redux Toolkit','Thực tế','createAsyncThunk','API async cần pending/fulfilled/rejected','dùng thunk hoặc RTK Query/TanStack Query tùy server state strategy','gọi API trong reducer','async lifecycle cần loading/error rõ','Redux DevTools xem lifecycle actions','RTK Docs','builder.addCase(fetchUsers.fulfilled,...)'],
  ['state','Redux Toolkit','Nâng cao','Entity adapter','users list/detail lưu trùng nhiều nơi','normalize collection bằng ids/entities và adapter CRUD','lưu duplicate entity nhiều slice','normalized state giúp update entity nhất quán','kiểm tra source of truth entity','RTK Docs','createEntityAdapter<User>()'],
  ['state','React Redux','Thực tế','useSelector object','selector trả object mới khiến component render nhiều','tách selector hoặc dùng shallowEqual/memoized selector','return object inline từ useSelector mọi nơi','useSelector mặc định so sánh strict reference','Profiler và log selector result','React Redux','useSelector(selectUser); useSelector(selectTheme)'],
  ['state','Zustand','Thực tế','Zustand selector','component dùng useStore() lấy cả store','dùng selector useStore(s=>s.user) để subscribe đúng slice','lấy toàn bộ store làm render lan rộng','selector giảm re-render không liên quan','log render khi field khác đổi','Zustand Docs','useAuthStore(s=>s.user?.name)'],
  ['state','State','Thực tế','Logout cleanup','logout chỉ xóa token nhưng data user cũ vẫn hiện','reset auth/cart/permission stores và clear query cache liên quan','chỉ navigate login là đủ','logout cần dọn mọi user-specific state/cache','test switch account trong cùng browser','Architecture','queryClient.clear(); authStore.reset()'],
  ['api-router','Axios','Thực tế','Axios instance','axios.get rải rác trong component','tạo axiosClient/service để gom baseURL, timeout, token, error handling','component lẫn UI với HTTP config','API layer giúp test và đổi implementation dễ hơn','search code axios.get trong UI','Axios Docs','const api=axios.create({baseURL,timeout:15000})'],
  ['api-router','Axios','Thực tế','Request interceptor','mọi request cần token/language header','gắn token/request id trong interceptor, không gọi React hooks trong đó','gọi useNavigate/useStore hook trực tiếp trong interceptor','interceptor nằm ngoài React lifecycle','kiểm tra request headers','Axios Docs','api.interceptors.request.use(config=>config)'],
  ['api-router','Axios','Nâng cao','Refresh token queue','10 request cùng 401 gọi refresh 10 lần','dùng isRefreshing + queue + _retry để refresh một lần rồi retry pending','mỗi request refresh riêng gây race condition','refresh token flow cần chống loop và đồng bộ pending requests','test token expired với nhiều API song song','Axios Auth','isRefreshing, failedQueue, originalRequest._retry'],
  ['api-router','Axios','Thực tế','Axios error handling','mọi lỗi đều alert chung chung','phân biệt error.response, error.request và setup error','nuốt lỗi rồi return undefined','mỗi loại lỗi cần UI/action khác nhau','log status/network/config','Axios Docs','if(error.response?.status===401){...}'],
  ['api-router','TanStack Query','Thực tế','Query key','getUsers có page/filter nhưng key chỉ ["users"]','đưa đủ input ảnh hưởng data vào queryKey','dùng key thiếu làm cache sai giữa filter/page','queryKey là identity của cache','Devtools xem cache keys','TanStack Query','["users",{page,keyword,role}]'],
  ['api-router','TanStack Query','Cơ bản','staleTime gcTime','data ít đổi refetch quá nhiều','set staleTime phù hợp; hiểu gcTime giữ cache inactive','nhầm staleTime là thời gian xóa cache','staleTime là fresh window, gcTime là garbage collect inactive cache','React Query Devtools','staleTime: 60_000'],
  ['api-router','TanStack Query','Thực tế','Mutation invalidate','createUser xong list vẫn cũ','invalidateQueries hoặc setQueryData query liên quan','reload page thay vì update cache','mutation thay server state nên cache cần đồng bộ','Devtools xem query stale/refetch','TanStack Query','queryClient.invalidateQueries({queryKey:["users"]})'],
  ['api-router','TanStack Query','Nâng cao','Optimistic update','delete item UI xóa trước nhưng API fail','snapshot previous data, update tạm, rollback onError, invalidate onSettled','optimistic không rollback','optimistic cần kế hoạch khi server từ chối','test network fail','TanStack Query','onMutate/onError/onSettled'],
  ['api-router','Browser API','Thực tế','CORS','FE gọi API cross-origin bị CORS','server phải cấu hình allow origin/method/header/credentials; dev có thể proxy','thêm no-cors rồi vẫn đọc JSON','CORS là browser security policy chủ yếu fix ở server','Network tab xem preflight/header','MDN CORS','Access-Control-Allow-Origin'],
  ['api-router','HTTP','Cơ bản','204 No Content','fetch res.json() lỗi với API delete trả 204','không parse JSON mù quáng khi body rỗng/status 204','mọi response đều gọi json()','204 thành công nhưng không có body','kiểm tra status và content-type','MDN HTTP','if(res.status!==204) await res.json()'],
  ['api-router','Router','Thực tế','Protected route','route admin chỉ ẩn menu FE','FE guard cho UX, backend vẫn phải enforce permission','tin FE check là bảo mật cuối cùng','client code không đáng tin','gọi API trực tiếp bằng Postman thử','Router/Auth','UI guard + server authorization'],
  ['api-router','Router','Thực tế','SPA fallback','refresh /dashboard/users bị 404 sau deploy','config hosting rewrite mọi route về index.html','React Router không hỗ trợ route sâu','BrowserRouter cần server fallback','Network xem request /dashboard/users','React Router','/* /index.html 200'],
  ['form-test','React Hook Form','Thực tế','Large form','form 80 input lag vì controlled state từng field','dùng React Hook Form/uncontrolled và validation mode hợp lý','đưa từng field vào Redux','RHF giảm re-render cho form lớn','Profiler field renders','RHF Docs','<input {...register("email")} />'],
  ['form-test','React Hook Form','Cơ bản','Controller','MUI Select không register native dễ dàng','dùng Controller cho controlled component của UI library','dùng Controller cho mọi input native không cần thiết','Controller bridge controlled component với RHF','check value/onChange/ref integration','RHF Docs','<Controller name="date" render={({field})=><DatePicker {...field}/>} />'],
  ['form-test','Zod','Thực tế','Runtime validation','TypeScript type đúng nhưng API trả sai shape làm crash','dùng Zod/schema hoặc type guard validate runtime boundary','tin TS validate runtime','TS chỉ compile-time, API là runtime input','safeParse API response','Zod Docs','UserSchema.safeParse(data)'],
  ['form-test','Zod','Cơ bản','refine','confirmPassword cần khớp password','dùng refine/superRefine cho validation custom/cross-field','chỉ validate từng field độc lập','cross-field cần schema-level validation','test error path field','Zod Docs','schema.refine(v=>v.password===v.confirmPassword)'],
  ['form-test','Form','Thực tế','Server form error','login API trả email không tồn tại','setError field/root để hiển thị lỗi server trong form','throw lỗi trong render hoặc alert chung','server business error cần map vào UI form','test 422/400 response','RHF Docs','setError("email",{message:"Email không tồn tại"})'],
  ['form-test','Testing','Cơ bản','Testing Library query','test button bằng className bị vỡ khi đổi style','ưu tiên getByRole/getByLabelText/getByText giống user','query DOM index/class cho mọi thứ','semantic query bền và tốt accessibility','đổi CSS class và test lại','Testing Library','screen.getByRole("button",{name:/submit/i})'],
  ['form-test','Testing','Thực tế','Async testing','message success xuất hiện sau API','dùng findBy hoặc waitFor đúng cách','getBy ngay khi async chưa xong','findBy chờ element xuất hiện','await userEvent và async UI','Testing Library','await screen.findByText(/thành công/i)'],
  ['form-test','Testing','Thực tế','MSW','test UI phụ thuộc axios mock implementation','mock network layer bằng MSW để gần behavior thật','mock axios quá sát implementation','đổi axios sang fetch test vẫn nên ổn','test loading/success/error HTTP','MSW','server.use(http.get("/api/users",...))'],
  ['rendering','Rendering','Cơ bản','CSR','admin dashboard private không cần SEO','CSR với Vite/TanStack Query có thể đủ và deploy static đơn giản','nghĩ mọi app phải SSR','CSR render UI chủ yếu ở client sau JS load','đo first load và bundle','React/Vite','Vite SPA dashboard'],
  ['rendering','Rendering','Cơ bản','SSR','page public cần nội dung HTML sớm cho SEO','SSR render HTML theo request rồi hydrate ở client','nghĩ SSR luôn interactive nhanh hơn','SSR tăng server work và có hydration cost','đo TTFB/LCP/hydration','React DOM','hydrateRoot(container,<App/>)'],
  ['rendering','Rendering','Cơ bản','SSG','landing/blog ít đổi cần load nhanh','SSG render static HTML ở build time và serve CDN','SSG cho private dashboard theo user','SSG nhanh nhưng data có thể cũ đến rebuild/revalidate','kiểm tra build output','Next Docs','blog/docs marketing pages'],
  ['rendering','Rendering','Nâng cao','ISR','product pages nhiều và cập nhật định kỳ','dùng ISR/revalidation để cập nhật static page sau build','rebuild toàn site mỗi phút','ISR cân bằng static speed và freshness','test revalidate path/tag','Next Docs','product detail ISR, stock dynamic'],
  ['rendering','Hydration','Nâng cao','Hydration mismatch','SSR render Date.now/localStorage gây warning','giữ markup server/client khớp, browser-only logic đưa vào effect/client boundary','đọc window/localStorage trực tiếp trong SSR render','hydration attach React vào HTML server-rendered','so sánh server HTML và client render','React DOM','render fallback rồi useEffect update'],
  ['rendering','Next.js','Nâng cao','use client','component có onClick/useState trong App Router','chỉ thêm use client ở boundary thật sự cần tương tác','đặt use client ở layout gốc bừa bãi','use client kéo subtree vào client bundle','analyze bundle/client component tree','Next Docs','"use client" ở Button mở modal'],
  ['rendering','Next.js','Nâng cao','Server Components','component fetch data public/secret server-side','dùng Server Component để fetch ở server và giảm JS client','dùng useEffect fetch mọi data dù server làm tốt hơn','Server Component không có event handler client','xem network client bundle','Next Docs','async Server Component fetch products'],
  ['rendering','Build Data','Thực tế','Build-time vs runtime data','interviewer hỏi data này lấy lúc build hay lúc chạy','đánh giá freshness, user-specific, SEO, cache, rebuild cost rồi chọn','trả lời theo trend mà không phân tích data','thời điểm lấy data ảnh hưởng đúng/sai và performance','vẽ data lifecycle','Next/Vite','blog build-time, profile runtime'],
  ['rendering','Performance','Nâng cao','Request waterfall','API độc lập bị gọi tuần tự qua nested effects','parallelize, prefetch hoặc route/server-level fetch sớm hơn','để request B chờ render A không cần thiết','waterfall làm latency cộng dồn','Network waterfall chart','TanStack/Next','Promise.all hoặc prefetchQuery'],
  ['git-build-security','Git','Cơ bản','revert vs reset','commit lỗi đã push lên branch chung','dùng git revert để tạo commit đảo ngược an toàn','reset --hard và force push branch shared bừa bãi','revert không rewrite history','xem git log trước/sau','Git SCM','git revert abc123'],
  ['git-build-security','Git','Thực tế','rebase','feature branch cá nhân lệch main','fetch rồi rebase origin/main để PR history sạch nếu team cho phép','rebase branch shared nhiều người dùng','rebase rewrite commit hash','resolve conflict và chạy test','Git SCM','git fetch origin && git rebase origin/main'],
  ['git-build-security','Git','Thực tế','merge conflict','conflict trong file feature của hai người','đọc logic hai bên, giữ requirement đúng, chạy test/build','accept current/incoming bừa','conflict là xung đột logic không chỉ text','review diff sau resolve','Git SCM','resolve → npm test → git add'],
  ['git-build-security','Vite','Cơ bản','Vite env','REACT_APP_API_URL undefined khi migrate CRA sang Vite','đổi sang import.meta.env.VITE_API_URL','dùng process.env.REACT_APP_* trong Vite client','Vite expose env client qua prefix VITE_','console env trong dev/build','Vite Docs','import.meta.env.VITE_API_URL'],
  ['git-build-security','Vite','Thực tế','base path','deploy dưới /app/ bị asset 404','config base/public path và router basename phù hợp','để base mặc định root khi deploy subpath','asset URL phụ thuộc base build','Network xem JS/CSS 404','Vite Docs','vite build --base=/app/'],
  ['git-build-security','Build','Thực tế','Production build','dev chạy ổn nhưng CI build Linux fail import','kiểm tra case-sensitive path, env, asset, build logs','nghĩ dev server giống production 100%','build production có minify/bundle/OS case sensitivity','chạy npm run build local','Vite Docs','./UserCard vs ./userCard'],
  ['git-build-security','Security','Thực tế','XSS','render HTML do user nhập bằng dangerouslySetInnerHTML','sanitize/whitelist HTML và CSP, backend cũng validate','tin TypeScript string là an toàn','XSS là chạy script độc hại trong browser user','test payload script/onerror','OWASP','DOMPurify.sanitize(html)'],
  ['git-build-security','Security','Thực tế','Token storage','access token lưu localStorage','hiểu rủi ro XSS; cân nhắc httpOnly cookie/SameSite/CSRF theo threat model','nghĩ localStorage mã hóa tuyệt đối','storage auth có trade-off XSS/CSRF','thảo luận với backend/security','OWASP','localStorage tiện nhưng nhạy XSS'],
  ['project','Architecture','Thực tế','Feature structure','UserManagement 900 dòng chứa API/table/filter/modal/form','tách components, hooks, services, types/constants theo responsibility','đưa mọi thứ vào một file cho tiện','separation of concerns giúp maintain/test/review','vẽ module features/users','Architecture','features/users/{components,hooks,services,types}'],
  ['project','Architecture','Thực tế','Shared folder','UserTable chỉ dùng trong feature users','để trong features/users/components, chỉ shared khi thật sự dùng chung','đưa mọi component vào shared sớm','shared quá sớm thành bãi chứa business component','search usage của component','Architecture','shared/Button, features/users/UserTable'],
  ['project','Architecture','Thực tế','Mock API','BE chưa xong nhưng FE cần làm UI','thống nhất contract, mock service/MSW, type response rồi thay endpoint thật','hard-code JSX không contract','contract-first giúp FE/BE làm song song','so sánh mock với API thật','Architecture','MSW handlers theo API contract'],
  ['project','Debug','Thực tế','White screen production','deploy xong trắng màn','mở Console/Network, check JS error, chunk 404, env/base path, route fallback, API config','đổi CSS trước khi xem log','debug có hệ thống thay vì đoán','Console + Network + build logs','Debug','chunk 404, env undefined, runtime error'],
  ['project','Interview','Thực tế','Kể feature khó','interviewer hỏi feature khó nhất từng làm','trả lời bối cảnh → vấn đề → quyết định → trade-off → kết quả','chỉ kể tên thư viện đã dùng','level 2.5+ cần chứng minh problem solving','chuẩn bị 2-3 câu chuyện STAR','Interview','Tối ưu table 10k rows bằng virtualization'],
  ['project','Interview','Thực tế','Trade-off answer','hỏi tại sao không dùng Redux cho tất cả','phân loại state và nói trade-off coupling/boilerplate/source of truth','trả lời vì thích/ghét Redux','nhà tuyển dụng đánh giá reasoning không phải khẩu vị','liệt kê local/server/client/url state','Interview','Server state dùng Query, UI global dùng store'],
];

const VARIANTS = [
  (c) => ({ q: `Case thực tế: ${c.caseText}. Bạn chọn hướng xử lý nào?`, correct: c.best }),
  (c) => ({ q: `Khi phỏng vấn hỏi về ${c.title}, câu trả lời nào đúng trọng tâm nhất?`, correct: `${c.best}. Quan trọng là giải thích được vì sao, trade-off và ví dụ thực tế.` }),
  (c) => ({ q: `Review code liên quan ${c.title}: lỗi nào cần tránh nhất?`, correct: c.pitfall }),
  (c) => ({ q: `Bug production có dấu hiệu liên quan ${c.title}. Bạn debug theo hướng nào trước?`, correct: c.debug }),
  (c) => ({ q: `Trade-off/ý chính quan trọng nhất của ${c.title} là gì?`, correct: c.tradeoff }),
];

const WRONGS = {
  'html-css': ['Dùng div, span và inline style cho nhanh, không cần semantic.', 'Tăng z-index hoặc margin thật lớn để ép giao diện đúng.', 'Bỏ qua accessibility vì không ảnh hưởng người dùng thật.'],
  'js-ts': ['Ép any hoặc bỏ qua type/check để code compile nhanh hơn.', 'Dùng cùng một pattern cho mọi case mà không xét runtime behavior.', 'Che lỗi bằng optional chaining hoặc try/catch rỗng ở mọi nơi.'],
  react: ['Đưa mọi thứ vào useEffect hoặc global state cho chắc.', 'Mutate trực tiếp state/props để giảm code.', 'Bọc mọi component bằng memo/useCallback dù chưa đo performance.'],
  state: ['Đưa toàn bộ local, server và form state vào một global store duy nhất.', 'Persist mọi dữ liệu vào localStorage kể cả token và server cache lớn.', 'Không phân biệt client state, server state và URL state.'],
  'api-router': ['Gọi API trực tiếp rải rác trong JSX component.', 'Reload toàn bộ trang sau mọi thay đổi dữ liệu.', 'Tin rằng FE route guard là bảo mật cuối cùng.'],
  'form-test': ['Dùng any cho form value và chỉ test className.', 'Bỏ qua lỗi server trả về vì client validation đã pass.', 'Mock sát implementation thay vì hành vi người dùng/API.'],
  rendering: ['Luôn chọn SSR cho mọi màn vì nghe cao cấp.', 'Dùng SSG cho dữ liệu private theo từng user.', 'Không quan tâm hydration, cache và thời điểm fetch data.'],
  'git-build-security': ['Force push branch chung hoặc tắt cảnh báo bảo mật cho nhanh.', 'Đưa secret lên client env vì build cần dùng.', 'Không chạy production build trước khi deploy.'],
  project: ['Gom toàn bộ logic vào một component lớn để dễ tìm.', 'Chỉ kể tên thư viện, không nói vấn đề và kết quả.', 'Code theo cảm tính, không thống nhất contract với team.'],
};

function stableHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash;
}

function buildQuestion(concept, conceptIndex, variantIndex) {
  const [area, topic, level, title, caseText, best, pitfall, tradeoff, debug, source, example] = concept;
  const c = { area, topic, level, title, caseText, best, pitfall, tradeoff, debug, source, example };
  const picked = VARIANTS[variantIndex](c);
  const wrongPool = WRONGS[area] || WRONGS.project;
  const rawOptions = [picked.correct, ...wrongPool];
  const shift = stableHash(`${title}-${variantIndex}`) % 4;
  const options = [...rawOptions.slice(shift), ...rawOptions.slice(0, shift)];
  return {
    id: conceptIndex * VARIANTS.length + variantIndex + 1,
    area,
    topic,
    level,
    title,
    source,
    question: picked.q,
    options,
    answer: options.indexOf(picked.correct),
    explanation: `${best}. ${tradeoff}. Lỗi cần tránh: ${pitfall}.`,
    example,
  };
}

const QUESTIONS = CONCEPTS.flatMap((concept, conceptIndex) => VARIANTS.map((_, variantIndex) => buildQuestion(concept, conceptIndex, variantIndex))).slice(0, 452).map((q, index) => ({ ...q, id: index + 1 }));
const alphabet = ['A', 'B', 'C', 'D'];

function levelClass(level) {
  if (level === 'Cơ bản') return 'level-basic';
  if (level === 'Thực tế') return 'level-practical';
  return 'level-advanced';
}

function getScoreLabel(percent) {
  if (percent >= 85) return 'Rất ổn - có thể đi phỏng vấn thử';
  if (percent >= 70) return 'Khá tốt - ôn lại nhóm câu sai';
  if (percent >= 50) return 'Nắm nền nhưng còn lỗ hổng';
  return 'Cần ôn lại từng vùng kiến thức';
}

export default function App() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [area, setArea] = useState('all');
  const [topic, setTopic] = useState('all');
  const [level, setLevel] = useState('all');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* noop */ }
  }, [answers]);

  const areaQuestions = useMemo(() => area === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.area === area), [area]);
  const topics = useMemo(() => ['all', ...Array.from(new Set(areaQuestions.map((q) => q.topic)))], [areaQuestions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter((q) => {
      const selected = answers[q.id];
      const topicOk = topic === 'all' || q.topic === topic;
      const levelOk = level === 'all' || q.level === level;
      const modeOk = mode === 'all' || (mode === 'unanswered' && selected === undefined) || (mode === 'wrong' && selected !== undefined && selected !== q.answer) || (mode === 'correct' && selected === q.answer);
      const searchOk = !keyword || `${q.topic} ${q.title} ${q.question} ${q.explanation} ${q.source} ${q.example}`.toLowerCase().includes(keyword);
      return topicOk && levelOk && modeOk && searchOk;
    });
  }, [areaQuestions, topic, level, mode, search, answers]);

  const areaCounts = useMemo(() => AREAS.reduce((acc, [id]) => {
    acc[id] = id === 'all' ? QUESTIONS.length : QUESTIONS.filter((q) => q.area === id).length;
    return acc;
  }, {}), []);

  const result = useMemo(() => {
    const correct = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    return { correct, total: QUESTIONS.length, percent: Math.round((correct / QUESTIONS.length) * 100) };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;

  function choose(id, index) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: index }));
  }

  function resetQuiz() {
    setAnswers({}); setSubmitted(false); setMode('all'); setLevel('all'); setArea('all'); setTopic('all'); setSearch('');
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-dark">
      <header className="topbar">
        <div className="brand"><span>🧙‍♂️</span><b>Luyện Phỏng Vấn FE</b></div>
        <div className="top-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Tìm kiếm..." /></div>
        <button className="ghost">Bảng giá</button><button className="pill">EN</button><button className="avatar">⚙</button>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h1>Tất Cả Câu Hỏi</h1>
          <button onClick={() => { setArea('all'); setTopic('all'); }} className={area === 'all' ? 'cat active' : 'cat'}><span>✨ Tất cả</span><em>{QUESTIONS.length}</em></button>
          <div className="side-filter"><input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Lọc danh mục..." /></div>
          <div className="side-label"><span>FRONTEND</span><i /></div>
          {AREAS.filter(([id]) => id !== 'all').map(([id, label, icon]) => (
            <button key={id} onClick={() => { setArea(id); setTopic('all'); }} className={area === id ? 'cat active' : 'cat'}><span><b>{icon}</b>{label}</span><em>{areaCounts[id]}</em></button>
          ))}
        </aside>

        <main className="content">
          <div className="mobile-search"><input value={search} onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Tìm câu hỏi..." /></div>
          <div className="content-toolbar">
            <div className="count">Hiển thị <b>{filtered.length}</b>/<b>{QUESTIONS.length}</b> câu · Đã làm <b>{answeredCount}</b></div>
            <div className="controls">
              <select value={level} onChange={(e) => setLevel(e.currentTarget.value)}><option value="all">Cấp độ: Tất cả</option><option value="Cơ bản">Cơ bản</option><option value="Thực tế">Thực tế</option><option value="Nâng cao">Nâng cao</option></select>
              <select value={topic} onChange={(e) => setTopic(e.currentTarget.value)}>{topics.map((t) => <option key={t} value={t}>{t === 'all' ? 'Chủ đề: Tất cả' : t}</option>)}</select>
              <select value={mode} onChange={(e) => setMode(e.currentTarget.value)}><option value="all">Trạng thái: Tất cả</option><option value="unanswered">Chưa làm</option><option value="wrong">Câu sai</option><option value="correct">Câu đúng</option></select>
              {!submitted ? <button className="primary" onClick={() => setSubmitted(true)}>Nộp bài</button> : <button className="primary cyan" onClick={resetQuiz}>Làm lại</button>}
            </div>
          </div>

          <section className="stats">
            <div><span>Tổng câu hỏi</span><strong>{QUESTIONS.length}</strong></div><div><span>Đã trả lời</span><strong>{answeredCount}</strong></div><div><span>Kết quả</span><strong>{submitted ? `${result.percent}%` : '--'}</strong><small>{submitted ? getScoreLabel(result.percent) : 'Làm xong bấm nộp bài'}</small></div>
          </section>

          <section className="cards">
            {filtered.map((q) => {
              const selected = answers[q.id];
              const done = selected !== undefined;
              const ok = selected === q.answer;
              return <article className="qa-card" key={q.id}>
                <div className="qa-head"><span className="num">#{q.id}</span><div className="qa-title"><div className="badges"><b className={levelClass(q.level)}>{q.level}</b><b>{q.topic}</b><b>Docs-driven</b></div><h2>{q.question}</h2></div><div className="icons">🔖 🎓 ↗</div></div>
                <div className="qa-body"><div className="options-grid">{q.options.map((option, index) => { let cls = 'option'; if (done && index === q.answer) cls += ' right'; if (done && index === selected && selected !== q.answer) cls += ' wrong'; if (!done && selected === index) cls += ' chosen'; return <button className={cls} key={option} onClick={() => choose(q.id, index)}><span>{alphabet[index]}</span><p>{option}</p></button>; })}</div>
                {done && <div className={ok ? 'explain good' : 'explain bad'}><p><b>Bạn chọn:</b> {q.options[selected]}</p><p><b>Đáp án đúng:</b> {q.options[q.answer]}</p><p><b>Giải thích:</b> {q.explanation}</p>{q.example && <code>Ví dụ: {q.example}</code>}<small>Nguồn định hướng: {q.source}</small></div>}</div>
              </article>;
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
