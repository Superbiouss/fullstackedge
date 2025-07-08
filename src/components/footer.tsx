import Link from 'next/link';
import { Logo } from './logo';
import { Github, Twitter, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-8">

          {/* Logo and Socials */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <Logo />
              <p className="mt-4 text-muted-foreground text-sm max-w-xs">
                Go from zero to hero with our project-based curriculum.
              </p>
            </div>
            <div className="flex mt-8 space-x-2">
              <Button asChild variant="outline" size="icon" className="text-muted-foreground hover:text-accent hover:border-accent">
                <Link href="#" aria-label="Github">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="text-muted-foreground hover:text-accent hover:border-accent">
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Platform</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/dashboard" className="text-foreground hover:text-accent transition-colors">Courses</Link></li>
                <li><Link href="/community" className="text-foreground hover:text-accent transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="#" className="text-foreground hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-foreground hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              <li>
                <a href="mailto:hello@fullstackedge.com" className="hover:text-accent transition-colors">hello@fullstackedge.com</a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-accent transition-colors">(123) 456-7890</a>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Subscribe</h3>
            <p className="mt-4 text-sm text-muted-foreground">Get the latest news and updates.</p>
            <form className="mt-4">
              <div className="relative flex items-center">
                <Input type="email" placeholder="Your email" className="pr-12" />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-1 text-muted-foreground hover:text-accent">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex items-start space-x-2">
                <Checkbox id="privacy" className="mt-0.5"/>
                <Label htmlFor="privacy" className="text-xs text-muted-foreground font-normal">
                  I have read and agree to the <Link href="#" className="underline hover:text-accent">Privacy Policy</Link>.
                </Label>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} FullStack Edge. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
            <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
