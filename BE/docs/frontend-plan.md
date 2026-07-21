# Frontend Implementation Plan — SEAL Hackathon Management System

Nguồn nghiệp vụ: `TV.docx` (mô tả hệ thống SEAL — Software Engineering Agile League Hackathon). Nguồn API: các Controller trong `WebAPI/Controllers/*.cs`. File này chia công việc FE theo module nghiệp vụ, dùng để tick tiến độ khi triển khai (`- [ ]` → `- [x]`).

**Role trong hệ thống:** Team Member, Team Leader, Mentor, Judge (Internal/Guest), Event Coordinator.

**Chú giải:**
- `⚠️` = giới hạn/gap đã biết ở backend, cần lưu ý khi implement (không phải lỗi FE).
- Mỗi module có 4 mục cố định: **Trang/màn hình**, **Component chính**, **API endpoint**, và khối **Bối cảnh** (role truy cập + phụ thuộc module khác) ở đầu.

---

## Module 0: Core (Nền tảng dùng chung)

**Bối cảnh:** không thuộc nghiệp vụ cụ thể, mọi module khác đều phụ thuộc vào đây. Không giới hạn role — dùng chung cho tất cả.

### Trang/màn hình
- [x] Root App Shell (khởi tạo `QueryClientProvider`, `AuthProvider`, router)
- [x] Dashboard / trang chủ sau đăng nhập (điều hướng nhanh theo role)
- [x] 404 Not Found
- [x] 403 Forbidden (khi `RoleRoute` chặn do sai role)
- [x] Splash/Loading (khi đang kiểm tra token lúc khởi động app) — xử lý inline trong `ProtectedRoute` bằng `Spinner`, không tách trang riêng

### Component chính
- [x] `MainLayout` (header, nav theo role, `<Outlet/>`)
- [x] `AuthLayout` (khung căn giữa cho Login/Register)
- [x] `ProtectedRoute` (redirect `/login` nếu chưa có token)
- [x] `RoleRoute` (nhận `allowedRoles`, redirect nếu không đúng role)
- [x] `Button`, `Input`, `Textarea`, `Select` (form primitives dùng chung)
- [x] `Card`, `Table`, `Badge`, `Modal`, `Spinner`, `EmptyState`, `Alert`
- [x] `apiClient` (đã có ở `FE/src/shared/lib/apiClient.ts`) + `queryClient` (TanStack Query, cần thêm)
- [x] Xử lý CORS giữa FE dev server và BE (đã thêm `AddCors`/`UseCors` vào `WebAPI/Program.cs`, origin cấu hình qua `Cors:AllowedOrigins`)

### API endpoint
- Không gọi API trực tiếp — là hạ tầng cho các module khác.

---

## Module 1: Auth (Đăng ký / Đăng nhập / Quản lý tài khoản)

**Bối cảnh:**
- **Role truy cập:** Login/Register — public (chưa đăng nhập); My Profile — mọi role đã đăng nhập; Pending Users & Guest Judge — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Core (layout, routing, shared components).

### Trang/màn hình
- [x] Login Page
- [x] Register Page — chọn **FPT Student** (nhập mã số SV), **External Student** (nhập mã số SV + tên trường), hoặc **Lecturer** (tự động gán role Mentor+Judge — theo đúng logic `AuthService.RegisterAsync`)
- [x] My Profile Page (xem thông tin bản thân, trạng thái `isApproved`)
- [x] Pending Users Page (Coordinator — danh sách tài khoản chờ duyệt)
- [x] Guest Judge Management Page (Coordinator — tạo tài khoản giám khảo khách mời)

### Component chính
- [x] `LoginForm` — hiện inline trong `LoginPage`, chưa tách file riêng
- [x] `RegisterForm` + `UserTypeSelector` — hiện inline trong `RegisterPage` (dùng `Select` dùng chung), chưa tách file riêng
- [x] `ProfileCard` — hiện inline trong `ProfilePage`
- [x] `PendingUserList` + nút Approve — dùng `Table` dùng chung trong `PendingUsersPage`
- [x] `CreateGuestJudgeForm` — hiện inline trong `GuestJudgePage`
- [x] `AuthContext` (lưu token + user, expose `login/register/logout`)

### API endpoint
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/me`
- `GET /api/users/pending` *(Coordinator)*
- `PUT /api/users/{id}/approve` *(Coordinator)*
- `POST /api/users/guest-judge` *(Coordinator)*
- `POST /api/auth/google-login` — ⚠️ để dành làm sau, chưa nằm trong scope ban đầu

⚠️ **Phát hiện khi implement:** `POST /api/users/guest-judge` tạo user với `PasswordHash = null` và không set `GoogleId` — tài khoản này **hiện không có cách nào đăng nhập được** (cả email/password lẫn Google). FE đã hiện cảnh báo này ngay trong `GuestJudgePage` để Coordinator biết, nhưng cần báo lại nhóm backend để bổ sung (vd: sinh mật khẩu tạm + hiển thị 1 lần, hoặc link Google).

---

## Module 2: Event (Quản lý sự kiện & vòng thi)

**Bối cảnh:**
- **Role truy cập:** Xem danh sách/chi tiết — mọi role đã đăng nhập; Tạo Event/Round, gán giám khảo — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Auth (biết role hiện tại để hiện nút quản lý); Criteria (form tạo Round cần chọn `criteriaIds` từ tiêu chí của event); Auth/Users (form gán judge vào round cần danh sách user có role Judge — ⚠️ BE hiện **chưa có endpoint liệt kê user theo role**, cần xin BE bổ sung hoặc tạm nhập UserId thủ công).

### Trang/màn hình
- [x] Events List Page
- [x] Event Detail Page (thông tin event + tab Track/Round/Criteria)
- [x] Create Event Modal/Page (Coordinator)
- [x] Create Round Modal (Coordinator, trong Event Detail)
- [x] Assign Judges to Round Modal (Coordinator) — ⚠️ do BE thiếu endpoint liệt kê user theo role, form hiện là ô nhập tay danh sách UserId (xem cảnh báo trong modal)

### Component chính
- [x] `EventCard`, `EventList` — trong `EventsListPage`
- [x] `EventForm` (title, description, academicYear, term, startDate, endDate) — `CreateEventModal`
- [x] `RoundList`, `RoundForm` (roundNumber, name, submissionDeadline, promotionRuleTopN, criteriaIds) — `RoundsPanel` + `CreateRoundModal`
- [x] `AssignJudgesForm` (multi-select judge) — `AssignJudgesModal`, hiện là textarea nhập UserId thay vì multi-select thật (chờ BE bổ sung endpoint)

### API endpoint
- `POST /api/events` *(Coordinator)*
- `GET /api/events`
- `GET /api/events/{id}`
- `POST /api/events/{eventId}/rounds` *(Coordinator)*
- `GET /api/events/{eventId}/rounds`
- `POST /api/rounds/{roundId}/assign-judges` *(Coordinator)*

---

## Module 3: Track (Quản lý hạng mục)

**Bối cảnh:**
- **Role truy cập:** Xem — mọi role; Tạo Track, gán Mentor — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Event (Track thuộc 1 Event); Team (Track Detail hiển thị danh sách đội đã đăng ký); ⚠️ gán Mentor cũng thiếu endpoint liệt kê user theo role, giống gap ở Module 2.

### Trang/màn hình
- [x] Track List (tab trong Event Detail)
- [x] Create Track Modal (Coordinator)
- [x] Assign Mentor Modal (Coordinator) — ⚠️ cùng hạn chế: nhập tay Mentor UserId
- [x] Track Detail Page (danh sách đội đã đăng ký vào track) — ⚠️ BE không có `GET /api/tracks/{trackId}` riêng lẻ, nên trang này cần `eventId` truyền qua query param (`/tracks/:trackId?eventId=`) để tra ngược tên/track info từ danh sách track của event; truy cập trực tiếp link không qua tab Tracks sẽ thiếu context

### Component chính
- [x] `TrackCard`, `TrackList` — trong `TracksPanel`
- [x] `TrackForm` (name, description, maxTeams) — `CreateTrackModal`
- [x] `AssignMentorForm` — `AssignMentorModal`

### API endpoint
- `POST /api/events/{eventId}/tracks` *(Coordinator)*
- `GET /api/events/{eventId}/tracks`
- `POST /api/tracks/{trackId}/assign-mentor` *(Coordinator)*
- `GET /api/tracks/{trackId}/teams`

---

## Module 4: Criteria (Quản lý tiêu chí chấm điểm)

**Bối cảnh:**
- **Role truy cập:** Xem — mọi role; Tạo template/tiêu chí — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Event (tiêu chí gắn với event, dùng để build `RoundForm` ở Module 2); Judging (form chấm điểm ở Module 7 dựa theo danh sách criteria này).

> Đã làm trước một phần nhỏ khi build Module 2 (Round cần chọn `criteriaIds`) — xem ghi chú `[x]` bên dưới. Phần Templates (dùng lại tiêu chí mẫu qua nhiều sự kiện) vẫn **chưa làm**.

### Trang/màn hình
- [ ] Criteria Templates Page (danh sách template mặc định dùng lại qua các sự kiện)
- [x] Event Criteria Tab (trong Event Detail — xem/thêm tiêu chí riêng của event) — `CriteriaPanel`, chưa có UI "kế thừa từ template" vì Templates Page chưa làm
- [x] Create Criteria Modal (Coordinator) — hiện inline trong `CriteriaPanel`, không phải modal riêng

### Component chính
- [x] `CriteriaList`, `CriteriaCard` (hiện name, weight, maxScore) — trong `CriteriaPanel`
- [x] `CriteriaForm` (name, description, weight, maxScore, isDefaultTemplate) — inline trong `CriteriaPanel`, luôn gửi `isDefaultTemplate: false` (tạo criteria riêng cho event, không phải template global)

### API endpoint
- `GET /api/criteria/templates` — ⚠️ chưa dùng, để dành cho Criteria Templates Page
- `POST /api/criteria/templates` *(Coordinator)* — ⚠️ chưa dùng
- [x] `GET /api/events/{eventId}/criteria`
- [x] `POST /api/events/{eventId}/criteria` *(Coordinator)*

---

## Module 5: Team (Quản lý đội thi)

**Bối cảnh:**
- **Role truy cập:** Tạo đội/Invite/Accept-Reject/Đăng ký track — **Team Leader**; Gửi join-request — **Team Member** (user chưa có đội); Xem danh sách đội theo Event/Track — **Coordinator**, **Mentor**.
- **Phụ thuộc module khác:** Event (đội thuộc 1 event); Track (đăng ký đội vào track — dùng lại API list track từ Module 3); Auth (so `currentUserId` với `leaderUserId` để hiện đúng action).

> Thiết kế lại "My Team Page" thành **tab "Teams" trong Event Detail** (giống Tracks/Rounds/Criteria) thay vì route riêng — vì Team luôn gắn với 1 Event, đặt tab ở đây nhất quán với 3 module trước và tránh route mồ côi không có event context. "Teams List by Event" (Coordinator/Mentor overview) dùng chung luôn tab này (mọi role xem được cùng danh sách, không tách trang riêng — BE không giới hạn role ở `GET /api/events/{eventId}/teams`).

### Trang/màn hình
- [x] My Team Page → hiện thực dưới dạng tab **Teams** trong `EventDetailPage` (`TeamsPanel`) — tự tạo đội nếu chưa có, hoặc "Request to join" trên đội bất kỳ trong event
- [x] Create Team Modal (Leader)
- [x] Team Detail Page (route `/teams/:teamId`, dùng thẳng `GET /api/teams/{id}` — không cần workaround `eventId` query param như Track vì BE có endpoint lấy 1 team)
- [x] Invite Member Modal (Leader)
- [x] Join Requests Management (Leader — Accept/Reject ngay trong Team Detail Page, badge "Pending" + 2 nút icon)
- [x] Register Track Modal (Leader — chọn track từ danh sách Module 3)
- [x] Teams List by Event/Track Page (Coordinator/Mentor xem tổng quan) → chính là tab Teams, mọi role xem chung

### Component chính
- [x] `TeamCard` (trong `TeamsPanel`), `MemberList`, `MemberStatusBadge` — dùng `teamStatusLabels`/`teamStatusTones` từ `shared/types/enums.ts`
- [x] `CreateTeamForm` (teamName, trackId tuỳ chọn) — `CreateTeamModal`
- [x] `InviteMemberForm` (emailOrStudentId) — `InviteMemberModal`
- [x] `JoinRequestList` + nút Accept/Reject — inline trong `TeamDetailPage`
- [x] `RegisterTrackForm` — `RegisterTrackModal`
- [x] `JoinTeamButton` (gửi join-request) — nút "Request to join" trong `TeamsPanel` và `TeamDetailPage`

### API endpoint
- [x] `POST /api/teams`
- [x] `GET /api/teams/{id}`
- [x] `GET /api/events/{eventId}/teams`
- [x] `GET /api/tracks/{trackId}/teams` — đã dùng cho Track Detail Page (Module 3), chỉ đọc
- [x] `POST /api/teams/{teamId}/join-request`
- [x] `POST /api/teams/{teamId}/invite`
- [x] `PUT /api/teams/{teamId}/members/{userId}/accept?accept=true|false`
- [x] `POST /api/teams/{teamId}/register-track`

⚠️ **Phát hiện khi implement (đã fix, không phải gap còn tồn đọng):** `shared/components/Input.tsx`/`Select.tsx`/`Textarea.tsx` không tự sinh `id` khi component gọi không truyền `name`/`id` — khiến `<label htmlFor>` không liên kết được với input (ảnh hưởng screen reader, và khiến test tự động không thể `getByLabel`). Đã fix bằng `useId()` làm fallback, áp dụng ngay cho toàn bộ form trong app (Login/Register/mọi modal), không chỉ Module 5.

---

## Module 6: Submission (Nộp bài)

**Bối cảnh:**
- **Role truy cập:** Nộp bài/Sync GitHub — **Team Leader**; Xem — mọi role đã đăng nhập; Disqualify — **Coordinator**.
- **Phụ thuộc module khác:** Team (chỉ leader của team mới nộp được, kiểm tra qua `AuthContext`); Event/Track/Round (submission gắn với 1 round, cần chọn round trước khi nộp — dùng lại data từ Module 2).

> Thiết kế lại "Submit Project" thành **modal mở từ section "Submissions" trong Team Detail Page** (Module 5) thay vì trang riêng — nhất quán với cách Module 5 nhúng mọi action vào Team Detail thay vì route mồ côi. "Submissions List by Round" (Coordinator) dùng route riêng `/rounds/:roundId/submissions?eventId=` (cùng workaround query-param như Track Detail vì BE không có `GET /api/rounds/{id}` đơn lẻ), có link vào từ mỗi round card trong `RoundsPanel`.

### Trang/màn hình
- [x] Submit Project → modal `SubmitProjectModal` mở từ `TeamSubmissionsSection` trong Team Detail Page, chỉ hiện round chưa nộp (lọc theo `roundId` đã có submission)
- [x] Submission Detail Page (route `/submissions/:submissionId`, dùng thẳng `GET /api/submissions/{id}` — có đủ `eventId`/`roundId`/`teamId` nên không cần workaround)
- [x] Submissions List by Round Page (Coordinator — `RoundSubmissionsPage`, route `/rounds/:roundId/submissions?eventId=`) — bảng tổng quan, click vào team → Submission Detail để disqualify (không lặp lại modal ở 2 nơi)
- [x] Disqualify Modal (Coordinator, nhập lý do bắt buộc) — mở từ Submission Detail Page

### Component chính
- [x] `SubmissionForm` (repoUrl, demoUrl?, reportUrl?, notes?) — `SubmitProjectModal`, có màn hình thành công animate (`animate-pop`) trước khi tự đóng
- [x] `SubmissionCard`, `SubmissionList` — `TeamSubmissionsSection` (stagger fade-in-up từng card)
- [x] `GithubMetadataBadge` → nâng cấp thành `GithubMetadataCard` (đẹp hơn plan gốc): 4 stat tile (stars/forks/issues/last commit) với icon màu riêng, dot màu theo ngôn ngữ (hash-based), stagger animation khi data vào
- [x] `SyncGithubButton` — icon xoay khi đang sync
- [x] `DisqualifyForm` (reason bắt buộc) — `DisqualifyModal`

### API endpoint
- [x] `POST /api/submissions`
- [x] `GET /api/submissions/{id}`
- [x] `GET /api/rounds/{roundId}/submissions`
- [x] `GET /api/events/{eventId}/submissions`
- [x] `POST /api/submissions/{id}/disqualify` *(Coordinator)*
- [x] `POST /api/submissions/{id}/sync-github`

⚠️ **Phát hiện khi implement:** `lucide-react` (bản đang dùng, v1.25) đã bỏ toàn bộ icon thương hiệu (`Github`, `Twitter`...) — dùng `FolderGit2` thay thế cho ngữ cảnh "GitHub repo". Đã verify `sync-github` hoạt động đúng với repo GitHub thật (`facebook/react`) — kéo về đúng số liệu sao/fork/issue/last-commit thật qua Playwright.

---

## Module 7: Judging (Chấm điểm)

**Bối cảnh:**
- **Role truy cập:** **Judge** (Internal/Guest) và **Coordinator**.
- **Phụ thuộc module khác:** Submission (chấm điểm gắn với 1 submission, tái dùng `GET /api/rounds/{roundId}/submissions` từ Module 6); Criteria (form chấm dựa theo tiêu chí của event, Module 4); Event/Round (round quyết định judge nào được assign, Module 2).
- ⚠️ `GET /api/scoring/submission/{submissionId}` hiện không giới hạn role — bất kỳ user đã đăng nhập nào cũng xem được điểm chi tiết của từng giám khảo (ảnh hưởng tính "chấm kín"), FE có thể tự ẩn UI này với role không phải Judge/Coordinator dù API không chặn.
- ✅ **Đã sửa bug BE chặn module này**: `ScoreRepository.CreateOrUpdateScoresAsync` trước đây dùng `ReplaceOneAsync(..., IsUpsert = true)` gửi nguyên document (kể cả `Score.Id` chưa set, tức `null`) lên Mongo — driver C# không tự sinh `ObjectId` cho `_id` trong trường hợp này (chỉ tự sinh với `InsertOneAsync` thường), nên document mới thứ 2 trở đi luôn bị `E11000 duplicate key error _id: null`, chặn hoàn toàn việc chấm >1 tiêu chí. Đã đổi sang `UpdateOneAsync` + `$set` từng field (không đụng `_id`) — Mongo tự sinh `_id` khi insert, giữ nguyên khi update. Đã verify thật qua API: chấm 4 tiêu chí trong 1 lần gọi (insert) rồi gọi lại lần 2 với giá trị khác (update) — cả 2 đều trả `200`, không trùng lặp document.

### Trang/màn hình
- [x] Judging Queue Page (`JudgingQueuePage`, route `/judging`) — danh sách round được assign cho judge hiện tại (tự tổng hợp client-side từ `GET /api/events` + `GET /api/events/{id}/rounds` vì BE không có endpoint "rounds theo judge"), mỗi round link sang trang chấm + calibration.
- [x] Score Submission Page — thiết kế lại thành **modal** (`ScoreModal`) mở từ `RoundJudgingPage`, nhất quán với pattern "Submit project" ở Module 6 thay vì trang riêng.
- [x] ~~My Scores Page~~ — không tách trang riêng; `ScoreModal` tự động điền lại điểm + comment đã chấm trước đó của chính judge khi mở lại (đã verify: mở modal cho submission đã chấm hiển thị đúng giá trị/comment cũ), phục vụ luôn nhu cầu "xem lại điểm mình đã chấm".
- [x] Calibration/Variance Dashboard Page (`CalibrationDashboardPage`, route `/rounds/:roundId/calibration`) — bảng mean/variance/stddev/số judge theo từng criterion, đánh dấu "High variance" (badge amber) khi stddev > 1.3× trung bình các criterion trong round.

### Component chính
- [x] `RoundJudgingPage` thay cho `SubmissionQueueList` riêng — liệt kê submission chưa bị loại trong round, badge trạng thái "Not scored yet / N/M criteria scored / Scored" tính từ `GET /api/scoring/submission/{id}` lọc theo judge hiện tại.
- [x] `ScoreModal` (thay `ScoreForm`) — input điểm + comment cho từng criterion, giới hạn `min=0 max={criterion.maxScore}`, cuộn riêng (`max-h-[55vh] overflow-y-auto`) vì Modal dùng chung không tự giới hạn chiều cao.
- [x] `VarianceTable` (thay `VarianceChart` — dùng bảng vì đủ rõ với số criterion ít, chưa cần chart).

### API endpoint
- `POST /api/scoring/submit-scores` *(Judge, Coordinator)*
- `GET /api/scoring/submission/{submissionId}`
- `GET /api/scoring/calibration/variance?roundId=` *(Judge, Coordinator)*

### Verify
- Build + lint pass. Playwright thật với `judge.internal1@fpt.edu.vn`: đăng nhập → thấy nav "Judging" → vào round đã assign → chấm 4 tiêu chí trong 1 lần (test chính xác kịch bản bug BE cũ) → animation "Scores saved!" → badge chuyển "Scored" → mở lại modal thấy điền sẵn điểm/comment cũ → xem Calibration Dashboard thấy đúng mean/stddev/variance tính từ 5 judge (bao gồm dữ liệu test lúc sửa bug BE). Không lỗi console xuyên suốt.

---

## Module 8: Ranking (Xếp hạng & Thăng vòng)

**Bối cảnh:**
- **Role truy cập:** Xem bảng xếp hạng — mọi role; Promote (thăng vòng) — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Judging (ranking tính từ Score); Event/Round (ranking theo từng round); Team (hiển thị tên đội trong bảng).
- ⚠️ BE hiện **chỉ có ranking theo Round** (`GET /api/rankings/round/{roundId}`), chưa có API tổng hợp theo Track hay theo toàn Event như `TV.docx` yêu cầu ("xếp hạng đội theo từng vòng, từng Hạng mục và toàn bộ sự kiện") — nếu cần, FE phải tự gộp nhiều round lại phía client hoặc chờ BE bổ sung endpoint.
- ✅ **Đã sửa bug BE phát hiện khi verify sống**: `RankingService.CalculateRoundRankingAsync` hardcode `IsPromoted = false` cho mọi dòng — không bao giờ đọc `Team.Status` thật, dù `PromoteTopTeamsAsync` cập nhật đúng `Team.Status = Promoted`. Kết quả: bấm "Promote" chạy thành công nhưng badge "Promoted" không bao giờ hiện trên bảng xếp hạng. Đã sửa: join thêm `teamStatusDict` (Id → `TeamStatus`) và set `IsPromoted` theo `Team.Status == TeamStatus.Promoted` thật. Verify lại: cả 2 team đều hiện badge "Promoted" đúng sau khi promote.

### Trang/màn hình
- [x] Round Ranking Page (`RoundRankingPage`, route `/rounds/:roundId/ranking?eventId=`) — mọi role xem, không cần RoleRoute riêng.
- [x] Promote Teams Action + Confirm Modal (`PromoteConfirmModal`, Coordinator-only nút "Promote top N" lấy N từ `round.promotionRuleTopN`).

### Component chính
- [x] `RankingTable` — rank #1 có huy hiệu trophy amber (điểm nhấn duy nhất, không lạm dụng màu accent), score dùng `font-display tabular-nums`, badge Promoted/Disqualified.
- [x] `PromoteConfirmModal` (thay `PromoteButton` riêng — gộp trigger vào `PageHeader` action).
- Link "Ranking" thêm vào `RoundsPanel` cạnh Judge/Submissions/Assign judges.

### API endpoint
- `GET /api/rankings/round/{roundId}`
- `POST /api/rankings/round/{roundId}/promote` *(Coordinator)*

### Verify
- Build + lint pass. Playwright thật (Coordinator): mở Ranking từ tab Rounds → thấy CodeWarriors #1 (86.71, trophy amber), InnovateX #2 (83.75) — điểm tính đúng từ dữ liệu Score thật đã chấm ở Module 7 → bấm Promote → confirm modal → cả 2 team hiện badge "Promoted" (sau khi sửa bug BE ở trên). Dark mode kiểm tra riêng, không lỗi console.

---

## Module 9: Prize (Giải thưởng)

**Bối cảnh:**
- **Role truy cập:** Xem — mọi role; Tạo giải — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Event (prize thuộc event); Team (chọn đội nhận giải); Ranking (thường tạo giải dựa trên kết quả xếp hạng cuối cùng ở Module 8).

### Trang/màn hình
- [x] Prizes List Page — thiết kế thành **tab "Prizes" thứ 5** trong `EventDetailPage` (`PrizesPanel`), nhất quán với Tracks/Rounds/Criteria/Teams thay vì trang riêng.
- [x] Create Prize Modal (`CreatePrizeModal`, Coordinator) — chọn team/track thật qua `Select` (tái dùng `useTeamsByEvent`/`useTracks`), không phải nhập ID tay.

### Component chính
- [x] `PrizesPanel` (thay `PrizeList`) + `PrizeCard` inline — icon trophy nền amber (điểm nhấn "giải thưởng" tự nhiên nhất cho màu accent mới), badge tên đội + hạng mục (nếu có).
- [x] `CreatePrizeModal` (thay `CreatePrizeForm` độc lập).

### API endpoint
- `GET /api/events/{eventId}/prizes`
- `POST /api/events/{eventId}/prizes` *(Coordinator)*

### Verify
- Build + lint pass. Playwright thật (Coordinator): tab Prizes rỗng → tạo giải "Best Overall" chọn team CodeWarriors, phần thưởng "10,000,000 VND + certificate" → card mới hiện đúng ngay, không lỗi console.

---

## Module 10: Research Data / RBL (Thu thập dữ liệu nghiên cứu)

**Bối cảnh:** tính năng optional theo `TV.docx` ("nếu chọn hướng RBL", nhóm SV làm thêm phần này được cộng điểm).
- **Role truy cập:** **Coordinator** only (theo yêu cầu quản trị dữ liệu nghiên cứu).
- **Phụ thuộc module khác:** Judging (dữ liệu variance ở Module 7, tái sử dụng component `VarianceTable`); Ranking (dữ liệu export); Event (chọn event/round để export).

### Trang/màn hình
- [x] Export Center Page — thiết kế thành **tab "Export" thứ 6** trong `EventDetailPage` (`ExportPanel`), **chỉ hiện với Coordinator** (tab bị ẩn hoàn toàn khỏi thanh tab cho role khác, đã verify bằng Playwright đăng nhập Judge — 0 tab Export xuất hiện).
- [x] ~~Variance Dashboard tổng hợp theo Event~~ — không xây riêng (đánh dấu "nếu cần" trong plan gốc, BE cũng không có endpoint tổng hợp nhiều round). Thay vào đó mỗi round trong tab Export có nút "Calibration" link thẳng sang `CalibrationDashboardPage` theo round đã có ở Module 7 — đủ dùng, không trùng lặp component.

### Component chính
- [x] `ExportRblDatasetCsvButton` — nút chính, luôn hiện đầu trang.
- [x] `ExportRankingsCsvButton` — 1 nút mỗi round trong danh sách.
- [x] `ExportPanel` (component gom, thay vì trang riêng).
- [x] `shared/lib/downloadBlob.ts` — helper dùng chung: `apiClient.get(url, { responseType: 'blob' })` rồi tạo `<a download>` tạm thời + `URL.createObjectURL`/`revokeObjectURL`. Cần thiết vì cả 2 endpoint export đều `[Authorize(Roles="Coordinator")]` — không thể dùng link `<a href>` trần (không gắn JWT header), phải fetch qua `apiClient` (đã có interceptor gắn Bearer token) rồi tự trigger download.

### API endpoint
- `GET /api/export/rankings/csv?roundId=` *(Coordinator)*
- `GET /api/export/rbl-dataset/csv?eventId=` *(Coordinator)*
- `GET /api/scoring/calibration/variance?roundId=` *(tái sử dụng từ Module 7)*

### Verify
- Build + lint pass. Playwright thật (Coordinator): mở tab Export → bấm "Export anonymized dataset" → file CSV tải về thật, nội dung đúng format `SubmissionAnonId,JudgeAnonId,CriterionId,CriterionName,Weight,ScoreValue` với ID đã ẩn danh (`SUB_ANON_001`, `JUDGE_ANON_001`...) → bấm "Export CSV" ở 1 round → file `rankings_round_{id}.csv` tải về đúng dữ liệu ranking thật (khớp bảng đã xem ở Module 8). Đăng nhập Judge kiểm tra lại: tab Export không hiện. Không lỗi console.

---

## Module 11: Audit Log (Nhật ký kiểm tra)

> Bổ sung ngoài danh sách module gốc — `TV.docx` yêu cầu rõ "Nhật ký kiểm tra cho tất cả hành động chấm điểm và loại bỏ" để đảm bảo minh bạch, và BE đã có sẵn `AuditLogsController`.

**Bối cảnh:**
- **Role truy cập:** **Coordinator** only.
- **Phụ thuộc module khác:** Event (lọc log theo event); tham chiếu dữ liệu từ Judging (disqualify) và Submission.
- ⚠️ BE hiện **chỉ ghi log cho hành động `SUBMIT_SCORE`**, chưa log disqualify/promote/approve dù `TV.docx` yêu cầu đầy đủ — FE hiển thị đúng dữ liệu BE trả về, phần thiếu log là gap cần báo lại nhóm backend.

### Trang/màn hình
- [x] Audit Log Page — thiết kế thành **tab "Audit Log" thứ 7** trong `EventDetailPage` (`AuditLogPanel`), **chỉ hiện với Coordinator**, nhất quán với tab Export ở Module 10. Bảng sort mới nhất trước.

### Component chính
- [x] `AuditLogTable` — cột Target là link sang `SubmissionDetailPage` khi `action === 'SUBMIT_SCORE'` (đúng ngữ nghĩa hiện tại vì `TargetEntityId` chính là `SubmissionId`); "Performed by" hiển thị raw user ID kèm `Alert` giải thích rõ vì BE chưa có endpoint "get user by ID".
- [x] `AuditLogFilter` — dropdown lọc theo action, options tự sinh từ dữ liệu thật đang có (hiện chỉ có `SUBMIT_SCORE` do gap BE đã ghi ở trên) thay vì liệt kê action giả định chưa tồn tại.

### API endpoint
- `GET /api/auditlogs?eventId=` *(Coordinator)*

### Verify
- Build + lint pass. Playwright thật: Judge chấm điểm mới → Coordinator mở tab Audit Log → entry mới nhất hiện đúng ở đầu bảng (sort mới nhất trước), bấm vào Target link điều hướng đúng sang `SubmissionDetailPage`. Không lỗi console.

---

## UI/UX Design System — Redesign v3 "Academic Prestige" (hoàn thành)

> Áp dụng sau Redesign v2 (elevation scale, focus ring, Skeleton, EmptyState theo ngữ cảnh — đã có từ trước). Redesign v3 thêm bản sắc thị giác riêng (font/màu không còn mặc định Tailwind) + chuyển động (scroll-reveal, count-up, stagger) + dark mode thật. Áp dụng cho toàn bộ trang đã build (Core, Auth, Event, Track, Criteria, Team, Submission, Admin); các module chưa build (Judging, Ranking, Prize, RBL, Audit Log) sẽ dùng design system này ngay từ đầu khi build.

- [x] **Typography**: `@fontsource/lexend` (500/600/700, self-host) cho heading/hero/số liệu lớn qua `font-display` utility; `@fontsource/inter` (400–700) cho body/form/bảng qua `font-sans` (mặc định). Token khai báo trong `index.css` (`@theme { --font-sans; --font-display }`).
- [x] **Bảng màu**: giữ indigo (action) / slate (neutral) / emerald-amber-rose (status), đậm thêm gradient hero (`indigo-700 → slate-900`), thêm **amber làm accent có chủ đích** (giải thưởng, "Active right now", "Your team") — không rải khắp nơi.
- [x] **Dark mode thật**: `@custom-variant dark (&:where(.dark, .dark *))` trong `index.css` để `dark:` theo class `.dark` trên `<html>` thay vì chỉ theo OS. `shared/lib/theme.ts` + `shared/hooks/useTheme.ts` + `shared/components/ThemeToggle.tsx`, lưu `localStorage` (`seal_theme`), mặc định theo system preference. Gắn ở `MainLayout` (sidebar footer + mobile header) và `AuthLayout` (góc trên).
- [x] **Count-up thật**: `Stat.tsx` đếm số 0→target bằng `requestAnimationFrame` (ease-out cubic) khi `value` là số; tôn trọng `prefers-reduced-motion` (nhảy thẳng tới target).
- [x] **Scroll-reveal**: `shared/hooks/useInView.ts` (IntersectionObserver) + `shared/components/Reveal.tsx`, dùng `slide-in-from-bottom` đã có sẵn từ Module 6. Áp cho list/grid: Dashboard (stat cards, quick access), EventsListPage, TracksPanel, RoundsPanel, TeamsPanel, TeamDetailPage (member cards) — không áp cho từng dòng bảng (Table) để tránh rối mắt. Tôn trọng `prefers-reduced-motion` (hiện ngay, không animation).
- [x] **WCAG AA fix thật phát hiện qua đo contrast**: `amber-600` trên nền trắng/`amber-50` chỉ đạt ~3.1–3.2:1 (< 4.5:1 yêu cầu cho text) — đổi sang `amber-700` (~4.8–5.0:1) ở `DashboardPage` (icon Stat) và `TeamsPanel` ("· Your team"). Dark mode variants (`amber-300`/`amber-400` trên nền tối) đã đạt >10:1, không cần đổi.
- [x] Verify: build + lint sau mỗi bước, Playwright thật (light + dark mode, mobile 390px, tablet 768px, keyboard Tab focus ring, `prefers-reduced-motion` emulation) — không chỉ dựa build pass.
