import { getUnits } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";

const UnitsPage = async () =>{
    const units = await getUnits();
    return(
        <div className="main-div">
        <div className="title">
            Units
            <Form type='unit'/>
        </div>
        {units.length!==0 &&(
        <div className="info"><InfoCard data={units} type='unit' /></div>
    )}
        </div>
    )
}

export default UnitsPage;