from fastapi import FastAPI, status, Request, Form
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from ensysmod.api import api_router
from ensysmod.core import settings
from ensysmod.database import init_db

# Create FastAPI app and add all endpoints
app = FastAPI(title=settings.SERVER_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router)

app.mount("/public", StaticFiles(directory="public"), name="public")

templates = Jinja2Templates(directory="templates")


# Initialize database and create models
@app.on_event("startup")
def init_database():
    init_db.check_connection()
    init_db.create_all()


@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc)},
    )
