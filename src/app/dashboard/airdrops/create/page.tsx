import { AirdropForm } from "@/components/airdrops/AirdropForm";

export default function CreateAirdropPage() {
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post New Airdrop</h1>
        <p className="text-muted-foreground">Share the next big opportunity with the community.</p>
      </div>
      <AirdropForm /> {/* Render form tanpa initialData */}
    </div>
  );
}