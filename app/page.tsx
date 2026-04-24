import Timetable from "@/components/Timetable";
import RealtimeListener from "@/components/RealtimeListener";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      {/* Header & Hero */}
      <div className="bg-white/80 sticky top-0 z-40 glass border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">JMA <span className="text-indigo-600">Timetable</span></h1>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Reservation Status & Guide */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">연습실 예약 현황</h2>
          <p className="text-slate-500 max-w-2xl">모든 예약은 실시간으로 업데이트되며, 원하는 시간을 클릭하여 예약을 시작할 수 있습니다.</p>
        </div>

        {/* Timetable View */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <Suspense fallback={<div className="p-20 text-center text-slate-400">시간표를 불러오는 중...</div>}>
            <Timetable />
          </Suspense>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-4 mt-20 pb-10 border-t border-slate-100 pt-10 text-center text-slate-300 text-sm font-medium">
        <p>연습실 이용 수칙을 준수해 주시기 바랍니다</p>
      </footer>

      {/* Real-time Listener (No UI) */}
      <RealtimeListener />
    </main>
  );
}
