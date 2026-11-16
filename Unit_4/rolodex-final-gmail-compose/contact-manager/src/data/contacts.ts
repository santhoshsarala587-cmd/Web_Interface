import type { Contact } from "@/lib/types";

/**
 * Deterministic built-in dataset of 320 realistic contacts.
 * A seeded PRNG keeps ids/values stable across sessions and machines, so the
 * dataset behaves exactly like a fixed JSON fixture but stays compact.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const indianFirst = [
  "Aarav",
  "Aditya",
  "Akash",
  "Ananya",
  "Anjali",
  "Arun",
  "Ashwin",
  "Bhavana",
  "Chitra",
  "Deepak",
  "Divya",
  "Farhan",
  "Gauri",
  "Harish",
  "Ishita",
  "Jayanth",
  "Kavya",
  "Kiran",
  "Lakshmi",
  "Mahesh",
  "Meena",
  "Naveen",
  "Nithya",
  "Pooja",
  "Prakash",
  "Praveen",
  "Priya",
  "Rahul",
  "Rajesh",
  "Ramya",
  "Ravi",
  "Rohit",
  "Sanjay",
  "Saranya",
  "Shalini",
  "Sneha",
  "Sriram",
  "Suresh",
  "Swathi",
  "Tarun",
  "Uma",
  "Vandana",
  "Varun",
  "Vignesh",
  "Vikram",
  "Vishnu",
  "Yamini",
  "Zoya",
];
const indianLast = [
  "Kumar",
  "Sharma",
  "Iyer",
  "Menon",
  "Nair",
  "Reddy",
  "Rao",
  "Patel",
  "Verma",
  "Gupta",
  "Krishnan",
  "Subramanian",
  "Pillai",
  "Das",
  "Joshi",
  "Mehta",
  "Chandran",
  "Balaji",
  "Raj",
  "Naidu",
  "Bhat",
  "Shetty",
  "Desai",
  "Sethu",
];
const intlFirst = [
  "Alex",
  "Amelia",
  "Benjamin",
  "Carla",
  "Daniel",
  "Elena",
  "Felix",
  "Grace",
  "Hannah",
  "Ibrahim",
  "Julia",
  "Kenji",
  "Laura",
  "Marcus",
  "Nadia",
  "Oliver",
  "Priscilla",
  "Quentin",
  "Rachel",
  "Samuel",
  "Tomas",
  "Ursula",
  "Victor",
  "Wei",
];
const intlLast = [
  "Anderson",
  "Baker",
  "Chen",
  "Dubois",
  "Evans",
  "Fischer",
  "Garcia",
  "Hughes",
  "Ivanov",
  "Johnson",
  "Kowalski",
  "Lopez",
  "Martinez",
  "Nakamura",
  "O'Brien",
  "Petrov",
  "Rossi",
  "Silva",
  "Tanaka",
  "Vargas",
  "Williams",
  "Yamada",
];

const companies = [
  "ABC Technologies",
  "XYZ Solutions",
  "Global Systems",
  "Ferro Studio",
  "Northgate Analytics",
  "Brightloop Labs",
  "Quillmark Media",
  "Vanta Retail",
  "Cobalt Financial",
  "Halden Consulting",
  "Tessellate Software",
  "Meridian Logistics",
  "Sunrise Textiles",
  "Kaveri Agro Foods",
  "Prime Health Care",
  "Arcline Engineering",
  "Bluepeak Energy",
  "Orbit Interactive",
  "Lumen Education",
  "Sierra Manufacturing",
  "Redwood Capital",
  "Silverline Motors",
  "Anvaya Infotech",
  "Zenith Pharma",
  "Nimbus Cloudworks",
  "Trident Constructions",
  "Ecliptic Design Co.",
  "Harbourline Exports",
  "Vertex Robotics",
  "Mosaic Hospitality",
];

const jobTitles = [
  "Software Engineer",
  "Sr. Software Engineer",
  "Engineering Manager",
  "Product Manager",
  "UX Researcher",
  "Product Designer",
  "Brand Designer",
  "Data Engineer",
  "Data Analyst",
  "QA Engineer",
  "DevOps Engineer",
  "Sales Lead",
  "Regional Manager",
  "Account Executive",
  "Customer Success Manager",
  "Support Specialist",
  "Recruiter",
  "People Partner",
  "Financial Controller",
  "Accountant",
  "Operations Executive",
  "Supply Chain Analyst",
  "Marketing Manager",
  "Content Strategist",
  "Business Analyst",
  "Legal Counsel",
  "Warehouse Supervisor",
  "Founder",
  "Consultant",
  "Intern",
];

const departments = [
  "Engineering",
  "Design",
  "Sales",
  "Product",
  "Marketing",
  "Finance",
  "Support",
  "People",
  "Operations",
  "Legal",
  "Logistics",
  "Research",
];

const indianPlaces: Array<{ city: string; district: string; state: string; pin: string }> = [
  { city: "Chennai", district: "Chennai", state: "Tamil Nadu", pin: "600" },
  { city: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu", pin: "641" },
  { city: "Madurai", district: "Madurai", state: "Tamil Nadu", pin: "625" },
  { city: "Salem", district: "Salem", state: "Tamil Nadu", pin: "636" },
  { city: "Tiruchirappalli", district: "Tiruchirappalli", state: "Tamil Nadu", pin: "620" },
  { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pin: "560" },
  { city: "Mysuru", district: "Mysuru", state: "Karnataka", pin: "570" },
  { city: "Kochi", district: "Ernakulam", state: "Kerala", pin: "682" },
  { city: "Thiruvananthapuram", district: "Thiruvananthapuram", state: "Kerala", pin: "695" },
  { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pin: "500" },
  { city: "Vijayawada", district: "Krishna", state: "Andhra Pradesh", pin: "520" },
  { city: "Visakhapatnam", district: "Visakhapatnam", state: "Andhra Pradesh", pin: "530" },
  { city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra", pin: "400" },
  { city: "Pune", district: "Pune", state: "Maharashtra", pin: "411" },
  { city: "Nagpur", district: "Nagpur", state: "Maharashtra", pin: "440" },
  { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pin: "380" },
  { city: "Surat", district: "Surat", state: "Gujarat", pin: "395" },
  { city: "Jaipur", district: "Jaipur", state: "Rajasthan", pin: "302" },
  { city: "New Delhi", district: "New Delhi", state: "Delhi", pin: "110" },
  { city: "Gurugram", district: "Gurugram", state: "Haryana", pin: "122" },
  { city: "Noida", district: "Gautam Buddh Nagar", state: "Uttar Pradesh", pin: "201" },
  { city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", pin: "226" },
  { city: "Kolkata", district: "Kolkata", state: "West Bengal", pin: "700" },
  { city: "Bhubaneswar", district: "Khordha", state: "Odisha", pin: "751" },
  { city: "Indore", district: "Indore", state: "Madhya Pradesh", pin: "452" },
  { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pin: "160" },
];

const intlPlaces: Array<{
  city: string;
  district: string;
  state: string;
  country: string;
  pin: string;
}> = [
  {
    city: "London",
    district: "Camden",
    state: "England",
    country: "United Kingdom",
    pin: "NW1 8QP",
  },
  {
    city: "Manchester",
    district: "Salford",
    state: "England",
    country: "United Kingdom",
    pin: "M3 4LZ",
  },
  {
    city: "New York",
    district: "Manhattan",
    state: "New York",
    country: "United States",
    pin: "10016",
  },
  { city: "Austin", district: "Travis", state: "Texas", country: "United States", pin: "78701" },
  {
    city: "San Jose",
    district: "Santa Clara",
    state: "California",
    country: "United States",
    pin: "95110",
  },
  { city: "Toronto", district: "Old Toronto", state: "Ontario", country: "Canada", pin: "M5H 2N2" },
  { city: "Berlin", district: "Mitte", state: "Berlin", country: "Germany", pin: "10117" },
  { city: "Munich", district: "Schwabing", state: "Bavaria", country: "Germany", pin: "80333" },
  {
    city: "Amsterdam",
    district: "Centrum",
    state: "North Holland",
    country: "Netherlands",
    pin: "1012 JS",
  },
  {
    city: "Singapore",
    district: "Downtown Core",
    state: "Central",
    country: "Singapore",
    pin: "049483",
  },
  {
    city: "Dubai",
    district: "Business Bay",
    state: "Dubai",
    country: "United Arab Emirates",
    pin: "00000",
  },
  {
    city: "Sydney",
    district: "Sydney CBD",
    state: "New South Wales",
    country: "Australia",
    pin: "2000",
  },
  { city: "Tokyo", district: "Shibuya", state: "Tokyo", country: "Japan", pin: "150-0002" },
  { city: "Dublin", district: "Dublin 2", state: "Leinster", country: "Ireland", pin: "D02 XY45" },
];

const streets = [
  "MG Road",
  "Anna Salai",
  "Gandhi Street",
  "Nehru Nagar",
  "Park Avenue",
  "Bazaar Street",
  "Temple Road",
  "Lake View Layout",
  "Hill Crest Road",
  "Industrial Estate",
  "Green Park",
  "Station Road",
  "Church Street",
  "Kingsway",
  "Market Square",
  "Harbour Lane",
  "Maple Drive",
  "Cedar Close",
];

const categories = [
  "Personal",
  "Business",
  "Customer",
  "Client",
  "Employee",
  "Student",
  "Vendor",
  "Supplier",
  "Other",
];

const notesPool = [
  "Met at the annual industry summit.",
  "Prefers email over phone calls.",
  "Key decision maker for renewals.",
  "Referred by an existing client.",
  "Follow up next quarter about expansion.",
  "Handles invoicing and purchase orders.",
  "Available only after 6 PM local time.",
  "Long-time contact, very responsive.",
  "Interested in the enterprise plan.",
  "Attends the monthly review call.",
  "",
];

const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "protonmail.com", "hey.com"];

function slugCompany(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12);
}

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

function buildContacts(): Array<Partial<Contact>> {
  const rnd = mulberry32(20260906);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)]!;
  const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));

  const total = 320;
  const contacts: Array<Partial<Contact>> = [];
  const nameSlots: Array<{ first: string; last: string; indian: boolean }> = [];

  // Base names
  for (let i = 0; i < total; i++) {
    const indian = rnd() < 0.75;
    nameSlots.push({
      first: indian ? pick(indianFirst) : pick(intlFirst),
      last: indian ? pick(indianLast) : pick(intlLast),
      indian,
    });
  }
  // Intentionally force duplicate names across records (different details).
  const dupNames: Array<{ first: string; last: string; indian: boolean }> = [
    { first: "Arun", last: "Kumar", indian: true },
    { first: "Rahul", last: "Kumar", indian: true },
    { first: "Priya", last: "Sharma", indian: true },
    { first: "Sanjay", last: "Raj", indian: true },
    { first: "Ananya", last: "Iyer", indian: true },
    { first: "Vignesh", last: "Rao", indian: true },
    { first: "Daniel", last: "Silva", indian: false },
    { first: "Grace", last: "Chen", indian: false },
  ];
  let slot = 0;
  for (const dn of dupNames) {
    const copies = int(3, 5);
    for (let c = 0; c < copies; c++) {
      const idx = (slot * 7 + 3) % total;
      nameSlots[idx] = { ...dn };
      slot++;
    }
  }

  const now = Date.UTC(2026, 8, 1, 9, 0, 0);
  for (let i = 0; i < total; i++) {
    const { first, last, indian } = nameSlots[i]!;
    const company = pick(companies);
    const jobTitle = pick(jobTitles);
    const department = pick(departments);
    const isIndia = indian ? rnd() < 0.93 : rnd() < 0.15;

    let city: string,
      district: string,
      state: string,
      country: string,
      pincode: string,
      phone: string,
      altPhone: string;
    if (isIndia) {
      const p = pick(indianPlaces);
      city = p.city;
      district = p.district;
      state = p.state;
      country = "India";
      pincode = p.pin + pad(int(1, 999), 3);
      phone = `+91 ${int(70000, 99999)} ${pad(int(0, 99999), 5)}`;
      altPhone = `+91 ${int(70000, 99999)} ${pad(int(0, 99999), 5)}`;
    } else {
      const p = pick(intlPlaces);
      city = p.city;
      district = p.district;
      state = p.state;
      country = p.country;
      pincode = p.pin;
      const cc = pick(["+1", "+44", "+49", "+65", "+61", "+81", "+31", "+971", "+353"]);
      phone = `${cc} ${int(200, 989)} ${pad(int(0, 9999), 4)}`;
      altPhone = `${cc} ${int(200, 989)} ${pad(int(0, 9999), 4)}`;
    }

    const cslug = slugCompany(company);
    const handle = `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}`;
    const email = `${handle}${int(1, 99)}@${cslug}.com`;
    const alternateEmail = `${handle}.${int(10, 99)}@${pick(emailDomains)}`;
    const age = int(21, 62);
    const dobYear = 2026 - age;
    const dobMonth = int(1, 12);
    const dobDay = int(1, 28);
    const createdAt = new Date(now - int(1, 900) * 86400000 - int(0, 86399) * 1000).toISOString();
    const updatedOffset = int(0, 60) * 86400000;
    const updatedAt = new Date(Math.min(now, Date.parse(createdAt) + updatedOffset)).toISOString();

    contacts.push({
      id: `CT-${pad(i + 1, 4)}`,
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      phone,
      alternatePhone: rnd() < 0.8 ? altPhone : "",
      email,
      alternateEmail: rnd() < 0.7 ? alternateEmail : "",
      gender: pick(["Male", "Female"]),
      age,
      dateOfBirth: `${dobYear}-${pad(dobMonth, 2)}-${pad(dobDay, 2)}`,
      company,
      jobTitle,
      department,
      address: `${int(1, 240)}, ${pick(streets)}${rnd() < 0.5 ? `, Block ${pick(["A", "B", "C", "D"])}` : ""}`,
      city,
      district,
      state,
      country,
      pincode,
      website: rnd() < 0.75 ? `https://www.${cslug}.com` : "",
      linkedin: rnd() < 0.8 ? `https://linkedin.com/in/${handle}${int(1, 999)}` : "",
      category: pick(categories),
      notes: pick(notesPool),
      createdAt,
      updatedAt,
    });
  }

  return contacts;
}

export const seedContacts: Array<Partial<Contact>> = buildContacts();
