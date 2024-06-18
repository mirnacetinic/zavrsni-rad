import { getDashUnits } from "@/app/actions/getDashInfo";
import InfoCard from "@/app/components/cards/infocard";
import '../style.css';
import Form from "@/app/components/inputs/form";
import { getAmenities } from "@/app/actions/getInfo";

const UnitsPage = async () =>{
    const units = await getDashUnits();
    const amenities = await getAmenities();
    return(
        <div className="main-div">
            <div className="title">
                Units
                <Form type='unit' amenities={amenities}/>
            </div>
            {units.length!==0 && (
                <div className="info">
                    <InfoCard data={units} type='unit' amenities = {amenities} />
                </div>
                )}
        </div>
    )
}

export default UnitsPage;