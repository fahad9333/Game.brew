from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
import bcrypt
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'gamebrew-secret-key-change-in-prod')
JWT_ALGO = 'HS256'

app = FastAPI(title="GAMEBREW API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

SERVICES = {
    "pc": {
        "id": "pc",
        "name": "PC Gaming",
        "tagline": "High-end rigs. Zero lag.",
        "price_per_hour": 90,
        "price_label": "₹90/hour",
        "resource_count": 10,
        "icon": "monitor",
        "description": "10 high-performance gaming PCs with RTX GPUs, mechanical keyboards, and 144Hz displays.",
    },
    "ps5": {
        "id": "ps5",
        "name": "PS5 Private Rooms",
        "tagline": "Private cinematic gaming.",
        "price_per_hour": 130,
        "extra_fee": 50,
        "price_label": "₹130/hour + ₹50 controller",
        "resource_count": 4,
        "icon": "gamepad-2",
        "description": "4 private PS5 rooms with 4K TVs, recliners, and full surround sound.",
    },
    "racing": {
        "id": "racing",
        "name": "Sim Racing",
        "tagline": "Full-motion racing rigs.",
        "price_per_hour": 200,
        "price_half_hour": 120,
        "price_label": "₹200/hour · ₹120/30min",
        "resource_count": 2,
        "icon": "car",
        "description": "2 pro-grade racing simulators with force-feedback wheels, pedals and curved displays.",
    },
    "pool": {
        "id": "pool",
        "name": "Pool Tables",
        "tagline": "American-style 8-ball.",
        "price_per_hour": 200,
        "price_half_hour": 120,
        "price_label": "₹200/hour · ₹120/30min",
        "resource_count": 2,
        "icon": "circle-dot",
        "description": "2 American pool tables with premium cues and chalk under moody neon lighting.",
    },
}

TIME_SLOTS = [f"{h:02d}:00" for h in range(11, 23)]  # 11:00 to 22:00


class BookingCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    service_id: str
    booking_date: str  # YYYY-MM-DD
    time_slot: str     # HH:00
    duration_hours: int = 1
    notes: Optional[str] = ""


class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    service_id: str
    service_name: str
    booking_date: str
    time_slot: str
    duration_hours: int
    total_amount: float
    status: str = "pending"  # pending | confirmed | cancelled | completed
    payment_status: str = "unpaid"
    notes: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CafeBookingCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    event_date: str
    guest_count: int
    event_type: str
    details: Optional[str] = ""


class CafeBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    event_date: str
    guest_count: int
    event_type: str
    details: str = ""
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AdminLogin(BaseModel):
    email: str
    password: str


class BookingStatusUpdate(BaseModel):
    status: str


def create_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "role": "admin",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@api_router.get("/")
async def root():
    return {"message": "GAMEBREW API online", "status": "ok"}


@api_router.get("/services")
async def get_services():
    return {"services": list(SERVICES.values()), "time_slots": TIME_SLOTS}


@api_router.get("/availability")
async def get_availability(service_id: str, booking_date: str):
    if service_id not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")
    svc = SERVICES[service_id]
    total = svc["resource_count"]

    bookings = await db.bookings.find(
        {"service_id": service_id, "booking_date": booking_date, "status": {"$ne": "cancelled"}},
        {"_id": 0, "time_slot": 1, "duration_hours": 1}
    ).to_list(500)

    slot_usage = {slot: 0 for slot in TIME_SLOTS}
    for b in bookings:
        start_idx = TIME_SLOTS.index(b["time_slot"]) if b["time_slot"] in TIME_SLOTS else -1
        if start_idx >= 0:
            for i in range(b.get("duration_hours", 1)):
                if start_idx + i < len(TIME_SLOTS):
                    slot_usage[TIME_SLOTS[start_idx + i]] += 1

    return {
        "service_id": service_id,
        "booking_date": booking_date,
        "total_resources": total,
        "slots": [
            {
                "time": slot,
                "available": total - slot_usage[slot],
                "total": total,
                "is_full": slot_usage[slot] >= total,
            }
            for slot in TIME_SLOTS
        ],
    }


def calc_amount(service_id: str, duration_hours: int) -> float:
    svc = SERVICES[service_id]
    return float(svc["price_per_hour"]) * duration_hours


@api_router.post("/bookings")
async def create_booking(payload: BookingCreate):
    if payload.service_id not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")
    if payload.time_slot not in TIME_SLOTS:
        raise HTTPException(status_code=400, detail="Invalid time slot")

    svc = SERVICES[payload.service_id]
    total = svc["resource_count"]

    start_idx = TIME_SLOTS.index(payload.time_slot)
    for i in range(payload.duration_hours):
        if start_idx + i >= len(TIME_SLOTS):
            raise HTTPException(status_code=400, detail="Booking extends beyond operating hours")
        slot = TIME_SLOTS[start_idx + i]
        count = await db.bookings.count_documents({
            "service_id": payload.service_id,
            "booking_date": payload.booking_date,
            "status": {"$ne": "cancelled"},
            "time_slot": slot,
        })
        if count >= total:
            raise HTTPException(status_code=409, detail=f"Slot {slot} is fully booked")

    booking = Booking(
        **payload.model_dump(),
        service_name=svc["name"],
        total_amount=calc_amount(payload.service_id, payload.duration_hours),
    )
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)

    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "type": "booking",
        "title": f"New booking: {svc['name']}",
        "message": f"{payload.name} booked {svc['name']} on {payload.booking_date} at {payload.time_slot}",
        "ref_id": booking.id,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"success": True, "booking": {k: v for k, v in doc.items() if k != "_id"}}


@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    b = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b


@api_router.post("/contact")
async def create_contact(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.messages.insert_one(msg.model_dump())
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "type": "message",
        "title": "New contact message",
        "message": f"From {payload.name}: {(payload.subject or payload.message)[:60]}",
        "ref_id": msg.id,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"success": True, "id": msg.id}


@api_router.post("/cafe-booking")
async def create_cafe_booking(payload: CafeBookingCreate):
    cb = CafeBooking(**payload.model_dump())
    await db.cafe_bookings.insert_one(cb.model_dump())
    await db.notifications.insert_one({
        "id": str(uuid.uuid4()),
        "type": "cafe_booking",
        "title": "Full café booking request",
        "message": f"{payload.name} for {payload.guest_count} guests on {payload.event_date}",
        "ref_id": cb.id,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"success": True, "id": cb.id}


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin):
    admin = await db.admins.find_one({"email": payload.email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not bcrypt.checkpw(payload.password.encode(), admin["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(payload.email)
    return {"token": token, "email": payload.email}


@api_router.get("/admin/stats")
async def admin_stats(_=Depends(verify_admin)):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    total_bookings = await db.bookings.count_documents({})
    today_bookings = await db.bookings.count_documents({"booking_date": today})
    pending = await db.bookings.count_documents({"status": "pending"})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    messages = await db.messages.count_documents({"is_read": False})
    cafe_requests = await db.cafe_bookings.count_documents({"status": "pending"})

    pipeline = [
        {"$match": {"status": {"$in": ["confirmed", "completed"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
    ]
    rev_cursor = db.bookings.aggregate(pipeline)
    revenue = 0
    async for r in rev_cursor:
        revenue = r["total"]

    svc_pipeline = [
        {"$group": {"_id": "$service_id", "count": {"$sum": 1}, "revenue": {"$sum": "$total_amount"}}}
    ]
    by_service = []
    async for r in db.bookings.aggregate(svc_pipeline):
        by_service.append({"service_id": r["_id"], "count": r["count"], "revenue": r["revenue"]})

    return {
        "total_bookings": total_bookings,
        "today_bookings": today_bookings,
        "pending_bookings": pending,
        "confirmed_bookings": confirmed,
        "unread_messages": messages,
        "cafe_requests": cafe_requests,
        "total_revenue": revenue,
        "by_service": by_service,
    }


@api_router.get("/admin/bookings")
async def admin_list_bookings(_=Depends(verify_admin), status_filter: Optional[str] = None, limit: int = 200):
    q = {}
    if status_filter:
        q["status"] = status_filter
    items = await db.bookings.find(q, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items}


@api_router.patch("/admin/bookings/{booking_id}")
async def admin_update_booking(booking_id: str, payload: BookingStatusUpdate, _=Depends(verify_admin)):
    if payload.status not in ["pending", "confirmed", "cancelled", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"success": True}


@api_router.get("/admin/messages")
async def admin_messages(_=Depends(verify_admin), limit: int = 200):
    items = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items}


@api_router.patch("/admin/messages/{msg_id}/read")
async def admin_mark_read(msg_id: str, _=Depends(verify_admin)):
    await db.messages.update_one({"id": msg_id}, {"$set": {"is_read": True}})
    return {"success": True}


@api_router.get("/admin/cafe-bookings")
async def admin_cafe_bookings(_=Depends(verify_admin), limit: int = 200):
    items = await db.cafe_bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items}


@api_router.get("/admin/notifications")
async def admin_notifications(_=Depends(verify_admin), limit: int = 50):
    items = await db.notifications.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items}


app.include_router(api_router)

default_cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", ",".join(default_cors_origins)).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_admin():
    existing = await db.admins.find_one({"email": "gamebrew.in@gmail.com"})
    if not existing:
        pw_hash = bcrypt.hashpw("SwaOm@19042026".encode(), bcrypt.gensalt()).decode()
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": "gamebrew.in@gmail.com",
            "password_hash": pw_hash,
            "name": "GameBrew Admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded default admin: gamebrew.in@gmail.com / SwaOm@19042026")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
