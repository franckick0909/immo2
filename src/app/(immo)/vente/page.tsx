import PageEnterTransition from "@/components/PageEnterTransition";

export default function VentePage() {
  return (
    <PageEnterTransition>
    <div className="container mx-auto px-4 py-8 bg-rose-500 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 mt-12">
        Vente de biens immobiliers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contenu de la page vente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nos services de vente</h2>
          <p className="text-gray-600">
            Trouvez le meilleur prix pour votre bien immobilier.
          </p>
        </div>
      </div>
    </div>
    </PageEnterTransition>
  );
}




{/*

{showOverlay && (
          <motion.div
            key={`overlay-${pathname}`}
            className="fixed inset-0 z-10 bg-black"
            initial={{ clipPath: `inset(100% 0 0 0)`, opacity: 1 }}
            animate={{ clipPath: `inset(0 0 0 0)`, opacity: 1,
              transition: {
                duration: 1,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            exit={{
              clipPath: [ `inset(100% 0 0 0)`],
              transition: {
                clipPath: {
                  duration: 0.7,
                  ease: [0.76, 0, 0.24, 1],
                },
              },
            }}
          />
        )}

*/}


{/*

<AnimatePresence mode="wait">
        {showOverlay && (
          <>
           // Overlay principal 
            <motion.div
              key={`overlay-${pathname}`}
              className="fixed inset-0 z-10 bg-white"
              initial={{ clipPath: `inset(100% 0 0 0)`, opacity: 1 }}
              animate={{
                clipPath: `inset(0 0 0 0)`,
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
              exit={{
                clipPath: [`inset(0 0 100% 0)`],
                opacity: 0,
                transition: {
                  clipPath: {
                    duration: 0.5,
                    ease: [0.76, 0, 0.24, 1],
                  },
                },
              }}
            />
          // Overlay gauche 
            <motion.div
              key={`overlay-left-${pathname}`}
              className="fixed inset-0 z-20 bg-gray-200"
              initial={{ clipPath: `inset(0 50% 0 0)`, opacity: 0 }}
              animate={{
                clipPath: `inset(0 50% 0 0)`,
                opacity: 1,
                transition: {
                  delay: 0.7,
                  duration: 0.8,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
              exit={{
                clipPath: [
                  `inset(0 50% 0 0)`,
                  `inset(0 100% 0 0)`,
                ],
                transition: {
                  duration: 1.2,
                  times: [0, 1],
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
            />
          // Overlay droit 
            <motion.div
              key={`overlay-right-${pathname}`}
              className="fixed inset-0 z-20 bg-gray-200"
              initial={{ clipPath: `inset(0 0 0 50%)`, opacity: 0 }}
              animate={{
                clipPath: `inset(0 0 0 50%)`,
                opacity: 1,
                transition: {
                  delay: 0.7,
                  duration: 0.8,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
              exit={{
                clipPath: [
                  `inset(0 0 0 50%)`,
                  `inset(0 0 0 100%)`,
                ],
                transition: {
                  duration: 1.2,
                  times: [0, 1],
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
            />
          </>
        )}
      </AnimatePresence>


*/}
