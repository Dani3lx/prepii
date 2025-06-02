import { getInterviewById } from "@/lib/actions/interview.action";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/data/auth.data";
import { redirect } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const [interview, user] = await Promise.all([
    getInterviewById(id),
    getCurrentUser(),
  ]);

  if (!interview || !user) {
    redirect("/");
  }

  return (
    <>{user && interview && <Agent user={user} interview={interview} />}</>
  );
};

export default Page;
