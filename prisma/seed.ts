import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const streams = {
  ENGINEERING: "Engineering",
  MANAGEMENT: "Management",
  MEDICAL: "Medical",
  ARTS: "Arts",
  SCIENCE: "Science",
};

const collegeData = [
  // Engineering Colleges
  {
    name: "Indian Institute of Technology Bombay (IIT Bombay)",
    description: "Established in 1958, IIT Bombay is one of the premium public engineering institutions in India. Famous for its highly selective admissions, state-of-the-art research laboratories, and robust entrepreneurship ecosystem (SINE), it occupies a lush campus in Powai, Mumbai. Key highlights include exceptional placements and the famous annual cultural festival Mood Indigo.",
    location: "Mumbai",
    state: "Maharashtra",
    established: 1958,
    type: "Public",
    rating: 4.9,
    averageFees: 220000,
    highestPlacement: 46.5,
    averagePlacement: 21.8,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Research Lab,Incubation Center",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 220000, seats: 120 },
      { name: "B.Tech Electrical Engineering", duration: 4, fees: 220000, seats: 100 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 220000, seats: 120 },
      { name: "M.Tech Microelectronics", duration: 2, fees: 90000, seats: 40 },
    ],
    companies: "Google,Microsoft,Apple,Qualcomm,Uber,Tower Research",
  },
  {
    name: "Indian Institute of Technology Delhi (IIT Delhi)",
    description: "IIT Delhi, located in Hauz Khas, is a beacon of scientific education and research in India. Known for its strong academic rigor, modern research infrastructure, and high-impact industry alliances, the campus provides students with immense opportunities. Placements consistently place graduates in global technology giants and cutting-edge startups.",
    location: "New Delhi",
    state: "Delhi",
    established: 1961,
    type: "Public",
    rating: 4.8,
    averageFees: 220000,
    highestPlacement: 44.0,
    averagePlacement: 20.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Incubation Center",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 220000, seats: 110 },
      { name: "B.Tech Mathematics and Computing", duration: 4, fees: 220000, seats: 60 },
      { name: "B.Tech Chemical Engineering", duration: 4, fees: 210000, seats: 90 },
    ],
    companies: "Microsoft,Amazon,Google,Goldman Sachs,Intel,Nvidia",
  },
  {
    name: "Indian Institute of Technology Madras (IIT Madras)",
    description: "Ranked as the top engineering institute in India by NIRF for multiple consecutive years, IIT Madras features an expansive forested campus in Chennai. It houses the country's first university-driven research park (IITM Research Park), propelling outstanding research and corporate incubation. Its alumni base is globally renowned.",
    location: "Chennai",
    state: "Tamil Nadu",
    established: 1959,
    type: "Public",
    rating: 4.9,
    averageFees: 225000,
    highestPlacement: 48.2,
    averagePlacement: 22.1,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Research Park,Swimming Pool",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 225000, seats: 115 },
      { name: "B.Tech Aerospace Engineering", duration: 4, fees: 225000, seats: 50 },
      { name: "B.Tech Engineering Physics", duration: 4, fees: 225000, seats: 45 },
    ],
    companies: "Google,Rubrik,Salesforce,Texas Instruments,Jane Street",
  },
  {
    name: "Birla Institute of Technology and Science, Pilani (BITS Pilani)",
    description: "A premier private deemed university known for its legendary 'Zero Attendance' policy, BITS Pilani offers students extreme academic flexibility and independence. With campuses in Pilani, Goa, Hyderabad, and Dubai, BITS provides stellar undergraduate educations and runs the unique Practice School (industry internship) curriculum program.",
    location: "Pilani",
    state: "Rajasthan",
    established: 1964,
    type: "Private",
    rating: 4.7,
    averageFees: 550000,
    highestPlacement: 38.0,
    averagePlacement: 18.2,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Practice School,Student Clubs",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 550000, seats: 150 },
      { name: "B.E. Electronics & Communication", duration: 4, fees: 550000, seats: 120 },
      { name: "B.E. Mechanical Engineering", duration: 4, fees: 520000, seats: 120 },
    ],
    companies: "Apple,Microsoft,Uber,Goldman Sachs,Qualcomm,Amazon",
  },
  {
    name: "National Institute of Technology, Trichy (NIT Trichy)",
    description: "The top-ranked NIT in India, NIT Trichy is a public technical university in Tamil Nadu. Spread over 800 acres, it represents a miniature township. It boasts outstanding alumni, rich student activities, and strong placement tracks, making it highly competitive and second only to premium IITs.",
    location: "Tiruchirappalli",
    state: "Tamil Nadu",
    established: 1964,
    type: "Public",
    rating: 4.5,
    averageFees: 150000,
    highestPlacement: 35.0,
    averagePlacement: 14.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 150000, seats: 100 },
      { name: "B.Tech Electronics & Communication", duration: 4, fees: 150000, seats: 100 },
    ],
    companies: "Microsoft,Nvidia,Cisco,Qualcomm,Oracle,Deloitte",
  },
  {
    name: "National Institute of Technology, Surathkal (NITK Surathkal)",
    description: "NITK Surathkal boasts a unique coastal campus with its own private beach on the Arabian Sea in Karnataka. It provides a marvelous ecosystem for studies, research, and sports, with spectacular academic output and highly competitive placements.",
    location: "Mangalore",
    state: "Karnataka",
    established: 1960,
    type: "Public",
    rating: 4.4,
    averageFees: 155000,
    highestPlacement: 34.0,
    averagePlacement: 13.9,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Beach Access,Boat Club",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 155000, seats: 110 },
      { name: "B.Tech Information Technology", duration: 4, fees: 155000, seats: 90 },
    ],
    companies: "Uber,Microsoft,Amazon,Wells Fargo,Qualcomm",
  },
  {
    name: "Delhi Technological University (DTU)",
    description: "Formerly known as Delhi College of Engineering (DCE), DTU is one of India's oldest and most prestigious engineering institutions. Located in Rohini, Delhi, it is celebrated for its huge cultural events, stellar automotive research projects, and top-tier placement records.",
    location: "New Delhi",
    state: "Delhi",
    established: 1941,
    type: "Public",
    rating: 4.4,
    averageFees: 190000,
    highestPlacement: 36.0,
    averagePlacement: 15.2,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Automotive Labs",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 190000, seats: 240 },
      { name: "B.Tech Software Engineering", duration: 4, fees: 190000, seats: 120 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 180000, seats: 180 },
    ],
    companies: "Amazon,Google,Microsoft,Adobe,Morgan Stanley",
  },
  {
    name: "Netaji Subhas University of Technology (NSUT)",
    description: "NSUT, formerly NSIT, is a state university located in Dwarka, New Delhi. Spanning 145 acres of lush greenery, the college provides outstanding undergraduate and post-graduate curricula in engineering, resulting in placements that rival the best IITs.",
    location: "New Delhi",
    state: "Delhi",
    established: 1983,
    type: "Public",
    rating: 4.3,
    averageFees: 195000,
    highestPlacement: 35.0,
    averagePlacement: 14.8,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1498243691581-b148c5c3ef71?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 195000, seats: 180 },
      { name: "B.Tech Information Technology", duration: 4, fees: 195000, seats: 120 },
    ],
    companies: "Google,Microsoft,Salesforce,Intuit,Paypal,Visa",
  },
  {
    name: "College of Engineering, Pune (COEP Tech)",
    description: "COEP is one of the oldest engineering colleges in Asia (established 1854). Located at the confluence of the Mula and Mutha rivers in Pune, it is highly reputable for its academic heritage, satellite research projects, and elite student clubs.",
    location: "Pune",
    state: "Maharashtra",
    established: 1854,
    type: "Public",
    rating: 4.3,
    averageFees: 135000,
    highestPlacement: 30.0,
    averagePlacement: 11.2,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Boat Club",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Engineering", duration: 4, fees: 135000, seats: 120 },
      { name: "B.Tech Electronics & Telecommunication", duration: 4, fees: 135000, seats: 60 },
    ],
    companies: "Tata Motors,Siemens,Goldman Sachs,Cisco,Microsoft",
  },
  {
    name: "Veermata Jijabai Technological Institute (VJTI)",
    description: "VJTI is an architecturally historic and high-ranking state college located in Matunga, Mumbai. Highly sought after, it provides top-tier placements, extremely low academic fees, and a strongly driven technical student body.",
    location: "Mumbai",
    state: "Maharashtra",
    established: 1887,
    type: "Public",
    rating: 4.4,
    averageFees: 85000,
    highestPlacement: 32.0,
    averagePlacement: 12.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.ENGINEERING,
    courses: [
      { name: "B.Tech Computer Engineering", duration: 4, fees: 85000, seats: 60 },
      { name: "B.Tech Information Technology", duration: 4, fees: 85000, seats: 60 },
    ],
    companies: "Morgan Sachs,Cisco,Amazon,Barclays,JPMC",
  },

  // Management Colleges
  {
    name: "Indian Institute of Management Ahmedabad (IIM Ahmedabad)",
    description: "Widely regarded as the leading business school in India and one of the finest in Asia. Famous for its red-brick Louis Kahn campus, the rigorous Case Method pedagogy, and outstanding global rankings. Placing graduates into the highest-paying consulting, finance, and product strategy jobs.",
    location: "Ahmedabad",
    state: "Gujarat",
    established: 1961,
    type: "Public",
    rating: 5.0,
    averageFees: 1250000,
    highestPlacement: 85.0,
    averagePlacement: 34.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Executive Center",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Post Graduate Programme in Management (PGP)", duration: 2, fees: 1250000, seats: 380 },
      { name: "PGP in Food and Agri-Business Management", duration: 2, fees: 1100000, seats: 50 },
    ],
    companies: "McKinsey & Co,Boston Consulting Group,Bain & Co,Goldman Sachs,JPMorgan,Morgan Stanley",
  },
  {
    name: "Indian Institute of Management Bangalore (IIM Bangalore)",
    description: "IIM Bangalore features an exquisite, green, stone-built campus designed by legendary architect B.V. Doshi. Known for its strong digital business focus and advanced public policy courses, it operates as a prime hub of executive management studies in South India.",
    location: "Bangalore",
    state: "Karnataka",
    established: 1973,
    type: "Public",
    rating: 4.9,
    averageFees: 1200000,
    highestPlacement: 80.0,
    averagePlacement: 33.2,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Swimming Pool",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Post Graduate Programme in Management (PGP)", duration: 2, fees: 1200000, seats: 400 },
      { name: "Executive PGP (EPGP)", duration: 1, fees: 1400000, seats: 75 },
    ],
    companies: "McKinsey,BCG,Bain,Accenture Strategy,Microsoft,Goldman Sachs",
  },
  {
    name: "Indian Institute of Management Calcutta (IIM Calcutta)",
    description: "The finance capital among IIMs, situated on a gorgeous campus with 7 lakes in Joka, Kolkata. It is globally recognized for its quantitative skills, economics departments, and double degree programs. Placements in Investment Banking are second to none.",
    location: "Kolkata",
    state: "West Bengal",
    established: 1961,
    type: "Public",
    rating: 4.9,
    averageFees: 1220000,
    highestPlacement: 82.0,
    averagePlacement: 33.8,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical,Lakes",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Post Graduate Programme in Management (PGP)", duration: 2, fees: 1220000, seats: 460 },
    ],
    companies: "JPMorgan,Deutsche Bank,Avendus Capital,McKinsey,Bain,BCG",
  },
  {
    name: "Faculty of Management Studies, Delhi University (FMS Delhi)",
    description: "Legendary for having the highest Return on Investment (ROI) of any business school in the world. Charging extremely nominal fees while providing access to the absolute top corporate consulting, product management, and investment banking placements.",
    location: "New Delhi",
    state: "Delhi",
    established: 1954,
    type: "Public",
    rating: 4.8,
    averageFees: 50000,
    highestPlacement: 68.0,
    averagePlacement: 32.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Master of Business Administration (MBA)", duration: 2, fees: 50000, seats: 220 },
    ],
    companies: "HUL,P&G,ITC,McKinsey,BCG,Bain,Accenture Strategy",
  },
  {
    name: "XLRI – Xavier School of Management",
    description: "The oldest and arguably the best Human Resources management school in India. Situated in Jamshedpur with an architectural brand-new campus in NCR, it has an intensely loyal alumni base and is heavily sought after for Human Resource and General Management streams.",
    location: "Jamshedpur",
    state: "Jharkhand",
    established: 1949,
    type: "Private",
    rating: 4.8,
    averageFees: 1150000,
    highestPlacement: 78.0,
    averagePlacement: 32.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "PGDM Business Management (BM)", duration: 2, fees: 1150000, seats: 180 },
      { name: "PGDM Human Resource Management (HRM)", duration: 2, fees: 1150000, seats: 180 },
    ],
    companies: "TAS,Aditya Birla Group,HUL,P&G,Bain,BCG,Goldman Sachs",
  },
  {
    name: "S.P. Jain Institute of Management and Research (SPJIMR)",
    description: "SPJIMR is a leading private business school situated in Andheri, Mumbai. Highly respected for its value-based leadership education, its unique village-immersion initiative (DOCC), and brilliant corporate placement record.",
    location: "Mumbai",
    state: "Maharashtra",
    established: 1981,
    type: "Private",
    rating: 4.7,
    averageFees: 950000,
    highestPlacement: 70.0,
    averagePlacement: 30.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Medical",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Post Graduate Diploma in Management (PGDM)", duration: 2, fees: 950000, seats: 240 },
    ],
    companies: "Unilever,P&G,Google,Amazon,BCG,Bain",
  },
  {
    name: "Jamnalal Bajaj Institute of Management Studies (JBIMS)",
    description: "Commonly known as the 'CEO Factory' of India, JBIMS is located in Churchgate, Mumbai. Its proximity to corporate headquarters makes its guest lecture panels incredibly rich with industrial experts and delivers record ROI placements.",
    location: "Mumbai",
    state: "Maharashtra",
    established: 1965,
    type: "Public",
    rating: 4.5,
    averageFees: 300000,
    highestPlacement: 60.0,
    averagePlacement: 26.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell",
    stream: streams.MANAGEMENT,
    courses: [
      { name: "Masters in Management Studies (MMS)", duration: 2, fees: 300000, seats: 120 },
    ],
    companies: "McKinsey,JPMC,Citigroup,HUL,Barclays,Tata Group",
  },

  // Medical Colleges
  {
    name: "All India Institute of Medical Sciences (AIIMS Delhi)",
    description: "The absolute crown jewel of medical education and public healthcare in India. AIIMS Delhi is a world-class public hospital and research university. Highly competitive, charging almost zero tuition while offering incomparable clinical exposure to thousands of daily patients.",
    location: "New Delhi",
    state: "Delhi",
    established: 1956,
    type: "Public",
    rating: 5.0,
    averageFees: 5000,
    highestPlacement: 35.0,
    averagePlacement: 18.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Medical,Super Specialty Clinics,Research Laboratories",
    stream: streams.MEDICAL,
    courses: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", duration: 5, fees: 1500, seats: 125 },
      { name: "MD General Medicine", duration: 3, fees: 2000, seats: 30 },
    ],
    companies: "Apollo Hospitals,Max Healthcare,Fortis,Global Residency,Medanta",
  },
  {
    name: "Christian Medical College Vellore (CMC Vellore)",
    description: "CMC Vellore is an elite private, minority-run educational and healthcare institute. Celebrating over 100 years of clinical excellence, it is recognized globally for community healthcare initiatives, research projects, and highly compassionate medical training programs.",
    location: "Vellore",
    state: "Tamil Nadu",
    established: 1900,
    type: "Private",
    rating: 4.9,
    averageFees: 45000,
    highestPlacement: 28.0,
    averagePlacement: 14.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Medical,Community Clinic,Research Wing",
    stream: streams.MEDICAL,
    courses: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", duration: 5, fees: 45000, seats: 100 },
    ],
    companies: "Apollo,CMC Hospital,St John's Hospital,Columbia Asia",
  },
  {
    name: "Armed Forces Medical College (AFMC Pune)",
    description: "A premier medical institution managed by the Indian Armed Forces. AFMC Pune merges exceptional academic medical training with structural military discipline. Graduating students are directly commissioned into the Army, Navy, or Air Force medical services.",
    location: "Pune",
    state: "Maharashtra",
    established: 1948,
    type: "Public",
    rating: 4.8,
    averageFees: 30000,
    highestPlacement: 26.0,
    averagePlacement: 13.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=600&fit=crop&q=80",
    facilities: "Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Medical,Military Grounds,Swimming Pool",
    stream: streams.MEDICAL,
    courses: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", duration: 5, fees: 30000, seats: 150 },
    ],
    companies: "Indian Army Medical Corps,Indian Navy,Indian Air Force,Military Hospitals",
  },
  {
    name: "King George's Medical University (KGMU)",
    description: "KGMU in Lucknow is one of the premier and highly historic public medical institutions in Northern India. Spread over massive healthcare wings, it is famous for its intensive clinical residency curricula and state-of-the-art trauma centers.",
    location: "Lucknow",
    state: "Uttar Pradesh",
    established: 1911,
    type: "Public",
    rating: 4.6,
    averageFees: 55000,
    highestPlacement: 25.0,
    averagePlacement: 13.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Medical,Super Specialty Trauma Center",
    stream: streams.MEDICAL,
    courses: [
      { name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", duration: 5, fees: 55000, seats: 250 },
    ],
    companies: "Fortis Healthcare,Max Hospitals,Medanta,KGMU Hospital",
  },

  // Arts Colleges
  {
    name: "St. Stephen's College, Delhi",
    description: "Established in 1881, St. Stephen's is one of Delhi University's oldest and most prestigious liberal arts colleges. Famed for its beautiful red-brick campus, legendary intellectual atmosphere, high student debates, and highly accomplished alumni base including heads of states, authors, and senior bureaucrats.",
    location: "New Delhi",
    state: "Delhi",
    established: 1881,
    type: "Public",
    rating: 4.7,
    averageFees: 40000,
    highestPlacement: 18.0,
    averagePlacement: 8.5,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Student Clubs",
    stream: streams.ARTS,
    courses: [
      { name: "B.A. (Hons) Economics", duration: 3, fees: 40000, seats: 60 },
      { name: "B.A. (Hons) English", duration: 3, fees: 38000, seats: 45 },
      { name: "B.A. (Hons) History", duration: 3, fees: 38000, seats: 50 },
    ],
    companies: "McKinsey,BCG,Bain,Brain & Co,EY,KPMG,PwC",
  },
  {
    name: "Lady Shri Ram College for Women (LSR Delhi)",
    description: "LSR is a premier women's liberal arts college under Delhi University. A global leader in women's higher education, it fosters strong leadership qualities, extreme intellectual excellence, and hosts premium campus recruitments from top global firms.",
    location: "New Delhi",
    state: "Delhi",
    established: 1956,
    type: "Public",
    rating: 4.6,
    averageFees: 35000,
    highestPlacement: 16.0,
    averagePlacement: 8.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1567057404533-c1a01231f24e?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Lush Gardens",
    stream: streams.ARTS,
    courses: [
      { name: "B.A. (Hons) Economics", duration: 3, fees: 35000, seats: 80 },
      { name: "B.A. (Hons) Psychology", duration: 3, fees: 37000, seats: 40 },
    ],
    companies: "McKinsey,Bain,Goldman Sachs,Deloitte,Citibank",
  },
  {
    name: "St. Xavier's College, Mumbai",
    description: "An architecturally stunning Indo-Gothic landmark in South Mumbai. St. Xavier's is famous for its vibrant liberal arts culture, intellectual heritage, and its highly popular annual college festival Malhar. It focuses heavily on research, critical thinking, and student empowerment.",
    location: "Mumbai",
    state: "Maharashtra",
    established: 1869,
    type: "Private",
    rating: 4.5,
    averageFees: 35000,
    highestPlacement: 14.0,
    averagePlacement: 7.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1464979681340-1261d429f83a?w=1200&h=600&fit=crop&q=80",
    facilities: "Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell,Gothic Quadrangle",
    stream: streams.ARTS,
    courses: [
      { name: "B.A. English Literature", duration: 3, fees: 35000, seats: 120 },
      { name: "B.A. Sociology & Anthropology", duration: 3, fees: 35000, seats: 80 },
    ],
    companies: "EY,Citi,Deloitte,Teach for India,Ogily & Mather",
  },

  // Science Colleges
  {
    name: "Indian Institute of Science (IISc Bangalore)",
    description: "The premier research institution of scientific learning in India. IISc Bangalore is globally acclaimed for scientific breakthroughs and advanced post-graduate research. Its highly selective Bachelor of Science (Research) program is second to none.",
    location: "Bangalore",
    state: "Karnataka",
    established: 1909,
    type: "Public",
    rating: 5.0,
    averageFees: 35000,
    highestPlacement: 40.0,
    averagePlacement: 20.0,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=600&fit=crop&q=80",
    facilities: "Wi-Fi,Gym,Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Medical,Advanced Core Research Facility",
    stream: streams.SCIENCE,
    courses: [
      { name: "Bachelor of Science (Research)", duration: 4, fees: 35000, seats: 120 },
    ],
    companies: "Intel,Nvidia,IBM Research,Google,Microsoft Research,ISRO",
  },
  {
    name: "Hindu College, Delhi",
    description: "Hindu College is one of Delhi University's finest constituent science and arts colleges. Celebrated for its rich academic standards, political student panels, and beautiful red-carpet campus infrastructure.",
    location: "New Delhi",
    state: "Delhi",
    established: 1899,
    type: "Public",
    rating: 4.7,
    averageFees: 30000,
    highestPlacement: 16.0,
    averagePlacement: 8.2,
    logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=600&fit=crop&q=80",
    facilities: "Hostel,Library,Cafeteria,Sports,Lab,Auditorium,Placement Cell",
    stream: streams.SCIENCE,
    courses: [
      { name: "B.Sc (Hons) Physics", duration: 3, fees: 30000, seats: 60 },
      { name: "B.Sc (Hons) Mathematics", duration: 3, fees: 28000, seats: 80 },
    ],
    companies: "KPMG,Deloitte,Brain Capability Center,EY",
  },
];

// Helper to expand and generate 50 colleges by copying templates and renaming
const locations = [
  { city: "Pune", state: "Maharashtra" },
  { city: "Bangalore", state: "Karnataka" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "New Delhi", state: "Delhi" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
];

const mockNames = [
  "National Institute of Technology",
  "Xavier Institute of Science & Technology",
  "Apex Technical University",
  "Savitribai Academy",
  "Loyola Institute of Excellence",
  "Presidency Deemed College",
  "Vidya Mandir School of Higher Studies",
  "Birla Academy of Management & Arts",
  "Symbiosis Deemed Science Center",
  "St. Andrews Liberal Arts College",
  "St. Johns Medical University",
  "Kasturba Gandhi Medical School",
  "Maulana Azad Technical Wing",
  "Pillai Institute of Engineering",
  "Bhaskar Institute of Science",
];

// Expand to exactly 50 colleges if needed
const allColleges = [...collegeData];

while (allColleges.length < 52) {
  const template = collegeData[allColleges.length % collegeData.length];
  const loc = locations[allColleges.length % locations.length];
  const namePrefix = mockNames[allColleges.length % mockNames.length];
  const uniqueName = `${namePrefix} (${loc.city} Campus)`;

  // Add slight variations in ratings, established years, and placements
  const variationFactor = (allColleges.length % 5) - 2; // -2 to +2
  const estYear = template.established + variationFactor * 4;
  const ratingVal = Math.min(5.0, Math.max(3.8, template.rating + variationFactor * 0.15));
  const avgFeesVal = Math.round(template.averageFees * (1 + variationFactor * 0.08));
  const highestPlVal = Math.round((template.highestPlacement * (1 + variationFactor * 0.05)) * 10) / 10;
  const avgPlVal = Math.round((template.averagePlacement * (1 + variationFactor * 0.04)) * 10) / 10;

  allColleges.push({
    name: uniqueName,
    description: `A highly prominent institution located in ${loc.city}, ${loc.state}. Fostering specialized education, community leadership, and modern infrastructure. Celebrated for rich academic output, active student societies, and a strong history of corporate placements.`,
    location: loc.city,
    state: loc.state,
    established: estYear,
    type: allColleges.length % 2 === 0 ? "Public" : "Private",
    rating: ratingVal,
    averageFees: avgFeesVal,
    highestPlacement: highestPlVal,
    averagePlacement: avgPlVal,
    logoUrl: template.logoUrl,
    coverUrl: template.coverUrl,
    facilities: template.facilities,
    stream: template.stream,
    courses: template.courses.map(c => ({
      ...c,
      fees: Math.round(c.fees * (1 + variationFactor * 0.08)),
    })),
    companies: template.companies,
  });
}

async function main() {
  console.log("Start seeding...");

  // Clean old DB data
  await prisma.savedCollege.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // Create Users
  const passwordAdmin = hashPassword("admin123");
  const passwordStudent = hashPassword("student123");
  const passwordDemo = hashPassword("demo123");

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@campuscompass.ai",
      password: passwordAdmin,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&q=80",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Student User",
      email: "student@campuscompass.ai",
      password: passwordStudent,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo Candidate",
      email: "demo@campuscompass.ai",
      password: passwordDemo,
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&fit=crop&q=80",
    },
  });

  const users = [admin, student, demoUser];

  console.log("Test users created.");

  // Create Colleges with nested items
  for (const c of allColleges) {
    const createdCollege = await prisma.college.create({
      data: {
        name: c.name,
        description: c.description,
        location: c.location,
        state: c.state,
        established: c.established,
        type: c.type,
        rating: c.rating,
        averageFees: c.averageFees,
        highestPlacement: c.highestPlacement,
        averagePlacement: c.averagePlacement,
        logoUrl: c.logoUrl,
        coverUrl: c.coverUrl,
        facilities: c.facilities,
        stream: c.stream,
        courses: {
          create: c.courses.map(course => ({
            name: course.name,
            stream: c.stream,
            duration: course.duration,
            fees: course.fees,
            seats: course.seats,
          })),
        },
      },
    });

    // Create Placements for the last 3 years
    await prisma.placement.create({
      data: {
        year: 2025,
        highestPackage: c.highestPlacement,
        averagePackage: c.averagePlacement,
        placementRate: 90 + Math.random() * 9,
        companies: c.companies,
        collegeId: createdCollege.id,
      },
    });

    await prisma.placement.create({
      data: {
        year: 2024,
        highestPackage: Math.round(c.highestPlacement * 0.92 * 10) / 10,
        averagePackage: Math.round(c.averagePlacement * 0.93 * 10) / 10,
        placementRate: 88 + Math.random() * 10,
        companies: c.companies,
        collegeId: createdCollege.id,
      },
    });

    await prisma.placement.create({
      data: {
        year: 2023,
        highestPackage: Math.round(c.highestPlacement * 0.85 * 10) / 10,
        averagePackage: Math.round(c.averagePlacement * 0.87 * 10) / 10,
        placementRate: 85 + Math.random() * 12,
        companies: c.companies,
        collegeId: createdCollege.id,
      },
    });

    // Create reviews for each college (from random test users)
    const reviewComments = [
      "Exceptional experience here! The labs are cutting edge and professors are very supportive.",
      "The placement cell is extremely aggressive, getting everyone top offers. Worth every rupee.",
      "Beautiful campus environment, vibrant student clubs, and awesome facilities. Proud to be here!",
      "Highly competitive academically. Peer groups are stellar. Campus hosting awesome annual festivals.",
      "Great libraries and facilities. Some administrative departments are slow, but education is top-tier.",
    ];

    const numReviews = 2 + Math.floor(Math.random() * 3); // 2 to 4 reviews per college
    for (let r = 0; r < numReviews; r++) {
      const reviewer = users[r % users.length];
      const rating = Math.min(5, Math.max(3, Math.round(c.rating + (Math.random() - 0.5) * 1.5)));
      await prisma.review.create({
        data: {
          rating: rating,
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
          userId: reviewer.id,
          collegeId: createdCollege.id,
        },
      });
    }
  }

  console.log(`Seeded ${allColleges.length} colleges successfully!`);
  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
