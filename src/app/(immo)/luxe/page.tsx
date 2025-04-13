import PageEnterTransition from "@/components/PageEnterTransition";

export default function LuxePage() {
  return (
    <PageEnterTransition>
    <div className="container mx-auto px-4 py-8 bg-sky-500 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 mt-12">
        Biens immobiliers de luxe
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contenu de la page luxe */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nos biens de prestige</h2>
          <p className="text-gray-600">
            Découvrez notre sélection de biens immobiliers d&apos;exception.
          </p>
        </div>
      </div>
    </div>
    </PageEnterTransition>
  );
}
