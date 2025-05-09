import GenerateForm from "@/components/form/GenerateForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col container px-8 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold tracking-tight">
            Generate an interview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Customize your interview by answering a few quick questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <GenerateForm />
          <div className="h-full bg-gray-100 rounded-3xl max-md:hidden"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
