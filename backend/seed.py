import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine, Base
from app.models.user import User, TechnicianProfile
from app.models.service import Service
from app.models.booking import Booking, Quote, Negotiation
from app.models.escrow import EscrowPayment
from app.models.chat import ChatMessage
from app.models.group_booking import GroupBooking
from app.models.notification import Notification
from app.models.sos import SOSAlert
from app.core.security import get_password_hash
from datetime import datetime, timezone, timedelta

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data for clean seed
    print("Clearing existing tables...")
    db.query(ChatMessage).delete()
    db.query(Negotiation).delete()
    db.query(Quote).delete()
    db.query(EscrowPayment).delete()
    db.query(Booking).delete()
    db.query(GroupBooking).delete()
    db.query(Notification).delete()
    db.query(SOSAlert).delete()
    db.query(TechnicianProfile).delete()
    db.query(Service).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding Users...")
    # 1 Admin
    admin_user = User(
        id="user-admin-1",
        name="Civic Administrator",
        email="admin@homecare360.gov.in",
        phone="+91 90000 00000",
        password_hash=get_password_hash("3600"),  # Pin 3600 matches frontend demo
        role="admin",
        language="en",
        locality="Pune Central",
        address="PMC Civic Operations Desk, Shivajinagar, Pune"
    )
    db.add(admin_user)

    # 3 Citizens
    asha = User(
        id="user-citizen-1",
        name="Asha Sharma",
        email="asha.sharma@example.com",
        phone="+91 98221 12345",
        password_hash=get_password_hash("password123"),
        role="citizen",
        language="en",
        senior_mode=False,
        locality="Koregaon Park",
        address="Flat 402, Ganga Carnation, Koregaon Park, Pune"
    )
    rajesh = User(
        id="user-citizen-2",
        name="Rajesh Verma",
        email="rajesh.verma@example.com",
        phone="+91 98222 23456",
        password_hash=get_password_hash("password123"),
        role="citizen",
        language="hi",
        senior_mode=True,
        locality="Kalyani Nagar",
        address="Bungalow 12, Nilanjali Society, Kalyani Nagar, Pune"
    )
    pooja = User(
        id="user-citizen-3",
        name="Pooja Deshmukh",
        email="pooja.d@example.com",
        phone="+91 98223 34567",
        password_hash=get_password_hash("password123"),
        role="citizen",
        language="mr",
        senior_mode=False,
        locality="Viman Nagar",
        address="Flat 204, Rohan Mithila, Viman Nagar, Pune"
    )
    db.add_all([asha, rajesh, pooja])
    db.commit()

    print("Seeding 6 Technicians...")
    # 1. Ramesh Patil (Plumber)
    tech1_u = User(
        id="user-tech-1",
        name="Ramesh Patil",
        phone="+91 98221 44021",
        email="ramesh.patil@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="mr",
        locality="Koregaon Park",
        address="Lane 5, Koregaon Park, Pune"
    )
    db.add(tech1_u)
    db.commit()

    tech1_p = TechnicianProfile(
        id="tech-prof-1",
        user_id=tech1_u.id,
        primary_service="plumbing",
        skills=["Pipe leaks", "Taps & Mixers", "Geyser fitting", "Concealed drains"],
        rating=4.9,
        jobs_count=429,
        experience_years=8,
        starting_price=199.0,
        verified=True,
        id_verified=True,
        trust_score=98,
        verification_status="approved",
        lat=18.5362,
        lng=73.8940,
        distance_km=1.2,
        eta_minutes=18,
        online=True,
        about="Govt. ITI certified master plumber. Over 8 years of municipal and residential sanitation experience in Pune East.",
        photo="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[
            {"title": "National Trade Certificate (NTC) — Plumbing", "issuer": "Govt. ITI Aundh", "year": "2016"},
            {"title": "Certified Master Plumber", "issuer": "Indian Plumbing Association (IPA)", "year": "2019"}
        ],
        portfolio=[
            {
                "title": "Concealed Wall Bathroom Pipe Repair",
                "beforePhoto": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
                "afterPhoto": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
            }
        ],
        bank_details={"accountNumber": "XXXX-XXXX-9912", "ifsc": "HDFC0001824", "upiId": "ramesh.patil@upi", "accountHolder": "Ramesh Patil"}
    )
    db.add(tech1_p)

    # 2. Suresh Rao (Electrician)
    tech2_u = User(
        id="user-tech-2",
        name="Suresh Rao",
        phone="+91 98224 55032",
        email="suresh.rao@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="hi",
        locality="Kalyani Nagar",
        address="Shastri Nagar, Pune"
    )
    db.add(tech2_u)
    db.commit()

    tech2_p = TechnicianProfile(
        id="tech-prof-2",
        user_id=tech2_u.id,
        primary_service="electrical",
        skills=["Short circuit detection", "MCB replacement", "Wiring", "Inverters"],
        rating=4.8,
        jobs_count=380,
        experience_years=6,
        starting_price=149.0,
        verified=True,
        id_verified=True,
        trust_score=96,
        verification_status="approved",
        lat=18.5480,
        lng=73.9020,
        distance_km=2.4,
        eta_minutes=22,
        online=True,
        about="Licensed wireman with MSEB industrial electrical certifications.",
        photo="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[{"title": "State Wireman License A-Grade", "issuer": "Govt of Maharashtra", "year": "2018"}],
        portfolio=[]
    )
    db.add(tech2_p)

    # 3. Amit Shinde (AC Repair)
    tech3_u = User(
        id="user-tech-3",
        name="Amit Shinde",
        phone="+91 98225 66043",
        email="amit.shinde@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="mr",
        locality="Viman Nagar",
        address="Clover Park, Viman Nagar, Pune"
    )
    db.add(tech3_u)
    db.commit()

    tech3_p = TechnicianProfile(
        id="tech-prof-3",
        user_id=tech3_u.id,
        primary_service="ac_repair",
        skills=["Foam jet wash", "Gas refill", "Cooling coil replacement"],
        rating=4.9,
        jobs_count=290,
        experience_years=7,
        starting_price=399.0,
        verified=True,
        id_verified=True,
        trust_score=97,
        verification_status="approved",
        lat=18.5670,
        lng=73.9140,
        distance_km=3.1,
        eta_minutes=25,
        online=True,
        about="HVAC certified technician specializing in Daikin, Voltas, and LG inverter units.",
        photo="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[{"title": "HVAC Refrigeration & Safety", "issuer": "National Skill Development Corp", "year": "2017"}],
        portfolio=[]
    )
    db.add(tech3_p)

    # 4. Sunita Gaikwad (Deep Cleaning)
    tech4_u = User(
        id="user-tech-4",
        name="Sunita Gaikwad",
        phone="+91 98226 77054",
        email="sunita.g@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="mr",
        locality="Koregaon Park",
        address="Ghorpadi, Pune"
    )
    db.add(tech4_u)
    db.commit()

    tech4_p = TechnicianProfile(
        id="tech-prof-4",
        user_id=tech4_u.id,
        primary_service="cleaning",
        skills=["Kitchen degreasing", "Bathroom descaling", "Sofa shampooing"],
        rating=4.8,
        jobs_count=512,
        experience_years=5,
        starting_price=299.0,
        verified=True,
        id_verified=True,
        trust_score=99,
        verification_status="approved",
        lat=18.5300,
        lng=73.8900,
        distance_km=1.5,
        eta_minutes=15,
        online=True,
        about="Trained in mechanized German cleaning equipment and eco-safe hospital-grade sanitization.",
        photo="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[{"title": "Hospital Hygiene & Deep Sanitization", "issuer": "Pune Municipal Health Bureau", "year": "2020"}],
        portfolio=[]
    )
    db.add(tech4_p)

    # 5. Vikram Joshi (Carpentry)
    tech5_u = User(
        id="user-tech-5",
        name="Vikram Joshi",
        phone="+91 98227 88065",
        email="vikram.joshi@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="hi",
        locality="Kothrud",
        address="Mayur Colony, Kothrud, Pune"
    )
    db.add(tech5_u)
    db.commit()

    tech5_p = TechnicianProfile(
        id="tech-prof-5",
        user_id=tech5_u.id,
        primary_service="carpentry",
        skills=["Door locks", "Hydraulic hinges", "Modular kitchen repairs"],
        rating=4.7,
        jobs_count=215,
        experience_years=9,
        starting_price=249.0,
        verified=True,
        id_verified=True,
        trust_score=94,
        verification_status="approved",
        lat=18.5074,
        lng=73.8077,
        distance_km=6.8,
        eta_minutes=35,
        online=True,
        about="Master carpenter specializing in high-security digital door locks and kitchen hardware.",
        photo="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[],
        portfolio=[]
    )
    db.add(tech5_p)

    # 6. Ganesh Shinde (Bodyguard & Security)
    tech6_u = User(
        id="user-tech-6",
        name="Capt. Ganesh Shinde (Retd.)",
        phone="+91 98228 99076",
        email="ganesh.shinde@homecare360.gov.in",
        password_hash=get_password_hash("password123"),
        role="technician",
        language="en",
        locality="Koregaon Park",
        address="Bund Garden Rd, Pune"
    )
    db.add(tech6_u)
    db.commit()

    tech6_p = TechnicianProfile(
        id="tech-prof-6",
        user_id=tech6_u.id,
        primary_service="bodyguard",
        skills=["Armed PSO", "VIP Escort", "Close Protection", "Ex-Military"],
        rating=5.0,
        jobs_count=146,
        experience_years=14,
        starting_price=799.0,
        verified=True,
        id_verified=True,
        trust_score=100,
        verification_status="approved",
        lat=18.5350,
        lng=73.8850,
        distance_km=1.0,
        eta_minutes=12,
        online=True,
        about="Ex-Indian Army Maratha Light Infantry, PSARA licensed armed escort and executive protection officer.",
        photo="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
        certificates=[
            {"title": "PSARA Arms & Protection License", "issuer": "Ministry of Home Affairs", "year": "2021"},
            {"title": "Commando & Tactical Driving", "issuer": "Indian Armed Forces", "year": "2015"}
        ],
        portfolio=[]
    )
    db.add(tech6_p)
    db.commit()

    print("Seeding Services (All 10 Categories with Benchmarks)...")
    services_data = [
        {
            "id": "plumbing",
            "name": "Plumbing",
            "name_hi": "नलसाजी (प्लंबर)",
            "name_mr": "प्लंबिंग",
            "description": "Pipe leaks, tap fixes, drain cleaning, and bathroom sanitary fittings.",
            "icon": "droplet",
            "base_price": 199.0,
            "local_min": 300.0,
            "local_max": 420.0,
            "benchmark_price": 340.0,
            "similar_jobs_count": 186,
            "duration": "45-60 min",
            "available_techs": 14,
            "tags": ["Pipe leaks", "Taps", "Geyser fitting", "Drain blockage"]
        },
        {
            "id": "electrical",
            "name": "Electrical",
            "name_hi": "बिजली मरम्मत",
            "name_mr": "इलेक्ट्रिकल दुरुस्ती",
            "description": "Wiring, switchboard fixes, short circuit detection, fans, and MCB installation.",
            "icon": "bolt",
            "base_price": 149.0,
            "local_min": 180.0,
            "local_max": 280.0,
            "benchmark_price": 210.0,
            "similar_jobs_count": 142,
            "duration": "30-50 min",
            "available_techs": 18,
            "tags": ["Wiring", "Switchboard", "Fan installation", "Fuse/MCB"]
        },
        {
            "id": "ac_repair",
            "name": "AC Care & Repair",
            "name_hi": "एसी सर्विस और मरम्मत",
            "name_mr": "एसी सर्व्हिस व दुरुस्ती",
            "description": "Deep foam wash, gas charging, cooling coil repair, and installation.",
            "icon": "snow",
            "base_price": 399.0,
            "local_min": 450.0,
            "local_max": 650.0,
            "benchmark_price": 520.0,
            "similar_jobs_count": 98,
            "duration": "60-90 min",
            "available_techs": 9,
            "tags": ["Gas refill", "Foam jet service", "No cooling", "Water leakage"]
        },
        {
            "id": "cleaning",
            "name": "Deep Cleaning",
            "name_hi": "गहन सफाई",
            "name_mr": "खोलवर स्वच्छता",
            "description": "Kitchen degreasing, bathroom descaling, sofa shampooing, full home sanitization.",
            "icon": "sparkles",
            "base_price": 299.0,
            "local_min": 350.0,
            "local_max": 550.0,
            "benchmark_price": 420.0,
            "similar_jobs_count": 115,
            "duration": "2-4 hours",
            "available_techs": 22,
            "tags": ["Full home", "Bathroom", "Kitchen", "Sofa wash"]
        },
        {
            "id": "carpentry",
            "name": "Carpentry",
            "name_hi": "बढ़ईगीरी (कारपेंटर)",
            "name_mr": "सुतारकाम",
            "description": "Furniture repair, door locks, modular kitchen adjustments, and hinges.",
            "icon": "hammer",
            "base_price": 249.0,
            "local_min": 280.0,
            "local_max": 400.0,
            "benchmark_price": 320.0,
            "similar_jobs_count": 74,
            "duration": "45-90 min",
            "available_techs": 11,
            "tags": ["Lock repair", "Door fitting", "Furniture fix", "Hinges"]
        },
        {
            "id": "painting",
            "name": "Wall Painting",
            "name_hi": "दीवार पेंटिंग",
            "name_mr": "रंगकाम",
            "description": "Waterproofing, exterior & interior wall touch-ups, texture finish.",
            "icon": "paint",
            "base_price": 499.0,
            "local_min": 550.0,
            "local_max": 800.0,
            "benchmark_price": 650.0,
            "similar_jobs_count": 62,
            "duration": "1-3 days",
            "available_techs": 8,
            "tags": ["Waterproofing", "Touch up", "Full room", "Texture"]
        },
        {
            "id": "appliances",
            "name": "Appliance Repair",
            "name_hi": "उपकरण मरम्मत",
            "name_mr": "उपकरणे दुरुस्ती",
            "description": "Washing machine, refrigerator, microwave oven, and water purifier servicing.",
            "icon": "settings",
            "base_price": 299.0,
            "local_min": 320.0,
            "local_max": 480.0,
            "benchmark_price": 380.0,
            "similar_jobs_count": 89,
            "duration": "45-75 min",
            "available_techs": 15,
            "tags": ["Washing machine", "Refrigerator", "Microwave", "RO Water"]
        },
        {
            "id": "pest_control",
            "name": "Pest Control",
            "name_hi": "कीट नियंत्रण",
            "name_mr": "कीटक नियंत्रण",
            "description": "Odorless herbal gel for cockroaches, termite eradication, bed bug treatments.",
            "icon": "shield",
            "base_price": 599.0,
            "local_min": 650.0,
            "local_max": 900.0,
            "benchmark_price": 720.0,
            "similar_jobs_count": 53,
            "duration": "60-120 min",
            "available_techs": 7,
            "tags": ["Cockroach gel", "Termite", "Bed bugs", "Mosquito"]
        },
        {
            "id": "garbage",
            "name": "Garbage & Waste Disposal",
            "name_hi": "कचरा और अपशिष्ट प्रबंधन",
            "name_mr": "कचरा व घनकचरा व्यवस्थापन",
            "description": "Doorstep segregated waste collection, bulk renovation debris, e-waste pickup, and eco-certified recycling.",
            "icon": "trash",
            "base_price": 99.0,
            "local_min": 120.0,
            "local_max": 220.0,
            "benchmark_price": 140.0,
            "similar_jobs_count": 210,
            "duration": "20-40 min",
            "available_techs": 16,
            "tags": ["Daily Waste", "Bulk Debris", "E-Waste", "Recycling", "Eco-Cert"]
        },
        {
            "id": "bodyguard",
            "name": "Bodyguard & Personal Security",
            "name_hi": "अंगरक्षक एवं व्यक्तिगत सुरक्षा",
            "name_mr": "अंगरक्षक व वैयक्तिक सुरक्षा",
            "description": "Licensed armed PSOs, VIP close protection, night travel escort, and verified event security.",
            "icon": "shield",
            "base_price": 799.0,
            "local_min": 850.0,
            "local_max": 1300.0,
            "benchmark_price": 950.0,
            "similar_jobs_count": 38,
            "duration": "4-8 hours",
            "available_techs": 12,
            "tags": ["Armed PSO", "VIP Escort", "Ex-Military", "Night Travel", "PSARA Verified"]
        }
    ]

    for s in services_data:
        srv = Service(**s)
        db.add(srv)
    db.commit()

    print("Seeding Sample Bookings & Negotiation Flow...")
    # Primary Booking: HC-2841 for Asha Sharma & Ramesh Patil
    b1 = Booking(
        id="HC-2841",
        citizen_id=asha.id,
        technician_id=tech1_u.id,
        service_id="plumbing",
        service_name="Plumbing · Bathroom Mixer & Tap Leak",
        citizen_name="Asha Sharma",
        citizen_phone="+91 98221 12345",
        citizen_address="Flat 402, Ganga Carnation, Koregaon Park, Pune",
        area="Koregaon Park",
        issue_description="The mixer valve in the master bathroom is continuously leaking, with moderate pressure drop in the shower head.",
        issue_photos=["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"],
        urgency="urgent",
        status="quoted",
        scheduled_date_str="Today",
        scheduled_time_window="11:30 AM – 1:00 PM",
        locked_price=340.0,
        platform_fee=17.0,
        gst_amount=64.26,
        total_paid=421.26,
        warranty_active_until="28 June 2025"
    )
    db.add(b1)
    db.commit()

    # Quote 1 (Ramesh Patil)
    q1 = Quote(
        id="q-1",
        booking_id=b1.id,
        technician_id=tech1_u.id,
        amount=340.0,
        original_price=440.0,
        warranty_days=7,
        scope_note="Full ceramic disc cartridge inspection, valve washer replacement, and 7-day guarantee.",
        status="pending",
        label="Best match",
        tag_color="green",
        eta="18 min",
        distance_km=1.2
    )
    # Quote 2 (Alternative Tech)
    q2 = Quote(
        id="q-2",
        booking_id=b1.id,
        technician_id=tech2_u.id,
        amount=380.0,
        original_price=480.0,
        warranty_days=7,
        scope_note="Includes heavy-duty brass washer seal replacement.",
        status="pending",
        label="Quickest response",
        tag_color="blue",
        eta="14 min",
        distance_km=1.8
    )
    db.add_all([q1, q2])

    # Initial Chat messages
    m1 = ChatMessage(
        id="msg-1",
        booking_id=b1.id,
        sender_role="technician",
        sender_name="Ramesh Patil",
        text="Namaste Asha ji! I saw your bathroom mixer photo. I have the genuine Jaguar and Kohler ceramic spindle cartridges in my kit.",
        status="read"
    )
    m2 = ChatMessage(
        id="msg-2",
        booking_id=b1.id,
        sender_role="citizen",
        sender_name="Asha Sharma",
        text="Great Ramesh! Please come as soon as possible. Does your quote include the 7-day HomeCare civic warranty?",
        status="read"
    )
    m3 = ChatMessage(
        id="msg-3",
        booking_id=b1.id,
        sender_role="technician",
        sender_name="Ramesh Patil",
        text="Yes absolutely, full 7-day municipal civic warranty included. We can lock the price at ₹340 whenever you are ready.",
        status="delivered"
    )
    db.add_all([m1, m2, m3])

    print("Seeding Group Bookings...")
    grp1 = GroupBooking(
        id="grp-1",
        service_id="ac_repair",
        service_name="Society AC Deep Foam Servicing",
        locality="Koregaon Park (Lane 5 & 6)",
        discount_percent=45.0,
        target_households=15,
        joined_households=[
            {"name": "Asha Sharma", "apt": "Flat 402, Ganga Carnation", "joinedAt": "Yesterday"},
            {"name": "Kiran Deshmukh", "apt": "Flat 501, Ganga Carnation", "joinedAt": "2 days ago"},
            {"name": "Col. R. Menon", "apt": "Flat 102, Silver Oak", "joinedAt": "3 days ago"}
        ],
        base_price=399.0,
        group_price=219.0,
        status="active",
        expires_in_days=3,
        date_deadline="24 Jun"
    )
    grp2 = GroupBooking(
        id="grp-2",
        service_id="pest_control",
        service_name="Building Anti-Termite & Mosquito Shield",
        locality="Kalyani Nagar Sector 2",
        discount_percent=60.0,
        target_households=20,
        joined_households=[
            {"name": "Rajesh Verma", "apt": "Bungalow 12", "joinedAt": "Today"}
        ],
        base_price=599.0,
        group_price=239.0,
        status="active",
        expires_in_days=6,
        date_deadline="27 Jun"
    )
    db.add_all([grp1, grp2])

    print("Seeding Notifications & SOS alerts...")
    n1 = Notification(
        id="notif-1",
        user_id=asha.id,
        role_target="citizen",
        title="Quotation Received from Ramesh Patil",
        body="Ramesh quoted ₹340 for your bathroom mixer repair with 7-day warranty.",
        type="quotation",
        read=False
    )
    n2 = Notification(
        id="notif-2",
        user_id=None,
        role_target="all",
        title="Escrow Security Active",
        body="HomeCare 360 guarantees 100% money protection. Funds released only after your approval.",
        type="payment",
        read=True
    )
    db.add_all([n1, n2])

    sos1 = SOSAlert(
        id="sos-1",
        user_id=rajesh.id,
        citizen_name="Rajesh Verma",
        citizen_phone="+91 98222 23456",
        location="Nilanjali Society, Kalyani Nagar, Pune",
        lat=18.5480,
        lng=73.9020,
        category="electrical",
        description="Main MCB sparking with electrical burning odor detected.",
        status="active",
        assigned_staff="PMC Rapid Unit #02"
    )
    db.add(sos1)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
