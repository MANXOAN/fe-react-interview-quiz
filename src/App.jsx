import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-interview-quiz-clear-v1';

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

function q(area, topic, level, question, options, answer, explanation, example = '', source = '') {
  return { area, topic, level, question, options, answer, explanation, example, source };
}

const QUESTIONS = [
  q('html-css','HTML','Cơ bản','Semantic HTML là gì? Vì sao không nên dùng toàn div cho mọi thứ?',[
    'Semantic HTML là dùng thẻ đúng ý nghĩa nội dung như header, nav, main, section, article, footer',
    'Semantic HTML là đặt class thật dài để dễ SEO hơn',
    'Semantic HTML là dùng toàn div cho dễ style',
    'Semantic HTML là viết CSS inline trong HTML'
  ],0,'Semantic HTML giúp code dễ đọc, tốt hơn cho SEO và accessibility vì browser, crawler và screen reader hiểu cấu trúc trang tốt hơn.','<main><article><h1>Tiêu đề</h1></article></main>','MDN HTML'),
  q('html-css','HTML','Cơ bản','Trong form, button không khai báo type mặc định là gì?',[
    'button','reset','submit','menu'
  ],2,'Trong form, button mặc định là submit. Vì vậy các nút như Hủy/Đóng nên khai báo type="button" để tránh submit ngoài ý muốn.','<button type="button">Hủy</button>','MDN Button'),
  q('html-css','HTML','Cơ bản','async và defer khác nhau như thế nào khi load script?',[
    'async giữ thứ tự script, defer không giữ thứ tự',
    'async chạy ngay khi tải xong, defer đợi HTML parse xong và giữ thứ tự script',
    'defer chặn parse HTML còn async không tải song song',
    'async chỉ dùng cho CSS'
  ],1,'Cả async và defer đều tải song song. async chạy ngay khi tải xong và không đảm bảo thứ tự. defer đợi HTML parse xong rồi chạy theo thứ tự.','<script defer src="app.js"></script>','MDN Script'),
  q('html-css','CSS','Cơ bản','box-sizing: border-box có tác dụng gì?',[
    'width chỉ tính content',
    'width tính content + padding + border',
    'width tính cả margin',
    'element không còn padding'
  ],1,'border-box giúp kích thước dễ kiểm soát hơn vì width đã bao gồm content, padding và border.','*{box-sizing:border-box}','MDN CSS Box Model'),
  q('html-css','CSS','Cơ bản','Flexbox và Grid khác nhau như thế nào?',[
    'Flexbox hợp layout một chiều, Grid hợp layout hai chiều hàng và cột',
    'Flexbox chỉ dùng mobile, Grid chỉ dùng desktop',
    'Grid chỉ đổi màu chữ, Flexbox chỉ đổi font',
    'Hai cái giống hệt nhau'
  ],0,'Flexbox mạnh cho alignment theo một trục như navbar/button group. Grid mạnh cho layout hai chiều như dashboard, gallery, card grid.','display:flex; display:grid;','MDN Flexbox / Grid'),
  q('html-css','CSS','Thực tế','Modal z-index rất cao nhưng vẫn bị header che. Nguyên nhân thường là gì?',[
    'Do stacking context của parent như transform, opacity, position + z-index',
    'Do React không render được modal',
    'Do TypeScript chưa bật strict mode',
    'Do thiếu display:flex'
  ],0,'z-index chỉ so sánh trong cùng stacking context. Modal nên được quản lý z-index rõ ràng và thường render qua portal ra document.body.','createPortal(<Modal />, document.body)','MDN z-index'),
  q('html-css','CSS','Thực tế','Responsive layout card list nên làm thế nào để không vỡ trên mobile?',[
    'Dùng width pixel cứng cho mọi card',
    'Dùng CSS Grid/Flex linh hoạt, minmax, auto-fit và breakpoint hợp lý',
    'Dùng position absolute cho từng card',
    'Ẩn hết card trên mobile'
  ],1,'Layout nên linh hoạt trước, sau đó dùng breakpoint khi cần. Tránh hard-code width khiến mobile bị overflow.','grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));','MDN Responsive Design'),

  q('js-ts','JavaScript','Cơ bản','Primitive type và reference type khác nhau như thế nào?',[
    'Primitive copy theo reference, object copy theo value',
    'Primitive copy theo value, object/array/function copy theo reference',
    'Cả hai đều copy theo value',
    'Cả hai đều copy theo reference'
  ],1,'Primitive như string, number, boolean copy giá trị. Object, array, function copy tham chiếu nên sửa nested object có thể ảnh hưởng nơi khác.','','MDN JavaScript'),
  q('js-ts','JavaScript','Cơ bản','== và === khác nhau như thế nào?',[
    '== ép kiểu, === so sánh cả value và type',
    '=== ép kiểu, == không ép kiểu',
    'Hai cái giống nhau',
    '=== chỉ dùng cho object'
  ],0,'== có ép kiểu ngầm nên dễ gây kết quả bất ngờ. === thường an toàn hơn vì so sánh cả kiểu dữ liệu và giá trị.','0 == false // true; 0 === false // false','MDN Equality'),
  q('js-ts','JavaScript','Cơ bản','Falsy values trong JavaScript gồm những giá trị nào?',[
    'false, 0, -0, 0n, "", null, undefined, NaN',
    '[], {}, "false"',
    'Mọi object rỗng',
    'Mọi string có chữ false'
  ],0,'Array và object rỗng vẫn là truthy. Bug thường gặp là if(count) bỏ qua count = 0 dù 0 là giá trị hợp lệ.','','MDN Boolean'),
  q('js-ts','JavaScript','Cơ bản','Closure là gì? Cho ví dụ dễ hiểu.',[
    'Function nhớ được biến ở scope bên ngoài nơi nó được tạo',
    'Object bị đóng băng không sửa được',
    'Một kiểu dữ liệu mới trong JS',
    'Một cách viết CSS module'
  ],0,'Closure xuất hiện khi function bên trong vẫn truy cập biến của function bên ngoài. Trong React, hiểu closure giúp tránh stale state trong callback/effect.','function outer(){ let x=1; return () => x; }','MDN Closure'),
  q('js-ts','JavaScript','Cơ bản','Arrow function khác function thường ở this như thế nào?',[
    'Arrow function có this riêng theo object gọi nó',
    'Arrow function không có this riêng, lấy this từ lexical scope',
    'Arrow function luôn trỏ tới window',
    'Arrow function không dùng được làm callback'
  ],1,'Arrow function rất hợp callback, nhưng không hợp khi cần this dynamic của object method.','','MDN Arrow Function'),
  q('js-ts','JavaScript','Cơ bản','slice và splice khác nhau như thế nào?',[
    'slice không mutate array gốc, splice mutate array gốc',
    'slice mutate array gốc, splice không mutate',
    'Cả hai đều không mutate',
    'Cả hai chỉ dùng cho object'
  ],0,'slice trả mảng mới. splice sửa trực tiếp mảng gốc. Trong React state nên tránh mutate trực tiếp.','const copy = arr.slice();','MDN Array'),
  q('js-ts','JavaScript','Cơ bản','sort() có mutate mảng gốc không? Trong React nên xử lý sao?',[
    'Có mutate, nên copy trước rồi sort',
    'Không mutate, dùng trực tiếp trên state luôn được',
    'Chỉ mutate object',
    'Không thể sort array trong React'
  ],0,'Array.prototype.sort() mutate array gốc. Nếu users là state, nên dùng [...users].sort(...) hoặc toSorted nếu môi trường hỗ trợ.','const sorted = [...users].sort(compare);','MDN Array sort'),
  q('js-ts','JavaScript Async','Cơ bản','Promise.all và Promise.allSettled khác nhau như thế nào?',[
    'Promise.all fail ngay nếu một promise reject; allSettled đợi tất cả xong và trả từng status',
    'allSettled fail ngay nếu một promise reject',
    'Promise.all chỉ chạy tuần tự',
    'Hai cái giống nhau'
  ],0,'Promise.all hợp khi các request đều bắt buộc thành công. allSettled hợp khi một phần fail vẫn muốn hiển thị phần còn lại.','','MDN Promise'),
  q('js-ts','JavaScript Async','Cơ bản','Event loop: Promise.then và setTimeout(...,0) cái nào chạy trước?',[
    'setTimeout chạy trước vì delay là 0',
    'Promise.then chạy trước vì microtask được xử lý trước macrotask',
    'Thứ tự ngẫu nhiên',
    'Cả hai chạy cùng lúc'
  ],1,'Code sync chạy trước, sau đó microtask như Promise.then, rồi đến macrotask như setTimeout.','console.log(1); setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(3)); console.log(4); // 1 4 3 2','MDN Event Loop'),
  q('js-ts','JavaScript Async','Thực tế','Search API bị response cũ ghi đè response mới. Xử lý như thế nào?',[
    'Debounce input và dùng AbortController hoặc requestId để hủy/bỏ qua request cũ',
    'Gọi API nhiều hơn để chắc chắn có data',
    'Tắt loading state',
    'Dùng index làm key'
  ],0,'Khi user gõ nhanh, request cũ có thể trả về sau request mới. Cần hủy hoặc ignore request cũ để UI không bị ghi đè sai.','fetch(url,{signal:controller.signal})','MDN AbortController'),

  q('js-ts','TypeScript','Cơ bản','TypeScript kiểm tra type ở thời điểm nào?',[
    'Runtime trong browser',
    'Compile-time/dev-time',
    'Khi server restart',
    'Khi CSS load'
  ],1,'TypeScript giúp bắt lỗi khi dev/build. Khi chạy trên browser, code đã là JavaScript nên API response vẫn cần validate runtime nếu không tin cậy.','','TypeScript Handbook'),
  q('js-ts','TypeScript','Cơ bản','type và interface khác nhau như thế nào?',[
    'interface hỗ trợ declaration merging; type linh hoạt hơn với union, conditional, mapped types',
    'type chỉ dùng cho number',
    'interface chỉ dùng cho CSS',
    'Cả hai không khai báo object được'
  ],0,'Cả type và interface đều có thể khai báo object shape. Trong FE, dùng theo convention team; type thường tiện với union/utility types.','','TypeScript Handbook'),
  q('js-ts','TypeScript','Cơ bản','unknown khác any như thế nào?',[
    'unknown bắt buộc narrowing trước khi dùng, any bỏ qua kiểm tra type',
    'unknown nguy hiểm hơn any',
    'unknown chỉ dùng cho array',
    'any bắt buộc check runtime'
  ],0,'unknown an toàn hơn any vì không cho truy cập property/method nếu chưa kiểm tra kiểu.','if (isUser(data)) data.name','TypeScript Handbook'),
  q('js-ts','TypeScript','Cơ bản','Generic dùng để làm gì?',[
    'Viết code tái sử dụng mà vẫn giữ type chính xác',
    'Tắt type checking',
    'Biến mọi type thành any',
    'Chỉ dùng để khai báo CSS'
  ],0,'Generic giúp function/component/type dùng được với nhiều kiểu dữ liệu mà không mất type safety.','function getById<T extends {id:string}>(items:T[], id:string): T | undefined','TypeScript Handbook'),
  q('js-ts','TypeScript','Cơ bản','keyof User trả về gì nếu User có id, name, email?',[
    'number',
    'User[]',
    "'id' | 'name' | 'email'",
    'boolean'
  ],2,'keyof lấy union các key của object type. Pattern này hay dùng trong helper update field.','function set<T,K extends keyof T>(obj:T,key:K,value:T[K]){}','TypeScript Handbook'),
  q('js-ts','TypeScript','Thực tế','Partial, Pick và Omit thường dùng khi nào?',[
    'Partial làm optional, Pick lấy một số field, Omit bỏ một số field',
    'Cả ba đều biến type thành string',
    'Cả ba chỉ validate runtime',
    'Cả ba chỉ dùng trong CSS'
  ],0,'Đây là utility types hay dùng để tạo DTO, form values, update payload mà không viết lại type thủ công.','type UpdateUser = Partial<Omit<User,"id">>','TypeScript Handbook'),
  q('js-ts','TypeScript','Nâng cao','Discriminated union giải quyết vấn đề gì trong UI state?',[
    'Model state theo từng trạng thái rõ ràng như loading/success/error, tránh state mâu thuẫn',
    'Tạo CSS grid',
    'Chạy promise song song',
    'Tự động gọi API'
  ],0,'Thay vì loading:boolean, data?, error? dễ mâu thuẫn, union theo status giúp TypeScript narrow đúng từng case.','{status:"success",data} | {status:"error",message}','TypeScript Handbook'),

  q('react','React Core','Cơ bản','Props và state khác nhau như thế nào trong component React?',[
    'Props là dữ liệu cha truyền xuống và readonly; state là dữ liệu nội bộ component có thể thay đổi bằng setter',
    'Props là dữ liệu nội bộ, state là dữ liệu cha truyền xuống',
    'Props chỉ dùng cho CSS',
    'State không gây re-render'
  ],0,'Props là input từ bên ngoài. Component không nên sửa trực tiếp props. State là memory nội bộ, khi update qua setter thì React render lại.','function UserCard({user}) { const [open,setOpen]=useState(false); }','React Docs'),
  q('react','React Core','Cơ bản','Vòng đời render cơ bản của React component diễn ra như thế nào?',[
    'State/props đổi → React gọi component để tính UI mới → diff/reconciliation → commit thay đổi ra DOM → chạy effects sau commit',
    'React sửa DOM trước rồi mới tính UI',
    'useEffect chạy trước render đầu tiên',
    'Component chỉ render đúng một lần'
  ],0,'Cần phân biệt render phase là tính toán UI mới, commit phase là apply thay đổi thật ra DOM. useEffect chạy sau commit.','','React Docs'),
  q('react','React Core','Cơ bản','Vì sao không nên mutate state trực tiếp?',[
    'React dựa vào reference để nhận biết thay đổi; mutate trực tiếp dễ làm UI không update hoặc update sai',
    'TypeScript không cho dùng object',
    'State chỉ dùng cho string',
    'Mutate sẽ tự động gọi API'
  ],0,'Nên tạo object/array mới khi update state. Với nested object cần copy từng cấp bị thay đổi.','setUser(prev => ({...prev, address:{...prev.address, city:"HN"}}))','React Docs'),
  q('react','React Core','Cơ bản','Key trong list dùng để làm gì? Vì sao không nên dùng index khi list thay đổi?',[
    'Key giúp React nhận diện item; index dễ làm reuse nhầm item khi insert/delete/sort',
    'Key chỉ để CSS đẹp hơn',
    'Index luôn là key tốt nhất',
    'Key giúp gọi API nhanh hơn'
  ],0,'Key là identity của item trong reconciliation. Khi dùng index, xóa item đầu có thể làm input/local state nhảy sang dòng khác.','items.map(item => <Row key={item.id} item={item} />)','React Docs'),
  q('react','React Core','Cơ bản','Controlled component là gì?',[
    'Input có value được quản lý bởi React state và update qua onChange',
    'Input không có value',
    'Component chỉ render một lần',
    'Component bắt buộc dùng React.memo'
  ],0,'Controlled input phù hợp khi cần validate realtime, sync UI với state hoặc xử lý submit rõ ràng.','<input value={keyword} onChange={e=>setKeyword(e.target.value)} />','React Docs'),
  q('react','React Hooks','Cơ bản','useEffect dùng để làm gì? Khi nào không nên dùng useEffect?',[
    'Dùng để đồng bộ với hệ thống bên ngoài như API, timer, event listener; không nên dùng cho dữ liệu tính được ngay từ props/state',
    'Dùng để tính mọi biến trong render',
    'Dùng thay mọi event handler',
    'Dùng để tắt re-render'
  ],0,'React Docs nhấn mạnh: nếu dữ liệu có thể tính từ props/state hiện tại thì tính trực tiếp, không cần effect + state phụ.','const fullName = firstName + " " + lastName','React Docs'),
  q('react','React Hooks','Cơ bản','useEffect dependency array hoạt động như thế nào?',[
    'Không truyền dependency: chạy sau mọi render; []: sau mount; [a,b]: chạy lại khi a/b đổi',
    '[] chạy sau mọi render',
    '[a,b] không bao giờ chạy lại',
    'Dependency array chỉ để TypeScript check'
  ],0,'Thiếu dependency có thể gây stale closure hoặc data cũ. ESLint exhaustive-deps giúp bắt lỗi này.','useEffect(()=>fetchUsers(keyword),[keyword])','React Docs'),
  q('react','React Hooks','Cơ bản','Cleanup function trong useEffect chạy khi nào?',[
    'Trước khi effect chạy lại và khi component unmount',
    'Trước render đầu tiên',
    'Chỉ khi click button',
    'Chỉ khi build production'
  ],0,'Cleanup dùng để dọn event listener, timer, WebSocket subscription hoặc abort request.','return () => window.removeEventListener("resize", onResize)','React Docs'),
  q('react','React Hooks','Cơ bản','useMemo và useCallback khác nhau như thế nào?',[
    'useMemo memo value, useCallback memo function reference',
    'useMemo memo function, useCallback memo CSS',
    'Hai cái giống 100%',
    'useCallback chỉ dùng class component'
  ],0,'Không nên bọc mọi thứ bằng useMemo/useCallback. Chỉ dùng khi có lý do: tính toán nặng, giữ reference ổn định cho memo child hoặc dependency.','','React Docs'),
  q('react','React Hooks','Cơ bản','useRef khác useState ở điểm nào?',[
    'Đổi ref.current không gây re-render, đổi state gây re-render',
    'useState không lưu được number',
    'useRef chỉ dùng API',
    'useRef luôn render lại toàn app'
  ],0,'useRef phù hợp lưu DOM node hoặc mutable value không cần hiển thị ra UI như timer id, previous value.','const inputRef = useRef(null);','React Docs'),
  q('react','React Hooks','Cơ bản','Vì sao hook không được gọi trong if/for/nested function?',[
    'React dựa vào thứ tự gọi hook giống nhau giữa các lần render',
    'JavaScript không cho dùng if',
    'Hook chỉ chạy trong CSS',
    'TypeScript cấm gọi function trong if'
  ],0,'Hook phải được gọi ở top-level component/custom hook để React map đúng state/effect với từng hook.','','Rules of Hooks'),
  q('react','React Performance','Thực tế','React.memo hoạt động dựa trên cơ chế nào? Khi nào không hiệu quả?',[
    'Shallow compare props; không hiệu quả nếu parent truyền object/function inline mới mỗi render',
    'Deep compare toàn bộ props tự động',
    'Tự động cache API response',
    'Tự động chặn mọi render'
  ],0,'React.memo chỉ nên dùng khi component render nặng hoặc re-render không cần thiết đã được đo. Props cần stable thì memo mới có ý nghĩa.','const filters = useMemo(()=>({keyword}),[keyword])','React Docs'),
  q('react','React Advanced','Cơ bản','Virtual DOM là gì?',[
    'Bản mô tả UI trong memory để React so sánh và cập nhật DOM thật cần thiết',
    'DOM thật trong browser',
    'CSS engine của React',
    'Database cache'
  ],0,'Khi state/props đổi, React tạo tree mới, so sánh với tree cũ rồi commit thay đổi cần thiết vào DOM thật.','','React Docs'),
  q('react','React Advanced','Cơ bản','Reconciliation là gì?',[
    'Quá trình React so sánh tree cũ và mới để quyết định cập nhật gì',
    'Quá trình browser tải CSS',
    'Quá trình build TypeScript',
    'Quá trình login user'
  ],0,'Key trong list giúp reconciliation nhận diện item chính xác hơn, tránh reuse nhầm component.','','React Docs'),
  q('react','React Advanced','Nâng cao','Render phase và commit phase khác nhau như thế nào?',[
    'Render phase tính UI mới; commit phase cập nhật DOM thật và chạy effects tương ứng',
    'Commit phase chạy trước render phase',
    'Render phase gọi database',
    'Hai phase giống nhau'
  ],0,'Render phase có thể bị tạm dừng/abort trong concurrent rendering. Commit phase là lúc thay đổi thật sự được apply.','','React Docs'),
  q('react','React Advanced','Cơ bản','Error Boundary bắt được loại lỗi nào?',[
    'Lỗi render/lifecycle trong component tree bên dưới',
    'Mọi lỗi async Promise tự động',
    'Mọi lỗi event handler tự động',
    'Mọi lỗi network tự động'
  ],0,'Error Boundary không tự bắt lỗi trong event handler hoặc async callback. Các lỗi đó cần try/catch hoặc xử lý promise riêng.','','React Docs'),
  q('react','React Advanced','Cơ bản','React Portal thường dùng cho trường hợp nào?',[
    'Modal, tooltip, dropdown, toast cần render ra ngoài DOM hierarchy hiện tại',
    'Tạo reducer',
    'Tạo queryKey',
    'Validate form schema'
  ],0,'Portal giúp overlay tránh bị cắt bởi overflow/z-index context của parent, thường render vào document.body.','createPortal(children, document.body)','React Docs'),
  q('react','React Advanced','Cơ bản','React.lazy và Suspense dùng để làm gì?',[
    'Code splitting component và hiển thị fallback khi component/resource chưa sẵn sàng',
    'Thay thế useState',
    'Tự động fix race condition',
    'Chạy CSS trước JS'
  ],0,'React.lazy giúp tách component nặng thành chunk riêng, giảm bundle ban đầu. Suspense hiển thị fallback trong lúc chờ.','const Chart = React.lazy(()=>import("./Chart"))','React Docs'),

  q('state','State Management','Cơ bản','Client state và server state khác nhau như thế nào?',[
    'Client state do UI/app sở hữu; server state nằm ở backend, cần fetch/cache/refetch/sync',
    'Client state chỉ là string, server state chỉ là number',
    'Server state luôn phải lưu Redux',
    'Client state không bao giờ thay đổi'
  ],0,'Modal open, theme là client state. Product list, user detail từ API là server state, phù hợp TanStack Query/RTK Query.','','React / TanStack Query Docs'),
  q('state','State Management','Cơ bản','Nguyên tắc đặt state ở đâu trong React là gì?',[
    'Đặt state gần nơi dùng nhất; chỉ lift/global khi nhiều component cần chia sẻ',
    'Đưa tất cả vào global store',
    'Đưa tất cả vào localStorage',
    'Đưa tất cả vào URL'
  ],0,'Global hóa quá sớm làm app khó reset, khó debug và dễ re-render lan rộng.','','React Docs'),
  q('state','State Management','Thực tế','URL state phù hợp cho dữ liệu nào?',[
    'Filter, sort, page, keyword cần share/bookmark/refresh không mất',
    'Password đang nhập',
    'Hover state',
    'DOM ref'
  ],0,'URL state giúp back/forward, refresh, share link hoạt động đúng. Không đưa dữ liệu nhạy cảm hoặc tạm thời vào URL.','/users?page=2&role=admin','Router Docs'),
  q('state','Redux Toolkit','Cơ bản','Redux Toolkit createSlice giúp gì?',[
    'Tạo reducer và action creators cùng lúc, giảm boilerplate Redux cũ',
    'Tự động gọi mọi API',
    'Thay thế React Router',
    'Tự động render component'
  ],0,'createSlice gom name, initialState, reducers và sinh action creators/reducer. RTK dùng Immer nên có thể viết cú pháp mutate draft trong reducer.','','Redux Toolkit Docs'),
  q('state','Redux Toolkit','Cơ bản','Trong Redux Toolkit reducer, vì sao viết state.value++ vẫn hợp lệ?',[
    'Vì RTK dùng Immer, cho phép mutate draft và tạo immutable update phía sau',
    'Vì Redux giờ mutate state thật',
    'Vì React không cần immutable nữa',
    'Vì TypeScript bỏ qua state update'
  ],0,'Chỉ được viết kiểu đó bên trong reducer RTK. Bên ngoài reducer vẫn không mutate state trực tiếp.','','Redux Toolkit Docs'),
  q('state','Zustand','Thực tế','Trong Zustand, vì sao nên dùng selector useStore(s => s.user) thay vì useStore()?',[
    'Để component chỉ subscribe phần state cần dùng, giảm re-render không liên quan',
    'Vì useStore() không hoạt động',
    'Vì selector tự gọi API',
    'Vì selector thay TypeScript'
  ],0,'Nếu lấy cả store, component có thể re-render khi bất kỳ phần nào của store đổi. Selector giúp render chính xác hơn.','','Zustand Docs'),
  q('state','State Management','Thực tế','Logout cần dọn những gì ở FE?',[
    'Xóa token/session, reset auth/permission/cart user-specific và clear query cache liên quan',
    'Chỉ navigate về login là đủ',
    'Chỉ đổi theme là đủ',
    'Không cần dọn vì app tự biết'
  ],0,'Nếu không reset state/cache, user sau có thể nhìn thấy dữ liệu user trước. Đây là bug thực tế rất hay gặp.','queryClient.clear(); authStore.reset();','Architecture'),

  q('api-router','Axios','Cơ bản','Vì sao nên tạo axiosClient riêng thay vì gọi axios trực tiếp khắp component?',[
    'Để gom baseURL, timeout, headers, token, interceptor và error handling ở một nơi',
    'Để component dài hơn',
    'Để bỏ TypeScript',
    'Để không cần xử lý lỗi'
  ],0,'API layer tách UI khỏi HTTP config, dễ test, dễ đổi endpoint và dễ xử lý refresh token tập trung.','const api = axios.create({baseURL, timeout:15000})','Axios Docs'),
  q('api-router','Axios','Thực tế','Nhiều request cùng bị 401, refresh token flow cần chú ý gì?',[
    'Dùng isRefreshing/queue để refresh một lần rồi retry các request pending, tránh loop',
    'Mỗi request tự refresh token riêng càng nhiều càng tốt',
    'Bỏ qua mọi lỗi 401',
    'Xóa node_modules'
  ],0,'Nếu 10 request cùng 401 mà refresh 10 lần, dễ race condition. Cần queue pending requests và logout nếu refresh fail.','','Axios Auth Flow'),
  q('api-router','TanStack Query','Cơ bản','TanStack Query chủ yếu quản lý loại state nào?',[
    'Server state: data từ API với cache/loading/error/refetch/mutation',
    'CSS state',
    'Git branch',
    'HTML tag'
  ],0,'TanStack Query không thay mọi state. Nó giải quyết server state; UI local/global state vẫn dùng useState, Context, Zustand, Redux tùy case.','','TanStack Query Docs'),
  q('api-router','TanStack Query','Cơ bản','TanStack Query setup cơ bản trong React như thế nào?',[
    'Tạo QueryClient, bọc app bằng QueryClientProvider, component dùng useQuery/useMutation',
    'Chỉ import useQuery là đủ, không cần Provider',
    'Đưa queryClient vào localStorage',
    'TanStack Query thay ReactDOM.createRoot'
  ],0,'QueryClient giữ cache/config. QueryClientProvider đưa client vào React tree để hooks sử dụng.','<QueryClientProvider client={queryClient}><App /></QueryClientProvider>','TanStack Query Docs'),
  q('api-router','TanStack Query','Cơ bản','queryKey nên chứa gì?',[
    'Đủ input ảnh hưởng data như id, page, keyword, filter',
    'Chỉ một string cố định cho mọi query',
    'Math.random để luôn mới',
    'Tên component bất kỳ'
  ],0,'queryKey là identity của cache. Thiếu page/filter sẽ dùng nhầm cache giữa các màn. Key không ổn định làm cache mất tác dụng.','["users", {page, keyword, role}]','TanStack Query Docs'),
  q('api-router','TanStack Query','Cơ bản','useQuery và useMutation khác nhau như thế nào?',[
    'useQuery dùng đọc/cache data; useMutation dùng create/update/delete hoặc side effect thay đổi server state',
    'useMutation dùng cho GET list',
    'useQuery dùng submit form',
    'Hai cái giống nhau'
  ],0,'Sau mutation thành công thường invalidateQueries hoặc setQueryData để đồng bộ cache liên quan.','','TanStack Query Docs'),
  q('api-router','TanStack Query','Thực tế','enabled trong useQuery dùng khi nào?',[
    'Khi query chỉ nên chạy khi điều kiện đủ, ví dụ có id/token',
    'Khi muốn query chạy vô hạn',
    'Khi muốn tắt TypeScript',
    'Khi muốn mutation tự chạy'
  ],0,'Dependent query không nên gọi API với undefined. enabled giúp tránh request sai.','useQuery({queryKey:["user",id], queryFn:()=>getUser(id), enabled:!!id})','TanStack Query Docs'),
  q('api-router','TanStack Query','Thực tế','staleTime và gcTime khác nhau như thế nào?',[
    'staleTime là thời gian data còn fresh; gcTime là thời gian cache inactive được giữ trước khi dọn',
    'staleTime là thời gian xóa cache; gcTime là thời gian gọi API',
    'Hai cái giống nhau',
    'Cả hai chỉ dùng cho mutation'
  ],0,'Data ít đổi có thể set staleTime dài để giảm refetch. gcTime không quyết định fresh/stale, chỉ quyết định cache inactive tồn tại bao lâu.','','TanStack Query Docs'),
  q('api-router','TanStack Query','Thực tế','Sau createUser thành công, danh sách users cần cập nhật. Làm thế nào?',[
    'invalidateQueries({queryKey:["users"]}) hoặc setQueryData có chủ đích',
    'Reload browser luôn là cách chuẩn',
    'Đổi key React component là đủ',
    'Alert thành công là cache tự đổi'
  ],0,'Mutation thay đổi server state, cache hiện tại có thể stale. Cần invalidate/refetch hoặc update cache trực tiếp.','queryClient.invalidateQueries({queryKey:["users"]})','TanStack Query Docs'),
  q('api-router','TanStack Router','Cơ bản','TanStack Router mạnh ở điểm nào so với router cơ bản?',[
    'Type-safe params/search/navigate, loader, beforeLoad, nested routes',
    'Chỉ để viết CSS',
    'Chỉ thay thế Axios',
    'Chỉ dùng backend'
  ],0,'Điểm mạnh lớn là TypeScript biết route params/search params, giúp giảm bug navigate sai hoặc parse URL sai.','','TanStack Router Docs'),
  q('api-router','TanStack Router','Thực tế','beforeLoad và loader khác nhau như thế nào?',[
    'beforeLoad thường dùng auth/redirect/context trước route; loader dùng load data cho route',
    'loader chỉ dùng đổi CSS',
    'beforeLoad chạy sau khi component render xong',
    'Hai cái giống nhau hoàn toàn'
  ],0,'beforeLoad phù hợp protected route. loader phù hợp data route-level và có thể tích hợp TanStack Query prefetch.','','TanStack Router Docs'),
  q('api-router','React Router','Cơ bản','BrowserRouter và HashRouter khác nhau như thế nào?',[
    'BrowserRouter dùng History API URL đẹp nhưng cần server fallback; HashRouter dùng phần # và dễ host static hơn',
    'HashRouter chỉ dùng backend',
    'BrowserRouter không cần fallback route sâu',
    'Hai cái giống nhau'
  ],0,'Nếu deploy SPA với BrowserRouter, refresh /dashboard/users cần server trả index.html, nếu không sẽ 404.','','React Router Docs'),

  q('form-test','React Hook Form','Cơ bản','React Hook Form phù hợp nhất khi nào?',[
    'Form nhiều field, cần validation, muốn giảm re-render',
    'Render static text',
    'Quản lý route params',
    'Tạo Git branch'
  ],0,'RHF thiên về uncontrolled input và subscription theo field, nên form lớn thường ít re-render hơn controlled state từng field.','','React Hook Form Docs'),
  q('form-test','React Hook Form','Cơ bản','Controller trong React Hook Form dùng khi nào?',[
    'Khi tích hợp controlled component từ UI library như MUI Select, DatePicker',
    'Bắt buộc cho mọi input HTML thường',
    'Khi muốn tắt validation',
    'Khi muốn tạo route guard'
  ],0,'Native input thường dùng register là đủ. Controller bridge value/onChange cho component controlled bên ngoài.','','React Hook Form Docs'),
  q('form-test','Zod','Cơ bản','Zod dùng để làm gì trong FE?',[
    'Validate runtime schema và infer TypeScript type',
    'Thay thế hoàn toàn backend validation',
    'Tự động render UI',
    'Tự động cache query'
  ],0,'TypeScript không validate dữ liệu runtime. Zod giúp kiểm tra form/API/localStorage data thật lúc chạy và suy ra type bằng z.infer.','const UserSchema = z.object({id:z.string()})','Zod Docs'),
  q('form-test','Testing','Cơ bản','React Testing Library khuyến khích test theo hướng nào?',[
    'Test behavior giống cách user tương tác, không phụ thuộc implementation detail',
    'Test private state bên trong component càng nhiều càng tốt',
    'Test className random là chính',
    'Chỉ snapshot toàn bộ app'
  ],0,'Query nên ưu tiên role/label/text. Test càng giống user thì càng bền khi refactor implementation.','screen.getByRole("button", {name:/submit/i})','Testing Library Docs'),
  q('form-test','Testing','Cơ bản','getBy, queryBy và findBy khác nhau như thế nào?',[
    'getBy sync và throw nếu không thấy; queryBy trả null; findBy async chờ element xuất hiện',
    'findBy sync, getBy async',
    'queryBy chỉ dùng CSS',
    'Ba cái giống nhau'
  ],0,'getBy dùng khi element phải có ngay. queryBy dùng assert không tồn tại. findBy dùng UI xuất hiện sau async API/loading.','','Testing Library Docs'),

  q('rendering','Rendering','Cơ bản','SPA là gì?',[
    'Single Page Application: app load một HTML chính rồi điều hướng/render chủ yếu bằng JavaScript trên client',
    'Server Page Application: mọi click reload HTML từ server',
    'Static Package Analyzer',
    'Một loại database cache'
  ],0,'SPA thường có index.html, JS bundle tải về browser, React render UI và router xử lý navigation phía client.','','React / Vite'),
  q('rendering','Rendering','Cơ bản','CSR là gì?',[
    'Client-Side Rendering: browser tải JS rồi render UI/data ở client',
    'Cache Server Rendering',
    'Client Static Revalidation',
    'Component Style Rendering'
  ],0,'CSR hợp dashboard/admin sau login, SEO không quá quan trọng. Cần chú ý bundle size, loading state và data fetching.','','React / Vite'),
  q('rendering','Rendering','Cơ bản','SPA và CSR có giống nhau hoàn toàn không?',[
    'Không. SPA là mô hình điều hướng/app shell; CSR là nơi render UI ở client. Nhiều SPA dùng CSR nhưng không phải một khái niệm',
    'Có, luôn giống 100%',
    'SPA là backend, CSR là Git',
    'SPA luôn là SSR'
  ],0,'Cách trả lời phỏng vấn tốt là phân biệt: SPA nói về navigation; CSR nói về rendering ở browser.','Vite React thường là SPA + CSR','Rendering Concepts'),
  q('rendering','Rendering','Cơ bản','SSR là gì và flow chạy như thế nào?',[
    'Server render HTML theo request, gửi HTML cho browser, client tải JS rồi hydrate để tương tác',
    'Build xong HTML không bao giờ đổi',
    'Browser tự render HTML trước khi server trả response',
    'SSR không cần JS nếu có button click'
  ],0,'SSR tốt cho SEO/initial HTML theo request nhưng tốn server work và cần xử lý hydration/cache.','Request → server render → HTML → hydrate','Next.js Docs'),
  q('rendering','Rendering','Cơ bản','SSG là gì?',[
    'Static Site Generation: render HTML/static assets ở build time rồi serve từ CDN/static hosting',
    'Server State Generation',
    'Single Server Gateway',
    'Style Sheet Generator'
  ],0,'SSG hợp landing, blog, docs, page public ít đổi. Nếu data đổi sau build thì cần rebuild hoặc revalidate.','','Next.js Docs'),
  q('rendering','Rendering','Nâng cao','ISR là gì và khác SSG thuần ở đâu?',[
    'ISR vẫn serve static page nhưng có cơ chế revalidate để cập nhật page sau build',
    'ISR là mọi request đều render động không cache',
    'ISR chỉ chạy trong useEffect',
    'ISR chỉ dùng cho CSS image'
  ],0,'ISR cân bằng tốc độ static và độ tươi dữ liệu. Hợp product/blog nhiều trang, content đổi định kỳ.','','Next.js Docs'),
  q('rendering','Rendering','Thực tế','Khi nào chọn CSR, SSR, SSG, ISR?',[
    'Dựa vào SEO, data có theo user không, độ tươi dữ liệu, cache, traffic, infra và bảo mật',
    'Luôn chọn SSR vì nghe cao cấp',
    'Luôn chọn CSR vì dễ nhất',
    'Chọn theo màu UI'
  ],0,'Landing public ít đổi: SSG. Product nhiều trang đổi định kỳ: ISR. Dashboard private: CSR hoặc SSR auth. Checkout/payment: dynamic, không cache chung.','','Rendering Strategy'),
  q('rendering','Hydration','Nâng cao','Hydration là gì?',[
    'React attach event/state vào HTML server-rendered để UI tương tác được',
    'Quá trình tải ảnh lazy',
    'Quá trình minify CSS',
    'Quá trình tạo Git branch'
  ],0,'Hydration mismatch xảy ra khi HTML server và render client khác nhau, ví dụ dùng Date.now, Math.random, localStorage trong render SSR.','','React DOM Docs'),
  q('rendering','Build','Cơ bản','npm run dev, build, preview/start khác nhau như thế nào?',[
    'dev chạy môi trường phát triển/HMR; build tạo production output; preview/start chạy thử output production tùy framework',
    'dev và build giống hệt nhau',
    'preview chỉ type check TypeScript',
    'build chỉ đổi màu button'
  ],0,'Dev server dễ dãi hơn production. Build có bundling/minify/tree-shaking và có thể lộ lỗi env, import path, asset base, SSR/hydration.','Vite: dev/build/preview. Next: dev/build/start.','Vite / Next Docs'),
  q('rendering','Build','Cơ bản','Vite React CSR chạy từ dev đến deploy như thế nào?',[
    'npm run dev mở dev server; npm run build tạo dist static; deploy dist và cấu hình fallback về index.html cho SPA route',
    'Vite build tạo Node SSR server mặc định',
    'Vite tự tạo database',
    'CSR không cần JavaScript bundle'
  ],0,'Nếu dùng BrowserRouter, server/static hosting cần fallback mọi route về index.html, nếu không refresh /users/1 sẽ 404.','','Vite Docs'),
  q('rendering','Build','Thực tế','Next.js build khác Vite SPA build ở điểm nào?',[
    'Next build phân tích routes, prerender/static/dynamic/server code/cache metadata tùy rendering strategy; Vite SPA build chủ yếu tạo dist static',
    'Next chỉ tạo một index.html giống Vite mọi trường hợp',
    'Next không có SSR runtime',
    'Vite bắt buộc dùng Next'
  ],0,'Next là framework rendering/routing/data conventions. Vite là build tool rất hợp SPA/CSR.','','Next / Vite Docs'),

  q('git-build-security','Git','Cơ bản','git fetch và git pull khác nhau như thế nào?',[
    'fetch tải remote changes nhưng chưa merge; pull = fetch + merge/rebase vào branch hiện tại',
    'pull chỉ xem log',
    'fetch xóa branch local',
    'Hai cái giống nhau'
  ],0,'fetch an toàn khi muốn xem remote trước. pull cập nhật branch hiện tại luôn nên có thể tạo merge/conflict ngay.','','Git SCM'),
  q('git-build-security','Git','Cơ bản','merge và rebase khác nhau như thế nào?',[
    'merge thường tạo merge commit; rebase replay commit để history linear hơn',
    'rebase chỉ dùng xóa file',
    'merge không bao giờ conflict',
    'Hai cái không liên quan branch'
  ],0,'Rebase nên dùng cẩn thận trên branch cá nhân hoặc khi team thống nhất, vì rebase rewrite commit history.','','Git SCM'),
  q('git-build-security','Git','Cơ bản','reset và revert khác nhau như thế nào?',[
    'reset có thể rewrite history; revert tạo commit mới đảo ngược thay đổi',
    'revert xóa remote repo',
    'reset chỉ dùng CSS',
    'Hai cái luôn an toàn trên branch shared'
  ],0,'Commit đã push lên main/develop thường nên revert để không phá history của team.','','Git SCM'),
  q('git-build-security','Git','Cơ bản','git stash dùng khi nào?',[
    'Lưu tạm code đang làm dở để chuyển branch/pull code',
    'Deploy production',
    'Chạy unit test',
    'Format TypeScript type'
  ],0,'stash giúp cất changes chưa commit. Sau đó có thể stash pop/apply để lấy lại.','','Git SCM'),
  q('git-build-security','Git','Thực tế','Workflow Git khi làm feature mới trong team nên như thế nào?',[
    'checkout main → fetch/pull → tạo feature branch → commit nhỏ → sync main → push → PR',
    'Code thẳng trên main rồi force push',
    'Copy project ra folder mới',
    'Chỉ stash, không cần commit'
  ],0,'Feature branch giúp isolate work, PR giúp review. Trước merge nên sync main, resolve conflict và chạy test/build.','git checkout -b feature/user-filter origin/main','Git SCM'),
  q('git-build-security','Git','Thực tế','Khi rebase bị conflict, xử lý đúng flow là gì?',[
    'Sửa conflict đúng logic → git add → git rebase --continue → chạy test/build → push --force-with-lease nếu cần',
    'git reset --hard ngay cho nhanh',
    'Luôn accept current toàn bộ',
    'Force push main để bỏ conflict'
  ],0,'Conflict là xung đột logic, không chỉ text. Không nên bấm accept bừa vì có thể làm mất code của người khác.','','Git SCM'),
  q('git-build-security','Build/Vite','Cơ bản','Trong Vite, env expose ra client cần prefix gì?',[
    'VITE_', 'REACT_', 'SECRET_', 'PRIVATE_'
  ],0,'Vite chỉ expose env có prefix VITE_ ra client. Tuyệt đối không đưa secret thật lên client bundle.','import.meta.env.VITE_API_URL','Vite Docs'),
  q('git-build-security','Security','Cơ bản','XSS là gì?',[
    'Tấn công chèn/chạy script độc hại trên trang người dùng',
    'Lỗi Git rebase',
    'Một loại CSS selector',
    'Một React hook mới'
  ],0,'Phòng tránh bằng escaping, sanitize HTML, CSP, hạn chế dangerouslySetInnerHTML và validate input/output.','','OWASP'),
  q('git-build-security','Security','Thực tế','FE ẩn nút Delete nếu user không phải admin, như vậy đã đủ bảo mật chưa?',[
    'Chưa. FE chỉ ẩn UI, backend vẫn phải check quyền ở API',
    'Đủ vì user không thể sửa JS',
    'Đủ nếu dùng TypeScript',
    'Đủ nếu dùng React.memo'
  ],0,'FE code nằm ở client nên không đáng tin. User vẫn có thể gọi API trực tiếp bằng DevTools/Postman.','','OWASP'),

  q('project','Project Structure','Thực tế','Feature-based structure nghĩa là gì?',[
    'Tổ chức code theo domain/feature như auth, users, orders; mỗi feature có components/hooks/services/types riêng',
    'Tất cả file bỏ vào một thư mục components',
    'Chỉ có một file App.tsx',
    'Không cần services/hooks/types'
  ],0,'Feature-based giúp module tự chứa logic liên quan, dễ maintain ở project vừa/lớn.','','Architecture'),
  q('project','Project Structure','Thực tế','Vì sao không nên gọi API rải rác trực tiếp trong component?',[
    'Component bị lẫn UI và data/business logic, khó test và maintain',
    'React cấm gọi API',
    'Axios không chạy trong component',
    'TypeScript không cho import service'
  ],0,'Nên tách API service, query hook và UI component để rõ trách nhiệm.','','Architecture'),
  q('project','Clean Code','Thực tế','Component 700-900 dòng nên refactor như thế nào?',[
    'Tách UI component, custom hooks, services, types, constants theo trách nhiệm',
    'Giữ nguyên vì file càng dài càng tốt',
    'Đổi toàn bộ type thành any',
    'Copy thêm logic vào nhiều nơi'
  ],0,'Refactor tốt là tách theo responsibility: table, filter, modal form, data hook, API service, types/constants.','','Clean Code'),
  q('project','Interview','Thực tế','Khi được hỏi feature khó nhất từng làm, nên trả lời theo cấu trúc nào?',[
    'Bối cảnh → vấn đề → cách xử lý → trade-off → kết quả',
    'Chỉ kể tên thư viện',
    'Nói em làm nhiều lắm',
    'Nói em không nhớ'
  ],0,'Phỏng vấn 2.5+ năm đánh giá problem solving. Câu trả lời có context, decision, trade-off và result thuyết phục hơn liệt kê tech stack.','','Interview'),
  q('project','Debug','Thực tế','Production trắng màn sau deploy React app, debug theo thứ tự nào?',[
    'Mở Console/Network, check JS error, chunk 404, env/base path, route fallback, API config, case-sensitive import',
    'Đổi màu background trước',
    'Xóa node_modules trên server là chắc chắn xong',
    'Đổ lỗi backend ngay'
  ],0,'Trắng màn thường do runtime error, asset/chunk 404, env sai, base path sai hoặc route fallback thiếu. Dev cần debug bằng log thực tế trước khi đoán.','','Debugging')
].map((item, index) => ({ ...item, id: index + 1 }));

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
      const searchOk = !keyword || `${q.topic} ${q.question} ${q.explanation} ${q.source} ${q.example}`.toLowerCase().includes(keyword);
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

  return <div className="app-dark"><header className="topbar"><div className="brand"><span>🧙‍♂️</span><b>Luyện Phỏng Vấn FE</b></div><div className="top-search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.currentTarget.value)} placeholder="Tìm kiếm..."/></div><button className="ghost">Bảng giá</button><button className="pill">EN</button><button className="avatar">⚙</button></header><div className="layout"><aside className="sidebar"><h1>Tất Cả Câu Hỏi</h1><button onClick={()=>{setArea('all');setTopic('all')}} className={area==='all'?'cat active':'cat'}><span>✨ Tất cả</span><em>{QUESTIONS.length}</em></button><div className="side-filter"><input value={search} onChange={e=>setSearch(e.currentTarget.value)} placeholder="Lọc danh mục..."/></div><div className="side-label"><span>FRONTEND</span><i/></div>{AREAS.filter(([id])=>id!=='all').map(([id,label,icon])=><button key={id} onClick={()=>{setArea(id);setTopic('all')}} className={area===id?'cat active':'cat'}><span><b>{icon}</b>{label}</span><em>{areaCounts[id]}</em></button>)}</aside><main className="content"><div className="mobile-search"><input value={search} onChange={e=>setSearch(e.currentTarget.value)} placeholder="Tìm câu hỏi..."/></div><div className="content-toolbar"><div className="count">Hiển thị <b>{filtered.length}</b>/<b>{QUESTIONS.length}</b> câu · Đã làm <b>{answeredCount}</b></div><div className="controls"><select value={level} onChange={e=>setLevel(e.currentTarget.value)}><option value="all">Cấp độ: Tất cả</option><option value="Cơ bản">Cơ bản</option><option value="Thực tế">Thực tế</option><option value="Nâng cao">Nâng cao</option></select><select value={topic} onChange={e=>setTopic(e.currentTarget.value)}>{topics.map(t=><option key={t} value={t}>{t==='all'?'Chủ đề: Tất cả':t}</option>)}</select><select value={mode} onChange={e=>setMode(e.currentTarget.value)}><option value="all">Trạng thái: Tất cả</option><option value="unanswered">Chưa làm</option><option value="wrong">Câu sai</option><option value="correct">Câu đúng</option></select>{!submitted?<button className="primary" onClick={()=>setSubmitted(true)}>Nộp bài</button>:<button className="primary cyan" onClick={resetQuiz}>Làm lại</button>}</div></div><section className="stats"><div><span>Tổng câu hỏi</span><strong>{QUESTIONS.length}</strong></div><div><span>Đã trả lời</span><strong>{answeredCount}</strong></div><div><span>Kết quả</span><strong>{submitted?`${result.percent}%`:'--'}</strong><small>{submitted?getScoreLabel(result.percent):'Làm xong bấm nộp bài'}</small></div></section><section className="cards">{filtered.map(q=>{const selected=answers[q.id];const done=selected!==undefined;const ok=selected===q.answer;return <article className="qa-card" key={q.id}><div className="qa-head"><span className="num">#{q.id}</span><div className="qa-title"><div className="badges"><b className={levelClass(q.level)}>{q.level}</b><b>{q.topic}</b><b>Interview-ready</b></div><h2>{q.question}</h2></div><div className="icons">🔖 🎓 ↗</div></div><div className="qa-body"><div className="options-grid">{q.options.map((option,index)=>{let cls='option';if(done&&index===q.answer)cls+=' right';if(done&&index===selected&&selected!==q.answer)cls+=' wrong';if(!done&&selected===index)cls+=' chosen';return <button className={cls} key={`${q.id}-${index}`} onClick={()=>choose(q.id,index)}><span>{alphabet[index]}</span><p>{option}</p></button>})}</div>{done&&<div className={ok?'explain good':'explain bad'}><p><b>Bạn chọn:</b> {q.options[selected]}</p><p><b>Đáp án đúng:</b> {q.options[q.answer]}</p><p><b>Giải thích:</b> {q.explanation}</p>{q.example&&<code>Ví dụ: {q.example}</code>}<small>Nguồn định hướng: {q.source}</small></div>}</div></article>})}</section></main></div></div>;
}
