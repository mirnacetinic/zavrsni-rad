import { getUsers } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";

const UsersPage = async () =>{
    const users = await getUsers();
    return(
        <div className="main-div">
        <div className="title">
            Users
            <Form type='user'/>
        </div>
        <div className="info">
            <InfoCard data={users} type='user'/></div>
        </div>
    )
}

export default UsersPage;