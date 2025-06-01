import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container px-8 overflow-x-hidden mt-12 grid lg:grid-cols-6 gap-8">
      <div className="flex flex-col justify-center gap-4 lg:col-span-3">
        <h1 className="text-5xl lg:text-6xl font-bold">
          Ace Every Behavioral Interview with Confidence
        </h1>
        <p className="text-xl font-medium">
          Prepii uses AI to help you prepare for behavioral interviews with live
          practice scenarios and smart personalized feedback.
        </p>
        <Button asChild className="text-md px-5 py-3">
          <Link className="w-fit h-fit" href="/sign-in">
            Get Started Free
          </Link>
        </Button>
      </div>
      <Card className="lg:col-span-3 h-fit w-full">
        <Image src="/dashboard.png" alt="dashboard" width={800} height={687} />
      </Card>
    </div>
  );
}
