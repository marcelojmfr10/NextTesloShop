import { Title } from "@/app/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries } from "@/app/actions";

export default async function Home() {
  const countries = await getCountries();

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-250 flex flex-col justify-center text-left">
        <Title title="Dirección" subTitle="Dirección de entrega" />

        <AddressForm countries={countries} />
      </div>
    </div>
  );
}
