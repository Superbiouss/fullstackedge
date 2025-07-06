import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('font-headline font-bold text-2xl tracking-tighter', className)}>
      FullStack<span className="text-accent">Edge</span>
    </Link>
  );
}
