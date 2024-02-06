from datetime import timezone, timedelta, datetime

def utc_to_vietnam_time(utc_time: datetime):
    return utc_time.astimezone(timezone(timedelta(hours=7)))