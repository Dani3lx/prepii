import GenerateForm from "@/components/form/GenerateForm";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center mt-24 w-3/5 gap-8">
      <div className="w-1/2 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Generate an interview
          </h1>
          <p className="text-muted-foreground">
            Customize your interview by answering a few quick questions.
          </p>
        </div>

        <GenerateForm />
      </div>
      <div className="h-full w-1/2 bg-gray-100 rounded-3xl"></div>
    </div>
  );
};

export default page;
