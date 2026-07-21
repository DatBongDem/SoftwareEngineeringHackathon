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

### Trang/màn hình
- [ ] My Team Page (nếu chưa có đội → hiện form tạo/tham gia; nếu có → hiện Team Detail)
- [ ] Create Team Modal (Leader)
- [ ] Team Detail Page (thông tin đội, danh sách thành viên + trạng thái `isAccepted`)
- [ ] Invite Member Modal (Leader)
- [ ] Join Requests Management (Leader — accept/reject request đang chờ)
- [ ] Register Track Modal (Leader — chọn track từ danh sách của Module 3)
- [ ] Teams List by Event/Track Page (Coordinator/Mentor xem tổng quan)

### Component chính
- [ ] `TeamCard`, `MemberList`, `MemberStatusBadge` (map `TeamStatus` → label/màu, dùng `shared/types/enums.ts`)
- [ ] `CreateTeamForm` (teamName, trackId tuỳ chọn)
- [ ] `InviteMemberForm` (emailOrStudentId)
- [ ] `JoinRequestList` + nút Accept/Reject
- [ ] `RegisterTrackForm`
- [ ] `JoinTeamButton` (gửi join-request)

> Đã có sẵn slice đọc-only (`features/teams/types.ts`, `api/teamsApi.ts::getTeamsByTrack`, `useTeamsByTrack`) làm trước cho Track Detail Page ở Module 3 — chưa có CRUD (create/invite/join/accept/register-track) nào cả, vẫn còn nguyên trong module này.

### API endpoint
- `POST /api/teams`
- `GET /api/teams/{id}`
- `GET /api/events/{eventId}/teams`
- [x] `GET /api/tracks/{trackId}/teams` — đã dùng cho Track Detail Page (Module 3), chỉ đọc
- `POST /api/teams/{teamId}/join-request`
- `POST /api/teams/{teamId}/invite`
- `PUT /api/teams/{teamId}/members/{userId}/accept?accept=true|false`
- `POST /api/teams/{teamId}/register-track`

---

## Module 6: Submission (Nộp bài)

**Bối cảnh:**
- **Role truy cập:** Nộp bài/Sync GitHub — **Team Leader**; Xem — mọi role đã đăng nhập; Disqualify — **Coordinator**.
- **Phụ thuộc module khác:** Team (chỉ leader của team mới nộp được, kiểm tra qua `AuthContext`); Event/Track/Round (submission gắn với 1 round, cần chọn round trước khi nộp — dùng lại data từ Module 2).

### Trang/màn hình
- [ ] Submit Project Page (Leader — trong ngữ cảnh 1 Round cụ thể)
- [ ] Submission Detail Page (mọi role xem: repo/demo/report links, GitHub metadata)
- [ ] Submissions List by Round/Event Page (Coordinator — tổng quan để disqualify)
- [ ] Disqualify Modal (Coordinator, nhập lý do bắt buộc)

### Component chính
- [ ] `SubmissionForm` (repoUrl, demoUrl?, reportUrl?, notes?)
- [ ] `SubmissionCard`, `SubmissionList`
- [ ] `GithubMetadataBadge` (stars/forks/language/openIssues/lastCommitDate)
- [ ] `SyncGithubButton`
- [ ] `DisqualifyForm` (reason bắt buộc)

### API endpoint
- `POST /api/submissions`
- `GET /api/submissions/{id}`
- `GET /api/rounds/{roundId}/submissions`
- `GET /api/events/{eventId}/submissions`
- `POST /api/submissions/{id}/disqualify` *(Coordinator)*
- `POST /api/submissions/{id}/sync-github`

---

## Module 7: Judging (Chấm điểm)

**Bối cảnh:**
- **Role truy cập:** **Judge** (Internal/Guest) và **Coordinator**.
- **Phụ thuộc module khác:** Submission (chấm điểm gắn với 1 submission, tái dùng `GET /api/rounds/{roundId}/submissions` từ Module 6); Criteria (form chấm dựa theo tiêu chí của event, Module 4); Event/Round (round quyết định judge nào được assign, Module 2).
- ⚠️ `GET /api/scoring/submission/{submissionId}` hiện không giới hạn role — bất kỳ user đã đăng nhập nào cũng xem được điểm chi tiết của từng giám khảo (ảnh hưởng tính "chấm kín"), FE có thể tự ẩn UI này với role không phải Judge/Coordinator dù API không chặn.

### Trang/màn hình
- [ ] Judging Queue Page (Judge — danh sách submission cần chấm trong round được assign)
- [ ] Score Submission Page (form nhập điểm theo từng criterion + comment)
- [ ] My Scores Page (Judge xem lại điểm mình đã chấm cho 1 submission)
- [ ] Calibration/Variance Dashboard Page (Judge + Coordinator — phân bố điểm giữa các giám khảo theo criterion trong 1 round hiệu chuẩn)

### Component chính
- [ ] `SubmissionQueueList`
- [ ] `ScoreForm` (list `CriterionScoreItem`: criterionId, score, comment)
- [ ] `CriterionScoreInput` (input điểm giới hạn theo `maxScore` của criterion)
- [ ] `ScoreHistoryList`
- [ ] `VarianceTable`/`VarianceChart` (mean/variance/stddev/totalJudges theo từng criterion — dùng lại ở Module 10)

### API endpoint
- `POST /api/scoring/submit-scores` *(Judge, Coordinator)*
- `GET /api/scoring/submission/{submissionId}`
- `GET /api/scoring/calibration/variance?roundId=` *(Judge, Coordinator)*

---

## Module 8: Ranking (Xếp hạng & Thăng vòng)

**Bối cảnh:**
- **Role truy cập:** Xem bảng xếp hạng — mọi role; Promote (thăng vòng) — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Judging (ranking tính từ Score); Event/Round (ranking theo từng round); Team (hiển thị tên đội trong bảng).
- ⚠️ BE hiện **chỉ có ranking theo Round** (`GET /api/rankings/round/{roundId}`), chưa có API tổng hợp theo Track hay theo toàn Event như `TV.docx` yêu cầu ("xếp hạng đội theo từng vòng, từng Hạng mục và toàn bộ sự kiện") — nếu cần, FE phải tự gộp nhiều round lại phía client hoặc chờ BE bổ sung endpoint.

### Trang/màn hình
- [ ] Round Ranking Page (bảng xếp hạng 1 round — mọi role xem)
- [ ] Promote Teams Action + Confirm Modal (Coordinator)

### Component chính
- [ ] `RankingTable` (rank, teamName, submissionId, finalWeightedScore, isPromoted, isDisqualified)
- [ ] `PromoteButton` + `ConfirmModal`

### API endpoint
- `GET /api/rankings/round/{roundId}`
- `POST /api/rankings/round/{roundId}/promote` *(Coordinator)*

---

## Module 9: Prize (Giải thưởng)

**Bối cảnh:**
- **Role truy cập:** Xem — mọi role; Tạo giải — chỉ **Coordinator**.
- **Phụ thuộc module khác:** Event (prize thuộc event); Team (chọn đội nhận giải); Ranking (thường tạo giải dựa trên kết quả xếp hạng cuối cùng ở Module 8).

### Trang/màn hình
- [ ] Prizes List Page (theo event — mọi role xem, dùng để công bố kết quả)
- [ ] Create Prize Modal (Coordinator)

### Component chính
- [ ] `PrizeList`, `PrizeCard`
- [ ] `CreatePrizeForm` (name, trackId?, teamId, reward)

### API endpoint
- `GET /api/events/{eventId}/prizes`
- `POST /api/events/{eventId}/prizes` *(Coordinator)*

---

## Module 10: Research Data / RBL (Thu thập dữ liệu nghiên cứu)

**Bối cảnh:** tính năng optional theo `TV.docx` ("nếu chọn hướng RBL", nhóm SV làm thêm phần này được cộng điểm).
- **Role truy cập:** **Coordinator** only (theo yêu cầu quản trị dữ liệu nghiên cứu).
- **Phụ thuộc module khác:** Judging (dữ liệu variance ở Module 7, tái sử dụng component `VarianceTable`); Ranking (dữ liệu export); Event (chọn event/round để export).

### Trang/màn hình
- [ ] Export Center Page (Coordinator — 1 trang gom các nút export)
- [ ] Variance Dashboard tổng hợp theo Event (nếu cần xem nhiều round cùng lúc, ngoài view theo round ở Module 7)

### Component chính
- [ ] `ExportRankingsCsvButton`
- [ ] `ExportRblDatasetCsvButton`
- [ ] (tái sử dụng `VarianceTable`/`VarianceChart` từ Module 7)

### API endpoint
- `GET /api/export/rankings/csv?roundId=` *(Coordinator)*
- `GET /api/export/rbl-dataset/csv?eventId=` *(Coordinator)*
- `GET /api/scoring/calibration/variance?roundId=` *(tái sử dụng từ Module 7)*

---

## Module 11: Audit Log (Nhật ký kiểm tra)

> Bổ sung ngoài danh sách module gốc — `TV.docx` yêu cầu rõ "Nhật ký kiểm tra cho tất cả hành động chấm điểm và loại bỏ" để đảm bảo minh bạch, và BE đã có sẵn `AuditLogsController`.

**Bối cảnh:**
- **Role truy cập:** **Coordinator** only.
- **Phụ thuộc module khác:** Event (lọc log theo event); tham chiếu dữ liệu từ Judging (disqualify) và Submission.
- ⚠️ BE hiện **chỉ ghi log cho hành động `SUBMIT_SCORE`**, chưa log disqualify/promote/approve dù `TV.docx` yêu cầu đầy đủ — FE hiển thị đúng dữ liệu BE trả về, phần thiếu log là gap cần báo lại nhóm backend.

### Trang/màn hình
- [ ] Audit Log Page (theo event — bảng log: action, performedBy, targetEntityId, details, timestamp)

### Component chính
- [ ] `AuditLogTable`
- [ ] `AuditLogFilter` (theo event, theo loại action)

### API endpoint
- `GET /api/auditlogs?eventId=` *(Coordinator)*
