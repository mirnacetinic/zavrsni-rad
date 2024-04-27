import getInfo from "../actions/getInfo";
import ObjectCard from "../components/cards/objectcard";
import Searchbar from "../components/navigation/searchbar";

const Objects = async ({ searchParams }: { searchParams?: { whereTo?: string; checkIn?: string; checkOut?: string; guests?: string } }) => {
  const objects = await getInfo('objects', searchParams);

  const mockupFilters = [
    { label: "Filter 1", value: "filter1" },
    { label: "Filter 2", value: "filter2" },
    { label: "Filter 3", value: "filter3" },
  ];

  return (
    <div className="flex bg-gray-200">
      <div className="w-1/4 bg-opacity-60 bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <ul>
          {mockupFilters.map((filter, index) => (
            <li key={index} className="mb-2">
              <input type="checkbox" className="mr-2" id={filter.label} />
              <label htmlFor={`filter-${index}`}>{filter.label}</label>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Searchbar small searchParams={searchParams} />
        </div>

        <div className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {objects.length === 0 ? (
            <div className="text-gray-600">Sorry, no matches!</div>
          ) : (
            objects.map((object: any) => (
              <ObjectCard key={object.id} data={object} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Objects;
