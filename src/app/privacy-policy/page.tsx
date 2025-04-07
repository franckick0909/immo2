export default function PrivacyPolicy() {
    return (
      <div className="flex flex-col items-center justify-center max-w-4xl min-h-screen mx-auto py-10 px-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
        
        <div className="prose max-w-none">
          <p>
            Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Informations que nous collectons</h2>
          <p>
            Nous collectons les informations que vous nous fournissez directement, comme votre nom, adresse e-mail et photo de profil.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Comment nous utilisons vos informations</h2>
          <p>
            Nous utilisons vos informations pour vous fournir nos services, communiquer avec vous et améliorer notre plateforme.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Protection de vos informations</h2>
          <p>
            Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre la perte, l&apos;accès non autorisé, la divulgation, l&apos;altération et la destruction.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
          <p>
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l&apos;adresse suivante : contact@example.com
          </p>
        </div>
      </div>
    );
  }