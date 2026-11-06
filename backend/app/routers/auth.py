from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, TechnicianProfile
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, RefreshTokenRequest, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.routers.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if phone already registered
    existing_phone = db.query(User).filter(User.phone == user_in.phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number is already registered"
        )
    
    if user_in.email:
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered"
            )

    new_user = User(
        name=user_in.name,
        phone=user_in.phone,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
        language=user_in.language,
        senior_mode=user_in.senior_mode,
        locality=user_in.locality,
        address=user_in.address or "Koregaon Park, Pune"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If technician, create a default technician profile
    if new_user.role == "technician":
        tech_prof = TechnicianProfile(
            user_id=new_user.id,
            primary_service="plumbing",
            skills=["General Maintenance", "Repairs"],
            starting_price=199.0,
            rating=5.0,
            jobs_count=0
        )
        db.add(tech_prof)
        db.commit()

    access_token = create_access_token(new_user.id)
    refresh_token = create_refresh_token(new_user.id)

    user_dict = {
        "id": new_user.id,
        "name": new_user.name,
        "phone": new_user.phone,
        "email": new_user.email,
        "role": new_user.role,
        "address": new_user.address,
        "city": new_user.city,
        "language": new_user.language,
        "senior_mode": new_user.senior_mode,
        "locality": new_user.locality,
        "is_verified": new_user.is_verified,
        "joined_date": "Recently"
    }

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_dict
    )

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    # Support phone or email
    user = db.query(User).filter(
        (User.phone == login_in.phone_or_email) | (User.email == login_in.phone_or_email)
    ).first()

    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Optional role check if requested
    if login_in.role and user.role != login_in.role:
        # If admin pin login or demo match, allow switching if demo
        pass

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    user_dict = {
        "id": user.id,
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role,
        "address": user.address,
        "city": user.city,
        "language": user.language,
        "senior_mode": user.senior_mode,
        "locality": user.locality,
        "is_verified": user.is_verified,
        "joined_date": "March 2025"
    }

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_dict
    )

@router.post("/refresh", response_model=dict)
def refresh_token_endpoint(refresh_in: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_token(refresh_in.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token(user.id)
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        phone=current_user.phone,
        email=current_user.email,
        role=current_user.role,
        language=current_user.language,
        senior_mode=current_user.senior_mode,
        locality=current_user.locality,
        address=current_user.address,
        city=current_user.city,
        is_verified=current_user.is_verified,
        joined_date="March 2025"
    )
