import React, { useMemo, useState } from 'react';
import FullTheory from './AppTheoryFull.jsx';

const OLD_TS_QUESTIONS = [
  'TypeScript là gì? Vì sao nên dùng TypeScript trong dự án frontend?',
  'TypeScript khác JavaScript ở điểm nào?',
  'TypeScript có chạy trực tiếp trên browser không? Vì sao?',
  'Type annotation là gì?',
  'Type inference là gì? Khi nào nên để TypeScript tự infer type?',
  'Các kiểu dữ liệu cơ bản trong TypeScript gồm những gì?',
  'Tuple là gì? Tuple khác array như thế nào?',
  'void là gì? Khi nào dùng void?',
  'type là gì? Khi nào nên dùng type?',
  'interface là gì? Khi nào nên dùng interface?',
  'type và interface khác nhau như thế nào?',
  'Union type là gì? Khi nào dùng union type?',
  'Intersection type là gì? Khi nào dùng intersection type?',
  'Literal type là gì? Ứng dụng thực tế của literal type?',
  'Optional property là gì? Khác gì với property có giá trị undefined?',
  'any là gì? Vì sao không nên lạm dụng any?',
  'unknown là gì? unknown khác gì any?',
  'never là gì? Khi nào dùng never?',
  'Exhaustive check với never là gì?',
  'Type Guard là gì?',
  'Custom Type Guard là gì? Viết custom type guard như thế nào?',
  'Narrowing là gì? TypeScript narrowing bằng những cách nào?',
  'Discriminated Union là gì? Khi nào nên dùng?',
  'Generic là gì? Vì sao generic tốt hơn any?',
  'Generic dùng với API response như thế nào?',
  'Generic Constraint là gì? T extends ... có ý nghĩa gì?',
  'Union và Generic khác nhau như thế nào?',
  'keyof là gì? Khi nào dùng keyof?',
  'typeof trong TypeScript dùng để làm gì?',
  'as const là gì? Khi nào nên dùng as const?',
  'satisfies là gì? satisfies khác gì với as?',
  'Type assertion as là gì? Khi nào nên và không nên dùng as?',
  'Utility type Partial<T> dùng khi nào?',
  'Utility type Pick<T, K> dùng khi nào?',
  'Utility type Omit<T, K> dùng khi nào?',
  'Utility type Record<K, V> dùng khi nào?',
  'Readonly<T> và Required<T> là gì?',
  'Mapped Type là gì?',
  'Conditional Type là gì?',
  'infer là gì? Khi nào dùng infer?',
  'Template Literal Type là gì?',
  'Function overload là gì? Khi nào nên dùng overload?',
  'TypeScript có validate dữ liệu runtime không?',
  'Khi gọi API, nên type response như thế nào?',
  'Nên xử lý API success/error type như thế nào cho an toàn?',
  'Làm sao tránh dùng any trong project thực tế?',
  'Type props trong React như thế nào?',
  'Type children trong React nên dùng kiểu gì?',
  'Type event trong React như onChange, onSubmit, onClick như thế nào?',
  'Type useState với giá trị null như thế nào?',
  'Type useState với array rỗng như thế nào?',
  'Vì sao useState([]) đôi khi bị infer thành never[]?',
  'Type custom hook trong React như thế nào?',
  'Khi nào nên khai báo return type rõ ràng cho custom hook?',
  'Generic component trong React là gì?',
  'Viết type cho component Select<T> dùng lại với nhiều loại dữ liệu như thế nào?',
  'Viết type cho reusable Table<T> component như thế nào?',
  'Kết hợp keyof và generic trong component Table/List để làm gì?',
  'Type form data trong React như thế nào?',
  'Type form errors theo field name như thế nào?',
  'Type route params hoặc search params như thế nào?',
  'enum và union literal khác nhau như thế nào?',
  'Khi nào nên dùng union literal thay vì enum?',
  'tsconfig.json là gì?',
  'strict: true trong tsconfig có ý nghĩa gì?',
  'strictNullChecks là gì?',
  'noImplicitAny là gì?',
  'TypeScript có ảnh hưởng đến performance runtime không?',
  'TypeScript giúp gì trong việc refactor code?',
  'Trong dự án React thực tế, bạn đã áp dụng TypeScript như thế nào?',
  'Khi dữ liệu API trả về không đúng type đã khai báo thì chuyện gì xảy ra?',
  'Vì sao TypeScript không thay thế được runtime validation?',
  'Khi nào nên dùng Zod/Yup hoặc type guard để validate dữ liệu?',
  'ReturnType<T> dùng để làm gì?',
  'Parameters<T> dùng để làm gì?',
  'Awaited<T> dùng để làm gì?',
  'Làm sao lấy item type từ một array type?',
  'Làm sao lấy data type từ một Promise type?',
  'Làm sao tạo type từ object constant?',
  'Làm sao tạo union type từ value của object as const?',
  'Khi nào nên tách type/interface ra file riêng?',
  'Cách tổ chức type trong project React lớn như thế nào?',
  'Type DTO, model, entity khác nhau như thế nào?',
  'TypeScript hỗ trợ maintain codebase lớn như thế nào?',
  'Những lỗi TypeScript thường gặp trong React project là gì?',
  'Khi nào nên để TypeScript infer, khi nào nên khai báo type rõ ràng?',
  'Có nên khai báo return type cho mọi function không?',
  'Khi nào nên dùng React.FC, khi nào không nên?',
  'React.ReactNode, React.ReactElement, JSX.Element khác nhau như thế nào?',
];

function theoryFor(question) {
  const q = question.toLowerCase();
  if (q.includes('typescript là gì')) return 'TypeScript là JavaScript có type system ở compile-time. Trong frontend nó giúp bắt lỗi sớm, mô tả rõ props/API/form/state và refactor an toàn hơn.';
  if (q.includes('khác javascript')) return 'JavaScript chạy trực tiếp ở runtime; TypeScript phải compile sang JavaScript và cung cấp type checking, interface, generic, utility types.';
  if (q.includes('browser')) return 'Browser không chạy trực tiếp TypeScript. File .ts/.tsx được Vite/tsc/Babel build thành JavaScript trước khi chạy.';
  if (q.includes('annotation')) return 'Type annotation là khai báo type rõ ràng cho biến, tham số, return function hoặc object khi cần contract dễ đọc.';
  if (q.includes('inference') || q.includes('infer type')) return 'Type inference là TS tự suy luận type. Nên để infer với biến local rõ ràng; khai báo rõ cho API, props, custom hook, state null/array rỗng.';
  if (q.includes('tuple')) return 'Tuple là array có số lượng phần tử và type từng vị trí cố định, khác array thường có số lượng linh hoạt.';
  if (q.includes('void')) return 'void biểu thị function không trả giá trị có ý nghĩa, hay dùng cho event handler hoặc callback side effect.';
  if (q.includes('interface') && q.includes('type')) return 'type linh hoạt với union/conditional/mapped type; interface hợp object shape, extends, implements và declaration merging. Chọn theo convention team.';
  if (q.startsWith('type là')) return 'type alias đặt tên cho type. Rất hợp union, intersection, tuple, function type, utility type hoặc conditional type.';
  if (q.startsWith('interface')) return 'interface mô tả shape object/class, hợp entity, props, model và trường hợp cần extends/implements.';
  if (q.includes('union type')) return 'Union cho phép một value thuộc một trong nhiều type. Hay dùng cho status, role, variant, API success/error.';
  if (q.includes('intersection')) return 'Intersection kết hợp nhiều type thành một type có đủ thuộc tính của các type được ghép.';
  if (q.includes('literal')) return 'Literal type giới hạn value vào giá trị cụ thể như "primary" | "danger", rất hợp variant, status, role.';
  if (q.includes('optional')) return 'Optional property có thể vắng mặt. Property type undefined nghĩa là field có thể tồn tại nhưng value là undefined.';
  if (q.includes('any')) return 'any tắt kiểm tra type nên dễ che bug. Nên hạn chế, thay bằng unknown, generic, type guard hoặc schema validation.';
  if (q.includes('unknown')) return 'unknown an toàn hơn any vì bắt buộc narrowing hoặc validate trước khi truy cập property/method.';
  if (q.includes('never')) return 'never biểu thị case không thể xảy ra. Dùng cho exhaustive check để TS báo khi union thêm case mới chưa xử lý.';
  if (q.includes('type guard')) return 'Type guard là điều kiện giúp TS thu hẹp type. Custom type guard trả về dạng value is Type.';
  if (q.includes('narrowing')) return 'Narrowing là thu hẹp type bằng typeof, instanceof, in, equality, switch, discriminated union hoặc custom type guard.';
  if (q.includes('discriminated')) return 'Discriminated union dùng field chung như status/type/kind để phân biệt case, rất hợp async state hoặc reducer.';
  if (q.includes('generic constraint')) return 'Generic constraint T extends ... giới hạn T phải có shape nhất định để function truy cập field an toàn.';
  if (q.includes('generic')) return 'Generic giúp code reusable mà vẫn giữ type cụ thể giữa input/output, tốt hơn any vì không mất type safety.';
  if (q.includes('keyof')) return 'keyof lấy union key của object type, hay dùng cho form field, table column, sort key.';
  if (q.includes('typeof')) return 'typeof trong type context lấy type từ value có sẵn, hữu ích với config constant.';
  if (q.includes('as const')) return 'as const giữ literal type hẹp nhất và readonly, hay dùng với config, roles, routes.';
  if (q.includes('satisfies')) return 'satisfies kiểm tra object thỏa type nhưng vẫn giữ literal inference; as là ép kiểu và có thể che lỗi.';
  if (q.includes('assertion') || q.includes(' as ')) return 'Type assertion dùng khi bạn có căn cứ chắc hơn compiler, nhưng không nên dùng để che lỗi API chưa validate.';
  if (q.includes('partial')) return 'Partial<T> biến các property thành optional, hợp update payload hoặc draft object.';
  if (q.includes('pick')) return 'Pick<T,K> lấy một số field từ type gốc, hợp props nhỏ hoặc form payload.';
  if (q.includes('omit')) return 'Omit<T,K> bỏ field khỏi type gốc, hợp create payload không có id/createdAt.';
  if (q.includes('record')) return 'Record<K,V> tạo object map từ key type K sang value type V, hợp map label/status/entity.';
  if (q.includes('readonly') || q.includes('required')) return 'Readonly<T> khóa gán lại property, Required<T> biến optional thành bắt buộc.';
  if (q.includes('mapped')) return 'Mapped type lặp qua keyof T để tạo type mới, là nền tảng của Partial/Readonly custom.';
  if (q.includes('conditional')) return 'Conditional type chọn type theo điều kiện T extends U ? X : Y.';
  if (q.includes('infer')) return 'infer dùng trong conditional type để trích xuất type con, như lấy resolved type từ Promise.';
  if (q.includes('template literal')) return 'Template literal type tạo string type bằng cách ghép literal type, hợp event name, route key, i18n key.';
  if (q.includes('overload')) return 'Function overload mô tả nhiều chữ ký gọi khác nhau cho cùng một implementation khi input khác nhau trả output khác nhau.';
  if (q.includes('runtime') || q.includes('validate')) return 'TypeScript không validate runtime vì type bị xóa khi build. Dữ liệu ngoài app nên validate bằng Zod/Yup/type guard.';
  if (q.includes('api')) return 'Nên type DTO/response rõ ràng, phân biệt API DTO và UI model nếu cần, đồng thời validate runtime với dữ liệu không tin cậy.';
  if (q.includes('props')) return 'Props nên khai báo type/interface rõ required/optional/callback/children. Design-system có thể mở rộng ComponentPropsWithoutRef.';
  if (q.includes('children')) return 'children thường dùng React.ReactNode; nếu cần đúng một element thì dùng React.ReactElement.';
  if (q.includes('event')) return 'React event nên dùng React.ChangeEvent, FormEvent, MouseEvent với element cụ thể và ưu tiên currentTarget.';
  if (q.includes('usestate') && q.includes('null')) return 'useState null cần union rõ như User | null để sau này set object hợp lệ.';
  if (q.includes('usestate') && (q.includes('array') || q.includes('never'))) return 'useState([]) cần generic như User[] vì array rỗng không đủ dữ liệu để infer item type.';
  if (q.includes('custom hook')) return 'Custom hook nên type input và return rõ, nhất là hook export/reusable để giữ contract ổn định.';
  if (q.includes('select<t>')) return 'Select<T> nên nhận options T[], value, onChange, getLabel/getValue để dùng lại với nhiều data type.';
  if (q.includes('table<t>') || q.includes('table/list')) return 'Table<T> dùng generic và keyof T để column chỉ trỏ tới field hợp lệ của row data.';
  if (q.includes('form')) return 'Form nên có FormValues riêng; errors có thể dùng Partial<Record<keyof FormValues, string>> hoặc type từ form library.';
  if (q.includes('route')) return 'Route/search params là runtime string/unknown, cần parse/coerce/validate trước khi dùng.';
  if (q.includes('enum')) return 'Union literal nhẹ và type-level; enum tạo runtime object. FE thường ưu tiên union literal/as const nếu không cần runtime enum.';
  if (q.includes('tsconfig') || q.includes('strict') || q.includes('noimplicit')) return 'tsconfig cấu hình TypeScript. strict/noImplicitAny/strictNullChecks giúp bắt lỗi sớm và tránh type lỏng trong codebase.';
  if (q.includes('performance')) return 'TypeScript gần như không ảnh hưởng runtime vì type bị xóa sau build; performance phụ thuộc JavaScript output và rendering/network.';
  if (q.includes('refactor') || q.includes('maintain') || q.includes('codebase')) return 'TypeScript giúp refactor và maintain codebase lớn bằng contract rõ ràng, compiler báo nơi bị ảnh hưởng khi đổi model/API.';
  if (q.includes('returntype')) return 'ReturnType<T> lấy type trả về của function, hữu ích khi tái sử dụng type từ hook/helper.';
  if (q.includes('parameters')) return 'Parameters<T> lấy tuple type các tham số của function.';
  if (q.includes('awaited') || q.includes('promise')) return 'Awaited<T> lấy type resolved của Promise; thường kết hợp ReturnType để lấy data từ async function.';
  if (q.includes('array type')) return 'Lấy item type từ array bằng T[number].';
  if (q.includes('object constant')) return 'Tạo type từ object constant bằng typeof; kết hợp as const để giữ literal type.';
  if (q.includes('file riêng') || q.includes('tổ chức')) return 'Type dùng nhiều nơi nên tách theo feature/domain như features/users/types.ts; type nội bộ nhỏ có thể để cùng component.';
  if (q.includes('dto') || q.includes('model') || q.includes('entity')) return 'DTO là shape API, model/entity là shape domain/UI. Có thể map DTO sang model để tách backend contract khỏi UI.';
  if (q.includes('react.fc')) return 'React.FC không bắt buộc; nhiều team tránh để khai báo children rõ ràng hơn. Theo convention team là chính.';
  if (q.includes('reactnode')) return 'ReactNode rộng nhất cho children; ReactElement là element cụ thể; JSX.Element thường là return JSX.';
  return 'Đây là câu cần trả lời theo hướng: định nghĩa ngắn, khi nào dùng, lỗi thường gặp và ví dụ trong React project thực tế.';
}

const SIDEBAR = [
  ['old-ts', 'Bộ TypeScript cũ'],
  ['new-full', 'Phần bổ sung mới'],
  ['js', 'JS / ES6'],
  ['react', 'React'],
  ['redux', 'Redux Toolkit'],
  ['api', 'Axios / TanStack'],
  ['rendering', 'SPA / CSR / SSR / SSG / ISR'],
  ['pwa', 'PWA / Performance'],
];

export default function AppTheoryUnified() {
  const [search, setSearch] = useState('');
  const filteredTs = useMemo(() => {
    const k = search.trim().toLowerCase();
    return OLD_TS_QUESTIONS.filter(question => !k || question.toLowerCase().includes(k) || theoryFor(question).toLowerCase().includes(k));
  }, [search]);

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <style>{`
        .embedded-full-theory header { display: none !important; }
        .embedded-full-theory aside { display: none !important; }
        .embedded-full-theory > div > div { display: block !important; max-width: 80rem !important; margin-left: auto !important; margin-right: auto !important; }
        .embedded-full-theory main { padding: 0 !important; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">FE Interview Theory Unified</div>
            <h1 className="text-xl font-black md:text-2xl">Giữ bộ cũ + thêm phần mới</h1>
            <p className="text-sm text-slate-400">Không xóa câu cũ. Sidebar bên trái đã sticky để nhảy nhanh theo nhóm.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
            <div className="text-2xl font-black text-cyan-200">{OLD_TS_QUESTIONS.length}+</div>
            <div className="text-xs text-slate-400">câu cũ + phần mới</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:grid-cols-[290px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Tìm trong bộ cũ</div>
              <input value={search} onChange={e => setSearch(e.currentTarget.value)} className="w-full rounded-2xl border border-white/10 bg-[#121722] px-4 py-3 text-sm outline-none placeholder:text-slate-500" placeholder="generic, useState, DTO..." />
            </div>
            <nav className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              {SIDEBAR.map(([id, label]) => <a key={id} href={`#${id}`} className="block rounded-2xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white">{label}</a>)}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <section id="old-ts" className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-500/10 p-5 md:p-7">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">Bộ cũ được giữ lại</div>
            <h2 className="mt-3 text-2xl font-black md:text-4xl">Bộ TypeScript cũ của bạn</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Các câu TypeScript bạn đã đưa không bị xóa. Mình đưa lại thành dạng hỏi + lý thuyết trả lời luôn để ôn phỏng vấn.</p>
            <div className="mt-4 text-sm text-slate-400">Đang hiển thị <b className="text-white">{filteredTs.length}</b>/<b className="text-white">{OLD_TS_QUESTIONS.length}</b> câu cũ.</div>
          </section>

          <div className="space-y-4">
            {filteredTs.map((question, index) => <article key={question} className="rounded-3xl border border-white/10 bg-[#171922] p-5 shadow-xl shadow-black/20">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-black text-white">TypeScript cũ</span>
              </div>
              <h3 className="text-lg font-black leading-7 text-white md:text-xl">{question}</h3>
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-slate-200"><b className="text-cyan-200">Lý thuyết trả lời:</b> {theoryFor(question)}</div>
            </article>)}
          </div>

          <section id="new-full" className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <h2 className="text-2xl font-black text-white">Phần bổ sung mới</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">Bên dưới là phần thêm mới: JavaScript, ES6, React, Redux Toolkit, Axios, TanStack, SPA/CSR/SSR/SSG/ISR, PWA, Performance. Phần này chỉ thêm vào, không thay thế bộ cũ.</p>
          </section>

          <div id="js" />
          <div id="react" />
          <div id="redux" />
          <div id="api" />
          <div id="rendering" />
          <div id="pwa" />
          <div className="embedded-full-theory">
            <FullTheory />
          </div>
        </main>
      </div>
    </div>
  );
}
