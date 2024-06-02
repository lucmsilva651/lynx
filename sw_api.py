import os
from dotenv import load_dotenv
import spamwatch

load_dotenv("config.env")

client = spamwatch.Client(os.getenv('SW_KEY'))
bans = client.get_bans_min()

with open('sw_blocklist.txt', 'w') as file:
    for ban in bans:
        file.write(f'{ban}\n')
