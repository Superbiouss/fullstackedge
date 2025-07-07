import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
