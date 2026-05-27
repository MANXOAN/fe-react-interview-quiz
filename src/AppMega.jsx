import React, { useMemo, useState } from 'react';
import { PRACTICAL_QUESTIONS } from './practicalQuestions.js';

const STORAGE_KEY = 'fe-react-mega-quiz-v1';

const AREAS = [
  { id: 'all', label: 'Tất cả', icon: '✨' },
  { id: 'html-css', label: 'HTML/CSS', icon: '🌐' },
  { id: 'js-ts', label: 'JavaScript / TypeScript', icon: '🟨' },
  { id: 'react', label: 'React / Sudheer+', icon: '⚛️' },
  { id: 'state', label: 'State Management', icon: '🧠' },
  { id: 'tanstack-axios', label: 'Axios / TanStack', icon: '🔌' },
  { id: 'rendering', label: 'Rendering / Build', icon: '🚀' },
  { id: 'git-build-security', label: 'Git / Security', icon: '🛠️' },
  { id: 'project', label: 'Project / Interview', icon: '📦' },
];

const q = (area, topic, level, question, correct, wrongs, example, source) => [
  area, topic, level, question, correct, wrongs.join('|'), example, source,
];

const SUDHEER_REACT_ROWS = [
  q('react','Core React','Cơ bản','React là gì? Trả lời sao để không chỉ nói là thư viện UI?','React là thư viện JavaScript xây UI theo component, declarative rendering và one-way data flow.',['React là framework full-stack có sẵn database.','React chỉ là template engine giống HTML.','React tự xử lý backend/API.'],'Component nhận props/state và trả React element mô tả UI.','Sudheer React / React Docs'),
  q('react','Core React','Cơ bản','JSX là gì và vì sao dùng className thay vì class?','JSX là cú pháp mô tả UI trong JS, compile thành React element; className theo DOM property/React convention.',['JSX là HTML thật chạy trực tiếp.','className tự tạo CSS module.','JSX chỉ dùng được trong Next.js.'],'<button className="primary">Save</button>','Sudheer JSX'),
  q('react','Core React','Cơ bản','Element và Component khác nhau thế nào?','Element là object mô tả UI; Component là function/class nhận props và trả element.',['Component là DOM node thật.','Element có state còn Component không.','Hai khái niệm giống hệt nhau.'],'const el=<Button/>; function Button(){return <button/>}','Sudheer Element vs Component'),
  q('react','Core React','Cơ bản','Function Component và Class Component khác nhau thế nào trong codebase hiện đại?','Function component dùng hooks và là hướng chính hiện nay; class component dùng lifecycle methods và vẫn cần biết để đọc code cũ.',['Class component là cách duy nhất có state.','Function component không thể có lifecycle/effect.','Class luôn nhanh hơn function.'],'useEffect mapping tư duy mount/update/unmount theo dependency.','Sudheer Components'),
  q('react','Core React','Cơ bản','Pure Component nghĩa là gì?','Cùng props/state thì render cùng output và không gây side effect trong render.',['Không được dùng props.','Bắt buộc dùng React.memo.','Không bao giờ render lại.'],'Không gọi API hoặc mutate global trong body component.','Sudheer Pure Components'),
  q('react','Events','Cơ bản','React event handling khác HTML event handling ở đâu?','React dùng camelCase event như onClick và truyền function reference, không truyền string inline handler.',['Viết onclick chữ thường như HTML.','onClick phải là string code.','React event không có preventDefault.'],'<button onClick={handleSave}>Save</button>','Sudheer Events'),
  q('react','Events','Thực tế','Synthetic event trong React là gì?','Synthetic event là wrapper/event system của React giúp API event nhất quán; vẫn dùng target/currentTarget, preventDefault, stopPropagation.',['Event giả không liên quan DOM.','Chỉ dùng trong Redux.','Chỉ chạy ở server.'],'function onChange(e){setValue(e.currentTarget.value)}','Sudheer Synthetic Event'),
  q('react','Rendering Lists','Cơ bản','Key prop trong list có lợi ích gì?','Key giúp React nhận diện item giữa các render để reconcile đúng khi thêm, xóa, sort hoặc reorder.',['Key chỉ dùng để style CSS.','Key nên là Math.random mỗi render.','Key không ảnh hưởng row state.'],'items.map(item => <Row key={item.id} />)','Sudheer Key Prop'),
  q('react','Rendering Lists','Thực tế','Dùng index làm key gây lỗi gì khi list thay đổi thứ tự?','React có thể reuse nhầm component vì index đổi theo vị trí, làm input/local state nhảy sang item khác.',['Index luôn là key tốt nhất.','Index giúp reset state đúng item.','Index làm list nhanh hơn mọi case.'],'Xóa dòng đầu trong list editable có thể làm dòng sau giữ state sai.','React Docs Key'),
  q('react','Virtual DOM','Cơ bản','Virtual DOM là gì?','Là mô hình object mô tả UI trong memory để React tính khác biệt trước khi commit cập nhật DOM thật.',['Là DOM ảo trong DevTools.','Là CSSOM của React.','Là database của React.'],'setState -> render tree mới -> diff -> commit DOM.','Sudheer Virtual DOM'),
  q('react','Reconciliation','Thực tế','Reconciliation trong React là gì?','React so sánh tree mới và cũ để quyết định cập nhật UI dựa trên type, position và key.',['Là quá trình gọi API.','Là compile TypeScript.','Là CSS cascade.'],'Đổi key làm React xem là instance mới và reset state.','Sudheer Reconciliation'),
  q('react','React Fiber','Nâng cao','React Fiber nên hiểu thế nào ở mức phỏng vấn?','Fiber là kiến trúc reconciliation cho phép chia nhỏ work, ưu tiên update và hỗ trợ pause/resume/abort render.',['Fiber là CSS engine.','Fiber là state manager.','Fiber chỉ dùng fetch data.'],'Concurrent features dựa trên scheduling của Fiber.','Sudheer React Fiber'),
  q('react','Forms','Cơ bản','Controlled component là gì?','Input có value/checked được điều khiển bởi React state và cập nhật qua onChange.',['Không cần onChange.','Value nằm trong DOM, React không biết.','Chỉ dùng class component.'],'<input value={name} onChange={e=>setName(e.currentTarget.value)} />','Sudheer Controlled Components'),
  q('react','Forms','Cơ bản','Uncontrolled component là gì và dùng khi nào?','Input lưu value trong DOM, đọc bằng ref/FormData; hợp form đơn giản hoặc thư viện form tối ưu bằng ref.',['Không submit được.','Bắt buộc dùng Redux.','Luôn tốt hơn controlled.'],'<input defaultValue="An" ref={inputRef} />','Sudheer Uncontrolled Components'),
  q('react','React Elements','Nâng cao','createElement và cloneElement khác nhau thế nào?','createElement tạo element mới; cloneElement clone element có sẵn và merge thêm props/children.',['cloneElement tạo DOM node thật.','createElement chỉ dùng class.','Hai cái dùng để gọi API.'],'React.cloneElement(child,{disabled:true})','Sudheer createElement/cloneElement'),
  q('react','State Sharing','Cơ bản','Lifting state up là gì?','Đưa state lên parent chung gần nhất để nhiều child dùng/chỉnh cùng một nguồn dữ liệu nhất quán.',['Đưa mọi state lên Redux.','Đưa state vào localStorage.','Đưa state vào CSS variable.'],'UsersPage giữ keyword cho SearchBox và UserTable.','React Docs'),
  q('react','Patterns','Thực tế','HOC là gì và hiện nay còn dùng khi nào?','HOC là function nhận component và trả component mới để thêm behavior/props; hiện nhiều case thay bằng hook/composition nhưng vẫn gặp trong code cũ.',['Component có z-index cao.','Chỉ dùng để style CSS.','Thay thế useState.'],'const Protected = withAuth(Page)','Sudheer HOC'),
  q('react','Patterns','Thực tế','Render props là gì?','Chia sẻ logic bằng function prop trả UI; hooks thay nhiều case nhưng render props vẫn gặp trong một số library/code cũ.',['Props chỉ chứa string.','Hooks làm render props không chạy.','Chỉ dùng Redux.'],'<Mouse>{pos => <Tooltip x={pos.x}/>}</Mouse>','Sudheer Render Props'),
  q('react','Children','Cơ bản','children prop dùng để làm gì?','Cho phép component nhận nội dung lồng bên trong và compose UI linh hoạt.',['Chỉ là string.','Bắt buộc là một element duy nhất.','Dùng để truyền CSS file.'],'<Card><UserInfo /></Card>','Sudheer children'),
  q('react','Fragments','Cơ bản','Fragment dùng để làm gì?','Nhóm nhiều element mà không thêm DOM node thừa, tránh phá layout/table/flex.',['Tạo div ẩn.','Không dùng được trong map.','Tự thêm key cho list.'],'<> <dt>Name</dt><dd>An</dd> </>','Sudheer Fragments'),
  q('react','Fragments','Thực tế','Khi map list và trả Fragment cần chú ý gì?','Nếu Fragment nằm trong list cần key, phải dùng <React.Fragment key={id}> vì shorthand <> không nhận key.',['Fragment không cần key.','Math.random là key tốt nhất.','Fragment tự lấy key từ children.'],'items.map(item => <React.Fragment key={item.id}>...</React.Fragment>)','React Docs'),
  q('react','Portals','Thực tế','Portal dùng khi nào trong React?','Render children vào DOM node khác như document.body, hợp modal, tooltip, dropdown, toast để tránh overflow/z-index parent.',['Tách khỏi React tree hoàn toàn.','Tự xử lý mọi accessibility.','Chỉ dùng Server Component.'],'createPortal(<Modal />, document.body)','Sudheer Portals'),
  q('react','Security','Thực tế','dangerouslySetInnerHTML dùng khi nào và rủi ro gì?','Dùng render HTML string khi thật sự cần, nhưng phải sanitize vì XSS nếu HTML không tin cậy.',['Tự sanitize HTML.','Dùng thay JSX cho nhanh.','Không có rủi ro bảo mật.'],'DOMPurify.sanitize(html) trước khi render.','Sudheer / OWASP XSS'),
  q('react','Styling','Cơ bản','Inline style trong React khác HTML style như thế nào?','React inline style nhận object với camelCase property, không phải CSS string.',['style nhận chuỗi CSS như HTML.','Dùng kebab-case.','Tự thêm mọi vendor prefix.'],'<div style={{backgroundColor:"red", padding:12}} />','Sudheer Styles'),
  q('react','React DOM','Cơ bản','React và ReactDOM khác nhau thế nào?','React chứa API core component/hooks/element; ReactDOM render/hydrate React tree vào DOM browser.',['ReactDOM chứa useState.','Hai package giống nhau.','ReactDOM chỉ dùng backend.'],'createRoot(root).render(<App />)','Sudheer React vs ReactDOM'),
  q('react','SSR','Thực tế','ReactDOMServer dùng để làm gì?','Render React component thành HTML string/stream ở server, nền tảng cho SSR.',['Render vào localStorage.','Thay Redux.','Chỉ dùng CSS-in-JS.'],'renderToString hoặc streaming SSR.','Sudheer ReactDOMServer'),
  q('react','Conditional Rendering','Cơ bản','Conditional rendering trong React thường viết bằng cách nào?','Dùng if trước return, ternary, &&, switch/map object tùy độ phức tạp; tránh JSX quá rối.',['Chỉ dùng if trực tiếp trong JSX.','Không thể render null.','Chỉ dùng CSS display none.'],'isLoading ? <Spinner/> : <Content/>','Sudheer Conditional Rendering'),
  q('react','Props','Thực tế','Vì sao cần cẩn thận khi spread props xuống DOM element?','Có thể truyền nhầm prop không hợp lệ/nhạy cảm xuống DOM, gây warning, leak data hoặc override handler/className.',['Spread luôn an toàn hơn.','React tự loại mọi prop nhạy cảm.','Spread làm component không render.'],'<button {...buttonProps} /> cần kiểm soát props.','Sudheer Spread props'),
  q('react','Hooks','Thực tế','Rules of Hooks là gì?','Chỉ gọi hooks ở top-level function component/custom hook, không gọi trong if/loop/nested function để giữ đúng thứ tự hooks.',['Gọi hooks ở đâu cũng được.','Hooks chỉ gọi trong useEffect.','Rules chỉ áp dụng production.'],'Không viết if (open) useEffect(...).','React Rules of Hooks'),
  q('react','Refs','Thực tế','Khi nào dùng useRef thay vì useState?','Dùng ref cho giá trị mutable cần giữ qua render nhưng không cần render UI, như DOM node, timer id, previous value.',['Dùng ref cho mọi data hiển thị.','Đổi ref.current làm re-render.','useRef chỉ dùng class.'],'const inputRef=useRef(null); inputRef.current?.focus();','React useRef'),
  q('react','Error Handling','Nâng cao','Error Boundary hiện tại thường viết bằng gì?','API chính thức dựa trên class lifecycle getDerivedStateFromError/componentDidCatch hoặc dùng wrapper như react-error-boundary.',['Bắt buộc dùng useEffect.','Bắt buộc dùng Redux.','Không dùng được React hiện đại.'],'class ErrorBoundary extends React.Component { componentDidCatch(){} }','React Error Boundaries'),
];

const EXTRA_ROWS = [
  q('js-ts','JavaScript Runtime','Thực tế','setTimeout trong loop với var và let khác nhau thế nào?','var là function-scoped nên callback có thể thấy cùng một i cuối; let tạo binding riêng mỗi vòng lặp.',['let và var giống nhau trong loop.','setTimeout luôn capture value tại thời điểm khai báo.','var tạo block scope riêng.'],'for(var i=0;i<3;i++) setTimeout(()=>console.log(i)); // 3 3 3','MDN Closures'),
  q('js-ts','JavaScript Runtime','Thực tế','Closure là gì và gây bug stale state thế nào trong React?','Closure là function nhớ scope nơi nó được tạo; trong React callback/effect có thể giữ state cũ nếu dependency sai.',['Closure chỉ có trong backend.','Closure tự cập nhật state mới nhất.','Closure là lỗi memory luôn luôn.'],'setInterval đọc count cũ nếu effect thiếu dependency/updater.','MDN Closures / React Effects'),
  q('js-ts','JavaScript Array','Thực tế','toSorted khác sort ở điểm nào?','toSorted trả array mới không mutate, còn sort mutate array gốc.',['toSorted mutate mạnh hơn sort.','sort không mutate.','toSorted chỉ dùng string.'],'const sorted = users.toSorted((a,b)=>a.name.localeCompare(b.name));','MDN Array toSorted'),
  q('js-ts','TypeScript React','Thực tế','React.ReactNode khác JSX.Element thế nào khi type children?','ReactNode rộng hơn, gồm string, number, null, element, array; JSX.Element hẹp hơn.',['JSX.Element rộng hơn ReactNode.','ReactNode chỉ là string.','Cả hai là DOM thật.'],'type Props={children: React.ReactNode}','React TypeScript'),
  q('js-ts','TypeScript React','Thực tế','ComponentPropsWithoutRef<"button"> dùng khi nào?','Lấy props native của button trừ ref, hữu ích khi build design-system Button wrapper.',['Dùng để gọi API.','Dùng để validate CSS.','Chỉ dùng với Redux.'],'type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {variant?:"primary"};','React TypeScript'),
  q('state','Context Performance','Thực tế','Context value object mới mỗi render gây vấn đề gì?','Consumers có thể re-render vì value reference đổi; nên memoize hoặc tách context state/dispatch.',['Context tự deep memo.','Object mới không ảnh hưởng render.','Chỉ Redux có re-render.'],'const value = useMemo(()=>({user,setUser}),[user]);','React Context'),
  q('state','Redux Toolkit','Thực tế','useSelector trả object mới mỗi lần gây gì?','Component có thể re-render mỗi store update vì useSelector mặc định so sánh === reference.',['React Redux deep compare mọi object.','Không ảnh hưởng render.','useSelector chỉ chạy một lần.'],'useSelector(s=>({name:s.user.name}), shallowEqual)','React Redux'),
  q('state','Zustand','Thực tế','Zustand persist cần partialize khi nào?','Khi chỉ muốn lưu theme/cart/draft, tránh lưu secret, action, cache lớn hoặc dữ liệu user-specific.',['Persist toàn store luôn tốt.','Không cần version/migrate.','Lưu function vào localStorage là bình thường.'],'persist(store,{partialize:s=>({theme:s.theme})})','Zustand Persist'),
  q('tanstack-axios','TanStack Query','Thực tế','placeholderData khác initialData ở đâu?','initialData đưa vào cache như data thật ban đầu; placeholderData chỉ là data tạm trong lúc query đang fetch.',['Hai cái giống nhau hoàn toàn.','placeholderData persist cache vĩnh viễn.','initialData không liên quan cache.'],'placeholderData: keepPreviousData khi đổi page.','TanStack Query'),
  q('tanstack-axios','TanStack Query','Thực tế','select trong useQuery dùng để làm gì?','Transform data cho component đọc mà vẫn giữ cache source theo query, giúp UI nhận shape cần dùng.',['select thay queryFn.','select mutate server data.','select chỉ dùng mutation.'],'useQuery({queryKey, queryFn, select:data=>data.items})','TanStack Query'),
  q('tanstack-axios','TanStack Query','Thực tế','isLoading và isFetching khác nhau thế nào?','isLoading thường true khi chưa có data lần đầu; isFetching true khi đang fetch kể cả background refetch.',['Hai cái giống nhau.','isFetching chỉ dùng mutation.','isLoading true mỗi lần refetch nền.'],'Hiển thị skeleton lần đầu, spinner nhỏ khi background fetching.','TanStack Query'),
  q('tanstack-axios','TanStack Query','Nâng cao','prefetchQuery/ensureQueryData dùng khi nào?','Chuẩn bị data trước khi vào route hoặc đảm bảo cache có data trong loader để UI nhanh hơn.',['Chỉ dùng để POST data.','Dùng thay mutation.','Không liên quan router.'],'loader: queryClient.ensureQueryData(userQueryOptions(id))','TanStack Query/Router'),
  q('tanstack-axios','TanStack Router','Nâng cao','route context trong TanStack Router giúp gì?','Inject dependency như queryClient/auth vào beforeLoad/loader mà không import global tùy tiện.',['Context chỉ dùng CSS.','Context chỉ là React Context.','Không dùng được trong loader.'],'createRouter({ routeTree, context:{ queryClient } })','TanStack Router'),
  q('tanstack-axios','Axios','Thực tế','Axios response interceptor normalize error như thế nào cho UI?','Map error response về shape thống nhất như status, code, message, fieldErrors để component xử lý nhất quán.',['Throw nguyên mọi object không cần chuẩn hóa.','Trả undefined cho mọi lỗi.','Chỉ alert lỗi trong interceptor.'],'throw normalizeApiError(error)','Axios Interceptors'),
  q('rendering','Rendering Strategy','Thực tế','Dashboard admin sau login thường chọn CSR/SSR/SSG thế nào?','Thường CSR hoặc SSR auth-aware tùy requirement; không dùng SSG cho data private theo từng user.',['Luôn SSG vì nhanh nhất.','Luôn ISR cho mọi user private.','Rendering strategy không liên quan auth.'],'Admin users list cần auth và data theo permission.','Rendering Architecture'),
  q('rendering','Hydration','Nâng cao','useId giúp gì trong SSR hydration?','Tạo id ổn định giữa server và client cho label/input/aria, tránh mismatch id random.',['Dùng làm key list data.','Tạo id database.','Chỉ dùng CSS.'],'const id=useId(); <label htmlFor={id}>Email</label>','React useId'),
  q('rendering','Build & Deploy','Thực tế','Vite base path sai gây lỗi gì khi deploy GitHub Pages?','Asset JS/CSS có thể 404 nếu app deploy dưới subpath mà base không cấu hình đúng.',['Chỉ ảnh hưởng TypeScript.','Không ảnh hưởng asset.','Chỉ lỗi khi dùng Redux.'],'base: "/fe-react-interview-quiz/" nếu deploy dưới repo path.','Vite base'),
  q('git-build-security','Git Workflow','Thực tế','force push an toàn hơn bằng lệnh nào?','Dùng --force-with-lease để tránh ghi đè commit người khác vừa push lên remote.',['Dùng --force mọi lúc.','Không bao giờ cần fetch trước force.','force push main là bình thường.'],'git push --force-with-lease origin feature/a','Git Docs'),
  q('git-build-security','Git Workflow','Thực tế','git reflog dùng khi nào?','Xem lịch sử di chuyển HEAD để cứu commit/branch vừa reset/rebase nhầm trên local.',['Dùng để merge PR.','Dùng để format code.','Dùng để deploy GitHub Pages.'],'git reflog -> git checkout <sha>','Git Reflog'),
  q('git-build-security','Security','Thực tế','Token để trong localStorage có rủi ro gì?','Nếu XSS xảy ra, script độc hại có thể đọc token; cần threat model, CSP, sanitize và auth strategy phù hợp.',['localStorage luôn an toàn tuyệt đối.','HttpOnly cookie luôn không cần CSRF.','FE lưu token không liên quan security.'],'Không render HTML user input chưa sanitize.','OWASP'),
  q('html-css','CSS Selector','Thực tế',':has() selector dùng được cho case nào?','Chọn parent dựa trên child condition, giúp style form/card khi bên trong có trạng thái nhất định.',['Chỉ dùng JS runtime.','Tạo DOM node mới.','Thay thế mọi media query.'],'form:has(input:invalid){...}','MDN :has'),
  q('html-css','Responsive','Thực tế','Container query khác media query ở đâu?','Media query theo viewport; container query theo kích thước container, hợp component reusable.',['Container query theo server width.','Hai cái giống nhau.','Container query chỉ cho Grid.'],'@container (min-width: 400px){...}','MDN Container Queries'),
  q('project','Project Interview','Thực tế','Khi bị hỏi feature khó nhất, trả lời theo cấu trúc nào?','Bối cảnh, vấn đề, giải pháp, trade-off, kết quả/impact và bài học.',['Chỉ liệt kê thư viện.','Nói càng nhiều buzzword càng tốt.','Tránh nói trade-off.'],'Tối ưu table 10k rows: đo Profiler, virtualization, giảm DOM nodes.','STAR Interview'),
];

const ALL_ROWS = [...PRACTICAL_QUESTIONS, ...SUDHEER_REACT_ROWS, ...EXTRA_ROWS];
const alphabet = ['A', 'B', 'C', 'D'];

function buildQuestion(row, index) {
  const [area, topic, level, question, correct, wrongsRaw, example, source] = row;
  const wrongs = String(wrongsRaw || '').split('|').filter(Boolean);
  const fallback = ['Câu trả lời này quá chung và không nêu được trade-off.', 'Cách này không đúng với docs hoặc dễ tạo bug thực tế.', 'Đây là cách học thuộc nhưng không giải quyết case dự án.'];
  const options = [correct, ...(wrongs.length >= 3 ? wrongs : fallback)].slice(0, 4);
  const shift = (index * 5 + question.length) % 4;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return { id: index + 1, area, topic, level, question, correct, options: rotated, answer: rotated.indexOf(correct), example, source };
}

const QUESTIONS = ALL_ROWS.map(buildQuestion);

function levelClass(level) {
  if (level === 'Cơ bản') return 'bg-blue-600 text-white';
  if (level === 'Thực tế') return 'bg-emerald-600 text-white';
  return 'bg-violet-600 text-white';
}

function scoreLabel(percent) {
  if (percent >= 85) return 'Rất ổn - có thể luyện trả lời sâu theo ví dụ.';
  if (percent >= 70) return 'Khá tốt - xem kỹ phần sai và nguồn docs.';
  if (percent >= 50) return 'Có nền nhưng cần ôn lại phần hỏi sâu.';
  return 'Nên ôn lại từng nhóm trước khi phỏng vấn.';
}

export default function AppMega() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [area, setArea] = useState('all');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* noop */ }
  }, [answers]);

  const areaQuestions = useMemo(() => area === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.area === area), [area]);
  const topics = useMemo(() => ['all', ...Array.from(new Set(areaQuestions.map(q => q.topic)))], [areaQuestions]);
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter(q => {
      const selected = answers[q.id];
      const topicOk = topic === 'all' || q.topic === topic;
      const modeOk = mode === 'all' || (mode === 'unanswered' && selected === undefined) || (mode === 'wrong' && selected !== undefined && selected !== q.answer) || (mode === 'correct' && selected === q.answer);
      const text = `${q.area} ${q.topic} ${q.level} ${q.question} ${q.correct} ${q.example} ${q.source}`.toLowerCase();
      return topicOk && modeOk && (!keyword || text.includes(keyword));
    });
  }, [answers, areaQuestions, mode, search, topic]);

  const counts = useMemo(() => AREAS.reduce((acc, item) => {
    acc[item.id] = item.id === 'all' ? QUESTIONS.length : QUESTIONS.filter(q => q.area === item.id).length;
    return acc;
  }, {}), []);

  const result = useMemo(() => {
    const correct = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0);
    return { correct, total: QUESTIONS.length, percent: Math.round((correct / QUESTIONS.length) * 100) };
  }, [answers]);

  const answeredCount = Object.keys(answers).length;

  function choose(id, index) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: index }));
  }

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

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#10131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black text-slate-950">FE</div>
          <div>
            <div className="font-black leading-tight">FE React Interview Quiz</div>
            <div className="text-xs text-slate-400">Một bank duy nhất: Sudheer React + JS/TS + Axios/TanStack + Rendering + Git</div>
          </div>
          <div className="ml-auto hidden w-full max-w-md rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 md:block">
            <input value={search} onChange={e => setSearch(e.currentTarget.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Tìm Fiber, cloneElement, TanStack Query, rebase..." />
          </div>
          {!submitted ? <button onClick={() => setSubmitted(true)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500">Nộp bài</button> : <button onClick={resetQuiz} className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Làm lại</button>}
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl md:grid-cols-[300px_1fr]">
        <aside className="hidden border-r border-white/10 md:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4">
            <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tiến độ</div>
              <div className="mt-2 text-3xl font-black">{answeredCount}/{QUESTIONS.length}</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, (answeredCount / QUESTIONS.length) * 100)}%` }} /></div>
            </div>
            <div className="space-y-1">{AREAS.map(item => <button key={item.id} onClick={() => { setArea(item.id); setTopic('all'); }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${area === item.id ? 'bg-blue-600/25 text-blue-100 ring-1 ring-blue-400/30' : 'text-slate-300 hover:bg-white/5'}`}><span className="text-lg">{item.icon}</span><span className="flex-1 font-semibold">{item.label}</span><span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{counts[item.id]}</span></button>)}</div>
          </div>
        </aside>

        <main className="min-w-0 px-3 py-5 md:px-8">
          <section className="mb-5 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-500/10 p-5 md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">Đã gộp thành một bank duy nhất — không còn tab làm chỉ thấy 182 câu</div>
                <h1 className="text-2xl font-black md:text-4xl">Ôn phỏng vấn FE React 2.5+ năm</h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">Mỗi câu tập trung vào cách nhà tuyển dụng hỏi thật: hiểu khái niệm, bug thực tế, trade-off, khi nào dùng và ví dụ code.</p>
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
              <select value={area} onChange={e => { setArea(e.currentTarget.value); setTopic('all'); }} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none">{AREAS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
              <select value={topic} onChange={e => setTopic(e.currentTarget.value)} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none">{topics.map(t => <option key={t} value={t}>{t === 'all' ? 'Chủ đề: Tất cả' : t}</option>)}</select>
              <select value={mode} onChange={e => setMode(e.currentTarget.value)} className="rounded-xl border border-white/10 bg-[#191b24] px-3 py-2 text-sm outline-none"><option value="all">Trạng thái: Tất cả</option><option value="unanswered">Chưa làm</option><option value="wrong">Câu sai</option><option value="correct">Câu đúng</option></select>
            </div>
            <div className="mt-3 text-sm text-slate-400">Hiển thị <b className="text-white">{filtered.length}</b>/<b className="text-white">{QUESTIONS.length}</b> câu</div>
          </div>

          <div className="space-y-4">
            {filtered.map(q => {
              const selected = answers[q.id];
              const hasAnswered = selected !== undefined;
              const isCorrect = selected === q.answer;
              const showFeedback = hasAnswered || submitted;
              return <article key={q.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#171922] shadow-xl shadow-black/20">
                <div className="border-b border-white/10 bg-white/[0.03] p-4 md:p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-slate-500">#{q.id}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${levelClass(q.level)}`}>{q.level}</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">{q.topic}</span>{hasAnswered && <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${isCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'}`}>{isCorrect ? 'Đúng' : 'Sai'}</span>}</div>
                  <h2 className="text-base font-black leading-7 md:text-xl">{q.question}</h2>
                </div>
                <div className="p-4 md:p-5">
                  <div className="grid gap-3 md:grid-cols-2">{q.options.map((option, index) => { let cls = 'border-white/10 bg-[#0f1118] hover:border-blue-400/60 hover:bg-blue-500/10'; if (showFeedback && index === q.answer) cls = 'border-emerald-400/70 bg-emerald-500/10 text-emerald-100'; if (showFeedback && selected === index && selected !== q.answer) cls = 'border-rose-400/70 bg-rose-500/10 text-rose-100'; return <button key={`${q.id}-${index}`} onClick={() => choose(q.id, index)} className={`flex min-h-[76px] gap-3 rounded-2xl border p-3 text-left text-sm leading-6 transition ${cls}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-black">{alphabet[index]}</span><span>{option}</span></button>; })}</div>
                  {showFeedback && <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f1118] p-4 text-sm leading-7 text-slate-300">{hasAnswered && <p><b className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>Bạn chọn:</b> {q.options[selected]}</p>}<p><b className="text-blue-300">Đáp án đúng:</b> {q.correct}</p><p className="mt-2"><b className="text-white">Giải thích:</b> {q.correct}</p><div className="mt-3 overflow-x-auto rounded-xl bg-black/30 px-3 py-2 font-mono text-xs text-cyan-100"><b className="font-sans text-cyan-300">Ví dụ:</b> {q.example}</div><p className="mt-2 text-xs text-slate-500">Nguồn định hướng: {q.source}</p></div>}
                </div>
              </article>;
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
