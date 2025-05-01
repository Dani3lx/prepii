"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";

const generateFormSchema = () => {
  return z.object({
    role: z.string().optional(),
    company: z.string().optional(),
    description: z.string().optional(),
  });
};

const GenerateForm = () => {
  const formSchema = generateFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      company: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          label="Role"
          placeholder="Frontend-Engineer"
        />

        <FormField
          control={form.control}
          name="company"
          label="Company"
          placeholder="Meta"
        />
        <FormField
          control={form.control}
          name="description"
          label="Job Description"
          placeholder="Paste the job description here..."
          type="textarea"
        />
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Generate Interview
        </Button>
      </form>
    </Form>
  );
};

export default GenerateForm;
