from __future__ import annotations

import json
import os
import random
import string
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Query,
    Request,
    Response,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field

try:
    from passlib.hash import pbkdf2_sha256
except Exception:  # pragma: no cover - passlib optional
    pbkdf2_sha256 = None


def utc_now_iso() -> str:
    """Return RFC3339 timestamp with UTC 'Z' suffix."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def generate_token(prefix: str, length: int = 12) -> str:
    suffix = "".join(random.choices(string.ascii_letters + string.digits, k=length))
    return f"{prefix}-{suffix}"


def ensure_admin(user: Dict[str, Any]) -> None:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")


def paginate(items: List[Any], page: int, size: int) -> List[Any]:
    start = (page - 1) * size
    end = start + size
    return items[start:end]


def verify_password(provided: str, stored: str | None) -> bool:
    if stored is None:
        return False
    if stored == provided:
        return True
    if stored.startswith("$") and pbkdf2_sha256:
        try:
            return pbkdf2_sha256.verify(provided, stored)
        except ValueError:
            return False
    return False

@dataclass
class PaginationResult:
    items: List[Any]
    total: int


class MockDatabase:
    """Simple in-memory data store backed by JSON."""

    def __init__(self, data_path: Path, persist_changes: bool = False):
        self._path = data_path
        self._persist = persist_changes
        self._load()

    def _load(self) -> None:
        if not self._path.exists():
            raise FileNotFoundError(f"Mock data file not found: {self._path}")
        with self._path.open("r", encoding="utf-8") as handle:
            raw = json.load(handle)

        self.organizations: Dict[int, Dict[str, Any]] = {
            org["id"]: org for org in raw.get("organizations", [])
        }
        self.users: Dict[int, Dict[str, Any]] = {user["id"]: user for user in raw.get("users", [])}
        self.projects: Dict[int, Dict[str, Any]] = {
            project["id"]: project for project in raw.get("projects", [])
        }
        self.chapters: Dict[int, Dict[str, Any]] = {
            chapter["id"]: chapter for chapter in raw.get("chapters", [])
        }
        self.storyboards: Dict[int, Dict[str, Any]] = {
            storyboard["id"]: storyboard for storyboard in raw.get("storyboards", [])
        }
        self.scenes: Dict[int, Dict[str, Any]] = {
            scene["id"]: scene for scene in raw.get("scenes", [])
        }
        self.characters: Dict[int, Dict[str, Any]] = {
            character["id"]: character for character in raw.get("characters", [])
        }
        self.assets: Dict[int, Dict[str, Any]] = {
            asset["id"]: asset for asset in raw.get("assets", [])
        }
        self.tasks: Dict[int, Dict[str, Any]] = {task["id"]: task for task in raw.get("tasks", [])}
        self.notifications: Dict[int, Dict[str, Any]] = {
            notification["id"]: notification for notification in raw.get("notifications", [])
        }
        self.plans: Dict[int, Dict[str, Any]] = {plan["id"]: plan for plan in raw.get("plans", [])}
        self.subscriptions: Dict[int, Dict[str, Any]] = {
            subscription["id"]: subscription for subscription in raw.get("subscriptions", [])
        }
        self.payments: Dict[str, Dict[str, Any]] = {
            payment["order_id"]: payment for payment in raw.get("payments", [])
        }
        self.api_keys: Dict[int, Dict[str, Any]] = {
            api_key["id"]: api_key for api_key in raw.get("api_keys", [])
        }
        self.voices: List[Dict[str, Any]] = list(raw.get("voices", []))
        self.storage_objects: List[Dict[str, Any]] = list(raw.get("storage_objects", []))

        self.tokens: Dict[str, int] = dict(raw.get("tokens", {}))

        self._counters: Dict[str, int] = {}
        for name, collection in [
            ("organizations", self.organizations),
            ("users", self.users),
            ("projects", self.projects),
            ("chapters", self.chapters),
            ("storyboards", self.storyboards),
            ("scenes", self.scenes),
            ("characters", self.characters),
            ("assets", self.assets),
            ("tasks", self.tasks),
            ("notifications", self.notifications),
            ("plans", self.plans),
            ("subscriptions", self.subscriptions),
            ("api_keys", self.api_keys),
        ]:
            self._counters[name] = (max(collection.keys()) + 1) if collection else 1

    def _dump(self) -> None:
        if not self._persist:
            return
        payload = {
            "organizations": list(self.organizations.values()),
            "users": list(self.users.values()),
            "projects": list(self.projects.values()),
            "chapters": list(self.chapters.values()),
            "storyboards": list(self.storyboards.values()),
            "scenes": list(self.scenes.values()),
            "characters": list(self.characters.values()),
            "assets": list(self.assets.values()),
            "tasks": list(self.tasks.values()),
            "notifications": list(self.notifications.values()),
            "plans": list(self.plans.values()),
            "subscriptions": list(self.subscriptions.values()),
            "payments": list(self.payments.values()),
            "api_keys": list(self.api_keys.values()),
            "voices": self.voices,
            "storage_objects": self.storage_objects,
            "tokens": self.tokens,
        }
        with self._path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)

    def _next_id(self, key: str) -> int:
        value = self._counters[key]
        self._counters[key] += 1
        return value

    def public_user(self, user: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(user)
        data.pop("password", None)
        return data

    def find_user_by_login(self, credential: str) -> Optional[Dict[str, Any]]:
        for user in self.users.values():
            if credential in {user.get("username"), user.get("email"), user.get("phone")}:
                return user
        return None

    def list_users_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [user for user in self.users.values() if user["organization_id"] == organization_id]

    def list_projects_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [project for project in self.projects.values() if project["organization_id"] == organization_id]

    def list_chapters_for_project(self, project_id: int) -> List[Dict[str, Any]]:
        return [chapter for chapter in self.chapters.values() if chapter["project_id"] == project_id]

    def list_storyboards(
        self, *, project_id: int, chapter_id: Optional[int]
    ) -> List[Dict[str, Any]]:
        return [
            storyboard
            for storyboard in self.storyboards.values()
            if storyboard["project_id"] == project_id and storyboard.get("chapter_id") == chapter_id
        ]

    def list_scenes_for_project(self, project_id: int) -> List[Dict[str, Any]]:
        return [scene for scene in self.scenes.values() if scene["project_id"] == project_id]

    def list_characters_for_project(self, project_id: int) -> List[Dict[str, Any]]:
        return [character for character in self.characters.values() if character["project_id"] == project_id]

    def list_assets_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [asset for asset in self.assets.values() if asset["organization_id"] == organization_id]

    def list_tasks_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [task for task in self.tasks.values() if task["organization_id"] == organization_id]

    def list_notifications_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [
            notification
            for notification in self.notifications.values()
            if notification["organization_id"] == organization_id
        ]

    def list_api_keys_for_org(self, organization_id: int) -> List[Dict[str, Any]]:
        return [
            api_key for api_key in self.api_keys.values() if api_key["organization_id"] == organization_id
        ]

    def create_task(self, organization_id: int, task_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        task_id = self._next_id("tasks")
        task = {
            "id": task_id,
            "organization_id": organization_id,
            "task_type": task_type,
            "status": "queued",
            "payload": payload,
            "progress": 0,
            "result": None,
            "error_message": None,
            "retry_token": None,
            "created_at": utc_now_iso(),
        }
        self.tasks[task_id] = task
        self._dump()
        return task

    def create_asset(self, asset: Dict[str, Any]) -> Dict[str, Any]:
        asset_id = self._next_id("assets")
        asset["id"] = asset_id
        asset.setdefault("created_at", utc_now_iso())
        self.assets[asset_id] = asset
        self._dump()
        return asset

    def upsert_storage_object(self, record: Dict[str, Any]) -> None:
        existing_keys = {item["object_key"] for item in self.storage_objects}
        if record["object_key"] not in existing_keys:
            self.storage_objects.append(record)
        else:
            for item in self.storage_objects:
                if item["object_key"] == record["object_key"]:
                    item.update(record)
                    break
        self._dump()


class RegisterRequest(BaseModel):
    email: str
    password: str
    organization_name: str
    display_name: Optional[str] = None


class UserCreateRequest(BaseModel):
    username: str
    display_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str = Field(default="editor")
    password: str


class UserUpdateMeRequest(BaseModel):
    display_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class ProjectCreateRequest(BaseModel):
    name: str
    project_type: str
    status: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    cover_image: Optional[str] = None
    video_scale: Optional[str] = None
    video_resolution: Optional[str] = None


class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    cover_image: Optional[str] = None
    video_scale: Optional[str] = None
    video_resolution: Optional[str] = None


class ChapterCreateRequest(BaseModel):
    name: str
    script_content: Optional[str] = None
    order_index: int = 0


class ChapterUpdateRequest(BaseModel):
    name: Optional[str] = None
    script_content: Optional[str] = None
    order_index: Optional[int] = None


class StoryboardUpdateRequest(BaseModel):
    dialogue: Optional[str] = None
    scene_description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: Optional[int] = None


class CharacterCreateRequest(BaseModel):
    project_id: int
    display_name: str
    description: Optional[str] = None
    portraits: List[Dict[str, Any]] = Field(default_factory=list)
    voice_preset: Optional[str] = None
    voice_speed: Optional[float] = 1.0
    voice_script: Optional[str] = None


class CharacterUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None
    portraits: Optional[List[Dict[str, Any]]] = None
    voice_preset: Optional[str] = None
    voice_speed: Optional[float] = None
    voice_script: Optional[str] = None


class AssetCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    asset_type: str
    sub_type: Optional[str] = None
    creation_method: Optional[str] = "UPLOAD"
    tags: List[str] = Field(default_factory=list)
    file_url: str
    object_key: str


class AssetUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    file_url: Optional[str] = None


class TaskCreateRequest(BaseModel):
    task_type: str
    payload: Dict[str, Any]


class TextToImageRequest(BaseModel):
    prompt: str
    size: Optional[str] = "2K"
    asset_name: Optional[str] = "AI生成图片"
    asset_description: Optional[str] = None
    sub_type: Optional[str] = "scene"
    tags: List[str] = Field(default_factory=list)


class CharacterImageTaskRequest(BaseModel):
    character_id: int
    prompt: str
    size: Optional[str] = "2K"


class WorkflowRunRequest(BaseModel):
    input: str
    style: Optional[str] = None
    workflow_id: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


class GenerateCharactersRequest(BaseModel):
    role_info: str
    project_id: int


class PlanCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    features: Optional[str] = None
    price: int
    duration_days: int
    plan_type: Optional[str] = None
    max_storyboards: Optional[int] = None
    storage_gb: Optional[int] = 10
    is_active: Optional[int] = 1


class PlanUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    features: Optional[str] = None
    price: Optional[int] = None
    duration_days: Optional[int] = None
    plan_type: Optional[str] = None
    max_storyboards: Optional[int] = None
    storage_gb: Optional[int] = None
    is_active: Optional[int] = None


class PaymentCreateRequest(BaseModel):
    plan_type: str
    amount: int


class ApiKeyCreateRequest(BaseModel):
    name: str
    value: str


class ApiKeyUpdateRequest(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None


class TtsSynthesizeRequest(BaseModel):
    text: str
    voice_type: Optional[str] = None
    emotion: Optional[str] = None
    speed: Optional[float] = 1.0
    volume: Optional[float] = 1.0
    sample_rate: Optional[int] = 24000
    audio_format: Optional[str] = "mp3"
    wait_for_result: Optional[bool] = True
    poll_interval: Optional[float] = None
    timeout: Optional[float] = None
    download_audio: Optional[bool] = False
    extra_parameters: Optional[Dict[str, Any]] = None


DATA_PATH = Path(__file__).resolve().parent / "mock_data" / "data.json"
PERSIST_CHANGES = os.getenv("MOCK_PERSIST_CHANGES", "false").lower() in {"1", "true", "yes"}


def create_app() -> FastAPI:
    app = FastAPI(title="Mock Service", version="1.0.0")

    if os.getenv("MOCK_ALLOW_CORS", "true").lower() in {"1", "true", "yes"}:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    store = MockDatabase(DATA_PATH, persist_changes=PERSIST_CHANGES)
    app.state.store = store

    async def get_store(request: Request) -> MockDatabase:
        return request.app.state.store  # type: ignore[attr-defined]

    async def get_current_user(
        request: Request, store: MockDatabase = Depends(get_store)
    ) -> Dict[str, Any]:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        token = auth_header.split(" ", 1)[1].strip()
        user_id = store.tokens.get(token)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = store.users.get(user_id)
        if not user or not user.get("is_active", True):
            raise HTTPException(status_code=401, detail="Inactive user")
        return user

    def build_created_by(project: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        creator = store.users.get(project.get("created_by_id"))
        if not creator:
            return None
        return store.public_user(creator)

    def serialize_chapter(chapter: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(chapter)
        chapter_storyboards = store.list_storyboards(
            project_id=chapter["project_id"], chapter_id=chapter["id"]
        )
        data["storyboards"] = [dict(storyboard) for storyboard in chapter_storyboards]
        return data

    def serialize_project(project: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(project)
        data["created_by"] = build_created_by(project)
        return data

    def serialize_asset(asset: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(asset)
        uploader = store.users.get(asset.get("uploaded_by_id"))
        if uploader:
            data["uploaded_by"] = store.public_user(uploader)
        return data

    def serialize_task(task: Dict[str, Any]) -> Dict[str, Any]:
        data = dict(task)
        return data

    def serialize_notification(notification: Dict[str, Any]) -> Dict[str, Any]:
        return dict(notification)

    @app.get("/health")
    async def health() -> Dict[str, str]:
        return {"status": "ok"}

    # Authentication ----------------------------------------------------------------

    @app.post("/api/auth/register")
    async def register(payload: RegisterRequest, request: Request, store: MockDatabase = Depends(get_store)):
        if store.find_user_by_login(payload.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        organization_id = store._next_id("organizations")
        organization = {
            "id": organization_id,
            "name": payload.organization_name,
            "created_at": utc_now_iso(),
        }
        store.organizations[organization_id] = organization

        username = payload.email.split("@")[0]
        user_id = store._next_id("users")
        user = {
            "id": user_id,
            "username": username,
            "display_name": payload.display_name or username,
            "email": payload.email,
            "phone": None,
            "role": "admin",
            "organization_id": organization_id,
            "is_active": True,
            "password": payload.password,
            "created_at": utc_now_iso(),
        }
        store.users[user_id] = user
        token = generate_token("mock-token")
        store.tokens[token] = user_id
        store._dump()

        return {"token": token, "user": store.public_user(user)}

    @app.post("/api/auth/login")
    async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        store: MockDatabase = Depends(get_store),
    ):
        user = store.find_user_by_login(form_data.username)
        if not user or not verify_password(form_data.password, user.get("password")):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        if not user.get("is_active", True):
            raise HTTPException(status_code=400, detail="User is inactive")
        existing_token = next((token for token, uid in store.tokens.items() if uid == user["id"]), None)
        if existing_token:
            token = existing_token
        else:
            token = generate_token("mock-token")
            store.tokens[token] = user["id"]
        return {"token": token, "user": store.public_user(user)}

    @app.get("/api/auth/me")
    async def auth_me(current_user: Dict[str, Any] = Depends(get_current_user)):
        return store.public_user(current_user)

    # User management ----------------------------------------------------------------

    @app.get("/api/users")
    async def list_users(
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        users = store.list_users_for_org(current_user["organization_id"])
        users_sorted = sorted(users, key=lambda item: item["id"])
        paged = paginate(users_sorted, page, size)
        return [store.public_user(user) for user in paged]

    @app.post("/api/users", status_code=201)
    async def create_user(
        payload: UserCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        if store.find_user_by_login(payload.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        if payload.email and store.find_user_by_login(payload.email):
            raise HTTPException(status_code=400, detail="Email already exists")
        if payload.phone and store.find_user_by_login(payload.phone):
            raise HTTPException(status_code=400, detail="Phone already exists")

        user_id = store._next_id("users")
        user = {
            "id": user_id,
            "username": payload.username,
            "display_name": payload.display_name or payload.username,
            "email": payload.email,
            "phone": payload.phone,
            "role": payload.role or "editor",
            "organization_id": current_user["organization_id"],
            "is_active": True,
            "password": payload.password,
            "created_at": utc_now_iso(),
        }
        store.users[user_id] = user
        store._dump()
        return store.public_user(user)

    @app.patch("/api/users/me")
    async def update_me(
        payload: UserUpdateMeRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        update_fields = payload.model_dump(exclude_none=True)
        if not update_fields:
            raise HTTPException(status_code=400, detail="At least one field must be provided")
        if "email" in update_fields:
            existing = store.find_user_by_login(update_fields["email"])
            if existing and existing["id"] != current_user["id"]:
                raise HTTPException(status_code=400, detail="Email already exists")
        if "phone" in update_fields:
            existing = store.find_user_by_login(update_fields["phone"])
            if existing and existing["id"] != current_user["id"]:
                raise HTTPException(status_code=400, detail="Phone already exists")
        current_user.update(update_fields)
        store._dump()
        return store.public_user(current_user)

    @app.delete("/api/users/{user_id}", status_code=204, response_class=Response)
    async def delete_user(
        user_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        target = store.users.get(user_id)
        if not target or target["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="User not found")
        del store.users[user_id]
        store.tokens = {token: uid for token, uid in store.tokens.items() if uid != user_id}
        store._dump()
        return Response(status_code=204)

    # Project management -------------------------------------------------------------

    def ensure_project_access(project_id: int, current_user: Dict[str, Any]) -> Dict[str, Any]:
        project = store.projects.get(project_id)
        if not project or project["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    @app.get("/api/projects")
    async def list_projects_endpoint(
        request: Request,
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
        search: Optional[str] = None,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        projects = store.list_projects_for_org(current_user["organization_id"])
        if search:
            lowered = search.lower()
            projects = [project for project in projects if lowered in project["name"].lower()]
        projects_sorted = sorted(projects, key=lambda item: item["created_at"], reverse=True)
        paged = paginate(projects_sorted, page, size)
        return [serialize_project(project) for project in paged]

    @app.post("/api/projects", status_code=201)
    async def create_project_endpoint(
        payload: ProjectCreateRequest,
        request: Request,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        project_id = store._next_id("projects")
        cover_image = payload.cover_image
        if not cover_image:
            base_url = str(request.base_url).rstrip("/")
            cover_image = f"{base_url}/assets/project_cover.png"
        project = {
            "id": project_id,
            "name": payload.name,
            "project_type": payload.project_type,
            "status": payload.status or "draft",
            "description": payload.description,
            "prompt": payload.prompt or "",
            "cover_image": cover_image,
            "video_scale": payload.video_scale,
            "video_resolution": payload.video_resolution,
            "organization_id": current_user["organization_id"],
            "created_by_id": current_user["id"],
            "created_at": utc_now_iso(),
        }
        store.projects[project_id] = project
        store._dump()
        return serialize_project(project)

    @app.get("/api/projects/{project_id}")
    async def get_project_endpoint(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        project = ensure_project_access(project_id, current_user)
        return serialize_project(project)

    @app.patch("/api/projects/{project_id}")
    async def update_project_endpoint(
        project_id: int,
        payload: ProjectUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        project = ensure_project_access(project_id, current_user)
        for field, value in payload.model_dump(exclude_none=True).items():
            project[field] = value
        store._dump()
        return serialize_project(project)

    @app.delete("/api/projects/{project_id}", status_code=204, response_class=Response)
    async def delete_project_endpoint(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        project = ensure_project_access(project_id, current_user)
        chapter_ids = [chapter_id for chapter_id, chapter in store.chapters.items() if chapter["project_id"] == project["id"]]
        for chapter_id in chapter_ids:
            del store.chapters[chapter_id]
        storyboard_ids = [
            storyboard_id
            for storyboard_id, storyboard in store.storyboards.items()
            if storyboard["project_id"] == project["id"]
        ]
        for storyboard_id in storyboard_ids:
            del store.storyboards[storyboard_id]
        character_ids = [
            character_id
            for character_id, character in store.characters.items()
            if character["project_id"] == project["id"]
        ]
        for character_id in character_ids:
            del store.characters[character_id]
        scene_ids = [
            scene_id
            for scene_id, scene in store.scenes.items()
            if scene["project_id"] == project["id"]
        ]
        for scene_id in scene_ids:
            del store.scenes[scene_id]
        del store.projects[project_id]
        store._dump()
        return Response(status_code=204)

    @app.get("/api/projects/{project_id}/scenes")
    async def list_scenes_endpoint(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        scenes = sorted(
            store.list_scenes_for_project(project_id),
            key=lambda item: item.get("created_at") or "",
        )
        serialized = []
        for scene in scenes:
            scene_data = dict(scene)
            creator = store.users.get(scene_data.get("generated_by"))
            if creator:
                scene_data["created_by"] = store.public_user(creator)
            serialized.append(scene_data)
        return serialized

    # Chapter management -------------------------------------------------------------

    @app.get("/api/projects/{project_id}/chapters")
    async def list_chapters_endpoint(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapters = sorted(
            store.list_chapters_for_project(project_id), key=lambda item: item.get("order_index", 0)
        )
        return [serialize_chapter(chapter) for chapter in chapters]

    @app.post("/api/projects/{project_id}/chapters", status_code=201)
    async def create_chapter_endpoint(
        project_id: int,
        payload: ChapterCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter_id = store._next_id("chapters")
        chapter = {
            "id": chapter_id,
            "project_id": project_id,
            "name": payload.name,
            "script_content": payload.script_content,
            "order_index": payload.order_index,
            "created_at": utc_now_iso(),
        }
        store.chapters[chapter_id] = chapter
        store._dump()
        return serialize_chapter(chapter)

    @app.patch("/api/projects/{project_id}/chapters/{chapter_id}")
    async def update_chapter_endpoint(
        project_id: int,
        chapter_id: int,
        payload: ChapterUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter = store.chapters.get(chapter_id)
        if not chapter or chapter["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Chapter not found")
        for field, value in payload.model_dump(exclude_none=True).items():
            chapter[field] = value
        store._dump()
        return serialize_chapter(chapter)

    @app.delete("/api/projects/{project_id}/chapters/{chapter_id}", status_code=204, response_class=Response)
    async def delete_chapter_endpoint(
        project_id: int,
        chapter_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter = store.chapters.get(chapter_id)
        if not chapter or chapter["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Chapter not found")
        storyboard_ids = [
            storyboard_id
            for storyboard_id, storyboard in store.storyboards.items()
            if storyboard.get("chapter_id") == chapter_id
        ]
        for storyboard_id in storyboard_ids:
            del store.storyboards[storyboard_id]
        del store.chapters[chapter_id]
        store._dump()
        return Response(status_code=204)

    @app.post("/api/projects/{project_id}/chapters/{chapter_id}/split")
    async def split_chapter_endpoint(
        project_id: int,
        chapter_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter = store.chapters.get(chapter_id)
        if not chapter or chapter["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Chapter not found")
        # Generate three mock storyboards
        generated: List[Dict[str, Any]] = []
        templates = [
            ("角色对话内容1", "场景描述1"),
            ("角色对话内容2", "场景描述2"),
            ("角色对话内容3", "场景描述3"),
        ]
        base_index = max(
            [sb.get("order_index", 0) for sb in store.list_storyboards(project_id=project_id, chapter_id=chapter_id)]
            + [-1]
        ) + 1
        for offset, (dialogue, scene_description) in enumerate(templates):
            storyboard_id = store._next_id("storyboards")
            storyboard = {
                "id": storyboard_id,
                "project_id": project_id,
                "chapter_id": chapter_id,
                "order_index": base_index + offset,
                "dialogue": dialogue,
                "scene_description": scene_description,
                "image_url": None,
                "created_at": utc_now_iso(),
            }
            store.storyboards[storyboard_id] = storyboard
            generated.append(storyboard)
        store._dump()
        return [dict(storyboard) for storyboard in generated]

    # Storyboard management ----------------------------------------------------------

    @app.get("/api/projects/{project_id}/chapters/{chapter_id}/storyboards")
    async def list_storyboards_endpoint(
        project_id: int,
        chapter_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter = store.chapters.get(chapter_id)
        if not chapter or chapter["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Chapter not found")
        storyboards = sorted(
            store.list_storyboards(project_id=project_id, chapter_id=chapter_id),
            key=lambda item: item.get("order_index", 0),
        )
        return [dict(storyboard) for storyboard in storyboards]

    @app.patch("/api/projects/{project_id}/chapters/{chapter_id}/storyboards/{storyboard_id}")
    async def update_storyboard_endpoint(
        project_id: int,
        chapter_id: int,
        storyboard_id: int,
        payload: StoryboardUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        chapter = store.chapters.get(chapter_id)
        if not chapter or chapter["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Chapter not found")
        storyboard = store.storyboards.get(storyboard_id)
        if not storyboard or storyboard["project_id"] != project_id or storyboard.get("chapter_id") != chapter_id:
            raise HTTPException(status_code=404, detail="Storyboard not found")
        for field, value in payload.model_dump(exclude_none=True).items():
            storyboard[field] = value
        store._dump()
        return dict(storyboard)

    def create_project_task(project_id: int, current_user: Dict[str, Any], task_type: str) -> Dict[str, Any]:
        ensure_project_access(project_id, current_user)
        payload = {"project_id": project_id}
        return store.create_task(current_user["organization_id"], task_type, payload)

    @app.post("/api/projects/{project_id}/storyboards:generate-images")
    async def generate_storyboard_images(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = create_project_task(project_id, current_user, "generate_storyboard_images")
        return serialize_task(task)

    @app.post("/api/projects/{project_id}/storyboards:generate-keyframes")
    async def generate_storyboard_keyframes(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = create_project_task(project_id, current_user, "generate_storyboard_keyframes")
        return serialize_task(task)

    @app.post("/api/projects/{project_id}/storyboards:generate-videos")
    async def generate_storyboard_videos(
        project_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = create_project_task(project_id, current_user, "generate_storyboard_videos")
        return serialize_task(task)

    # Character management -----------------------------------------------------------

    def ensure_character_access(project_id: int, character_id: int, current_user: Dict[str, Any]) -> Dict[str, Any]:
        ensure_project_access(project_id, current_user)
        character = store.characters.get(character_id)
        if not character or character["project_id"] != project_id:
            raise HTTPException(status_code=404, detail="Character not found")
        return character

    @app.get("/api/projects/{project_id}/characters")
    async def list_characters_endpoint(
        project_id: int,
        page: int = Query(1, ge=1),
        size: int = Query(100, ge=1, le=1000),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        characters = sorted(
            store.list_characters_for_project(project_id), key=lambda item: item.get("id", 0)
        )
        total = len(characters)
        paged = paginate(characters, page, size)
        return {"items": [dict(character) for character in paged], "total": total}

    @app.get("/api/projects/{project_id}/characters/{character_id}")
    async def get_character_endpoint(
        project_id: int,
        character_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        character = ensure_character_access(project_id, character_id, current_user)
        return dict(character)

    @app.post("/api/projects/{project_id}/characters", status_code=201)
    async def create_character_endpoint(
        project_id: int,
        payload: CharacterCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(project_id, current_user)
        if payload.project_id != project_id:
            raise HTTPException(status_code=400, detail="Project ID mismatch")
        character_id = store._next_id("characters")
        character = {
            "id": character_id,
            "project_id": project_id,
            "display_name": payload.display_name,
            "description": payload.description,
            "portraits": payload.portraits,
            "voice_preset": payload.voice_preset,
            "voice_speed": payload.voice_speed,
            "voice_script": payload.voice_script,
            "created_at": utc_now_iso(),
            "updated_at": utc_now_iso(),
        }
        store.characters[character_id] = character
        store._dump()
        return dict(character)

    @app.patch("/api/projects/{project_id}/characters/{character_id}")
    async def update_character_endpoint(
        project_id: int,
        character_id: int,
        payload: CharacterUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        character = ensure_character_access(project_id, character_id, current_user)
        for field, value in payload.model_dump(exclude_none=True).items():
            character[field] = value
        character["updated_at"] = utc_now_iso()
        store._dump()
        return dict(character)

    @app.delete("/api/projects/{project_id}/characters/{character_id}", status_code=204, response_class=Response)
    async def delete_character_endpoint(
        project_id: int,
        character_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_character_access(project_id, character_id, current_user)
        del store.characters[character_id]
        store._dump()
        return Response(status_code=204)

    @app.post("/api/projects/{project_id}/characters/{character_id}/import-portraits", status_code=201)
    async def import_character_portraits(
        project_id: int,
        character_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        character = ensure_character_access(project_id, character_id, current_user)
        if not character.get("portraits"):
            raise HTTPException(status_code=400, detail="No portraits to import")
        created_assets = []
        for index, portrait in enumerate(character["portraits"], start=1):
            asset = store.create_asset(
                {
                    "organization_id": current_user["organization_id"],
                    "name": f"{character['display_name']}立绘-{index}",
                    "description": character.get("description"),
                    "asset_type": "IMAGE",
                    "sub_type": "character_ip",
                    "creation_method": "GENERATED",
                    "tags": ["角色", character["display_name"]],
                    "file_url": portrait.get("src"),
                    "object_key": f"{current_user['organization_id']}/characters/{character_id}_{index}.png",
                    "uploaded_by_id": current_user["id"],
                }
            )
            created_assets.append(
                {
                    "id": asset["id"],
                    "name": asset["name"],
                    "asset_type": asset["asset_type"],
                    "asset_sub_type": asset.get("sub_type"),
                    "object_key": asset["object_key"],
                    "url": asset["file_url"],
                    "size": 102400,
                    "metadata": {"character_id": character_id, "index": index},
                    "created_at": asset["created_at"],
                }
            )
        return created_assets

    # Asset management ---------------------------------------------------------------

    @app.get("/api/assets")
    async def list_assets_endpoint(
        asset_type: Optional[str] = None,
        search: Optional[str] = None,
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        assets = store.list_assets_for_org(current_user["organization_id"])
        if asset_type:
            assets = [asset for asset in assets if asset.get("asset_type") == asset_type]
        if search:
            lowered = search.lower()
            assets = [asset for asset in assets if lowered in asset.get("name", "").lower()]
        assets_sorted = sorted(assets, key=lambda item: item["created_at"], reverse=True)
        paged = paginate(assets_sorted, page, size)
        return [serialize_asset(asset) for asset in paged]

    @app.post("/api/assets", status_code=201)
    async def create_asset_endpoint(
        payload: AssetCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        asset = store.create_asset(
            {
                "organization_id": current_user["organization_id"],
                "name": payload.name,
                "description": payload.description,
                "asset_type": payload.asset_type,
                "sub_type": payload.sub_type,
                "creation_method": payload.creation_method or "UPLOAD",
                "tags": payload.tags,
                "file_url": payload.file_url,
                "object_key": payload.object_key,
                "uploaded_by_id": current_user["id"],
            }
        )
        return serialize_asset(asset)

    @app.patch("/api/assets/{asset_id}")
    async def update_asset_endpoint(
        asset_id: int,
        payload: AssetUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        asset = store.assets.get(asset_id)
        if not asset or asset["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Asset not found")
        for field, value in payload.model_dump(exclude_none=True).items():
            asset[field] = value
        store._dump()
        return serialize_asset(asset)

    @app.delete("/api/assets/{asset_id}", status_code=204, response_class=Response)
    async def delete_asset_endpoint(
        asset_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        asset = store.assets.get(asset_id)
        if not asset or asset["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Asset not found")
        del store.assets[asset_id]
        store._dump()
        return Response(status_code=204)

    # Task management ----------------------------------------------------------------

    @app.get("/api/tasks")
    async def list_tasks_endpoint(
        status: Optional[str] = None,
        limit: int = Query(50, ge=1, le=200),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        tasks = store.list_tasks_for_org(current_user["organization_id"])
        if status:
            tasks = [task for task in tasks if task.get("status") == status]
        tasks_sorted = sorted(tasks, key=lambda item: item["created_at"], reverse=True)
        limited = tasks_sorted[:limit]
        return [serialize_task(task) for task in limited]

    def ensure_task_access(task_id: int, current_user: Dict[str, Any]) -> Dict[str, Any]:
        task = store.tasks.get(task_id)
        if not task or task["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    @app.get("/api/tasks/{task_id}")
    async def get_task_endpoint(
        task_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = ensure_task_access(task_id, current_user)
        return serialize_task(task)

    @app.post("/api/tasks", status_code=201)
    async def create_task_endpoint(
        payload: TaskCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = store.create_task(current_user["organization_id"], payload.task_type, payload.payload)
        return serialize_task(task)

    @app.post("/api/tasks/{task_id}/retry")
    async def retry_task_endpoint(
        task_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = ensure_task_access(task_id, current_user)
        task["status"] = "queued"
        task["progress"] = 0
        task["error_message"] = None
        task["retry_token"] = generate_token("retry")
        task["created_at"] = utc_now_iso()
        store._dump()
        return serialize_task(task)

    @app.post("/api/tasks/text-to-image", status_code=201)
    async def create_text_to_image_task(
        payload: TextToImageRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task = store.create_task(current_user["organization_id"], "text_to_image", payload.model_dump())
        return serialize_task(task)

    @app.post("/api/tasks/generate-character-images", status_code=201)
    async def generate_character_images_task(
        payload: CharacterImageTaskRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        character = store.characters.get(payload.character_id)
        if not character:
            raise HTTPException(status_code=404, detail="Character not found")
        task = store.create_task(
            current_user["organization_id"],
            "generate_character_images",
            payload.model_dump(),
        )
        # Simulate portrait updates
        generated_portraits = [
            {
                "src": f"https://cdn.example.com/characters/{payload.character_id}_{angle}.jpg",
                "alt": angle,
            }
            for angle in ["front", "side", "three-quarter"]
        ]
        character["portraits"] = generated_portraits
        character["updated_at"] = utc_now_iso()
        store._dump()
        return serialize_task(task)

    # Storage management -------------------------------------------------------------

    @app.post("/api/storage/upload")
    async def upload_file(
        file: UploadFile,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        object_key = f"{current_user['organization_id']}/{generate_token('upload', 8)}-{file.filename}"
        record = {
            "object_key": object_key,
            "url": f"https://your-oss-domain.com/{object_key}",
            "organization_id": current_user["organization_id"],
        }
        store.upsert_storage_object(record)
        response = {
            "file_id": object_key,
            "object_key": object_key,
            "file_url": record["url"],
            "filename": file.filename,
            "size": 1024000,
            "content_type": file.content_type or "application/octet-stream",
            "uploaded_by": current_user["id"],
        }
        return response

    @app.get("/api/storage/presign")
    async def presign_url(
        object_key: str = Query(...),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        organization_id = current_user["organization_id"]
        valid = False
        if object_key.startswith(f"{organization_id}/") or f"/{organization_id}/" in object_key:
            valid = True
        else:
            for asset in store.list_assets_for_org(organization_id):
                if asset.get("object_key") == object_key:
                    valid = True
                    break
        if not valid:
            raise HTTPException(status_code=404, detail="Object not found")
        url = f"https://your-oss-domain.com/{object_key}"
        return {"url": url, "method": "GET", "expires_at": None, "signed_headers": {}}

    # Agent module ------------------------------------------------------------------

    @app.post("/api/agents/workflow/run")
    async def run_workflow(
        payload: WorkflowRunRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        workflow_id = payload.workflow_id or "default_workflow"
        events = [
            {"event": "message", "data": "生成的内容...", "id": "event_1"},
            {"event": "message", "data": "更多创意灵感。", "id": "event_2"},
        ]
        return {"workflow_id": workflow_id, "events": events}

    @app.post("/api/agents/generate-characters")
    async def generate_characters(
        payload: GenerateCharactersRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_project_access(payload.project_id, current_user)
        characters = [
            {
                "name": "皇帝",
                "displayName": "皇帝",
                "description": "威严的皇帝,统治天下",
                "roleType": "主角",
                "voicePreset": "",
                "voiceSpeed": 1.0,
                "voiceScript": "朕即天下",
                "portraits": [],
            },
            {
                "name": "皇后",
                "displayName": "皇后",
                "description": "温柔贤惠的皇后",
                "roleType": "主角",
                "voicePreset": "",
                "voiceSpeed": 1.1,
                "voiceScript": "本宫相信你。",
                "portraits": [],
            },
        ]
        return {"success": True, "characters": characters, "project_id": payload.project_id, "events_count": 3}

    # Notifications -----------------------------------------------------------------

    @app.get("/api/notifications")
    async def list_notifications_endpoint(
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        notifications = store.list_notifications_for_org(current_user["organization_id"])
        notifications_sorted = sorted(
            notifications, key=lambda item: item["created_at"], reverse=True
        )
        return [serialize_notification(notification) for notification in notifications_sorted]

    @app.patch("/api/notifications/{notification_id}:read")
    async def mark_notification_read(
        notification_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        notification = store.notifications.get(notification_id)
        if not notification or notification["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Notification not found")
        notification["is_read"] = True
        store._dump()
        return serialize_notification(notification)

    # Plans -------------------------------------------------------------------------

    @app.get("/api/plans")
    async def list_plans():
        plans = sorted(store.plans.values(), key=lambda item: item["id"])
        return [dict(plan) for plan in plans]

    def ensure_plan(plan_id: int) -> Dict[str, Any]:
        plan = store.plans.get(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        return plan

    @app.post("/api/plans", status_code=201)
    async def create_plan(
        payload: PlanCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        plan_id = store._next_id("plans")
        plan = {
            "id": plan_id,
            **payload.model_dump(),
            "created_at": utc_now_iso(),
        }
        store.plans[plan_id] = plan
        store._dump()
        return dict(plan)

    @app.get("/api/plans/{plan_id}")
    async def get_plan(plan_id: int):
        plan = ensure_plan(plan_id)
        return dict(plan)

    @app.patch("/api/plans/{plan_id}")
    async def update_plan(
        plan_id: int,
        payload: PlanUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        plan = ensure_plan(plan_id)
        for field, value in payload.model_dump(exclude_none=True).items():
            plan[field] = value
        store._dump()
        return dict(plan)

    @app.delete("/api/plans/{plan_id}", status_code=204, response_class=Response)
    async def delete_plan(
        plan_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        ensure_plan(plan_id)
        del store.plans[plan_id]
        store._dump()
        return Response(status_code=204)

    @app.post("/api/plans/subscribe", status_code=201)
    async def subscribe_plan(
        plan_id: int = Query(...),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        plan = ensure_plan(plan_id)
        subscription_id = store._next_id("subscriptions")
        subscription = {
            "id": subscription_id,
            "organization_id": current_user["organization_id"],
            "plan_id": plan["id"],
            "status": "active",
            "created_at": utc_now_iso(),
        }
        store.subscriptions[subscription_id] = subscription
        store._dump()
        return dict(subscription)

    # Payments ----------------------------------------------------------------------

    @app.post("/api/payments/wechat/create")
    async def create_wechat_order(
        payload: PaymentCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        order_id = f"ORDER_{generate_token('wx', 12)}"
        summary = {
            "url": "https://api.mch.weixin.qq.com/v3/pay/transactions/native",
            "method": "POST",
            "headers": {},
            "body": {},
            "response": {},
            "code_url": f"weixin://wxpay/bizpayurl?pr={generate_token('qr', 8)}",
        }
        payment = {
            "order_id": order_id,
            "organization_id": current_user["organization_id"],
            "plan_type": payload.plan_type,
            "amount": payload.amount,
            "status": "pending",
            "created_at": utc_now_iso(),
        }
        store.payments[order_id] = payment
        store._dump()
        return {"order_id": order_id, "qrcode_url": summary["code_url"], "wechat_request_summary": summary}

    def ensure_order_access(order_id: str, current_user: Dict[str, Any]) -> Dict[str, Any]:
        order = store.payments.get(order_id)
        if not order or order["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

    @app.get("/api/payments/wechat/status/{order_id}")
    async def get_payment_status(
        order_id: str,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        order = ensure_order_access(order_id, current_user)
        return {"order_id": order_id, "status": order["status"]}

    @app.post("/api/payments/wechat/callback")
    async def payment_callback(payload: Dict[str, Any]):
        order_id = payload.get("order_id")
        if order_id and order_id in store.payments:
            store.payments[order_id]["status"] = payload.get("status", "paid")
            store._dump()
        return {"code": "SUCCESS", "message": "OK"}

    # API keys ----------------------------------------------------------------------

    @app.get("/api/settings/api-keys")
    async def list_api_keys(
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        keys = store.list_api_keys_for_org(current_user["organization_id"])
        return [
            {
                "id": api_key["id"],
                "name": api_key["name"],
                "masked_value": api_key.get("masked_value") or api_key["value"][:4] + "****",
                "created_at": api_key["created_at"],
            }
            for api_key in keys
        ]

    @app.post("/api/settings/api-keys", status_code=201)
    async def create_api_key(
        payload: ApiKeyCreateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        key_id = store._next_id("api_keys")
        masked = payload.value[:4] + "****" if len(payload.value) >= 4 else "****"
        api_key = {
            "id": key_id,
            "organization_id": current_user["organization_id"],
            "name": payload.name,
            "value": payload.value,
            "masked_value": masked,
            "created_at": utc_now_iso(),
        }
        store.api_keys[key_id] = api_key
        store._dump()
        return {
            "id": api_key["id"],
            "name": api_key["name"],
            "masked_value": api_key["masked_value"],
            "created_at": api_key["created_at"],
        }

    def ensure_api_key_access(key_id: int, current_user: Dict[str, Any]) -> Dict[str, Any]:
        api_key = store.api_keys.get(key_id)
        if not api_key or api_key["organization_id"] != current_user["organization_id"]:
            raise HTTPException(status_code=404, detail="API key not found")
        return api_key

    @app.patch("/api/settings/api-keys/{key_id}")
    async def update_api_key(
        key_id: int,
        payload: ApiKeyUpdateRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        api_key = ensure_api_key_access(key_id, current_user)
        for field, value in payload.model_dump(exclude_none=True).items():
            if field == "value":
                api_key["masked_value"] = value[:4] + "****" if len(value) >= 4 else "****"
            api_key[field] = value
        store._dump()
        return {
            "id": api_key["id"],
            "name": api_key["name"],
            "masked_value": api_key["masked_value"],
            "created_at": api_key["created_at"],
        }

    @app.delete("/api/settings/api-keys/{key_id}", status_code=204, response_class=Response)
    async def delete_api_key(
        key_id: int,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        ensure_admin(current_user)
        ensure_api_key_access(key_id, current_user)
        del store.api_keys[key_id]
        store._dump()
        return Response(status_code=204)

    # TTS module --------------------------------------------------------------------

    @app.get("/api/tts/voices")
    async def list_voices(
        scene_category: Optional[str] = None,
        gender: Optional[str] = None,
        support_language: Optional[str] = None,
        is_support_mix: Optional[int] = None,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        voices = store.voices
        if scene_category:
            voices = [voice for voice in voices if voice.get("scene_category") == scene_category]
        if gender:
            voices = [voice for voice in voices if voice.get("gender") == gender]
        if support_language:
            voices = [voice for voice in voices if voice.get("support_language") == support_language]
        if is_support_mix is not None:
            bool_value = bool(is_support_mix)
            voices = [voice for voice in voices if bool(voice.get("is_support_mix")) == bool_value]
        return voices

    @app.post("/api/tts/synthesize")
    async def synthesize_speech(
        payload: TtsSynthesizeRequest,
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        task_id = f"tts-{utc_now_iso().replace(':', '').replace('-', '')}-{generate_token('id', 6)}"
        response = {
            "task_id": task_id,
            "status": "succeeded",
            "audio_url": f"https://oss.example.com/{current_user['organization_id']}/tts/{task_id}.mp3",
            "audio_content_base64": "UklGRjIAAABXQVZFZm10IBAAAAABAAEA...",
        }
        return response

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("MOCK_HOST", "0.0.0.0")
    port = int(os.getenv("MOCK_PORT", "8100"))
    reload_flag = os.getenv("MOCK_RELOAD", "false").lower() in {"1", "true", "yes"}

    if reload_flag:
        uvicorn.run(
            "apps.api.mock.mock_server:app",
            host=host,
            port=port,
            reload=True,
        )
    else:
        uvicorn.run(
            app,
            host=host,
            port=port,
            reload=False,
        )
