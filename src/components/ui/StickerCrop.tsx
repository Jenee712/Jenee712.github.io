import type { CSSProperties } from 'react';

type StickerSheet = 'garden' | 'birthday' | 'pink' | 'snack';

const SHEETS: Record<StickerSheet, string> = {
  garden: 'garden-friends.jpg',
  birthday: 'birthday-party.jpg',
  pink: 'pink-buddies.jpg',
  snack: 'snack-time.jpg',
};

interface StickerCropProps {
  sheet: StickerSheet;
  position: string;
  label: string;
  className?: string;
  zoom?: number;
}

/** Shows one motif from the supplied sticker sheets without changing the original artwork. */
export function StickerCrop({ sheet, position, label, className = '', zoom = 340 }: StickerCropProps) {
  const style: CSSProperties = {
    backgroundImage: `url(${import.meta.env.BASE_URL}assets/sticker-sheets/${SHEETS[sheet]})`,
    backgroundPosition: position,
    backgroundSize: `${zoom}% auto`,
  };

  return <span role="img" aria-label={label} className={`sticker-crop ${className}`} style={style} />;
}
