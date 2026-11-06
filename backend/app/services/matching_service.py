from sqlalchemy.orm import Session
from app.models.user import User, TechnicianProfile
from typing import List, Optional
import math

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    # Approximate Haversine in KM
    radius = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(radius * c, 1)

def match_technicians(
    db: Session,
    service_id: str,
    user_lat: Optional[float] = 18.5362,
    user_lng: Optional[float] = 73.8940,
    limit: int = 5
) -> List[dict]:
    query = db.query(TechnicianProfile).join(User).filter(
        TechnicianProfile.primary_service == service_id,
        TechnicianProfile.online == True
    )
    
    profiles = query.all()
    # If no exact match for this service, get all online verified technicians
    if not profiles:
        profiles = db.query(TechnicianProfile).join(User).filter(TechnicianProfile.online == True).all()

    results = []
    for tp in profiles:
        u = tp.user
        dist = calculate_distance(user_lat or 18.5362, user_lng or 73.8940, tp.lat, tp.lng)
        # ETA roughly 10 min base + 5 min per km
        eta = max(10, int(8 + dist * 5))
        
        # Best match scoring: rating * 0.4 + verified * 20 + low distance
        score = (tp.rating * 15) + (25 if tp.verified else 0) - (dist * 2)
        
        results.append({
            "score": score,
            "id": u.id,
            "profile_id": tp.id,
            "name": u.name,
            "phone": u.phone,
            "photo": tp.photo,
            "jobs_count": tp.jobs_count,
            "rating": tp.rating,
            "experience_years": tp.experience_years,
            "primary_service": tp.primary_service,
            "skills": tp.skills or [],
            "starting_price": tp.starting_price,
            "verified": tp.verified,
            "trust_score": tp.trust_score,
            "distance_km": dist or tp.distance_km,
            "eta_minutes": eta,
            "online": tp.online,
            "about": tp.about
        })

    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]
