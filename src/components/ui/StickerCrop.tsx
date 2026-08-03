import type { CSSProperties } from 'react';

export type StickerSheet =
  | 'garden' | 'birthday' | 'pink' | 'snack'
  | 'autumnCozy' | 'autumnBotany' | 'chocolate' | 'kindWords'
  | 'spring' | 'breakfast' | 'happyDay';

const SHEETS: Record<StickerSheet, string> = {
  garden: 'garden-friends.jpg',
  birthday: 'birthday-party.jpg',
  pink: 'pink-buddies.jpg',
  snack: 'snack-time.jpg',
  autumnCozy: 'autumn-cozy.jpg',
  autumnBotany: 'autumn-botany.jpg',
  chocolate: 'chocolate-friends.jpg',
  kindWords: 'kind-words.jpg',
  spring: 'spring-friends.jpg',
  breakfast: 'breakfast-friends.jpg',
  happyDay: 'happy-day.jpg',
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
