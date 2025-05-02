import { Button } from "@/components/ui/button";
import { getInterview } from "@/lib/actions/interview.action";
import React from "react";
import Image from "next/image";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const interview = await getInterview(id);

  return (
    <div className="alt-background rounded-xl shadow-sm border p-8 md:p-10 mt-24 w-3/5 flex flex-col justify-center items-center gap-8 h-[66vh]">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
        {interview?.role ? interview?.role : "Behavioural"} Interview with{" "}
        {interview?.company ? interview?.company : "Lily"}
      </h1>
      <div className="flex flex-col gap-4">
        <Image
          src="/interviewer.svg"
          alt="interviewer"
          width={120}
          height={120}
        />
        <p>Lily is in this call</p>
      </div>

      <Button className="w-1/3 p-6">Join Call</Button>
    </div>
  );
};

export default page;
