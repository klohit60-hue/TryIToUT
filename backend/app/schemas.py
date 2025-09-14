from pydantic import BaseModel
from typing import List


class TryOnResponse(BaseModel):
    image_base64: str


class TryOnMultiResponse(BaseModel):
    images_base64: List[str]


