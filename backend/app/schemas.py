from pydantic import BaseModel


class _ServerId(BaseModel):
    _id: int

class ServerCreate(_ServerId, BaseModel):
    hostname: str
    type: str
    cores: int
    ram: int
    disk: int
class Server(BaseModel):
    id: int
    hostname: str
    type: str
    cores: int
    ram: int
    disk: int

    class Config:
        orm_mode = True
