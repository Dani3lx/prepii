import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center h-[66vh] w-3/5">
      <div className="flex flex-col gap-8">
        <h1 className="text-9xl font-bold">Prepii</h1>
        <p className="text-2xl text-gray-500">
          Prep Smarter, Ace Every Behavioral Interview.
        </p>
        <Button asChild className="text-2xl p-8 w-fit">
          <Link href="/sign-in">Get Started Today!</Link>
        </Button>
      </div>
    </div>
  );
}
