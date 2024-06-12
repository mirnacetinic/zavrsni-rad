import { PanelNav } from "@/app/components/navigation/panelnav";
import "@/app/(pages)/(boards)/dashboard/style.css";
import getUser from "../../../actions/getUser";


export default async function HostboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();
    if(!user){
        return (<div className="text-lg">You need to sign in to see the hostboard.</div>);
        
    }

    else{
        if(user.role!='HOST'){
            return (<div className="text-lg">You do not have permission to view this site.</div>);
        }

    return (
        <div className="layout">
            <div className="panel-nav">
            <PanelNav path="hostboard" options={['Accommodations', 'Reservations']}/> 
            </div>
            <div className="content overflow-auto">
                {children}
            </div>
        </div>
    );
}
}
