import { getInitials } from '../../utils/fieldValue';
import { getAvatarColor } from '../../utils/avatarColors';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

const SIZES = { sm: 24, md: 32, lg: 48 };

export function Avatar({ name, size = 'md', src }: AvatarProps) {
  const px = SIZES[size];
  const initials = getInitials(name);
  const bg = getAvatarColor(name);

  if (src) {
    return (
      <img
        className="avatar"
        src={src}
        alt={name}
        style={{ width: px, height: px }}
      />
    );
  }

  return (
    <span
      className="avatar avatar--initials"
      style={{ width: px, height: px, backgroundColor: bg, fontSize: px * 0.38 }}
      title={name}
    >
      {initials}
    </span>
  );
}
