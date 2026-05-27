import logo from '../../assets/sportsnest-logo.png';
import { cn } from '../../utils/cn';

export default function BrandLogo({ className, imageClassName, compact = false }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src={logo}
        alt="SportsNest"
        className={cn(
          'shrink-0 rounded-xl object-contain',
          compact ? 'h-12 w-12' : 'h-20 w-auto',
          imageClassName
        )}
      />
    </div>
  );
}
