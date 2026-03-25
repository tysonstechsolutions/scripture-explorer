import { Header } from "@/components/layout/Header";
import { DonationForm } from "@/components/donate/DonationForm";

export default function DonatePage() {
  return (
    <>
      <Header title="Donate" showBack />
      <main className="p-4 pb-24 max-w-md mx-auto">
        <DonationForm />
      </main>
    </>
  );
}
