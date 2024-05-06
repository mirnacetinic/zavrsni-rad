'use client';
import { Unit} from "@prisma/client";
import CustomCalendar from "../inputs/customcalendar";

interface UnitCardProps {
    key : number,
    unit: Unit;
}

const UnitCard = ({key, unit} : UnitCardProps) => {
    return (
        <div className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="relative">
                       <img src="https://via.placeholder.com/400" alt="Object" className="h-48 w-full object-cover object-center" />
                            <div className="px-4 top-0 bottom-0 bg-black opacity-50">
                                <h3 className="text-lg font-semibold text-white top-4 left-4">
                                        {unit.type} {unit.title}
                                </h3>
                            </div>
                   
            <div className="p-4">
                <p className="text-gray-600 mb-2">{unit.description}</p>
                <div className="flex items-center">
                </div>
            </div>
        </div>
        <div className="absolute my-4 right-10">
        <CustomCalendar onSelect={()=>{}} hidden={false}/>
        </div>
    </div>
)};

export default UnitCard;
