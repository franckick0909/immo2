


export default async function AchatDetailPage({
    params,
}: {
    params: Promise<{ achatId: string }>
}) {
    const achatId = (await params).achatId;
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Achat {achatId}</h1>
        </div>
    )
}
