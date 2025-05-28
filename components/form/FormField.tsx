"use client";
import React, { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "email" | "password" | "file" | "textarea";
}

const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  description,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <RHFFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid gap-2">
          <FormLabel className="text-base">{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className="resize-none min-h-80 pr-8"
              />
            ) : (
              <div className="relative">
                <Input
                  type={inputType}
                  placeholder={placeholder}
                  {...field}
                  className="pr-8 py-2"
                />
                {description && (
                  <FormDescription className="mt-2">
                    {description}
                  </FormDescription>
                )}
                {type === "password" && (
                  <button
                    className="absolute top-[12px] right-2"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400" strokeWidth={1.2} />
                    ) : (
                      <Eye className="text-gray-400" strokeWidth={1.2} />
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
