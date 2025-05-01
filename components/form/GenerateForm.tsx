"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { generateInterview } from "@/lib/actions/interview.action";
import { useRouter } from "next/navigation";

const generateFormSchema = () => {
  return z.object({
    role: z.string(),
    company: z.string(),
    description: z.string(),
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

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await getCurrentUser();
    const { role, company, description } = values;
    try {
      const res = await generateInterview({
        role: role,
        company: company,
        description: description,
        userid: user!.id,
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);

      router.push(`/interview/${res.context?.interviewId}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later.");
    }
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
