import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container px-8 overflow-x-hidden mt-24 grid lg:grid-cols-7 gap-8">
      <div className="flex flex-col justify-center gap-8 lg:col-span-4">
        <h1 className="text-5xl lg:text-7xl font-bold">
          Ace Every Behavioral Interview with Confidence
        </h1>
        <p className="text-xl lg:text-2xl text-gray-500">
          Prepii uses AI to help you prepare for behavioral interviews with live
          practice scenarios and smart personalized feedback.
        </p>
        <Button asChild className="text-md p-8 w-fit">
          <Link href="/sign-in">Get Started Free</Link>
        </Button>
      </div>
      <Card className="lg:col-span-3 h-fit w-full">
        <Image src="/dashboard.png" alt="dashboard" width={800} height={687} />
      </Card>
    </div>
  );
}
