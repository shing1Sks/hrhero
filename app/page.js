import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-muted px-6">
      <div className="max-w-3xl text-center space-y-6">
        <div className="w-full flex items-center justify-center">
          <div className="hidden md:flex">
            <Image src="/icon.png" alt="Logo" width={200} height={200} />
          </div>
          <div className="flex md:hidden">
            <Image src="/icon.png" alt="Logo" width={120} height={120} />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to HRHero</h1>
        <p className="text-lg text-muted-foreground">
          Automate resume screening, analyze employee sentiment, and boost
          engagement — all powered by AI.
        </p>
        <Button asChild>
          <Link href="/dashboard">Enter Dashboard</Link>
        </Button>
      </div>

      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        Built by Shreyash Kumar Singh for the HR-Tech Innovation Challenge
      </footer>
    </main>
  );
}
