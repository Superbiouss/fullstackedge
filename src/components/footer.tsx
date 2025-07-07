import Link from 'next/link';
import { Logo } from './logo';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <Logo />
            <p className="mt-4 text-muted-foreground text-sm max-w-xs">
              Go from zero to hero with our project-based curriculum. Learn to build and deploy real-world applications.
            </p>
          </div>
          <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold font-headline text-foreground">Navigate</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold font-headline text-foreground">Connect</h3>
              <div className="flex mt-4 space-x-4">
                <Link href="#" aria-label="Github" className="text-muted-foreground hover:text-accent transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FullStack Edge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
