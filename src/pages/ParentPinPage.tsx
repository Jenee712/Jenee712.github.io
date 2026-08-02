import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';

export function ParentPinPage() {
  const nav = useNavigate();
  const verify = useAppStore(s => s.verifyPin);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const press = (k: string) => {
    setError('');
    if (k === '⌫') return setPin(p => p.slice(0, -1));
    if (k === '✓') return submit();
    if (pin.length < 4) setPin(p => p + k);
  };
  const submit = async () => {
    if (pin.length !== 4) { setError('请输入 4 位数字'); return; }
    const ok = await verify(pin);
    if (ok) nav('/parent/center');
    else { setError('PIN 不对，再试一次'); setPin(''); }
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 md:p-8 text-center">
        <Mascot name="bear" size={120} animated />
        <h1 className="type-h1 mt-4">家长中心</h1>
        <p className="type-body text-forest-600/80 mt-1">请输入 4 位 PIN 进入</p>

        <div className="mt-6 flex justify-center gap-3" aria-label="PIN 输入">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className={clsx(
              'w-12 h-14 rounded-barn ring-1 ring-forest-200 flex items-center justify-center text-3xl font-display font-bold',
              pin.length > i ? 'bg-forest-50 text-forest-800' : 'bg-cream-50 text-forest-300',
            )} aria-hidden>
              {pin.length > i ? '•' : ''}
            </span>
          ))}
        </div>

        {error && <p className="mt-3 text-sun-500 font-semibold">{error}</p>}

        <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(k => (
            <button
              key={k}
              onClick={() => press(k)}
              className={clsx(
                'h-14 rounded-barn text-2xl font-display font-bold tap transition',
                k === '✓' ? 'bg-forest-700 text-cream-50 shadow-soft' : 'bg-cream-50 ring-1 ring-forest-200 text-forest-800',
              )}
              aria-label={`按键 ${k}`}
            >{k}</button>
          ))}
        </div>

        <p className="type-meta mt-6">默认 PIN：1234</p>
      </div>
    </div>
  );
}
