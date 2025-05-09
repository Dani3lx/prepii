"use client";

import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const Columns: ColumnDef<FeedbackSummary>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = String(row.getValue("company")) || "N/A";
      return <p className="font-medium">{company}</p>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = String(row.getValue("role")) || "N/A";
      return <p className="font-medium">{role}</p>;
    },
  },
  {
    accessorKey: "overallScore",
    header: "Overall",
    cell: ({ row }) => {
      const overall = String(row.getValue("overallScore")) || "N/A";
      return <p className="font-medium">{overall}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return (
        <p className="font-medium">
          {dayjs(row.getValue("createdAt")).format("MMM D, YYYY")}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const feedback = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/interview/${feedback.interviewId}/feedback`}>
                  View Feedback
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
