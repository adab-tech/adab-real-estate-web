import { redirect } from "next/navigation";

type ListersAliasPageProps = {
  params: Promise<{ username: string }>;
};

export default async function ListersAliasPage({ params }: ListersAliasPageProps) {
  const { username } = await params;
  redirect(`/l/${username.toLowerCase()}`);
}
