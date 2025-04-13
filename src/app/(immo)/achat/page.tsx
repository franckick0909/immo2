import PageEnterTransition from "@/components/PageEnterTransition";

export default function AchatPage() {
  return (
    <PageEnterTransition>
    <div className="container mx-auto px-4 py-8 min-h-screen bg-emerald-500">
      <h1 className="text-3xl font-bold mb-6 mt-12">
        Achat de biens immobiliers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contenu de la page achat */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nos services d&apos;achat</h2>
          <p className="text-gray-600">
            Découvrez notre sélection de biens immobiliers à acheter.
          </p>
        </div>
      </div>
    </div>
    </PageEnterTransition>
  );
}
