import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Ctx = createContext(null);
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = 'info') => {
    const id = Math.random();
    setItems((l) => [...l, { id, message, type }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 4000);
  }, []);
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const colors = { success: 'text-emerald-500', error: 'text-red-500', info: 'text-brand' };
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2">
        {items.map((t) => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className="flex max-w-sm items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-card">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${colors[t.type]}`} />
              <p className="text-sm font-medium">{t.message}</p>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
