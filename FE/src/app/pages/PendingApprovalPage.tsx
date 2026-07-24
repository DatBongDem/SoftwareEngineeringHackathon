import { useState } from 'react'
import { LogOut, RefreshCw, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button, Card } from '@/shared/components'

export function PendingApprovalPage() {
  const { user, refetchUser, logout } = useAuth()
  const [checking, setChecking] = useState(false)

  async function handleCheckStatus() {
    setChecking(true)
    try {
      await refetchUser()
    } catch (err) {
      console.error('Failed to refresh status:', err)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] h-80 w-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] h-80 w-80 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
            Awaiting Approval
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tài khoản của bạn đang được Ban tổ chức xem xét.
          </p>
        </div>

        <Card className="flex flex-col gap-5 border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/80">
          <div className="text-center text-sm text-slate-600 dark:text-slate-350">
            Chào <span className="font-semibold text-slate-900 dark:text-white">{user?.fullName}</span>, tài khoản 
            đăng ký của bạn cần được phê duyệt từ Ban tổ chức (Coordinator) trước khi có thể tham gia cuộc thi.
          </div>

          <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            Hệ thống sẽ tự động duyệt nếu email đăng ký của bạn thuộc định dạng FPT hoặc FE (@fpt.edu.vn hoặc @fe.edu.vn). 
            Nếu không, vui lòng chờ Ban tổ chức xét duyệt thủ công.
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleCheckStatus} loading={checking} className="w-full">
              <RefreshCw className="h-4 w-4" />
              Kiểm tra trạng thái
            </Button>
            <Button variant="secondary" onClick={logout} className="w-full">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} SEAL — FPT University HCMC
        </p>
      </div>
    </div>
  )
}
