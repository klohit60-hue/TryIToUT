from pydantic import BaseModel


class TryOnResponse(BaseModel):
    image_base64: str


