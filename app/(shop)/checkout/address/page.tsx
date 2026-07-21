import { Title } from "@/app/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries, getUserAddress } from "@/app/actions";
import { auth } from "@/app/auth";

export default async function Home() {
  const countries = await getCountries();

  const session = await auth();
  if (!session?.user) {
    return <h3 className="text-5xl">500 - No hay sesión de usuario</h3>;
  }

  const userAddress = (await getUserAddress(session.user.id)) ?? undefined;

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-250 flex flex-col justify-center text-left">
        <Title title="Dirección" subTitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}
