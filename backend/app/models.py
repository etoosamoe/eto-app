from sqlalchemy import Column, Integer, String
from sqlalchemy.types import Date
from .database import Base

class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String(255), unique=True)
    type = Column(String(10), index=True) # vm, hw
    cores = Column(Integer)
    ram = Column(Integer)
    disk = Column(Integer)

#    ip_address = Column(IPNetwork) need to implement ipaddress
