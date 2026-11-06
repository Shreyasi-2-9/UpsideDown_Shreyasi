from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class ServiceResponse(BaseModel):
    id: str
    name: str
    nameHi: str = Field(alias="name_hi")
    nameMr: str = Field(alias="name_mr")
    description: str
    icon: str
    basePrice: float = Field(alias="base_price")
    duration: str
    availableTechs: int = Field(alias="available_techs")
    tags: List[str]

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class BenchmarkResponse(BaseModel):
    service_id: str
    service_name: str
    locality: str
    local_min: float
    local_max: float
    benchmark_price: float
    discount_price: float
    similar_jobs_count: int
    recommendation_note: str
