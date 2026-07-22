import { ServiceCard } from "@/components/catalog/ServiceCard";
import { getCatalogServices } from "@/lib/api/catalog";

export default async function CatalogPage() {
  const services = await getCatalogServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase text-muted-foreground">
          Catalog Pricelist
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Layanan Barbershop
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih layanan premium dan nikmati grooming experience terbaik.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
