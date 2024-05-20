import Searchbar from "./components/navigation/searchbar";

export default function Home() {
  return (
    <div>
      <div className="h-[90vh] bg-cover bg-center" style={{backgroundImage: 'url("/images/sky.jpg")'}}>
        <div className="flex items-center justify-center h-full">
          <Searchbar/>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 relative z-10">
        <h2 className="text-2xl font-bold mb-4">Most popular destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Split, Croatia</h3>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et velit nec urna imperdiet consectetur.</p>
            <a href="#" className="text-blue-500 mt-2 inline-block">Read more</a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Crikvenica, Croatia</h3>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et velit nec urna imperdiet consectetur.</p>
            <a href="#" className="text-blue-500 mt-2 inline-block">Read more</a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Zadar, Croatia</h3>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et velit nec urna imperdiet consectetur.</p>
            <a href="#" className="text-blue-500 mt-2 inline-block">Read more</a>
          </div>
        </div>
      </div>
    </div>
  );
}
