import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-12">
            <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-semibold">404</h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold">Page non trouvée</h2>
            <Link href="/" className="text-blue-800">
                Retour à la page d&apos;accueil
            </Link>
        </div>
    )
}
