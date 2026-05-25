interface TagProps {
  label: string;
  variant?: 'default' | 'vip' | 'shared';
}

export function Tag({ label, variant = 'default' }: TagProps) {
  return <span className={`tag tag--${variant}`}>{label}</span>;
}
