import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, CodeXml, Layers, TerminalSquare } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              Master Full-Stack Development
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Go from zero to hero with our project-based curriculum. Learn to build and deploy real-world applications.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="font-bold text-lg">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-accent">Why FullStack Edge?</h2>
              <p className="mt-2 text-lg text-muted-foreground">The best place to build your developer career.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="p-3 rounded-md bg-accent/10 border border-accent/20 text-accent">
                  <CodeXml className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold font-headline">Hands-On Learning</h3>
                <p className="mt-2 text-muted-foreground">
                  Stop watching, start doing. Build complex projects from scratch and solidify your skills.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="p-3 rounded-md bg-accent/10 border border-accent/20 text-accent">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold font-headline">Cutting-Edge Tech</h3>
                <p className="mt-2 text-muted-foreground">
                  Master the modern stack: Next.js, Firebase, Tailwind CSS, and more. Stay ahead of the curve.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="p-3 rounded-md bg-accent/10 border border-accent/20 text-accent">
                  <TerminalSquare className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-bold font-headline">Real-World Skills</h3>
                <p className="mt-2 text-muted-foreground">
                  Gain practical experience that employers are looking for. Deploy your projects and build your portfolio.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
