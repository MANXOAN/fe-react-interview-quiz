import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fe-interview-quiz-expanded-v1';

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

const WRONGS = {
  'html-css': ['Chỉ cần nhìn giống design, không cần semantic/accessibility', 'Dùng inline style và !important cho nhanh', 'Không liên quan đến phỏng vấn FE thực tế'],
  'js-ts': ['Ép any hoặc bỏ qua runtime behavior là đủ', 'Chỉ là cú pháp, không ảnh hưởng bug thực tế', 'Dùng cùng một cách cho mọi case, không cần phân biệt'],
  react: ['Đưa mọi logic vào useEffect/global state là tốt nhất', 'Mutate trực tiếp state/props để giảm code', 'Bọc mọi thứ bằng memo là tối ưu chuẩn'],
  state: ['Đưa toàn bộ state vào một global store duy nhất', 'Persist mọi thứ vào localStorage', 'Không cần phân biệt local/client/server/URL state'],
  'api-router': ['Gọi API trực tiếp rải rác trong JSX component', 'Reload page sau mọi thay đổi là chuẩn SPA', 'FE route guard là bảo mật cuối cùng'],
  'form-test': ['Dùng any và chỉ test className là đủ', 'Bỏ qua lỗi server vì client đã validate', 'Chỉ snapshot toàn app, không cần test interaction'],
  rendering: ['Luôn chọn SSR cho mọi màn vì nghe cao cấp', 'Dùng SSG cho dữ liệu private theo từng user', 'Không cần quan tâm cache, hydration hay thời điểm fetch data'],
  'git-build-security': ['Force push branch chung cho nhanh', 'Đưa secret vào client env nếu cần dùng', 'Không cần chạy build trước deploy'],
  project: ['Gom toàn bộ logic vào một component lớn', 'Chỉ kể tên thư viện, không nói vấn đề và kết quả', 'Không cần thống nhất API contract với backend'],
};

const CONCEPTS = [
  ['html-css','HTML','Cơ bản','DOCTYPE','DOCTYPE khai báo chuẩn HTML để browser render ở standards mode','đặt <!doctype html> ở đầu file để tránh quirks mode và lỗi layout khác browser','bỏ DOCTYPE khiến browser có thể render theo quirks mode','<!doctype html>','MDN HTML'],
  ['html-css','HTML','Cơ bản','Semantic HTML','Dùng thẻ đúng ý nghĩa nội dung như header, nav, main, article, section, footer','giúp SEO, accessibility, test by role và code dễ đọc hơn','dùng toàn div/span làm screen reader/crawler khó hiểu cấu trúc','<main><article><h1>Title</h1></article></main>','MDN HTML'],
  ['html-css','HTML','Cơ bản','Heading hierarchy','h1-h6 mô tả outline nội dung theo cấp bậc','dùng h1 cho tiêu đề chính, h2/h3 cho section, không chọn heading chỉ vì font size','nhảy cấp heading lung tung hoặc dùng div thay heading','<h1>Dashboard</h1><section><h2>Users</h2></section>','MDN HTML'],
  ['html-css','HTML','Cơ bản','Form label','label liên kết input bằng htmlFor/id giúp accessibility và focus đúng','form login/register/search nên có label hoặc accessible name rõ ràng','chỉ dùng placeholder thay label khiến UX/accessibility kém','<label htmlFor="email">Email</label><input id="email" />','MDN Forms'],
  ['html-css','HTML','Cơ bản','Button type trong form','button trong form mặc định là submit nếu không khai báo type','nút Hủy/Đóng dùng type button, nút gửi form dùng type submit','quên type làm nút phụ submit form ngoài ý muốn','<button type="button">Hủy</button>','MDN Button'],
  ['html-css','HTML','Cơ bản','alt image','alt mô tả ý nghĩa ảnh cho accessibility và fallback','ảnh nội dung cần alt mô tả, ảnh trang trí có thể alt rỗng','bỏ alt hoặc nhét keyword SEO không liên quan','<img src="chart.png" alt="Biểu đồ doanh thu tháng 5" />','MDN Images'],
  ['html-css','HTML','Thực tế','ARIA','ARIA bổ sung semantic khi HTML native chưa đủ','ưu tiên HTML native trước, chỉ dùng aria khi cần accessible name/state/role','lạm dụng role/aria sai làm accessibility tệ hơn','<button aria-label="Xóa người dùng">🗑</button>','MDN Accessibility'],
  ['html-css','HTML','Thực tế','script async vs defer','async chạy khi tải xong không giữ thứ tự, defer đợi parse HTML xong và giữ thứ tự','app script phụ thuộc DOM/thứ tự thường dùng defer, analytics độc lập có thể async','dùng async cho script phụ thuộc thứ tự gây race bug','<script defer src="app.js"></script>','MDN Script'],
  ['html-css','CSS','Cơ bản','CSS selector','Selector chọn element để áp style: type, class, id, attribute, pseudo-class, pseudo-element, combinator','viết style có scope rõ và tránh selector quá rộng/quá cụ thể','selector quá cụ thể khiến override khó, selector quá rộng làm ảnh hưởng ngoài ý muốn','.card > h2:first-child, input[type="email"], button:hover','MDN CSS Selectors'],
  ['html-css','CSS','Cơ bản','CSS specificity','Specificity là trọng số selector quyết định rule nào thắng khi nhiều rule cùng áp','debug style bị override bằng DevTools, hiểu id/class/type/inline/important/layer/order','dùng !important bừa thay vì hiểu cascade','ID > class/attribute/pseudo-class > type/pseudo-element','MDN CSS Specificity'],
  ['html-css','CSS','Cơ bản','Cascade','Cascade quyết định declaration cuối cùng dựa trên origin, importance, layer, specificity, scope và order','debug CSS conflict, theme override, component style override','nghĩ dòng viết sau luôn thắng trong mọi trường hợp','Cascade + specificity + order','MDN CSS Cascade'],
  ['html-css','CSS','Cơ bản','Inheritance','Một số property như color/font inherit từ cha, còn margin/padding không inherit','tận dụng inheritance cho typography/theme, reset đúng nơi','nghĩ mọi property đều tự truyền xuống con','body{font-family:Inter;color:#111}','MDN CSS Inheritance'],
  ['html-css','CSS','Cơ bản','Box model','Element gồm content, padding, border, margin','tính layout, spacing, click area và debug overflow','không phân biệt padding và margin dẫn tới layout lệch','content + padding + border + margin','MDN Box Model'],
  ['html-css','CSS','Cơ bản','box-sizing border-box','border-box làm width/height bao gồm content + padding + border','dùng global reset để sizing dễ dự đoán','content-box mặc định làm element vượt width khi thêm padding','*{box-sizing:border-box}','MDN Box Model'],
  ['html-css','CSS','Cơ bản','display block inline inline-block','block chiếm dòng riêng, inline theo dòng, inline-block theo dòng nhưng set được width/height','căn chỉnh text/button/icon, layout inline element','set width/height cho inline rồi thắc mắc không ăn','span inline, div block, button inline-block','MDN Display'],
  ['html-css','CSS','Cơ bản','Flexbox','Flexbox là layout một chiều theo main axis/cross axis','navbar, button group, center item, row/column layout nhỏ','dùng flex cho layout page hai chiều phức tạp khi Grid phù hợp hơn','display:flex; justify-content:center; align-items:center','MDN Flexbox'],
  ['html-css','CSS','Cơ bản','CSS Grid','Grid là layout hai chiều theo hàng và cột','dashboard, gallery, card grid, layout page','dùng margin/absolute hard-code thay grid khiến responsive vỡ','grid-template-columns:280px 1fr','MDN Grid'],
  ['html-css','CSS','Cơ bản','position','static mặc định; relative lệch từ vị trí cũ; absolute theo containing block; fixed theo viewport; sticky theo scroll threshold','dropdown, badge, sticky header, tooltip, overlay','nghĩ absolute luôn theo body hoặc sticky không cần top','position:sticky; top:64px','MDN Position'],
  ['html-css','CSS','Thực tế','stacking context','Stacking context là ngữ cảnh xếp lớp riêng ảnh hưởng z-index','debug modal/dropdown z-index cao vẫn bị che','tăng z-index vô hạn nhưng không xem parent transform/opacity/z-index','transform/opacity/position z-index có thể tạo stacking context','MDN z-index'],
  ['html-css','CSS','Thực tế','overflow và scroll container','overflow kiểm soát nội dung vượt box; scroll container cần height rõ','dashboard content scroll riêng, table scroll, modal body scroll','set overflow hidden toàn app làm mất content','height:100vh; .content{overflow:auto; min-height:0}','MDN Overflow'],
  ['html-css','CSS','Thực tế','responsive media query','Media query áp style theo viewport/container/media feature','mobile-first responsive layout cho phone/tablet/desktop','hard-code pixel cho mọi màn hình','@media (min-width:768px){...}','MDN Responsive Design'],
  ['html-css','CSS','Thực tế','relative units rem em vw vh clamp','Đơn vị linh hoạt giúp UI scale tốt hơn px cứng','typography/spacing responsive và accessibility-friendly','dùng px cứng mọi nơi gây khó scale','font-size:clamp(1rem,2vw,1.5rem)','MDN CSS Values'],
  ['html-css','CSS','Thực tế','pseudo-class và pseudo-element','Pseudo-class chọn trạng thái, pseudo-element style phần ảo/phần con','hover/focus/disabled, before/after decoration, first-line','nhầm :hover với ::before hoặc xóa focus outline không thay thế','button:focus-visible; .badge::before','MDN Selectors'],
  ['html-css','CSS','Thực tế','CSS custom properties','CSS variables lưu token và thay đổi theo cascade/scope/runtime','theme dark/light, design tokens, component variables','nhầm với Sass variable compile-time','--primary:#2563eb; color:var(--primary)','MDN Custom Properties'],
  ['html-css','CSS','Thực tế','BEM / naming convention','Convention đặt class giúp CSS dễ maintain và tránh conflict','project không dùng CSS modules/Tailwind hoặc cần CSS thuần rõ ràng','đặt class random/too generic như .title gây đè style','user-card__title--active','CSS Architecture'],

  ['js-ts','JavaScript','Cơ bản','primitive vs reference','Primitive copy theo value, object/array/function copy theo reference','tránh bug mutate object/array và hiểu comparison','so sánh object bằng === rồi nghĩ compare deep','{} === {} // false','MDN JS Data Types'],
  ['js-ts','JavaScript','Cơ bản','truthy falsy','Falsy gồm false, 0, -0, 0n, "", null, undefined, NaN','check điều kiện UI như count/page/discount đúng','if(count) bỏ qua count=0 dù hợp lệ','count != null','MDN Boolean'],
  ['js-ts','JavaScript','Cơ bản','== vs ===','== ép kiểu, === so sánh cả type và value','tránh coercion bất ngờ trong logic permission/form','dùng == trong logic quan trọng gây bug','0 == false; 0 !== false','MDN Equality'],
  ['js-ts','JavaScript ES6','Cơ bản','let const var','let/const block-scoped và TDZ, var function-scoped','tránh bug scope trong loop/callback và khai báo biến rõ intention','nghĩ const làm object immutable sâu','const arr=[]; arr.push(1) hợp lệ','MDN Declarations'],
  ['js-ts','JavaScript ES6','Cơ bản','template literal','Backtick string hỗ trợ ${} và multi-line','format string, message, dynamic class name','nghĩ template literal tự sanitize HTML','`Hello ${name}`','MDN Template Literals'],
  ['js-ts','JavaScript ES6','Cơ bản','destructuring','Lấy field từ object/array ngắn gọn, hỗ trợ default/alias/rest','đọc props, API response, hook return values','default chỉ chạy với undefined, không chạy với null','const {page=1,name:label}=query','MDN Destructuring'],
  ['js-ts','JavaScript ES6','Cơ bản','rest parameter','Rest gom tham số còn lại thành array thật','viết helper nhận nhiều arguments linh hoạt','nhầm rest với arguments object hoặc spread','function sum(...nums){return nums.reduce(...)}','MDN Rest Parameters'],
  ['js-ts','JavaScript ES6','Cơ bản','spread syntax','Spread trải array/object/iterable ra shallow','copy state cấp đầu, merge props, truyền args','nghĩ spread là deep clone','const next={...user, name:"A"}','MDN Spread Syntax'],
  ['js-ts','JavaScript ES6','Cơ bản','default parameter','Parameter default áp dụng khi argument là undefined','đặt fallback đơn giản cho function args','nghĩ null cũng trigger default','function list(page=1){}; list(null) // page null','MDN Default Parameters'],
  ['js-ts','JavaScript ES6','Cơ bản','arrow function','Arrow không có this/arguments riêng, lexical this','callback map/filter/event inline khi không cần this dynamic','dùng arrow làm object method cần this dynamic','items.map(item => item.id)','MDN Arrow Functions'],
  ['js-ts','JavaScript','Cơ bản','function closure','Closure là function nhớ scope nơi nó được tạo','callback, debounce, factory, React stale closure','thiếu dependency làm callback giữ state cũ','function outer(){let x=1; return()=>x}','MDN Closures'],
  ['js-ts','JavaScript','Cơ bản','this binding','this phụ thuộc cách function được gọi, trừ arrow lexical this','debug method mất this khi truyền callback','nhầm this luôn là object khai báo function','obj.method(); const fn=obj.method; fn()','MDN this'],
  ['js-ts','JavaScript','Cơ bản','call apply bind','call/apply gọi ngay với this mới, bind trả function mới','xử lý this, partial application, đọc legacy code','nhầm bind gọi function ngay','fn.call(obj,a); fn.apply(obj,[a]); fn.bind(obj)','MDN Function'],
  ['js-ts','JavaScript Array','Cơ bản','map filter reduce','map biến đổi từng item, filter lọc list, reduce gom thành giá trị/cấu trúc','render list, transform API data, group data','dùng map để side-effect hoặc reduce làm code khó đọc','orders.reduce((acc,o)=>{...}, {})','MDN Array'],
  ['js-ts','JavaScript Array','Cơ bản','find some every','find trả item đầu match, some kiểm tra ít nhất một, every kiểm tra tất cả','validate list, tìm entity, permission checks','dùng filter()[0] thay find không cần thiết','users.find(u=>u.id===id)','MDN Array'],
  ['js-ts','JavaScript Array','Cơ bản','slice splice sort toSorted','slice không mutate, splice/sort mutate, toSorted trả array mới','update React state immutable','sort trực tiếp trên state array','const sorted=[...users].sort(compare)','MDN Array'],
  ['js-ts','JavaScript Object','Trung bình','Object.keys values entries fromEntries','Chuyển object thành array key/value/entry và ngược lại','render config map, convert query/filter object','quên Object.keys trả string[] làm TS cần xử lý','Object.entries(obj).map(([k,v])=>...)','MDN Object'],
  ['js-ts','JavaScript ES6','Trung bình','Map Set WeakMap','Map là keyed collection, Set lưu unique values, WeakMap key object không giữ strong reference','cache, selectedIds, unique list, metadata theo object','dùng object map cho key object hoặc dùng array includes cho set lớn','new Set(ids); new Map([[key,value]])','MDN Keyed Collections'],
  ['js-ts','JavaScript ES6','Trung bình','module import export','ES modules có import/export static giúp bundler phân tích dependency','chia code theo module, tree-shaking, reuse util/component','cycle dependency hoặc import default/named sai','export const a=1; import {a} from "./a"','MDN Modules'],
  ['js-ts','JavaScript ES6','Trung bình','class prototype','class là syntax trên prototype-based inheritance','đọc code OOP, extends, custom Error, library code','nghĩ class JS giống Java hoàn toàn','class User extends Person {}','MDN Classes'],
  ['js-ts','JavaScript ES6','Trung bình','Promise','Promise biểu diễn async result pending/fulfilled/rejected','API calls, async composition, error flow','nuốt lỗi trong catch hoặc return undefined làm UI không biết error','fetchUsers().then(...).catch(...)','MDN Promises'],
  ['js-ts','JavaScript Async','Trung bình','async await','await tạm dừng async function và tiếp tục khi promise settle','viết async code dễ đọc, handle loading/error bằng try/catch','dùng await tuần tự cho request độc lập làm chậm','const [a,b]=await Promise.all([getA(),getB()])','MDN async function'],
  ['js-ts','JavaScript Async','Trung bình','Promise.all allSettled race any','all fail fast, allSettled đợi tất cả, race settle đầu tiên, any fulfilled đầu tiên','dashboard nhiều API, timeout, fallback source','dùng Promise.all khi một block fail không nên làm hỏng cả page','Promise.allSettled([banner(),news()])','MDN Promise Composition'],
  ['js-ts','JavaScript Async','Trung bình','event loop microtask macrotask','Sync chạy trước, microtask Promise trước macrotask setTimeout','đoán thứ tự log, hiểu UI blocking, async bug','nghĩ setTimeout 0 chạy trước Promise.then','sync → Promise.then → setTimeout','MDN Event Loop'],
  ['js-ts','JavaScript Async','Trung bình','debounce throttle','Debounce đợi ngừng thao tác, throttle giới hạn tần suất chạy','search input dùng debounce, scroll/resize dùng throttle','gọi API mỗi keypress hoặc xử lý scroll quá nhiều','useDebounce(keyword,300)','MDN Events'],
  ['js-ts','Browser API','Trung bình','AbortController','AbortController hủy async request hỗ trợ signal','cancel search request cũ, cleanup khi unmount','để response cũ ghi đè response mới','fetch(url,{signal}); controller.abort()','MDN AbortController'],
  ['js-ts','JavaScript Advanced','Nâng cao','prototype chain','JS tìm property trên object rồi lên prototype chain tới null','hiểu class, inheritance, method sharing, built-in methods','mutate prototype bừa hoặc không hiểu method lookup','arr.map nằm trên Array.prototype','MDN Prototype Chain'],
  ['js-ts','JavaScript Advanced','Nâng cao','event delegation','Gắn listener ở parent để xử lý event từ child dựa trên bubbling','list dynamic, table rows, performance event handlers','gắn listener cho hàng nghìn item không cần thiết','ul.addEventListener("click", e=>...)','MDN Event Bubbling'],
  ['js-ts','JavaScript Advanced','Nâng cao','generator iterator','Iterator cung cấp next(), generator function* yield từng giá trị','lazy sequence, custom iterable, đọc library internals','nhầm generator với async API thông thường','function* ids(){yield 1; yield 2}','MDN Iterators'],
  ['js-ts','JavaScript Advanced','Nâng cao','Proxy Reflect','Proxy intercept operation trên object, Reflect gọi default operation tương ứng','library reactivity, validation wrapper, logging, meta programming','lạm dụng Proxy làm debug/type khó','new Proxy(obj,{get(target,key){...}})','MDN Proxy'],
  ['js-ts','JavaScript Advanced','Nâng cao','memory leak browser','Memory leak xảy ra khi reference không cần thiết vẫn bị giữ','cleanup event listener, timer, subscription, cache đúng cách','quên cleanup interval/websocket/listener khi unmount','return()=>clearInterval(id)','MDN Memory Management'],
  ['js-ts','JavaScript Advanced','Nâng cao','structuredClone','structuredClone deep clone nhiều built-in nhưng không clone function/DOM node','clone data plain phức tạp khi cần, thay JSON stringify','deep clone mọi render làm chậm hoặc nghĩ clone được function','structuredClone({date:new Date()})','MDN structuredClone'],
  ['js-ts','JavaScript Advanced','Nâng cao','optional chaining nullish','?. tránh lỗi nullish access, ?? fallback chỉ null/undefined','API optional fields, default value giữ 0/false/empty string','lạm dụng ?. che data contract sai','const limit = query.limit ?? 20','MDN Operators'],

  ['js-ts','TypeScript','Cơ bản','TypeScript compile-time','TS kiểm tra type khi dev/build, runtime vẫn là JavaScript','bắt lỗi props/function/type trước khi chạy','nghĩ TS validate API response runtime','tsc kiểm tra type, browser chạy JS','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','type annotation inference','Annotation là khai báo type, inference là TS tự suy ra','type public API/props/response boundary rõ ràng, để TS infer biến đơn giản','annotate quá nhiều hoặc any hóa mọi thứ','const age=18; function add(a:number,b:number):number','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','type vs interface','Cả hai mô tả object shape, interface merge/extends tốt, type mạnh với union/mapped/conditional','chọn theo convention team và đặc điểm bài toán','nói một trong hai luôn tốt hơn tuyệt đối','type Status="idle"|"loading"; interface User{ id:string }','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','any unknown never','any bỏ kiểm tra, unknown bắt narrow, never biểu diễn case không thể xảy ra','validate API boundary, exhaustive check, tránh mất type safety','dùng any thay unknown khi dữ liệu chưa tin cậy','function assertNever(x:never):never{throw new Error()}','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','union intersection','Union là A hoặc B, intersection là A và B','status/modal variants, compose object type','dùng field riêng của union mà không narrow','type ApiState = Loading | Success | Error','TypeScript Handbook'],
  ['js-ts','TypeScript','Cơ bản','narrowing','Thu hẹp type bằng typeof, in, instanceof, discriminant, truthiness, type guard','xử lý unknown/union an toàn trước khi truy cập field','ép as any thay vì check runtime','if (typeof value === "string") value.toUpperCase()','TypeScript Handbook Narrowing'],
  ['js-ts','TypeScript','Cơ bản','literal type as const','Literal type giới hạn giá trị cụ thể, as const giữ literal và readonly','role/status/config/option list','dùng string rộng làm mất autocomplete/guard','const roles=["admin","user"] as const','TypeScript Handbook'],
  ['js-ts','TypeScript','Trung bình','generics','Generic giúp tái sử dụng code mà vẫn giữ type cụ thể','helper getById, API response, reusable component','dùng any làm mất return type chính xác','function identity<T>(value:T):T{return value}','TypeScript Handbook Generics'],
  ['js-ts','TypeScript','Trung bình','generic constraints','Constraint yêu cầu T có shape tối thiểu nhưng vẫn giữ type riêng','helper cho entity có id, table row, form field','generic quá rộng khiến không truy cập field an toàn','T extends {id:string|number}','TypeScript Handbook Generics'],
  ['js-ts','TypeScript','Trung bình','keyof typeof indexed access','keyof lấy key union, typeof lấy type từ value, T[K] lấy type property','type-safe updateField/table columns/form helper','dùng key:string value:any mất safety','function get<T,K extends keyof T>(o:T,k:K):T[K]','TypeScript Handbook'],
  ['js-ts','TypeScript','Trung bình','utility types','Partial/Required/Readonly/Pick/Omit/Record/Exclude/Extract/NonNullable... biến đổi type có sẵn','DTO, form values, config map, union filtering','copy type thủ công gây lệch model','Partial<Omit<User,"id">>','TypeScript Utility Types'],
  ['js-ts','TypeScript','Trung bình','discriminated union','Union có field literal chung để TS narrow chính xác','UI loading/success/error, modal type, payment method','nhiều boolean loading/data/error tạo state mâu thuẫn','{status:"success",data} | {status:"error",message}','TypeScript Handbook Narrowing'],
  ['js-ts','TypeScript','Trung bình','type guard','Function trả value is Type nối runtime check với TS narrowing','validate unknown API/localStorage trước khi dùng','type guard sai vẫn làm TS tin nhầm','function isUser(v:unknown): v is User { ... }','TypeScript Handbook'],
  ['js-ts','TypeScript','Trung bình','assertion function','Function asserts value is Type throw nếu invalid và narrow sau khi gọi','validate config/API boundary rồi code phía sau sạch type','dùng assertion để che lỗi mà không check thật','function assertUser(v:unknown): asserts v is User','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','mapped types','Type tạo type mới bằng cách lặp qua key của type khác','xây utility type, form error map, readonly/optional map','nhầm với Array.map runtime','type Flags<T>={ [K in keyof T]: boolean }','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','conditional types infer','Type logic dạng T extends U ? X : Y, infer để lấy type con','Awaited, ReturnType, extracting Promise/result types','lạm dụng làm type khó đọc không cần thiết','type Unwrap<T> = T extends Promise<infer R> ? R : T','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','template literal types','Tạo pattern string type từ union/string literal','event names, route path, design token names','dùng string rộng làm mất kiểm tra pattern','type Event<T> = `${Extract<keyof T,string>}Changed`','TypeScript Handbook'],
  ['js-ts','TypeScript','Nâng cao','satisfies','Kiểm tra object thỏa type nhưng giữ literal inference','routes/menu/config/theme tokens','dùng as che lỗi shape','const routes = {...} satisfies RouteConfig','TypeScript 4.9'],
  ['js-ts','TypeScript React','Trung bình','ReactNode vs JSX.Element','ReactNode là mọi thứ React render được, JSX.Element hẹp hơn','type children, render prop, component return','type children là JSX.Element làm string/null/array lỗi không cần thiết','type Props={children:React.ReactNode}','React TypeScript'],
  ['js-ts','TypeScript React','Trung bình','React event types','React.ChangeEvent/FormEvent/MouseEvent type event theo element','form/input/button handler an toàn','dùng any cho event làm mất currentTarget type','React.ChangeEvent<HTMLInputElement>','React TypeScript'],
  ['js-ts','TypeScript React','Nâng cao','ComponentPropsWithoutRef','Lấy props native của element/component trừ ref','design system Button/Input wrapper','khai báo lại props native thủ công dễ thiếu/sai','type ButtonProps = React.ComponentPropsWithoutRef<"button">','React TypeScript'],
  ['js-ts','TypeScript React','Nâng cao','polymorphic as prop','Props thay đổi theo element truyền vào as nên cần generic/Omit','design-system component linh hoạt như Button as="a"','type sơ sài làm nhận prop sai element','type Props<T extends React.ElementType> = {as?:T} & Omit<ComponentPropsWithoutRef<T>,"as">','React TypeScript'],

  ['react','React Core','Cơ bản','props vs state','Props là input readonly từ parent, state là memory nội bộ update bằng setter','truyền dữ liệu và quản lý tương tác component','mutate props hoặc nhầm state không gây re-render','function Card({user}){const [open,setOpen]=useState(false)}','React Docs'],
  ['react','React Core','Cơ bản','render lifecycle','State/props đổi → render phase tính UI → reconciliation → commit DOM → effects','giải thích component update và effect timing','nghĩ useEffect chạy trước render đầu tiên','render phase vs commit phase','React Docs'],
  ['react','React Core','Cơ bản','immutable state','React nhận thay đổi qua reference nên state cần update immutable','object/array state, nested update, reducer','mutate state trực tiếp rồi set cùng reference','setUser(p=>({...p,name:"A"}))','React Docs'],
  ['react','React Core','Cơ bản','key in list','Key là identity cho React reconciliation trong list','list add/remove/sort, preserve row state đúng item','dùng index key cho list dynamic gây input nhảy dòng','items.map(item=><Row key={item.id}/>)','React Docs'],
  ['react','React Core','Cơ bản','controlled component','Input controlled có value từ state và update qua onChange','form nhỏ, realtime validation, search input','quên onChange làm input read-only','<input value={name} onChange={e=>setName(e.target.value)} />','React Docs'],
  ['react','React Core','Cơ bản','derived state','Dữ liệu tính được từ props/state hiện tại thường không nên lưu state riêng','fullName, totals, filtered list nhẹ','useEffect + setState để sync value tính được làm render thừa','const fullName = first + " " + last','React Docs: You Might Not Need an Effect'],
  ['react','React Hooks','Cơ bản','useEffect purpose','Effect dùng để đồng bộ với external systems như API, timer, subscription, DOM API','fetch/cancel, event listener, websocket, third-party widget','dùng effect cho mọi phép tính render','useEffect(()=>{window.addEventListener(...);return cleanup},[])','React useEffect'],
  ['react','React Hooks','Cơ bản','effect dependencies','Dependency array liệt kê reactive values effect sử dụng','refetch khi keyword/id đổi, tránh stale closure','bỏ dependency để né gọi lại làm data cũ','useEffect(()=>fetch(keyword),[keyword])','React useEffect'],
  ['react','React Hooks','Cơ bản','effect cleanup','Cleanup chạy trước effect kế tiếp và khi unmount','remove listener, clear timer, unsubscribe, abort request','quên cleanup tạo leak/duplicate subscription','return()=>controller.abort()','React useEffect'],
  ['react','React Hooks','Cơ bản','rules of hooks','Hook phải gọi top-level và cùng thứ tự mỗi render','React map state/effect với hook order đúng','gọi hook trong if/for/nested function','if(cond) useEffect(...) // sai','Rules of Hooks'],
  ['react','React Hooks','Cơ bản','useRef vs useState','ref.current đổi không re-render, state đổi re-render','DOM ref, timer id, mutable value không hiển thị UI','dùng ref cho data cần render khiến UI không update','const inputRef=useRef(null)','React useRef'],
  ['react','React Hooks','Trung bình','useMemo useCallback','useMemo cache value, useCallback cache function reference','giữ props stable, tính toán nặng có dependency rõ','bọc mọi thứ bằng memo làm code rối','useMemo(()=>expensive(data),[data])','React Docs'],
  ['react','React Hooks','Trung bình','useReducer','useReducer gom state transition phức tạp theo action','form/wizard/filter nhiều action phụ thuộc previous state','dùng reducer cho boolean đơn giản không cần thiết','const [state,dispatch]=useReducer(reducer,init)','React useReducer'],
  ['react','React Hooks','Trung bình','useLayoutEffect','Chạy sau DOM commit nhưng trước browser paint','đo layout, tránh flicker khi cần sync layout','gọi API bằng useLayoutEffect làm block paint không cần thiết','useLayoutEffect(()=>measure(),[])','React useLayoutEffect'],
  ['react','React Hooks','Nâng cao','useTransition','Đánh dấu update không khẩn cấp để UI ưu tiên tương tác quan trọng','filter list lớn, route transition, heavy render','nghĩ transition làm API nhanh hơn','startTransition(()=>setFilter(v))','React useTransition'],
  ['react','React Hooks','Nâng cao','useDeferredValue','Trì hoãn value ít khẩn cấp để render nặng không làm input lag','search/filter list lớn khi user gõ nhanh','dùng thay debounce API một cách mù quáng','const deferred = useDeferredValue(keyword)','React useDeferredValue'],
  ['react','React Hooks','Nâng cao','useId','Tạo id ổn định cho accessibility và SSR hydration','label/input aria-describedby trong component reusable','dùng useId làm key cho list data','const id=useId(); <label htmlFor={id}>','React useId'],
  ['react','React Performance','Trung bình','React.memo','memo shallow compare props để tránh render không cần thiết','component con nặng, props stable, list row','props object/function inline làm memo mất tác dụng','export default memo(Row)','React memo'],
  ['react','React Performance','Trung bình','Profiler','Profiler đo component nào render và mất bao lâu','tối ưu performance dựa trên số liệu thay vì đoán','tối ưu sớm không đo hoặc blame nhầm component','React DevTools Profiler','React DevTools'],
  ['react','React Performance','Trung bình','virtualization','Chỉ render items đang thấy thay vì toàn bộ list lớn','table/list 10k records','render toàn bộ DOM rồi chỉ thêm memo','react-window, tanstack virtual','Performance Pattern'],
  ['react','React Advanced','Trung bình','Portal','Render children vào DOM node khác nhưng giữ React tree','modal, tooltip, dropdown, toast overlay','modal bị overflow/z-index parent cắt','createPortal(<Modal/>, document.body)','React createPortal'],
  ['react','React Advanced','Trung bình','Error Boundary','Bắt lỗi render/lifecycle trong subtree và hiển thị fallback','widget/page section có thể fail riêng','nghĩ bắt được mọi async/event handler error','<ErrorBoundary><Widget/></ErrorBoundary>','React Error Boundary'],
  ['react','React Advanced','Trung bình','lazy Suspense','Code-splitting component và fallback khi chưa sẵn sàng','route/chart/editor/modal nặng','lazy quá nhỏ hoặc thiếu fallback gây UX xấu','const Chart=lazy(()=>import("./Chart"))','React lazy/Suspense'],
  ['react','React Advanced','Nâng cao','StrictMode','Bật kiểm tra dev để phát hiện side effect không an toàn','dev double invoke effect setup/cleanup để lộ thiếu cleanup','tắt StrictMode để che bug effect','<StrictMode><App/></StrictMode>','React StrictMode'],
  ['react','React Advanced','Nâng cao','render vs commit phase','Render phase tính UI có thể bị interrupt, commit phase apply DOM/effects','hiểu concurrent rendering và side effects đúng chỗ','side effect trong render gây bug khó đoán','render pure, effects after commit','React Architecture'],
  ['react','React Advanced','Nâng cao','Server vs Client Components','Server Component render/fetch ở server, Client Component xử lý interaction/browser APIs','Next App Router boundary, giảm JS client','đặt use client ở root làm tăng bundle','server fetch data, client button opens modal','React/Next RSC'],

  ['state','State','Cơ bản','local state','State chỉ dùng trong một component hoặc subtree nhỏ','modal open, input draft, tab local','đưa mọi local state lên global store','const [open,setOpen]=useState(false)','React State'],
  ['state','State','Cơ bản','lifting state up','Đưa state lên parent chung gần nhất khi sibling cần share','filter panel và list cùng dùng filter','dùng Redux ngay cho hai component gần nhau','Parent giữ filter, truyền props xuống children','React State'],
  ['state','State','Cơ bản','URL state','State phản ánh trong URL như page/filter/sort/keyword','share link, refresh không mất, back/forward đúng','đưa password/draft nhạy cảm vào URL','/users?page=2&role=admin','Router Docs'],
  ['state','State','Cơ bản','client vs server state','Client state do UI sở hữu, server state thuộc backend và có stale/cache/refetch','chọn đúng useState/Zustand/Redux/TanStack Query','nhét product list API và modal open chung một store','products server state, sidebarOpen client state','TanStack Query'],
  ['state','Context','Trung bình','React Context','Context truyền data sâu không cần prop drilling','theme, locale, current user info ít thay đổi','dùng Context cho state update liên tục toàn app','<ThemeContext.Provider value={theme}>','React Context'],
  ['state','Context','Trung bình','Context performance','Context value đổi làm consumers liên quan re-render','tách context/memo value/store selector khi context lớn','nhét toàn app state vào một provider object mới mỗi render','useMemo(()=>({user,setUser}),[user])','React Context'],
  ['state','Redux Toolkit','Trung bình','configureStore','Setup Redux store với default middleware/devtools tốt hơn Redux cũ','app lớn cần predictable global state và DevTools','tự config Redux thủ công không cần thiết','configureStore({reducer:{auth,users}})','Redux Toolkit'],
  ['state','Redux Toolkit','Trung bình','createSlice','Tạo reducer/action creators/action types từ slice definition','client global state như auth UI, permission, settings','viết action type/reducer boilerplate kiểu cũ không cần thiết','createSlice({name,initialState,reducers})','Redux Toolkit'],
  ['state','Redux Toolkit','Trung bình','Immer in RTK','RTK cho mutate draft trong reducer và tạo immutable update phía sau','viết reducer ngắn gọn nhưng vẫn immutable','mutate Redux state bên ngoài reducer','state.value++ trong createSlice reducer','Redux Toolkit'],
  ['state','Redux Toolkit','Nâng cao','createAsyncThunk extraReducers','Tạo async lifecycle pending/fulfilled/rejected và xử lý ở extraReducers','project Redux chưa dùng RTK Query/TanStack Query','đưa API call vào reducer pure','builder.addCase(fetchUsers.fulfilled,...)','Redux Toolkit'],
  ['state','Redux Toolkit','Nâng cao','createEntityAdapter','Quản lý collection normalized ids/entities với CRUD reducers/selectors','list entity nhiều, update item riêng lẻ','store duplicate entity ở nhiều nơi','usersAdapter.upsertMany(state, users)','Redux Toolkit'],
  ['state','React Redux','Trung bình','useSelector equality','useSelector mặc định strict reference equality','selector trả primitive hoặc memoized object để tránh render thừa','return object mới inline khiến re-render liên tục','useSelector(selectUserName)','React Redux'],
  ['state','Zustand','Trung bình','Zustand selector','Selector giúp component subscribe slice cần dùng','global client state gọn, giảm render lan','useStore() lấy cả store cho mọi component','useAuthStore(s=>s.user)','Zustand Docs'],
  ['state','Zustand','Trung bình','persist middleware','Persist lưu một phần store xuống storage','theme, language, guest cart preference','persist token nhạy cảm/server cache lớn bừa bãi','persist(...,{partialize:s=>({theme:s.theme})})','Zustand Docs'],
  ['state','TanStack Query','Trung bình','server state cache','TanStack Query quản lý server state: cache/loading/error/refetch/mutation','API list/detail, pagination, optimistic update','dùng nó cho hover state/input local','useQuery({queryKey,queryFn})','TanStack Query'],
  ['state','State','Thực tế','logout cleanup','Logout cần xóa token, reset user-specific stores và clear query cache','tránh user sau thấy data user trước','chỉ navigate login nhưng cache/store còn dữ liệu','queryClient.clear(); authStore.reset()','Architecture'],

  ['api-router','Axios','Cơ bản','axios instance','axios.create tạo client có baseURL/timeout/headers/interceptors','gom HTTP config và tách component khỏi request details','axios.get rải rác trong JSX','const api=axios.create({baseURL,timeout:15000})','Axios Docs'],
  ['api-router','Axios','Trung bình','request interceptor','Interceptor request chỉnh config trước khi gửi','gắn token, locale, request id','gọi React hook/useNavigate trực tiếp trong interceptor','api.interceptors.request.use(config=>config)','Axios Docs'],
  ['api-router','Axios','Trung bình','response interceptor','Interceptor response normalize data hoặc xử lý lỗi chung','unwrap response.data, refresh token, map error','ẩn mọi lỗi bằng return undefined','api.interceptors.response.use(res=>res.data, err=>...)','Axios Docs'],
  ['api-router','Axios','Trung bình','refresh token queue','Khi nhiều request 401 cùng lúc cần refresh một lần và queue request pending','auth flow production tránh race condition','mỗi request refresh riêng gây token race','isRefreshing + failedQueue + _retry','Auth Pattern'],
  ['api-router','HTTP','Cơ bản','HTTP status 401 vs 403','401 là chưa/không xác thực hợp lệ, 403 là xác thực rồi nhưng không có quyền','auth UI, redirect login, permission message','xử lý 401/403 giống nhau mọi lúc','401 refresh/login; 403 no permission','MDN HTTP'],
  ['api-router','Browser API','Trung bình','CORS','CORS là browser policy, server phải cho phép origin/method/header/credentials','debug API local/prod khác origin','dùng mode no-cors để đọc JSON response','Access-Control-Allow-Origin','MDN CORS'],
  ['api-router','React Router','Cơ bản','BrowserRouter HashRouter','BrowserRouter dùng History API URL đẹp cần fallback, HashRouter dùng # dễ host static','deploy SPA static, route refresh','BrowserRouter không cần server rewrite','/users/1 vs /#/users/1','React Router'],
  ['api-router','React Router','Cơ bản','dynamic route params','URL segment động như /users/:id lấy bằng useParams','detail page theo id/slug','hard-code id trong component','/users/:id','React Router'],
  ['api-router','React Router','Trung bình','nested routes Outlet','Outlet là vị trí route con render trong layout cha','dashboard layout với users/orders child routes','quên Outlet làm route con không hiện','<Outlet />','React Router'],
  ['api-router','React Router','Trung bình','useNavigate replace','navigate bằng code, replace thay entry hiện tại trong history','redirect sau login/logout/protected route','dùng push khiến back quay lại page không hợp lệ','navigate("/login",{replace:true})','React Router'],
  ['api-router','TanStack Query','Trung bình','queryKey','queryKey là identity cache và phải chứa đủ input ảnh hưởng data','pagination/filter/detail cache chính xác','queryKey thiếu page/keyword dùng nhầm cache','["users",{page,keyword}]','TanStack Query'],
  ['api-router','TanStack Query','Trung bình','staleTime gcTime','staleTime quyết định fresh/stale, gcTime giữ inactive cache trước khi dọn','config cache data ít đổi vs realtime','nhầm gcTime là thời gian data fresh','staleTime: 60_000','TanStack Query'],
  ['api-router','TanStack Query','Trung bình','enabled dependent query','enabled cho query chỉ chạy khi điều kiện đủ','detail query cần id/token, query phụ thuộc query trước','gọi API /undefined rồi xử lý sau','enabled: !!id','TanStack Query'],
  ['api-router','TanStack Query','Trung bình','mutation invalidation','Mutation thay server state, cần invalidate hoặc update cache liên quan','create/update/delete xong list/header/detail cập nhật','alert thành công nhưng cache vẫn stale','invalidateQueries({queryKey:["users"]})','TanStack Query'],
  ['api-router','TanStack Query','Nâng cao','optimistic update','Update UI tạm trước server response và rollback nếu fail','delete/like/toggle nhanh UX','không snapshot/rollback khi API fail','onMutate/onError/onSettled','TanStack Query'],
  ['api-router','TanStack Query','Nâng cao','infinite query','useInfiniteQuery load nhiều page với getNextPageParam','infinite scroll/load more','queryKey không chứa filter hoặc getNextPageParam sai','getNextPageParam:last=>last.nextCursor','TanStack Query'],
  ['api-router','TanStack Router','Trung bình','type-safe routing','TanStack Router type params/search/navigate/loader','giảm bug route params/search sai trong TS app','đọc window.location thủ công khắp nơi','createRouter({routeTree})','TanStack Router'],
  ['api-router','TanStack Router','Trung bình','validateSearch','Validate/parse search params từ URL thành type đúng','page number, sort enum, keyword string','tin URL params đã typed sẵn','validateSearch:z.object({page:z.coerce.number().catch(1)})','TanStack Router'],
  ['api-router','TanStack Router','Nâng cao','beforeLoad loader context','beforeLoad auth/redirect, loader data, context inject dependency','protected route + prefetch query','gọi React hook tùy tiện trong loader','beforeLoad({context}){...}','TanStack Router'],

  ['form-test','React Hook Form','Trung bình','register','register kết nối input uncontrolled với RHF form state/validation','form nhiều field ít re-render','dùng useState cho từng input lớn gây lag','<input {...register("email")} />','React Hook Form'],
  ['form-test','React Hook Form','Trung bình','Controller','Controller bridge controlled component UI library với RHF','MUI Select, DatePicker, custom controlled input','dùng Controller cho mọi native input không cần thiết','<Controller name="role" render={({field})=><Select {...field}/>} />','React Hook Form'],
  ['form-test','React Hook Form','Trung bình','formState','formState chứa errors/isDirty/isSubmitting/isValid...','disable submit, show error, prevent double submit','không dùng isSubmitting khiến submit nhiều lần','formState.errors.email','React Hook Form'],
  ['form-test','React Hook Form','Nâng cao','useFieldArray','Quản lý danh sách field động trong form','nhiều số điện thoại, order items, survey questions','dùng index key làm field state nhảy sai','fields.map(field=><input key={field.id}/>)','React Hook Form'],
  ['form-test','Zod','Trung bình','parse safeParse','parse throw khi invalid, safeParse trả success/data/error','validate API/form/localStorage runtime','nghĩ TS tự validate runtime','UserSchema.safeParse(data)','Zod Docs'],
  ['form-test','Zod','Trung bình','refine superRefine','Custom validation/cross-field validation','confirmPassword, startDate < endDate, conditional field','chỉ validate từng field độc lập nên miss business rule','z.object(...).refine(data=>data.a<data.b)','Zod Docs'],
  ['form-test','Testing Library','Cơ bản','query priority','Ưu tiên query giống user: role, label, text, placeholder; testId là fallback','test behavior bền hơn implementation detail','query className/DOM index làm test giòn','screen.getByRole("button",{name:/submit/i})','Testing Library'],
  ['form-test','Testing Library','Cơ bản','getBy queryBy findBy','getBy throw sync, queryBy trả null, findBy chờ async','assert tồn tại/không tồn tại/async UI đúng cách','dùng getBy cho element sau API chưa xuất hiện','await screen.findByText(/success/i)','Testing Library'],
  ['form-test','Testing Library','Trung bình','userEvent vs fireEvent','userEvent mô phỏng tương tác user đầy đủ hơn và thường async','test typing/click/tab form gần thực tế','fireEvent mọi thứ khiến thiếu chuỗi event thực tế','await userEvent.type(input,"abc")','Testing Library'],
  ['form-test','Testing','Trung bình','MSW','MSW mock network layer thay vì mock axios implementation','integration test loading/success/error bền hơn khi đổi HTTP client','mock quá sát implementation làm test giòn','server.use(http.get("/users",...))','MSW'],

  ['rendering','Rendering','Cơ bản','SPA','Single Page Application load một HTML chính và client router đổi view không reload full page','dashboard/admin/app sau login','nhầm SPA với CSR hoàn toàn','Vite React SPA + React Router','Rendering Concepts'],
  ['rendering','Rendering','Cơ bản','CSR','Client-Side Rendering: browser tải JS rồi render UI/data ở client','app tương tác mạnh, SEO không trọng tâm','bundle lớn làm initial load trắng lâu','index.html + JS bundle render React','Rendering Concepts'],
  ['rendering','Rendering','Cơ bản','SSR','Server render HTML theo request rồi client hydrate','SEO, initial content theo request/auth-aware page','server chậm làm TTFB cao hoặc hydration mismatch','request → server render → HTML → hydrate','Next Docs'],
  ['rendering','Rendering','Cơ bản','SSG','Static Site Generation render HTML ở build time','landing/blog/docs public ít đổi','dùng SSG cho private data theo user','npm run build tạo static HTML','Next Docs'],
  ['rendering','Rendering','Trung bình','ISR','Static page có cơ chế revalidate sau build','product/blog nhiều trang cập nhật định kỳ','nghĩ ISR là SSR mọi request không cache','revalidate:60 hoặc on-demand revalidate','Next Docs'],
  ['rendering','Hydration','Trung bình','hydration','React attach event/state vào HTML server-rendered','SSR/SSG cần UI interactive','server/client markup khác nhau gây mismatch','hydrateRoot(document.getElementById("root"), <App />)','React DOM'],
  ['rendering','Next.js','Trung bình','use client','Directive đánh dấu Client Component cần state/effect/event/browser API','Next App Router component tương tác','đặt use client ở root layout làm tăng client bundle','"use client"; function Button(){...}','Next Docs'],
  ['rendering','Next.js','Nâng cao','Server Components','Component chạy/render ở server, có thể fetch data và không gửi JS component đó xuống client','giảm client bundle, dùng secret server-side','dùng onClick/useState trong Server Component','async function Products(){const data=await fetch(...)}','Next Docs'],
  ['rendering','Build','Cơ bản','Vite dev build preview','dev chạy HMR, build tạo production dist, preview serve thử dist','kiểm tra lỗi production trước deploy','tin dev server giống production 100%','npm run dev/build/preview','Vite Docs'],
  ['rendering','Build','Trung bình','bundle chunk code splitting','Bundle là output JS, chunk là phần tách, code splitting tải khi cần','lazy route/chart/editor giảm initial JS','split quá nhỏ hoặc không fallback','React.lazy(()=>import("./Chart"))','Bundling Concepts'],
  ['rendering','Build','Trung bình','env client public','VITE_ hoặc NEXT_PUBLIC_ expose ra client bundle nên không chứa secret','API base URL public, feature flag public','đưa database password/token secret vào client env','import.meta.env.VITE_API_URL','Vite/Next Docs'],
  ['rendering','Deployment','Trung bình','SPA fallback','BrowserRouter refresh route sâu cần server fallback về index.html','deploy Netlify/Nginx/GitHub Pages SPA','refresh /users/1 bị 404','try_files $uri /index.html','React Router Deployment'],
  ['rendering','Deployment','Trung bình','base path','Deploy dưới subpath cần config base/public path/router basename','GitHub Pages /repo-name, /admin subpath','asset 404 do build base sai','vite base:"/repo/"','Vite Docs'],

  ['git-build-security','Git','Cơ bản','git fetch vs pull','fetch tải remote refs chưa merge, pull = fetch + merge/rebase','xem remote trước khi sync branch','pull bừa gây merge/conflict khi chưa xem','git fetch origin; git log main..origin/main','Git SCM'],
  ['git-build-security','Git','Cơ bản','merge vs rebase','merge tạo merge commit, rebase replay commit cho history linear','sync feature branch theo team convention','rebase branch shared bừa bãi rewrite history','git rebase origin/main','Git SCM'],
  ['git-build-security','Git','Cơ bản','reset vs revert','reset di chuyển history, revert tạo commit đảo ngược','undo local commit vs undo commit đã merge main','reset --hard force push main làm mất history team','git revert <sha>','Git SCM'],
  ['git-build-security','Git','Cơ bản','stash','Stash lưu tạm working changes chưa commit','chuyển hotfix khi đang code dở','reset hard làm mất code chưa backup','git stash push -m "wip"','Git SCM'],
  ['git-build-security','Git','Trung bình','cherry-pick','Cherry-pick lấy một commit cụ thể sang branch hiện tại','hotfix từ develop sang release','pick commit phụ thuộc nhiều commit khác gây conflict/thiếu logic','git cherry-pick <sha>','Git SCM'],
  ['git-build-security','Git','Trung bình','conflict resolution','Resolve conflict là hiểu logic hai bên và giữ kết quả đúng','merge/rebase conflict, PR update','bấm accept current/incoming bừa','sửa conflict → git add → continue → test','Git SCM'],
  ['git-build-security','Security','Cơ bản','XSS','Script độc hại chạy trong browser người dùng','render user-generated HTML, token storage risk','dangerouslySetInnerHTML content chưa sanitize','DOMPurify.sanitize(html)','OWASP'],
  ['git-build-security','Security','Cơ bản','CSRF','Lợi dụng browser tự gửi cookie để thực hiện request không mong muốn','cookie-based auth cần SameSite/CSRF token','nghĩ CORS thay CSRF protection hoàn toàn','SameSite=Lax/Strict, CSRF token','OWASP'],
  ['git-build-security','Security','Trung bình','FE permission','FE chỉ ẩn UI, backend phải enforce permission thật','route guard/menu button permission UX','tin FE role check là bảo mật cuối cùng','backend check user.canDelete before delete','OWASP'],
  ['git-build-security','Security','Trung bình','token storage','localStorage tiện nhưng nhạy XSS, httpOnly cookie giảm đọc token bằng JS nhưng cần CSRF strategy','thiết kế auth theo threat model','khẳng định một cách lưu token luôn tốt nhất','access token short-lived, refresh flow rõ','OWASP'],

  ['project','Architecture','Thực tế','feature-based structure','Tổ chức code theo domain feature với components/hooks/services/types riêng','project vừa/lớn dễ maintain','mọi thứ bỏ shared/components làm bãi rác','features/users/components/UserTable.tsx','Architecture'],
  ['project','Architecture','Thực tế','service layer','Service gom API call/normalize response, UI không biết HTTP chi tiết','dễ test, đổi Axios sang fetch, đổi API shape','component gọi axios trực tiếp khắp nơi','userService.getList(params)','Architecture'],
  ['project','Architecture','Thực tế','custom hook','Custom hook tái sử dụng state/effect/behavior, không phải UI markup chính','useDebounce, useUsers, usePermission','nhét JSX lớn vào hook','function useDebounce(value,delay){...}','React Patterns'],
  ['project','Clean Code','Thực tế','component 900 dòng','Tách UI components, hooks, services, types, constants theo responsibility','refactor màn quản lý users/orders phức tạp','đổi tên file nhưng vẫn giữ toàn bộ logic một chỗ','UserTable/UserFilter/UserFormModal/useUsers','Clean Code'],
  ['project','Interview','Thực tế','feature khó nhất','Trả lời theo bối cảnh → vấn đề → cách xử lý → trade-off → kết quả','chứng minh problem solving level 2.5+','chỉ kể tên thư viện đã dùng','STAR style answer','Interview'],
  ['project','Debug','Thực tế','white screen production','Debug bằng Console/Network/build logs: chunk 404, env, base path, route fallback, runtime error','deploy app trắng màn','đoán mò hoặc đổ lỗi backend ngay','check Console + Network first','Debugging'],
];

function hash(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function buildOptions(correct, area, seed) {
  const wrongs = WRONGS[area] || WRONGS.project;
  const raw = [correct, ...wrongs];
  const shift = hash(seed) % raw.length;
  const options = [...raw.slice(shift), ...raw.slice(0, shift)];
  return { options, answer: options.indexOf(correct) };
}

function fromConcept(concept, index) {
  const [area, topic, level, name, meaning, use, pitfall, example, source] = concept;
  const items = [
    [`${name} là gì / khác gì?`, meaning, `${meaning}. Dùng trong thực tế: ${use}. Lỗi cần tránh: ${pitfall}.`],
    [`${name} dùng khi nào trong dự án FE?`, use, `${use}. Ý chính: ${meaning}. Lỗi cần tránh: ${pitfall}.`],
    [`Lỗi thường gặp với ${name} là gì?`, pitfall, `Lỗi thường gặp: ${pitfall}. Cách hiểu đúng: ${meaning}. Ứng dụng thực tế: ${use}.`],
  ];
  return items.map(([question, correct, explanation], variant) => {
    const { options, answer } = buildOptions(correct, area, `${name}-${variant}`);
    return { id: index * 3 + variant + 1, area, topic, level, question, options, answer, explanation, example, source };
  });
}

const QUESTIONS = CONCEPTS.flatMap(fromConcept).map((q, i) => ({ ...q, id: i + 1 }));
const alphabet = ['A', 'B', 'C', 'D'];

function levelClass(level) {
  if (level === 'Cơ bản') return 'level-basic';
  if (level === 'Trung bình' || level === 'Thực tế') return 'level-practical';
  return 'level-advanced';
}

function scoreLabel(percent) {
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
    setAnswers({});
    setSubmitted(false);
    setMode('all');
    setLevel('all');
    setArea('all');
    setTopic('all');
    setSearch('');
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
              <select value={level} onChange={(e) => setLevel(e.currentTarget.value)}><option value="all">Cấp độ: Tất cả</option><option value="Cơ bản">Cơ bản</option><option value="Trung bình">Trung bình</option><option value="Thực tế">Thực tế</option><option value="Nâng cao">Nâng cao</option></select>
              <select value={topic} onChange={(e) => setTopic(e.currentTarget.value)}>{topics.map((t) => <option key={t} value={t}>{t === 'all' ? 'Chủ đề: Tất cả' : t}</option>)}</select>
              <select value={mode} onChange={(e) => setMode(e.currentTarget.value)}><option value="all">Trạng thái: Tất cả</option><option value="unanswered">Chưa làm</option><option value="wrong">Câu sai</option><option value="correct">Câu đúng</option></select>
              {!submitted ? <button className="primary" onClick={() => setSubmitted(true)}>Nộp bài</button> : <button className="primary cyan" onClick={resetQuiz}>Làm lại</button>}
            </div>
          </div>

          <section className="stats">
            <div><span>Tổng câu hỏi</span><strong>{QUESTIONS.length}</strong></div><div><span>Đã trả lời</span><strong>{answeredCount}</strong></div><div><span>Kết quả</span><strong>{submitted ? `${result.percent}%` : '--'}</strong><small>{submitted ? scoreLabel(result.percent) : 'Làm xong bấm nộp bài'}</small></div>
          </section>

          <section className="cards">
            {filtered.map((q) => {
              const selected = answers[q.id];
              const done = selected !== undefined;
              const ok = selected === q.answer;
              return <article className="qa-card" key={q.id}>
                <div className="qa-head"><span className="num">#{q.id}</span><div className="qa-title"><div className="badges"><b className={levelClass(q.level)}>{q.level}</b><b>{q.topic}</b><b>Docs-driven</b></div><h2>{q.question}</h2></div><div className="icons">🔖 🎓 ↗</div></div>
                <div className="qa-body"><div className="options-grid">{q.options.map((option, index) => { let cls = 'option'; if (done && index === q.answer) cls += ' right'; if (done && index === selected && selected !== q.answer) cls += ' wrong'; if (!done && selected === index) cls += ' chosen'; return <button className={cls} key={`${q.id}-${index}`} onClick={() => choose(q.id, index)}><span>{alphabet[index]}</span><p>{option}</p></button>; })}</div>
                {done && <div className={ok ? 'explain good' : 'explain bad'}><p><b>Bạn chọn:</b> {q.options[selected]}</p><p><b>Đáp án đúng:</b> {q.options[q.answer]}</p><p><b>Giải thích:</b> {q.explanation}</p>{q.example && <code>Ví dụ: {q.example}</code>}<small>Nguồn định hướng: {q.source}</small></div>}</div>
              </article>;
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
