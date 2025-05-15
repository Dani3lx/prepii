import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file" | "textarea";
}

const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => (
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
              className="resize-none min-h-80 bg-white"
            />
          ) : (
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className="bg-white"
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;
