import { getAmenities } from "@/app/actions/getInfo";
import InfoCard from "@/app/components/cards/infocard";
import Form from "@/app/components/inputs/form";

const AmenityPage = async () => {
    const amenities = await getAmenities();
    return (
        <div className="main-div">
            <div className="title">
                Amenities
                <Form type='amenity'/>
            </div>
            {amenities.length!== 0 &&(
            <div className="info">
                <InfoCard data={amenities} type="amenity" />
            </div>)}
        </div>
    );
};

export default AmenityPage;
