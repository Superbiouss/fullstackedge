import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ '--header-height': '65px' } as React.CSSProperties}>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
