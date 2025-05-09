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
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
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
      setLoading(false);
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
          className={cn(
            "w-full",
            !loading
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-600/70 hover:bg-purple-600/70"
          )}
        >
          {!loading ? (
            "Generate Interview"
          ) : (
            <svg
              aria-hidden="true"
              className="w-8 h-8 animate-spin fill-gray-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default GenerateForm;
