"use client";

import { getInterview } from "@/lib/actions/interview.action";
import React, { useEffect, useState } from "react";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = ({ params }: RouteParams) => {
  const [interview, setInterview] = useState<Interview>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchInterview = async () => {
      const { id } = await params;
      const data = await getInterview(id);
      setInterview(data!);
    };

    const fetchUser = async () => {
      const currUser = await getCurrentUser();
      setUser(currUser!);
    };
    fetchInterview();
    fetchUser();
  }, []);

  return (
    <>{user && interview && <Agent user={user} interview={interview} />}</>
  );
};

export default Page;
