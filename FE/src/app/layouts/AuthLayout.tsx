import { Outlet } from 'react-router-dom'
import { Gavel, ShieldCheck, Trophy, Users } from 'lucide-react'

const highlights = [
  { icon: Trophy, text: 'Ba mùa Hackathon mỗi năm: Spring, Summer, Fall' },
  { icon: Users, text: 'Đội thi 3–5 thành viên, mở cho SV FPT và các trường đối tác' },
  { icon: Gavel, text: 'Chấm điểm minh bạch theo tiêu chí, có nhật ký kiểm tra' },
  { icon: ShieldCheck, text: 'Xếp hạng, thăng vòng và trao giải tự động' },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Trophy className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">SEAL Hackathon</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-semibold leading-tight">
              Software Engineering
              <br />
              Agile League
            </h2>
            <p className="mt-3 max-w-sm text-sm text-indigo-100">
              Nền tảng quản lý cuộc thi hackathon học thuật của Khoa Kỹ thuật Phần mềm, phối hợp cùng PDP —
              Trường Đại học FPT TP.HCM.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-indigo-50">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">© {new Date().getFullYear()} SEAL — FPT University HCMC</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-in fade-in">
          <div className="mb-6 text-center lg:hidden">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white">
              <Trophy className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">SEAL Hackathon</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Software Engineering Agile League</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
