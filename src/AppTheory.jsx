import React, { useMemo, useState } from 'react';

const q = (category, level, question, theory, example = '') => ({ category, level, question, theory, example });

const THEORY_BANK = [
  q('TypeScript', 'Cơ bản', 'TypeScript là gì? Vì sao nên dùng TypeScript trong dự án frontend?', 'TypeScript là JavaScript có thêm hệ thống kiểu tĩnh ở giai đoạn phát triển. Trong frontend, TypeScript giúp phát hiện lỗi sớm, autocomplete tốt hơn, refactor an toàn hơn, mô tả rõ props, API response, form data và state.', 'Ví dụ: props thiếu field hoặc truyền sai type sẽ được báo ngay trong editor/build.'),
  q('TypeScript', 'Cơ bản', 'TypeScript khác JavaScript ở điểm nào?', 'JavaScript chạy trực tiếp ở runtime. TypeScript cần được biên dịch sang JavaScript trước khi chạy. Điểm khác chính là TypeScript có type checking, interface, generic, utility types và các công cụ giúp codebase lớn dễ maintain hơn.', 'Browser chỉ hiểu JavaScript, không hiểu trực tiếp file .ts/.tsx.'),
  q('TypeScript', 'Cơ bản', 'TypeScript có chạy trực tiếp trên browser không? Vì sao?', 'Không. Browser chạy JavaScript. TypeScript phải được transpile bởi tsc, Vite, Babel hoặc build tool thành JavaScript. TypeScript chủ yếu giúp kiểm tra lỗi trước runtime.', 'src/main.tsx -> build -> assets/index.js.'),
  q('TypeScript', 'Cơ bản', 'Type annotation là gì?', 'Type annotation là cách khai báo type rõ ràng cho biến, tham số, return function, object hoặc props. Nó hữu ích khi TypeScript không thể infer đủ rõ hoặc khi muốn public API dễ đọc.', 'const age: number = 25; function sum(a: number, b: number): number { return a + b; }'),
  q('TypeScript', 'Cơ bản', 'Type inference là gì? Khi nào nên để TypeScript tự infer type?', 'Type inference là khả năng TypeScript tự suy luận type từ giá trị khởi tạo hoặc biểu thức. Nên để infer với biến đơn giản, state rõ ràng, return đơn giản để code gọn. Nên khai báo rõ khi API public, function phức tạp, generic, state null/array rỗng.', 'const name = "An"; TypeScript tự hiểu name là string.'),
  q('TypeScript', 'Cơ bản', 'Các kiểu dữ liệu cơ bản trong TypeScript gồm những gì?', 'Các kiểu thường gặp gồm string, number, boolean, null, undefined, symbol, bigint, object, array, tuple, enum, union, literal, any, unknown, void, never. Với frontend còn hay gặp function type, ReactNode, Promise và Record.', 'let ids: string[] = []; let status: "idle" | "loading" = "idle";'),
  q('TypeScript', 'Cơ bản', 'Tuple là gì? Tuple khác array như thế nào?', 'Tuple là array có số lượng phần tử và type ở từng vị trí được xác định trước. Array thường là danh sách nhiều phần tử cùng kiểu hoặc union kiểu. Tuple hợp cho cặp dữ liệu cố định như [state, setState] hoặc tọa độ.', 'const point: [number, number] = [10, 20];'),
  q('TypeScript', 'Cơ bản', 'void là gì? Khi nào dùng void?', 'void biểu thị function không trả về giá trị có ý nghĩa. Thường dùng cho event handler, callback chỉ thực hiện side effect như log, setState, submit.', 'function handleClick(): void { setOpen(true); }'),
  q('TypeScript', 'Cơ bản', 'type là gì? Khi nào nên dùng type?', 'type alias đặt tên cho một kiểu. Nên dùng type cho union, intersection, utility type, tuple, function type, conditional type hoặc khi cần compose type linh hoạt.', 'type Status = "idle" | "loading" | "success" | "error";'),
  q('TypeScript', 'Cơ bản', 'interface là gì? Khi nào nên dùng interface?', 'interface mô tả shape của object/class. Nên dùng interface cho object model, props, entity hoặc khi muốn extends/implements và declaration merging.', 'interface User { id: string; name: string; }'),
  q('TypeScript', 'Cơ bản', 'type và interface khác nhau như thế nào?', 'Cả hai đều mô tả shape object. interface hỗ trợ declaration merging và extends tự nhiên. type linh hoạt hơn với union, intersection, mapped type, conditional type. Trong project thực tế nên theo convention team, không cần cực đoan.', 'type Role = "admin" | "user"; interface User { id: string; }'),
  q('TypeScript', 'Cơ bản', 'Union type là gì? Khi nào dùng union type?', 'Union type cho phép một giá trị thuộc một trong nhiều type. Dùng cho trạng thái, variant UI, param có nhiều dạng, response success/error.', 'type Status = "idle" | "loading" | "success";'),
  q('TypeScript', 'Cơ bản', 'Intersection type là gì? Khi nào dùng intersection type?', 'Intersection type kết hợp nhiều type thành một type có đủ tất cả thuộc tính. Dùng khi muốn compose props, entity base với metadata hoặc kết hợp nhiều capability.', 'type AdminUser = User & { permissions: string[] };'),
  q('TypeScript', 'Cơ bản', 'Literal type là gì? Ứng dụng thực tế của literal type?', 'Literal type giới hạn giá trị vào các literal cụ thể như "small", "medium", "large". Ứng dụng trong variant component, status, role, route name, sort key.', 'type ButtonVariant = "primary" | "secondary" | "danger";'),
  q('TypeScript', 'Cơ bản', 'Optional property là gì? Khác gì với property có giá trị undefined?', 'Optional property dùng dấu ? để field có thể vắng mặt. Property có type undefined nghĩa là field có thể tồn tại nhưng value là undefined. Với exactOptionalPropertyTypes, hai khái niệm này càng cần phân biệt rõ.', 'type User = { avatarUrl?: string };'),
  q('TypeScript', 'Cơ bản', 'any là gì? Vì sao không nên lạm dụng any?', 'any tắt kiểm tra type tại vị trí đó, cho phép gọi property/method tùy ý. Lạm dụng any làm mất lợi ích của TypeScript, dễ che bug API, props, form và refactor.', 'Tránh: const data: any = await api.get();'),
  q('TypeScript', 'Cơ bản', 'unknown là gì? unknown khác gì any?', 'unknown là kiểu an toàn hơn any. Bạn không thể dùng trực tiếp unknown nếu chưa narrowing hoặc validate. any cho phép làm mọi thứ, unknown buộc bạn kiểm tra trước.', 'if (typeof value === "string") value.toUpperCase();'),
  q('TypeScript', 'Cơ bản', 'never là gì? Khi nào dùng never?', 'never biểu thị giá trị không bao giờ xảy ra. Dùng cho exhaustive check trong switch, function luôn throw error hoặc vòng lặp không kết thúc.', 'const _exhaustive: never = value;'),
  q('TypeScript', 'Trung bình', 'Exhaustive check với never là gì?', 'Exhaustive check đảm bảo bạn đã xử lý hết mọi case của union. Nếu thêm variant mới mà switch chưa xử lý, TypeScript sẽ báo lỗi tại chỗ gán never.', 'switch(status){ default: const _check: never = status; }'),
  q('TypeScript', 'Trung bình', 'Type Guard là gì?', 'Type Guard là kỹ thuật giúp TypeScript thu hẹp type trong một nhánh code. Có thể dùng typeof, instanceof, in operator, equality check hoặc custom predicate.', 'if ("email" in user) { /* user được narrow */ }'),
  q('TypeScript', 'Trung bình', 'Custom Type Guard là gì? Viết custom type guard như thế nào?', 'Custom type guard là function trả về predicate dạng value is Type. Nó giúp kiểm tra runtime và cho TypeScript biết type đã được narrow.', 'function isUser(v: unknown): v is User { return typeof v === "object" && v !== null && "id" in v; }'),
  q('TypeScript', 'Trung bình', 'Narrowing là gì? TypeScript narrowing bằng những cách nào?', 'Narrowing là quá trình thu hẹp type từ rộng sang cụ thể hơn. TypeScript narrowing bằng typeof, instanceof, in, switch, equality, truthiness, discriminated union và custom type guard.', 'if (typeof id === "string") id.toUpperCase();'),
  q('TypeScript', 'Trung bình', 'Discriminated Union là gì? Khi nào nên dùng?', 'Discriminated union là union có một field chung làm dấu phân biệt, ví dụ status/type/kind. Nên dùng cho async state, modal state, action reducer, API success/error để tránh boolean mâu thuẫn.', 'type State = {status:"loading"} | {status:"success", data: User[]} | {status:"error", message: string};'),
  q('TypeScript', 'Trung bình', 'Generic là gì? Vì sao generic tốt hơn any?', 'Generic cho phép viết logic tái sử dụng nhưng vẫn giữ type cụ thể. Khác any, generic không làm mất type safety mà truyền type từ input sang output.', 'function identity<T>(value: T): T { return value; }'),
  q('TypeScript', 'Trung bình', 'Generic dùng với API response như thế nào?', 'Có thể tạo wrapper ApiResponse<T> để response nào cũng có metadata chung nhưng data vẫn giữ type riêng. Tuy nhiên type này chỉ là compile-time, vẫn cần validate runtime nếu data không tin cậy.', 'type ApiResponse<T> = { data: T; message: string; success: boolean };'),
  q('TypeScript', 'Trung bình', 'Generic Constraint là gì? T extends ... có ý nghĩa gì?', 'Generic constraint giới hạn T phải thỏa điều kiện nào đó. T extends { id: string } nghĩa là T phải có field id string, nhờ vậy function được phép đọc item.id.', 'function getById<T extends {id:string}>(items:T[], id:string){ return items.find(i => i.id === id); }'),
  q('TypeScript', 'Trung bình', 'Union và Generic khác nhau như thế nào?', 'Union biểu thị một giá trị có thể là một trong nhiều kiểu cố định. Generic là tham số type giúp function/component giữ quan hệ type giữa input và output. Union chọn trong tập type, generic truyền type vào để tái sử dụng.', 'function wrap<T>(data:T): {data:T}; type Status = "idle" | "loading";'),
  q('TypeScript', 'Trung bình', 'keyof là gì? Khi nào dùng keyof?', 'keyof lấy union các key của object type. Dùng để type-safe khi truy cập property động, tạo table columns, form field names, sort keys.', 'type UserKey = keyof User;'),
  q('TypeScript', 'Trung bình', 'typeof trong TypeScript dùng để làm gì?', 'typeof trong type context lấy type từ một value có sẵn. Hữu ích khi tạo type từ constant object, config, default values.', 'const routes = { home: "/" }; type Routes = typeof routes;'),
  q('TypeScript', 'Trung bình', 'as const là gì? Khi nào nên dùng as const?', 'as const biến object/array literal thành readonly và giữ literal type hẹp nhất. Dùng cho config, enum-like object, route names, role list.', 'const roles = ["admin", "user"] as const; type Role = typeof roles[number];'),
  q('TypeScript', 'Trung bình', 'satisfies là gì? satisfies khác gì với as?', 'satisfies kiểm tra một object có thỏa type không nhưng vẫn giữ type literal gốc. as là type assertion ép type, có thể che lỗi nếu dùng bừa.', 'const menu = [{key:"home"}] satisfies MenuItem[];'),
  q('TypeScript', 'Trung bình', 'Type assertion as là gì? Khi nào nên và không nên dùng as?', 'as nói với TypeScript rằng bạn biết type cụ thể hơn. Nên dùng khi có căn cứ chắc như DOM element sau query hoặc library chưa type tốt. Không nên dùng để che lỗi, ép API response chưa validate.', 'const input = document.querySelector("input") as HTMLInputElement | null;'),
  q('TypeScript', 'Trung bình', 'Utility type Partial<T> dùng khi nào?', 'Partial<T> biến tất cả field của T thành optional. Dùng cho update payload, form draft, patch object. Cần cẩn thận vì mọi field đều optional.', 'type UpdateUser = Partial<User>;'),
  q('TypeScript', 'Trung bình', 'Utility type Pick<T, K> dùng khi nào?', 'Pick lấy một số field từ type gốc. Dùng khi tạo type nhỏ hơn cho component props, form payload, table row summary.', 'type UserCardProps = Pick<User, "id" | "name" | "avatarUrl">;'),
  q('TypeScript', 'Trung bình', 'Utility type Omit<T, K> dùng khi nào?', 'Omit bỏ một số field khỏi type gốc. Hay dùng khi tạo create payload không có id, createdAt hoặc field server tự sinh.', 'type CreateUserPayload = Omit<User, "id" | "createdAt">;'),
  q('TypeScript', 'Trung bình', 'Utility type Record<K, V> dùng khi nào?', 'Record tạo object map từ key type K sang value type V. Dùng cho map label theo role/status, entity by id, permission map.', 'const roleLabels: Record<Role, string> = { admin: "Admin", user: "User" };'),
  q('TypeScript', 'Trung bình', 'Readonly<T> và Required<T> là gì?', 'Readonly<T> làm các property không thể gán lại. Required<T> biến optional property thành bắt buộc. Dùng để mô tả config không đổi hoặc normalize type sau khi đã fill đủ dữ liệu.', 'type CompleteUser = Required<UserDraft>;'),
  q('TypeScript', 'Nâng cao', 'Mapped Type là gì?', 'Mapped type tạo type mới bằng cách lặp qua key của type cũ. Đây là nền tảng của Partial, Pick, Record và nhiều utility type custom.', 'type Optional<T> = { [K in keyof T]?: T[K] };'),
  q('TypeScript', 'Nâng cao', 'Conditional Type là gì?', 'Conditional type chọn type dựa trên điều kiện dạng T extends U ? X : Y. Dùng để viết type logic, trích xuất type hoặc biến đổi type phức tạp.', 'type IsString<T> = T extends string ? true : false;'),
  q('TypeScript', 'Nâng cao', 'infer là gì? Khi nào dùng infer?', 'infer dùng trong conditional type để suy luận và đặt tên type con. Hay dùng để lấy return type, item type, promise value type.', 'type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;'),
  q('TypeScript', 'Nâng cao', 'Template Literal Type là gì?', 'Template literal type tạo string type bằng cách ghép literal type. Dùng cho event name, route key, CSS token, i18n key.', 'type EventName = `${keyof User}Changed`;'),
  q('TypeScript', 'Nâng cao', 'Function overload là gì? Khi nào nên dùng overload?', 'Function overload cho phép một function có nhiều chữ ký gọi khác nhau nhưng cùng implementation. Dùng khi input khác nhau dẫn đến return type khác nhau rõ ràng.', 'function getValue(id: string): User; function getValue(ids: string[]): User[];'),
  q('TypeScript', 'Thực tế', 'TypeScript có validate dữ liệu runtime không?', 'Không. TypeScript chỉ kiểm tra lúc compile/dev-time. Khi app chạy, type đã bị xóa. Nếu API trả sai shape, TypeScript không tự chặn được.', 'Cần Zod/Yup/type guard để validate data thật từ API.'),
  q('TypeScript', 'Thực tế', 'Khi gọi API, nên type response như thế nào?', 'Nên type rõ DTO/response wrapper, phân biệt data server trả về với model UI nếu cần. Không nên ép any. Với dữ liệu không tin cậy, validate runtime trước khi dùng.', 'type UserDto = { id: string; full_name: string };'),
  q('TypeScript', 'Thực tế', 'Nên xử lý API success/error type như thế nào cho an toàn?', 'Có thể dùng discriminated union cho kết quả API: success true có data, success false có error. Điều này giúp UI bắt buộc xử lý cả thành công và thất bại.', 'type Result<T> = {ok:true; data:T} | {ok:false; error:ApiError};'),
  q('TypeScript', 'Thực tế', 'Làm sao tránh dùng any trong project thực tế?', 'Dùng unknown ở boundary, khai báo DTO, dùng generic, utility types, type guard, schema validation, bật strict/noImplicitAny và không bỏ qua lỗi bằng as any.', 'Thay any API bằng unknown + zod schema parse.'),
  q('TypeScript React', 'Thực tế', 'Type props trong React như thế nào?', 'Tạo type/interface Props mô tả props component. Props nên rõ required/optional, event callback, children nếu có. Với design-system có thể mở rộng native props bằng ComponentPropsWithoutRef.', 'type ButtonProps = { variant?: "primary"; onClick?: () => void; };'),
  q('TypeScript React', 'Thực tế', 'Type children trong React nên dùng kiểu gì?', 'Phổ biến nhất là React.ReactNode vì children có thể là string, number, element, fragment, null, undefined hoặc array. Nếu cần đúng một element thì dùng ReactElement.', 'type Props = { children: React.ReactNode };'),
  q('TypeScript React', 'Thực tế', 'Type event trong React như onChange, onSubmit, onClick như thế nào?', 'Dùng event type từ React: ChangeEvent, FormEvent, MouseEvent với element cụ thể. Nên dùng currentTarget để có type tốt hơn target.', 'function onChange(e: React.ChangeEvent<HTMLInputElement>) { setValue(e.currentTarget.value); }'),
  q('TypeScript React', 'Thực tế', 'Type useState với giá trị null như thế nào?', 'Nếu initial state là null nhưng sau này có object, cần khai báo union rõ. Nếu không TypeScript có thể infer state chỉ là null.', 'const [user, setUser] = useState<User | null>(null);'),
  q('TypeScript React', 'Thực tế', 'Type useState với array rỗng như thế nào?', 'Array rỗng không đủ thông tin để infer item type. Cần truyền generic để tránh never[] hoặc any[] ngoài ý muốn.', 'const [users, setUsers] = useState<User[]>([]);'),
  q('TypeScript React', 'Thực tế', 'Vì sao useState([]) đôi khi bị infer thành never[]?', 'Vì array rỗng không có phần tử để TypeScript suy luận type. Trong strict mode, TS có thể infer never[] nghĩa là không được push/set item khác type.', 'useState<User[]>([]) thay vì useState([]).'),
  q('TypeScript React', 'Thực tế', 'Type custom hook trong React như thế nào?', 'Custom hook nên type input params, return data/actions rõ ràng. Có thể để infer return nếu đơn giản, nhưng với hook public/reusable nên khai báo return type để ổn định API.', 'function useAuth(): { user: User | null; logout: () => void } { ... }'),
  q('TypeScript React', 'Thực tế', 'Khi nào nên khai báo return type rõ ràng cho custom hook?', 'Khi hook dùng lại nhiều nơi, trả object phức tạp, là public API của module hoặc muốn tránh thay đổi return vô tình làm hỏng consumer.', 'export function useUsers(): UseUsersResult { ... }'),
  q('TypeScript React', 'Nâng cao', 'Generic component trong React là gì?', 'Generic component là component nhận type parameter để dùng lại với nhiều data type mà vẫn giữ type-safe. Hay dùng cho Select, Table, List, Combobox.', 'function Select<T>(props: SelectProps<T>) { ... }'),
  q('TypeScript React', 'Nâng cao', 'Viết type cho component Select<T> dùng lại với nhiều loại dữ liệu như thế nào?', 'Select<T> nên nhận options: T[], value: T hoặc id, onChange: (item:T)=>void, getLabel/getValue để component không phụ thuộc shape cứng.', 'type SelectProps<T> = { options:T[]; value:T|null; onChange:(v:T)=>void; getLabel:(v:T)=>string };'),
  q('TypeScript React', 'Nâng cao', 'Viết type cho reusable Table<T> component như thế nào?', 'Table<T> thường nhận rows: T[], columns có key hoặc render function. Nếu dùng key, kết hợp keyof T để column chỉ trỏ tới field hợp lệ.', 'type Column<T> = { key: keyof T; title: string; render?: (row:T)=>React.ReactNode };'),
  q('TypeScript React', 'Nâng cao', 'Kết hợp keyof và generic trong component Table/List để làm gì?', 'Để đảm bảo các field được truyền vào column/sort/filter là key thật của data type. Khi đổi model, TypeScript sẽ báo column sai.', 'Column<User> key chỉ có thể là keyof User.'),
  q('TypeScript React', 'Thực tế', 'Type form data trong React như thế nào?', 'Tạo type FormValues riêng, thường lấy từ schema validation nếu dùng Zod/Yup. FormValues không nhất thiết giống Entity vì form có thể dùng string cho input trước khi parse.', 'type LoginForm = { email: string; password: string };'),
  q('TypeScript React', 'Thực tế', 'Type form errors theo field name như thế nào?', 'Có thể dùng Partial<Record<keyof FormValues, string>> để map lỗi theo field. Với form phức tạp dùng type của React Hook Form hoặc schema resolver.', 'type FormErrors<T> = Partial<Record<keyof T, string>>;'),
  q('TypeScript React', 'Thực tế', 'Type route params hoặc search params như thế nào?', 'Route params/search params từ URL là dữ liệu string/unknown ở runtime. Nên parse, coerce và validate bằng router schema, Zod hoặc helper trước khi dùng.', 'page từ URL là string, cần parse thành number.'),
  q('TypeScript', 'Trung bình', 'enum và union literal khác nhau như thế nào?', 'enum tạo runtime object nếu là enum thường, còn union literal chỉ tồn tại ở type-level. Union literal nhẹ hơn và thường đủ cho FE. enum có ích khi cần runtime mapping rõ.', 'type Role = "admin" | "user";'),
  q('TypeScript', 'Trung bình', 'Khi nào nên dùng union literal thay vì enum?', 'Khi chỉ cần giới hạn giá trị trong TypeScript và không cần runtime object. Union literal kết hợp as const thường gọn, tree-shaking tốt và dễ dùng với string từ API.', 'const ROLES = ["admin", "user"] as const; type Role = typeof ROLES[number];'),
  q('TypeScript Config', 'Cơ bản', 'tsconfig.json là gì?', 'tsconfig.json là file cấu hình TypeScript compiler: target, module, jsx, strict mode, path alias, include/exclude, noEmit, moduleResolution.', 'strict: true, jsx: react-jsx, paths: {"@/*": ["src/*"]}'),
  q('TypeScript Config', 'Cơ bản', 'strict: true trong tsconfig có ý nghĩa gì?', 'strict bật nhóm rule kiểm tra type nghiêm ngặt như strictNullChecks, noImplicitAny, strictFunctionTypes. Nó giúp phát hiện nhiều bug hơn nhưng yêu cầu code rõ type hơn.', 'Nên bật strict cho project nghiêm túc nếu có thể.'),
  q('TypeScript Config', 'Cơ bản', 'strictNullChecks là gì?', 'strictNullChecks buộc bạn xử lý null/undefined rõ ràng. Nếu tắt, null/undefined dễ lọt vào nơi không mong muốn và gây runtime error.', 'user?.name hoặc if (user) thay vì user.name khi user có thể null.'),
  q('TypeScript Config', 'Cơ bản', 'noImplicitAny là gì?', 'noImplicitAny báo lỗi khi TypeScript không suy luận được type và sẽ ngầm dùng any. Rule này giúp tránh any vô tình lan trong codebase.', 'function handle(value){} sẽ bị báo nếu value không có type.'),
  q('TypeScript', 'Thực tế', 'TypeScript có ảnh hưởng đến performance runtime không?', 'Gần như không trực tiếp, vì TypeScript bị xóa sau khi compile sang JavaScript. Performance runtime phụ thuộc JavaScript output, thuật toán, rendering, network và bundle size.', 'Type không tồn tại ở browser runtime.'),
  q('TypeScript', 'Thực tế', 'TypeScript giúp gì trong việc refactor code?', 'TypeScript giúp đổi tên field, tách component, đổi API contract, thay đổi model an toàn hơn vì compiler sẽ báo nơi bị ảnh hưởng.', 'Đổi User.fullName thành User.name, các chỗ dùng fullName sẽ báo lỗi.'),
  q('TypeScript', 'Thực tế', 'Trong dự án React thực tế, bạn đã áp dụng TypeScript như thế nào?', 'Nên trả lời theo case: type props, API DTO, form values, route params, custom hooks, Redux/Zustand state, TanStack Query data, utility types và strict config.', 'Ví dụ phỏng vấn: Em tách UserDto từ API và User model cho UI để tránh phụ thuộc backend naming.'),
  q('TypeScript Runtime', 'Thực tế', 'Khi dữ liệu API trả về không đúng type đã khai báo thì chuyện gì xảy ra?', 'TypeScript không tự biết ở runtime. App vẫn chạy với dữ liệu sai và có thể crash hoặc hiển thị sai. Type khai báo chỉ là cam kết compile-time.', 'API trả age: "18" nhưng type là number, TS không tự convert.'),
  q('TypeScript Runtime', 'Thực tế', 'Vì sao TypeScript không thay thế được runtime validation?', 'Vì type bị xóa khi build. Dữ liệu từ API, localStorage, URL, postMessage, file upload là dữ liệu runtime cần validate nếu không tin cậy.', 'Dùng Zod parse response trước khi đưa vào UI quan trọng.'),
  q('TypeScript Runtime', 'Thực tế', 'Khi nào nên dùng Zod/Yup hoặc type guard để validate dữ liệu?', 'Khi data đến từ bên ngoài app: API, URL params, localStorage, form, CMS, file import. Zod/Yup phù hợp schema rõ; type guard phù hợp check nhẹ hoặc custom logic.', 'const user = UserSchema.parse(rawData);'),
  q('TypeScript Utility', 'Trung bình', 'ReturnType<T> dùng để làm gì?', 'ReturnType lấy type trả về của một function type. Dùng để tái sử dụng type từ function/hook/action creator mà không viết lại.', 'type AuthState = ReturnType<typeof useAuth>;'),
  q('TypeScript Utility', 'Trung bình', 'Parameters<T> dùng để làm gì?', 'Parameters lấy tuple type các tham số của function. Dùng khi muốn wrap function mà giữ nguyên type params.', 'type FnArgs = Parameters<typeof fetchUsers>;'),
  q('TypeScript Utility', 'Trung bình', 'Awaited<T> dùng để làm gì?', 'Awaited lấy type value sau khi Promise resolve, hỗ trợ cả Promise lồng nhau. Dùng khi cần lấy data type từ async function.', 'type User = Awaited<ReturnType<typeof getUser>>;'),
  q('TypeScript Utility', 'Trung bình', 'Làm sao lấy item type từ một array type?', 'Dùng indexed access T[number]. Nếu có type User[] thì UserArray[number] là type của item.', 'type Item = Users[number];'),
  q('TypeScript Utility', 'Trung bình', 'Làm sao lấy data type từ một Promise type?', 'Dùng Awaited<T> hoặc Awaited<ReturnType<typeof asyncFn>>.', 'type Data = Awaited<ReturnType<typeof fetchUsers>>;'),
  q('TypeScript Utility', 'Trung bình', 'Làm sao tạo type từ object constant?', 'Dùng typeof để lấy type từ object value. Nếu muốn giữ literal type thì kết hợp as const.', 'const config = { theme: "dark" } as const; type Config = typeof config;'),
  q('TypeScript Utility', 'Trung bình', 'Làm sao tạo union type từ value của object as const?', 'Dùng typeof obj[keyof typeof obj] để lấy union các value. Với array as const thì dùng typeof arr[number].', 'const ROLE = { ADMIN:"admin", USER:"user" } as const; type Role = typeof ROLE[keyof typeof ROLE];'),
  q('TypeScript Project', 'Thực tế', 'Khi nào nên tách type/interface ra file riêng?', 'Khi type được dùng ở nhiều file, thuộc domain chung, là API contract, entity/model, form schema hoặc quá dài làm component khó đọc. Type chỉ dùng nội bộ component nhỏ có thể để cùng file.', 'features/users/types.ts cho User, UserDto, UserFilter.'),
  q('TypeScript Project', 'Thực tế', 'Cách tổ chức type trong project React lớn như thế nào?', 'Có thể tổ chức theo feature/domain: features/users/types.ts, api/dto.ts, shared/types.ts. Tránh một file types.ts khổng lồ cho toàn app nếu project lớn.', 'Feature-based structure giúp type gần nơi dùng.'),
  q('TypeScript Project', 'Thực tế', 'Type DTO, model, entity khác nhau như thế nào?', 'DTO là shape trao đổi với API. Model/entity là shape domain trong app. Có thể map DTO sang model nếu backend naming, nullability hoặc format khác UI cần.', 'UserDto.full_name -> User.fullName.'),
  q('TypeScript Project', 'Thực tế', 'TypeScript hỗ trợ maintain codebase lớn như thế nào?', 'Nó làm contract rõ, bắt lỗi khi đổi API/model, giúp autocomplete, giảm bug refactor, enforce convention và hỗ trợ onboard thành viên mới nhanh hơn.', 'Đổi type User sẽ lan warning đến component/table/form liên quan.'),
  q('TypeScript Project', 'Thực tế', 'Những lỗi TypeScript thường gặp trong React project là gì?', 'Các lỗi thường gặp: lạm dụng any/as, useState([]) thành never[], props quá lỏng, API response không validate, ReactNode/JSX.Element nhầm, event type sai, nullable không xử lý.', 'const [items,setItems]=useState<Item[]>([]);'),
  q('TypeScript Project', 'Thực tế', 'Khi nào nên để TypeScript infer, khi nào nên khai báo type rõ ràng?', 'Để infer cho biến local rõ ràng. Khai báo rõ cho function export, props, API response, custom hook public, state null/array rỗng, generic component và logic phức tạp.', 'const total = price * qty; infer được. function fetchUsers(): Promise<User[]> nên khai báo.'),
  q('TypeScript Project', 'Thực tế', 'Có nên khai báo return type cho mọi function không?', 'Không bắt buộc. Với function local đơn giản có thể để infer. Với function export, custom hook, API service, reducer, helper quan trọng nên khai báo để giữ contract ổn định.', 'export async function getUsers(): Promise<User[]> { ... }'),
  q('TypeScript React', 'Thực tế', 'Khi nào nên dùng React.FC, khi nào không nên?', 'React.FC tự thêm một số typing cho function component nhưng hiện không bắt buộc. Nhiều team tránh React.FC để props/children rõ ràng hơn. Có thể dùng nếu team convention chấp nhận.', 'function Button(props: ButtonProps) { ... } thường đủ rõ.'),
  q('TypeScript React', 'Trung bình', 'React.ReactNode, React.ReactElement, JSX.Element khác nhau như thế nào?', 'ReactNode rộng nhất: string, number, null, array, element. ReactElement là object React element cụ thể. JSX.Element là type element JSX trả về. children thường dùng ReactNode; component return thường để infer hoặc JSX.Element.', 'type Props = { children: React.ReactNode };'),

  q('Auth / JWT', 'Cơ bản', 'JWT là gì?', 'JWT là JSON Web Token, một chuỗi token gồm header, payload, signature. JWT thường dùng để truyền thông tin xác thực/ủy quyền giữa client và server theo dạng stateless.', 'JWT không phải mã hóa mặc định; payload thường chỉ base64url encode.'),
  q('Auth / JWT', 'Cơ bản', 'JWT gồm những phần nào?', 'JWT gồm 3 phần: header mô tả thuật toán, payload chứa claims, signature dùng để kiểm tra token có bị sửa hay không.', 'xxxxx.yyyyy.zzzzz tương ứng header.payload.signature.'),
  q('Auth / JWT', 'Trung bình', 'Access token và refresh token khác nhau thế nào?', 'Access token thường sống ngắn, dùng gọi API. Refresh token sống lâu hơn, dùng để lấy access token mới. Refresh token cần bảo vệ kỹ hơn vì rủi ro cao hơn.', 'Access token 15 phút, refresh token vài ngày tùy hệ thống.'),
  q('Auth / JWT', 'Trung bình', 'Nên lưu JWT ở đâu trong frontend?', 'Không có đáp án tuyệt đối. localStorage dễ dùng nhưng rủi ro XSS. HttpOnly cookie giảm rủi ro bị JS đọc token nhưng cần xử lý CSRF/SameSite. Cần chọn theo threat model.', 'App nội bộ và app public có thể chọn chiến lược khác nhau.'),
  q('Auth / JWT', 'Trung bình', 'Refresh token flow ở frontend nên xử lý thế nào?', 'Khi API trả 401 do access token hết hạn, gọi refresh một lần, retry request cũ, queue các request chờ, nếu refresh fail thì logout và clear cache/state.', 'Axios interceptor dùng isRefreshing và failedQueue.'),
  q('Auth / JWT', 'Trung bình', 'FE ẩn nút theo role có đủ bảo mật không?', 'Không. FE chỉ cải thiện UX. Backend vẫn phải enforce quyền ở API. User có thể gọi API trực tiếp qua DevTools/Postman nếu backend không kiểm tra.', 'Ẩn nút Delete không thay thế kiểm tra permission ở server.'),
  q('AJAX / API', 'Cơ bản', 'AJAX là gì?', 'AJAX là kỹ thuật gửi/nhận dữ liệu bất đồng bộ từ server mà không reload toàn bộ trang. Ngày nay thường dùng fetch hoặc Axios thay vì XMLHttpRequest trực tiếp.', 'Search autocomplete gọi API khi user gõ mà không refresh page.'),
  q('AJAX / API', 'Cơ bản', 'fetch và Axios khác nhau thế nào?', 'fetch là API có sẵn của browser. Axios là thư viện có tiện ích như instance, interceptor, timeout, transform response, tự reject theo status config. Cả hai đều dùng được, chọn theo convention dự án.', 'Axios interceptor rất tiện cho token/refresh token.'),
  q('AJAX / API', 'Trung bình', 'RESTful API là gì?', 'RESTful API là cách thiết kế API dựa trên resource, HTTP method, status code và stateless request. URL đại diện tài nguyên, method đại diện hành động.', 'GET /users, POST /users, PATCH /users/:id, DELETE /users/:id.'),
  q('AJAX / API', 'Trung bình', 'HTTP methods GET, POST, PUT, PATCH, DELETE khác nhau thế nào?', 'GET lấy dữ liệu, POST tạo hoặc trigger action, PUT thay thế toàn bộ resource, PATCH cập nhật một phần, DELETE xóa resource. Cần thống nhất với backend contract.', 'PATCH /users/1 với body {name:"An"}.'),
  q('AJAX / API', 'Trung bình', 'HTTP status code frontend cần nắm?', '2xx thành công, 400 validation/bad request, 401 chưa xác thực, 403 không đủ quyền, 404 không tìm thấy, 409 conflict, 422 validation, 500 lỗi server.', '401 thường redirect login hoặc refresh token; 403 hiển thị không có quyền.'),
  q('AJAX / API', 'Trung bình', 'CORS là gì?', 'CORS là cơ chế browser kiểm soát request cross-origin. Nếu server không trả header cho phép origin/method/header phù hợp, browser sẽ chặn response.', 'FE không thể tự sửa CORS hoàn toàn nếu server không cấu hình đúng.'),
  q('AJAX / API', 'Trung bình', 'Idempotent là gì trong REST?', 'Một request idempotent có thể gọi nhiều lần nhưng kết quả cuối giống nhau. GET, PUT, DELETE thường idempotent; POST thường không.', 'Gọi DELETE /users/1 nhiều lần thì user vẫn là đã bị xóa.'),

  q('HTML/CSS/JS nền tảng', 'Cơ bản', 'HTML5 cần nắm gì cho FE 2.5 năm?', 'Cần nắm semantic tags, form/label/input, accessibility cơ bản, media tags, meta viewport, script async/defer và SEO cơ bản.', 'Dùng button thật thay div onClick cho hành động click.'),
  q('HTML/CSS/JS nền tảng', 'Cơ bản', 'CSS3 cần nắm gì?', 'Cần nắm box model, cascade, specificity, flex, grid, position, responsive, pseudo-class, pseudo-element, transition, custom properties. Nếu dùng SCSS/Tailwind vẫn phải hiểu CSS gốc.', 'Tailwind là utility CSS, không thay thế hiểu biết về layout.'),
  q('HTML/CSS/JS nền tảng', 'Trung bình', 'SCSS hữu ích ở điểm nào?', 'SCSS thêm nesting, variables, mixins, functions, partials giúp tổ chức CSS truyền thống tốt hơn. Tuy nhiên cần tránh nesting quá sâu làm selector nặng và khó override.', 'Dùng mixin cho breakpoint hoặc theme token.'),
  q('HTML/CSS/JS nền tảng', 'Trung bình', 'Tailwind CSS nên hiểu thế nào?', 'Tailwind là utility-first CSS framework. Ưu điểm là style nhanh, consistent spacing/color, ít đặt tên class custom. Cần biết responsive prefix, state variant, config theme, component extraction.', 'md:grid-cols-2, hover:bg-blue-500, dark:bg-slate-900.'),
  q('HTML/CSS/JS nền tảng', 'Trung bình', 'JavaScript ES6+ cần nắm gì?', 'Cần nắm let/const, arrow function, destructuring, spread/rest, modules, promise, async/await, optional chaining, nullish coalescing, array methods, class/prototype, event loop.', 'const name = user?.profile?.name ?? "N/A";'),

  q('Architecture / State', 'Trung bình', 'Component-based architecture là gì?', 'Là cách chia UI thành component nhỏ, độc lập, reusable, có props rõ ràng và trách nhiệm cụ thể. Component tốt nên dễ test, dễ compose và không ôm quá nhiều logic.', 'UserPage gồm UserFilter, UserTable, UserFormModal, useUsersQuery.'),
  q('Architecture / State', 'Trung bình', 'Smart component và presentational component khác nhau thế nào?', 'Smart/container component xử lý data, state, side effects. Presentational component nhận props và render UI. Cách chia này giúp UI dễ reuse và logic dễ test hơn.', 'UserTable chỉ nhận rows/onEdit; UsersPage gọi API và giữ filter.'),
  q('Architecture / State', 'Trung bình', 'State management nên chọn theo tiêu chí nào?', 'Chọn theo loại state: local, lifted, global client, URL, server state. Không đưa mọi thứ vào Redux/Zustand. Server state nên dùng React Query/TanStack Query hoặc RTK Query.', 'modalOpen local, theme global, filter URL, users list server state.'),
  q('Architecture / State', 'Trung bình', 'Redux, Context API và React Query khác nhau thế nào?', 'Context truyền value qua tree, hợp theme/locale data ít đổi. Redux quản lý client global state có convention/devtools/middleware. React Query quản lý server state như cache, refetch, mutation.', 'Không nên copy server data từ React Query sang Redux nếu không có lý do.'),
  q('Architecture / State', 'Trung bình', 'Context API có thay Redux không?', 'Context không phải state manager đầy đủ cho mọi case. Nó thiếu selector mặc định, middleware, devtools mạnh và có thể gây re-render rộng nếu value thay đổi thường xuyên.', 'Theme hợp Context, cart/auth complex có thể dùng Zustand/Redux.'),
  q('Architecture / State', 'Trung bình', 'React Query/TanStack Query giải quyết gì?', 'Nó giải quyết server state: loading, error, cache, stale time, refetch, pagination, mutation, optimistic update, invalidation. Nó không thay thế local UI state.', 'useQuery cho users list, useState cho modal open.'),

  q('Responsive / Browser / Performance', 'Cơ bản', 'Responsive Design là gì?', 'Responsive Design giúp UI thích ứng nhiều kích thước màn hình bằng fluid layout, media query, responsive images, flexible grid và kiểm tra touch/mobile UX.', 'Mobile-first: style mobile trước, dùng min-width cho tablet/desktop.'),
  q('Responsive / Browser / Performance', 'Trung bình', 'Browser Compatibility là gì?', 'Là đảm bảo app chạy đúng trên các browser/version mục tiêu. Cần chú ý API support, CSS support, polyfill, transpilation target, caniuse, testing thật trên browser.', 'Một số CSS mới như :has hoặc container query cần kiểm tra support.'),
  q('Responsive / Browser / Performance', 'Trung bình', 'Tối ưu tốc độ tải trang frontend gồm những gì?', 'Gồm giảm bundle size, code splitting, lazy load, image optimization, caching, preloading tài nguyên quan trọng, giảm render blocking, tối ưu API và tránh JS quá nặng.', 'React.lazy cho route lớn, nén ảnh WebP/AVIF, dùng CDN cache.'),
  q('Responsive / Browser / Performance', 'Trung bình', 'Core Web Vitals cần nắm gì?', 'Các chỉ số quan trọng gồm LCP, INP, CLS. LCP đo tốc độ nội dung chính, INP đo độ phản hồi tương tác, CLS đo layout shift. FE cần tối ưu ảnh, JS, layout stability.', 'Đặt width/height cho ảnh để giảm CLS.'),
  q('Responsive / Browser / Performance', 'Trung bình', 'Lazy loading trong frontend dùng cho gì?', 'Lazy loading trì hoãn tải component, route, image hoặc dữ liệu chưa cần ngay. Nó giảm initial load nhưng cần fallback/skeleton hợp lý để không làm UX kém.', 'const AdminPage = React.lazy(() => import("./AdminPage"));'),
  q('Responsive / Browser / Performance', 'Trung bình', 'Code splitting là gì?', 'Code splitting chia bundle thành nhiều chunk để chỉ tải phần cần thiết. Thường áp dụng theo route, component nặng hoặc thư viện lớn.', 'Không tải editor/chart library ở trang không dùng.'),

  q('PWA', 'Cơ bản', 'PWA là gì?', 'Progressive Web App là web app có trải nghiệm gần native hơn: installable, offline/poor network support, caching, service worker, manifest và có thể push notification tùy nền tảng.', 'App có manifest.json và service worker cache asset.'),
  q('PWA', 'Cơ bản', 'Service Worker là gì?', 'Service worker là script chạy nền giữa web app và network, có thể intercept request, cache response, hỗ trợ offline, background sync, push notification. Nó chạy ngoài main thread.', 'self.addEventListener("fetch", event => { ... });'),
  q('PWA', 'Trung bình', 'Caching strategy trong PWA gồm những loại nào?', 'Các strategy phổ biến: Cache First cho asset ít đổi, Network First cho data cần mới, Stale While Revalidate cho vừa nhanh vừa cập nhật nền, Network Only và Cache Only cho case đặc biệt.', 'Avatar/static asset dùng Cache First, API news có thể dùng Network First.'),
  q('PWA', 'Trung bình', 'Workbox là gì?', 'Workbox là bộ thư viện của Google giúp tạo service worker và cấu hình caching strategy dễ hơn thay vì viết service worker thủ công. Nó hỗ trợ precache, runtime cache, routing và expiration.', 'workbox.routing.registerRoute(..., new StaleWhileRevalidate()).'),
  q('PWA', 'Trung bình', 'Precache và runtime cache khác nhau thế nào?', 'Precache cache trước các asset build-time như JS/CSS/logo để app load offline. Runtime cache cache khi request xảy ra, ví dụ ảnh/API/CDN.', 'precache manifest do build tạo; runtime cache cho /api/products.'),
  q('PWA', 'Trung bình', 'Service worker update cần chú ý gì?', 'Service worker có lifecycle install, waiting, activate. Bản mới có thể chờ tab cũ đóng. Cần có UX thông báo refresh hoặc skipWaiting/clientsClaim có kiểm soát.', 'Hiển thị toast: Có bản mới, bấm tải lại.'),
  q('PWA', 'Trung bình', 'PWA offline cần cẩn thận điều gì?', 'Không phải API nào cũng cache được. Cần phân biệt public/private data, stale data, logout clear cache, quota storage, cache version và fallback offline UI.', 'Không cache dữ liệu nhạy cảm user bằng Cache Storage bừa bãi.'),
];

const CATEGORIES = ['Tất cả', ...Array.from(new Set(THEORY_BANK.map(item => item.category)))];
const LEVELS = ['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao', 'Thực tế'];

function badgeClass(level) {
  if (level === 'Cơ bản') return 'bg-blue-600 text-white';
  if (level === 'Trung bình') return 'bg-emerald-600 text-white';
  if (level === 'Nâng cao') return 'bg-violet-600 text-white';
  return 'bg-cyan-500 text-slate-950';
}

export default function AppTheory() {
  const [category, setCategory] = useState('Tất cả');
  const [level, setLevel] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return THEORY_BANK.filter(item => {
      const matchCategory = category === 'Tất cả' || item.category === category;
      const matchLevel = level === 'Tất cả' || item.level === level;
      const text = `${item.category} ${item.level} ${item.question} ${item.theory} ${item.example}`.toLowerCase();
      return matchCategory && matchLevel && (!keyword || text.includes(keyword));
    });
  }, [category, level, search]);

  const counts = useMemo(() => {
    return CATEGORIES.reduce((acc, item) => {
      acc[item] = item === 'Tất cả' ? THEORY_BANK.length : THEORY_BANK.filter(q => q.category === item).length;
      return acc;
    }, {});
  }, []);

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10131d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">FE Interview Theory Mode</div>
            <h1 className="text-xl font-black md:text-2xl">Hỏi & hiển thị lý thuyết luôn</h1>
            <p className="text-sm text-slate-400">Không trắc nghiệm nữa. Mỗi mục có câu hỏi, lý thuyết cần trả lời và ví dụ phỏng vấn.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
            <div className="text-2xl font-black text-cyan-200">{THEORY_BANK.length}</div>
            <div className="text-xs text-slate-400">mục lý thuyết</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:grid-cols-[290px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Tìm kiếm</div>
            <input value={search} onChange={e => setSearch(e.currentTarget.value)} className="w-full rounded-2xl border border-white/10 bg-[#121722] px-4 py-3 text-sm outline-none placeholder:text-slate-500" placeholder="Tìm generic, JWT, PWA..." />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Level</div>
            <select value={level} onChange={e => setLevel(e.currentTarget.value)} className="w-full rounded-2xl border border-white/10 bg-[#121722] px-4 py-3 text-sm outline-none">
              {LEVELS.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Chủ đề</div>
            <div className="space-y-1">
              {CATEGORIES.map(item => (
                <button key={item} onClick={() => setCategory(item)} className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${category === item ? 'bg-blue-600/25 text-blue-100 ring-1 ring-blue-400/30' : 'text-slate-300 hover:bg-white/5'}`}>
                  <span>{item}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{counts[item]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main>
          <section className="mb-5 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-500/10 p-5 md:p-7">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">TypeScript + JWT + AJAX/REST + HTML/CSS/JS + Architecture + Performance + PWA</div>
            <h2 className="mt-3 text-2xl font-black md:text-4xl">Ôn lý thuyết FE React 2.5+ năm</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">Dạng này phù hợp để học thuộc ý chính và luyện nói phỏng vấn. Bạn có thể lọc theo chủ đề hoặc search nhanh phần cần ôn.</p>
            <div className="mt-4 text-sm text-slate-400">Đang hiển thị <b className="text-white">{filtered.length}</b>/<b className="text-white">{THEORY_BANK.length}</b> mục.</div>
          </section>

          <div className="space-y-4">
            {filtered.map((item, index) => (
              <article key={`${item.category}-${item.question}`} className="rounded-3xl border border-white/10 bg-[#171922] p-5 shadow-xl shadow-black/20">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${badgeClass(item.level)}`}>{item.level}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">{item.category}</span>
                </div>
                <h3 className="text-lg font-black leading-7 text-white md:text-xl">{item.question}</h3>
                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-slate-200">
                  <b className="text-cyan-200">Lý thuyết trả lời:</b> {item.theory}
                </div>
                {item.example && (
                  <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-cyan-100">
                    <span className="font-sans font-bold text-cyan-300">Ví dụ:</span> {item.example}
                  </div>
                )}
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
