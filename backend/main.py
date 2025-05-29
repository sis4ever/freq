from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import json
import os
from pathlib import Path

app = FastAPI(title="Freqtrade UI API")

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Strategy(BaseModel):
    name: str
    description: Optional[str] = None
    config: dict

class Trade(BaseModel):
    pair: str
    profit_ratio: float
    profit_abs: float
    open_date: str
    close_date: Optional[str] = None
    open_rate: float
    close_rate: Optional[float] = None
    amount: float
    stake_amount: float
    trade_duration: Optional[int] = None
    is_open: bool

@app.get("/")
async def root():
    return {"message": "Freqtrade UI API"}

@app.get("/strategies")
async def get_strategies():
    try:
        strategies_dir = Path("user_data/strategies")
        if not strategies_dir.exists():
            return []
        
        strategies = []
        for file in strategies_dir.glob("*.py"):
            if file.name != "__init__.py":
                strategies.append({
                    "name": file.stem,
                    "path": str(file)
                })
        return strategies
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def get_status():
    try:
        result = subprocess.run(
            ["freqtrade", "status"],
            capture_output=True,
            text=True
        )
        return {"status": result.stdout}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trades")
async def get_trades():
    try:
        result = subprocess.run(
            ["freqtrade", "trades", "--export", "trades.json"],
            capture_output=True,
            text=True
        )
        
        if os.path.exists("trades.json"):
            with open("trades.json", "r") as f:
                trades = json.load(f)
            return trades
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start")
async def start_trading(strategy: Strategy):
    try:
        cmd = [
            "freqtrade", "trade",
            "--strategy", strategy.name,
            "--config", "config.json"
        ]
        subprocess.Popen(cmd)
        return {"message": "Trading started successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stop")
async def stop_trading():
    try:
        subprocess.run(["freqtrade", "stop"])
        return {"message": "Trading stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 