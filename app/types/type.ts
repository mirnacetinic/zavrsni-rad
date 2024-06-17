import { PriceList, Reservation } from "@prisma/client";

export type SafeUser = {
    id : number,
    name : string,
    surname : string,
    email : string,
    favourites : number[] | []
    role : string,
    status : string
    
}

export type AccommodationType = "House" | "Villa" | "Apartment" | "Room";
export type ActiveStatus = "Active" | "Suspended" | "Inactive";


export type SearchAccommodation ={
  id: number;
  title: string;
  description: string;
  type: AccommodationType;
  country: string;
  city: string;
  address: string;
  imageUrl: string | null;
  popularity : number;
  rating : number;
  amenities : string[];
  price : number,
}

export type SafeAccommodation = {
    id: number;
    ownerId: number;
    owner: string;
    title: string;
    description: string;
    type: AccommodationType;
    locationId: number;
    country: string;
    image: string | null;
    imageKey : string | null;
    city: string;
    address: string;
    status: ActiveStatus;
    units? : SafeUnit[] | [];
}

export interface SafeUnit {
  id: number;
  title: string;
  type: AccommodationType;
  description: string;
  capacity: number;
  inquiry : boolean;
  address? : string;
  images: string[];
  imagesKeys : string [];
  amenities: number[],
  amenitiesName? : string[],
  reservations? : Reservation[],
  priceLists : PriceList[];
  closedDates? : {id:number, start : Date, end : Date}[]
}


export interface safeReservation{
    id: number,
    guest: string,
    unit: number,
    unitTitle : string,
    accommodation : number,
    checkIn: string,
    checkOut: string,
    guests: number,
    status : string,
    price : number,
    paymentId : string,
    review? : { rating : number | undefined, hostRating : number | undefined, experience : string | undefined}
}

export const status = [
  "Active",
  "Canceled",
  "Inquiry",
  "Declined",
  "Accepted"
];

export const accommodationType = [
  "Villa",
  "House",
  "Apartment",
  "Room"
]

export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor (Timor-Leste)",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];
