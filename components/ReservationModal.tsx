"use client";

import { useState, useEffect } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name?: string; password?: string }) => void;
  title: string;
  type: "reservation" | "cancel" | "confirm" | "alert";
  defaultValue?: string;
  description?: string;
  infoTag?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  type,
  defaultValue = "",
  description,
  infoTag,
}: ReservationModalProps) {
  const [name, setName] = useState(defaultValue);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(defaultValue);
      setPassword("");
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPassword(val);
  };

  const canConfirm = 
    type === "reservation" ? (name.trim().length > 0 && password.length === 4) :
    type === "cancel" ? password.length === 4 : true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-100 p-8 animate-in zoom-in-95 duration-200 overflow-hidden">
        {infoTag && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-wider uppercase ring-1 ring-inset ring-indigo-500/20">
              {infoTag}
            </span>
          </div>
        )}
        <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
        {description && (
          <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">{description}</p>
        )}

        {(type === "reservation" || type === "cancel") && (
          <div className="space-y-6 mb-8">
            {/* Name Input - Only for reservation */}
            {type === "reservation" && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">예약자 이름</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 10))}
                  placeholder="이름을 입력해주세요"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-base font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
                />
                <p className="mt-2 text-[10px] text-slate-400 font-medium text-right px-1">
                  {name.length} / 10자
                </p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">비밀번호 (4자리)</label>
              <input
                id="password-input"
                autoFocus={type === "cancel"}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-2xl font-bold tracking-[0.5em] text-indent-[0.25em] text-center focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-200"
                autoComplete="off"
              />
              <p className="mt-3 text-[10px] text-slate-400 font-medium text-center italic">
                {type === "reservation" ? "예약 취소 시 필요한 비밀번호입니다." : "예약 시 설정한 비밀번호를 입력해주세요."}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {type !== "alert" && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl text-sm font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              취소
            </button>
          )}
          <button
            disabled={!canConfirm}
            onClick={() => type === "alert" ? onClose() : onConfirm({ name, password })}
            className={`flex-[1.5] px-4 py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-xl disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed ${
              (type === "alert" || type === "cancel") ? "bg-rose-500 shadow-rose-200" : "bg-indigo-600 shadow-indigo-200 active:scale-[0.98]"
            }`}
          >
            {type === "alert" ? "확인" : (type === "confirm" || type === "cancel") ? "삭제하기" : "예약 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}