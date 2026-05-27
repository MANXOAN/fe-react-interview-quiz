import React, { useEffect, useMemo, useState } from 'react';
import { PRACTICAL_QUESTIONS } from './practicalQuestions.js';

const STORAGE_KEY = 'fe-react-practical-sudheer-v1';

const AREAS = [
  { id: 'all', label: 'Tất cả', icon: '✨' },
  { id: 'react', label: 'React / Sudheer', icon: '⚛️' },
  { id: 'js-ts', label: 'JavaScript / TypeScript', icon: '🟨' },
  { id: 'tanstack-axios', label: 'Axios / TanStack', icon: '🔌' },
  { id: 'state', label: 'State Management', icon: '🧠' },
  { id: 'rendering', label: 'Rendering / Build', icon: '🚀' },
  { id: 'git-build-security', label: 'Git / Security', icon: '🛠️' },
  { id: 'html-css', label: 'HTML/CSS', icon: '🌐' },
];

const SUDHEER_REACT_QUESTIONS = [
  ['react','Core React','Cơ bản','React là gì? Trả lời sao để không chỉ nói là thư viện UI?','React là thư viện JavaScript để xây UI theo component, declarative rendering và one-way data flow; điểm mạnh là chia UI thành component tái sử dụng và cập nhật UI theo state.','React là framework full-stack có sẵn router/API/database.|React chỉ là template engine giống HTML.|React tự giải quyết toàn bộ CSS/backend.','function UserCard({ user }) { return <div>{user.name}</div>; }','Sudheer React Q1 / React Docs'],
  ['react','Core React','Cơ bản','JSX là gì và vì sao dùng className thay vì class?','JSX là cú pháp mô tả UI trong JavaScript và được compile thành React element; className dùng theo DOM property/React convention vì class là keyword trong JS.','JSX là HTML thật chạy trực tiếp trong browser.|className tự động tạo CSS module.|JSX chỉ dùng được trong Next.js.','<button className="primary">Save</button>','Sudheer React JSX / React Docs'],
  ['react','Core React','Cơ bản','Element và Component khác nhau thế nào?','Element là object mô tả UI cần render; Component là function/class nhận props và trả element.','Component là DOM node thật, Element là CSS class.|Element có state còn Component không có state.|Hai khái niệm giống hệt nhau.','const el = <Button />; function Button(){ return <button/> }','Sudheer React Element vs Component'],
  ['react','Core React','Cơ bản','Function Component và Class Component khác nhau thế nào trong codebase hiện đại?','Function component dùng hooks để quản lý state/effect và là hướng chính hiện nay; class component dùng lifecycle methods và vẫn cần biết để đọc code cũ.','Class component là cách duy nhất dùng state.|Function component không thể có lifecycle/effect.|Class component chạy nhanh hơn mọi trường hợp.','useEffect tương ứng tư duy componentDidMount/Update/Unmount theo dependency.','Sudheer React Components / React Docs'],
  ['react','Core React','Cơ bản','Pure Component nghĩa là gì?','Component pure là cùng props/state thì render cùng output và không gây side effect trong render.','Component không được dùng props.|Component bắt buộc dùng React.memo.|Component không bao giờ render lại.','Không gọi API, analytics hoặc mutate global trong body component.','Sudheer Pure Components / React Docs'],
  ['react','Core React','Cơ bản','Props và state khác nhau thế nào trong component?','Props là input từ parent và readonly với child; state là dữ liệu nội bộ component, update qua setter và làm render lại.','Props dùng cho dữ liệu nội bộ, state truyền từ parent.|Cả hai đều mutate trực tiếp.|State đổi không ảnh hưởng UI.','function Card({ user }) { const [open, setOpen] = useState(false); }','Sudheer Props vs State / React Docs'],
  ['react','Events','Cơ bản','React event handling khác HTML event handling ở đâu?','React dùng camelCase event như onClick và truyền function reference, không truyền string HTML inline handler.','React event viết onclick chữ thường như HTML.|onClick phải là string code.|React event không nhận preventDefault.','<button onClick={handleSave}>Save</button>','Sudheer React Events / React Docs'],
  ['react','Events','Thực tế','Synthetic event trong React là gì?','Synthetic event là wrapper/event system của React giúp API event nhất quán; trong handler vẫn dùng target/currentTarget, preventDefault, stopPropagation.','Event giả không liên quan DOM.|Chỉ dùng trong Redux.|Chỉ chạy ở server.','function onChange(e){ setValue(e.currentTarget.value); }','Sudheer Synthetic Events / React Docs'],
  ['react','Rendering Lists','Cơ bản','Key prop trong list có lợi ích gì?','Key giúp React nhận diện item giữa các lần render để reconcile đúng khi thêm, xóa, sort hoặc reorder.','Key chỉ dùng để style CSS.|Key phải là Math.random để unique mỗi render.|Key không ảnh hưởng local state của row.','items.map(item => <Row key={item.id} item={item} />)','Sudheer Key prop / React Docs'],
  ['react','Rendering Lists','Thực tế','Dùng index làm key gây lỗi gì khi list thay đổi thứ tự?','Index thay đổi theo vị trí nên React có thể reuse nhầm component, làm input/local state nhảy sang item khác.','Index luôn là key tốt nhất.|Index giúp React reset state đúng item.|Index làm list render nhanh hơn mọi trường hợp.','List todo có input edit, xóa dòng đầu khiến dòng sau giữ state sai.','Sudheer Index as key / React Docs'],
  ['react','Virtual DOM','Cơ bản','Virtual DOM là gì?','Virtual DOM là mô hình object mô tả UI trong memory để React tính toán khác biệt trước khi commit cập nhật DOM thật.','Virtual DOM là DOM ảo trong browser devtools.|Virtual DOM thay CSSOM.|Virtual DOM là database của React.','setState -> render new tree -> diff/reconcile -> commit DOM.','Sudheer Virtual DOM'],
  ['react','Virtual DOM','Thực tế','Reconciliation trong React là gì?','Reconciliation là quá trình React so sánh tree mới và cũ để quyết định cập nhật UI tối thiểu dựa trên type, position và key.','Là quá trình gọi API.|Là quá trình compile TypeScript.|Là CSS cascade của React.','Đổi key làm React xem là instance mới và reset state.','Sudheer Reconciliation / React Docs'],
  ['react','React Fiber','Nâng cao','React Fiber là gì ở mức phỏng vấn nên hiểu thế nào?','Fiber là kiến trúc reconciliation của React cho phép chia nhỏ công việc render, ưu tiên update, pause/resume/abort work để UI responsive hơn.','Fiber là CSS engine của React.|Fiber là thư viện state management.|Fiber chỉ dùng để fetch data.','Concurrent features dựa trên khả năng scheduling của Fiber.','Sudheer React Fiber'],
  ['react','Forms','Cơ bản','Controlled component là gì?','Input controlled có value/checked được điều khiển bởi React state và cập nhật qua onChange.','Input controlled không cần onChange.|Controlled value nằm trong DOM, React không biết.|Controlled chỉ dùng cho class component.','<input value={name} onChange={e => setName(e.currentTarget.value)} />','Sudheer Controlled Components'],
  ['react','Forms','Cơ bản','Uncontrolled component là gì và dùng khi nào?','Uncontrolled input lưu value trong DOM, thường đọc bằng ref/FormData; hợp form đơn giản hoặc thư viện form tối ưu bằng ref.','Uncontrolled input không submit được.|Uncontrolled bắt buộc dùng Redux.|Uncontrolled an toàn hơn mọi controlled input.','<input defaultValue="An" ref={inputRef} />','Sudheer Uncontrolled Components'],
  ['react','Forms','Thực tế','defaultValue khác value trong React input thế nào?','defaultValue chỉ set giá trị ban đầu cho uncontrolled input; value biến input thành controlled và phải đi cùng onChange.','defaultValue cập nhật mỗi render như value.|value chỉ dùng cho checkbox.|Hai cái giống nhau.','Edit form async data thường cần reset form thay vì mong defaultValue tự đổi.','React Docs / Forms'],
  ['react','React Elements','Nâng cao','createElement và cloneElement khác nhau thế nào?','createElement tạo React element mới từ type/props/children; cloneElement clone element có sẵn và merge thêm props/children.','cloneElement tạo DOM node thật.|createElement chỉ dùng cho class component.|Hai cái dùng để gọi API.','React.cloneElement(child, { disabled: true })','Sudheer createElement vs cloneElement'],
  ['react','State Sharing','Cơ bản','Lifting state up là gì?','Đưa state lên parent chung gần nhất để nhiều child dùng/chỉnh cùng một nguồn dữ liệu nhất quán.','Đưa toàn bộ state lên Redux.|Đưa state vào localStorage.|Đưa state vào CSS variable.','SearchBox và UserTable cùng dùng keyword thì UsersPage giữ keyword.','Sudheer Lifting State Up / React Docs'],
  ['react','Patterns','Thực tế','HOC là gì và hiện nay còn dùng khi nào?','Higher-Order Component là function nhận component và trả component mới để thêm behavior/props; hiện nhiều case thay bằng custom hook/composition nhưng vẫn gặp trong code cũ/library.','HOC là component có z-index cao.|HOC chỉ dùng để style CSS.|HOC thay thế useState.','const Protected = withAuth(Page);','Sudheer Higher-Order Components'],
  ['react','Patterns','Thực tế','Render props là gì và hooks có thay thế hoàn toàn không?','Render props chia sẻ logic bằng function prop trả UI; hooks thay nhiều case nhưng render props vẫn xuất hiện trong một số library/pattern cũ.','Render props là props chỉ chứa string.|Hooks làm render props không thể chạy.|Render props chỉ dùng Redux.','<Mouse>{pos => <Tooltip x={pos.x} />}</Mouse>','Sudheer Render Props / Hooks'],
  ['react','Children','Cơ bản','children prop dùng để làm gì?','children cho phép component nhận nội dung lồng bên trong và compose UI linh hoạt.','children chỉ là string.|children bắt buộc là một element duy nhất.|children dùng để truyền CSS file.','<Card><UserInfo /></Card>','Sudheer children prop / React Docs'],
  ['react','Fragments','Cơ bản','Fragment dùng để làm gì và tốt hơn div bọc thừa ở đâu?','Fragment nhóm nhiều element mà không thêm DOM node thừa, giúp markup sạch và tránh phá layout/table/flex.','Fragment tạo div ẩn.|Fragment không dùng được trong map.|Fragment tự thêm key cho list.','<> <dt>Name</dt><dd>An</dd> </>','Sudheer Fragments'],
  ['react','Fragments','Thực tế','Khi map list và trả Fragment cần chú ý gì?', 'Nếu Fragment nằm trong list cần key, phải dùng <React.Fragment key={id}> vì shorthand <> không nhận key.', 'Fragment không cần key trong list.|Dùng Math.random làm key là tốt nhất.|Fragment tự lấy key từ children.', 'items.map(item => <React.Fragment key={item.id}>...</React.Fragment>)', 'React Docs Fragment'],
  ['react','Portals','Thực tế','Portal dùng khi nào trong React?','Portal render children vào DOM node khác như document.body, hợp modal, tooltip, dropdown, toast để tránh overflow/z-index parent.','Portal tách khỏi React tree hoàn toàn.|Portal tự xử lý mọi accessibility.|Portal chỉ dùng cho server component.','createPortal(<Modal />, document.body)','Sudheer Portals / React Docs'],
  ['react','Security','Thực tế','dangerouslySetInnerHTML dùng khi nào và rủi ro gì?','Dùng để render HTML string khi thật sự cần, nhưng phải sanitize vì rủi ro XSS rất cao nếu HTML đến từ user/API không tin cậy.','Nó tự sanitize HTML.|Dùng nó thay JSX cho nhanh.|Không có rủi ro bảo mật.','DOMPurify.sanitize(html) trước khi render HTML user-generated.','Sudheer innerHTML / OWASP XSS'],
  ['react','Styling','Cơ bản','Inline style trong React viết khác HTML style như thế nào?','React inline style nhận object với camelCase property và value string/number, không phải CSS string.','style nhận chuỗi CSS y như HTML.|Dùng kebab-case như background-color.|Inline style tự thêm vendor prefix mọi thứ.','<div style={{ backgroundColor: "red", padding: 12 }} />','Sudheer Styles in React'],
  ['react','React DOM','Cơ bản','React và ReactDOM khác nhau thế nào?','React chứa API core component/hooks/element; ReactDOM chịu trách nhiệm render/hydrate React tree vào DOM browser.','ReactDOM chứa useState còn React chứa document API.|Hai package giống nhau.|ReactDOM chỉ dùng backend.','createRoot(document.getElementById("root")).render(<App />)','Sudheer React vs ReactDOM'],
  ['react','SSR','Thực tế','ReactDOMServer dùng để làm gì?','ReactDOMServer render React component thành HTML string/stream ở server, nền tảng cho SSR.','Dùng để render component vào localStorage.|Dùng để thay Redux.|Dùng để chạy CSS-in-JS client only.','renderToString hoặc streaming SSR trong server framework.','Sudheer ReactDOMServer'],
  ['react','Performance','Thực tế','Làm sao memoize một component và khi nào nên làm?', 'Dùng React.memo cho function component khi props thường không đổi và render component tương đối tốn chi phí; đo trước bằng Profiler là tốt nhất.', 'Bọc mọi component bằng memo luôn tốt.|memo deep compare mọi prop miễn phí.|memo cache API response.', 'export default React.memo(UserRow);', 'Sudheer memoization / React Docs'],
  ['react','Conditional Rendering','Cơ bản','Conditional rendering trong React thường viết bằng cách nào?', 'Dùng if trước return, ternary, &&, switch/map object tùy độ phức tạp; tránh làm JSX quá rối.', 'Chỉ có thể dùng if trực tiếp bên trong JSX.|Không thể render null.|Chỉ dùng CSS display none.', 'isLoading ? <Spinner /> : <Content />', 'Sudheer Conditional Rendering'],
  ['react','Conditional Rendering','Thực tế','Dùng && với số 0 trong JSX có lỗi gì?', 'Nếu vế trái là 0, React có thể render số 0 ra UI; nên ép điều kiện boolean rõ ràng.', '&& không dùng được trong JSX.|React luôn bỏ qua số 0.|Dùng && sẽ unmount toàn app.', '{items.length > 0 && <List />}', 'React Docs Conditional Rendering'],
  ['react','Props','Thực tế','Vì sao cần cẩn thận khi spread props xuống DOM element?', 'Có thể truyền nhầm prop không hợp lệ/nhạy cảm xuống DOM, gây warning, leak data hoặc override handler/className ngoài ý muốn.', 'Spread props luôn an toàn hơn khai báo rõ.|React tự loại mọi prop nhạy cảm.|Spread props làm component không render.', '<button type="button" {...buttonProps} /> cần kiểm soát props được truyền.', 'Sudheer Spread props'],
  ['react','Naming','Cơ bản','Vì sao tên React component nên bắt đầu bằng chữ hoa?', 'React xem tag viết thường là DOM tag như div/span, còn viết hoa là component custom.', 'Viết hoa để CSS đẹp hơn.|Viết thường vẫn luôn là component.|Chữ hoa giúp component tự memo.', '<UserCard /> là component, <userCard /> bị hiểu như custom DOM tag.', 'Sudheer Component naming'],
  ['react','Hooks','Thực tế','Hooks có thay thế render props và HOC không?', 'Hooks thay nhiều use case chia sẻ logic, nhưng không thay hoàn toàn composition/HOC/render props; vẫn cần hiểu để đọc code cũ và dùng library.', 'Hooks làm HOC không thể chạy.|Hooks thay cả component composition.|Hooks chỉ dùng cho class component.', 'useAuth() thường gọn hơn withAuth, nhưng withAuth vẫn gặp trong code cũ.', 'Sudheer Hooks vs HOC'],
  ['react','Hooks','Thực tế','Rules of Hooks là gì?', 'Chỉ gọi hooks ở top-level của function component/custom hook và không gọi trong if/loop/nested function để React giữ đúng thứ tự hooks.', 'Có thể gọi hooks ở bất kỳ đâu nếu tên bắt đầu use.|Hooks chỉ được gọi trong useEffect.|Rules chỉ áp dụng production.', 'Không viết if (open) useEffect(...).', 'React Rules of Hooks'],
  ['react','Refs','Thực tế','Khi nào dùng useRef thay vì useState?', 'Dùng ref cho giá trị mutable cần giữ qua render nhưng không cần render lại UI, như DOM node, timer id, previous value.', 'Dùng ref cho mọi data hiển thị UI.|Đổi ref.current làm component render lại.|useRef chỉ dùng class component.', 'const inputRef = useRef(null); inputRef.current?.focus();', 'React useRef'],
  ['react','Effects','Thực tế','Cleanup function trong useEffect chạy khi nào?', 'Chạy trước effect kế tiếp và khi component unmount, dùng để dọn listener, timer, subscription, request.', 'Chỉ chạy khi reload browser.|Chạy trước render đầu tiên.|Không bao giờ chạy nếu dependency array rỗng.', 'useEffect(() => { const id=setInterval(...); return () => clearInterval(id); }, []);', 'React Effects'],
  ['react','Error Handling','Nâng cao','Error Boundary hiện tại thường viết bằng gì?', 'API Error Boundary chính thức dựa trên class lifecycle getDerivedStateFromError/componentDidCatch hoặc dùng thư viện wrapper như react-error-boundary.', 'Bắt buộc dùng useEffect.|Bắt buộc dùng Redux.|Không dùng được trong React hiện đại.', 'class ErrorBoundary extends React.Component { componentDidCatch(error, info){} }', 'React Error Boundaries'],
];

const ALL_ROWS = [...PRACTICAL_QUESTIONS, ...SUDHEER_REACT_QUESTIONS];
const alphabet = ['A', 'B', 'C', 'D'];

function buildQuestion(row, index) {
  const [area, topic, level, question, correct, wrongsRaw, example, source] = row;
  const wrongs = String(wrongsRaw).split('|');
  const options = [correct, ...wrongs].slice(0, 4);
  const shift = (index * 3 + question.length) % 4;
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

export default function AppPractical() {
  const [answers, setAnswers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [area, setArea] = useState('all');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); } catch { /* noop */ }
  }, [answers]);

  const areaQuestions = useMemo(() => area === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.area === area), [area]);
  const topics = useMemo(() => ['all', ...Array.from(new Set(areaQuestions.map(q => q.topic)))], [areaQuestions]);
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return areaQuestions.filter(q => {
      const selected = answers[q.id];
      const modeOk = mode === 'all' || (mode === 'unanswered' && selected === undefined) || (mode === 'wrong' && selected !== undefined && selected !== q.answer) || (mode === 'correct' && selected === q.answer);
      const topicOk = topic === 'all' || q.topic === topic;
      const text = `${q.area} ${q.topic} ${q.level} ${q.question} ${q.correct} ${q.example} ${q.source}`.toLowerCase();
      return modeOk && topicOk && (!keyword || text.includes(keyword));
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

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#10131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black text-slate-950">FE</div>
          <div>
            <div className="font-black leading-tight">FE React Interview Quiz</div>
            <div className="text-xs text-slate-400">Bản mới dựa trên Sudheer React + câu hỏi thực chiến Axios/TanStack/Git/Rendering</div>
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
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">Đã nối vào UI: Sudheer React + Axios + TanStack Query/Router + Rendering + Git</div>
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
