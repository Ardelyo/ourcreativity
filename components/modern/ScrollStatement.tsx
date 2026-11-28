import React, { useEffect, useRef } from 'react';

export type StatementToken = string | { img: string };

interface Props {
  tokens: StatementToken[];
  className?: string;
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Pernyataan besar yang menyala kata demi kata mengikuti gulir. Token { img } menjadi gambar mungil sebaris
// yang melebar saat gilirannya tiba. Tanpa JS atau dengan gerak berkurang, seluruh teks langsung tampil.
export const ScrollStatement: React.FC<Props> = ({ tokens, className = '' }) => {
  const box = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    const items = Array.from(host.querySelectorAll<HTMLElement>('[data-t]'));
    const apply = (lit: number) => {
      items.forEach((el, i) => {
        const k = clamp01(lit - i);
        if (el.dataset.t === 'w') {
          el.style.color = k > 0.5 ? '#0E0E0F' : '#BDBDBA';
        } else {
          el.style.width = `${(0.2 + 1.5 * k).toFixed(3)}em`;
          el.style.opacity = String(0.25 + 0.75 * k);
          el.style.transform = `rotate(${((1 - k) * -8).toFixed(2)}deg)`;
        }
      });
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(items.length + 2);
      return;
    }
    let raf = 0;
    let cur = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01((vh * 0.82 - r.top) / (r.height + vh * 0.35));
      const target = p * (items.length + 2);
      cur += (target - cur) * 0.12;
      apply(cur);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tokens]);

  return (
    <p ref={box} className={className}>
      {tokens.map((t, i) =>
        typeof t === 'string' ? (
          <React.Fragment key={i}>
            <span data-t="w" style={{ color: '#BDBDBA', transition: 'color 0.3s' }}>{t}</span>{' '}
          </React.Fragment>
        ) : (
          <React.Fragment key={i}>
            <span
              data-t="i"
              aria-hidden
              className="relative top-[0.08em] mx-[0.08em] inline-block h-[0.82em] overflow-hidden rounded-[0.12em] bg-[#D6D6D3] align-baseline"
              style={{ width: '0.2em', opacity: 0.25 }}
            >
              <img src={t.img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </span>{' '}
          </React.Fragment>
        ),
      )}
    </p>
  );
};
