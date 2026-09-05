#!/usr/bin/env python3
import json

# Load story.json
with open('/workspace/src/lib/data/story.json', 'r', encoding='utf-8') as f:
    story = json.load(f)

# New romantic/intimate images to add
romantic_images = [
    {
        "entry_key": ("641", "Gotaso's Wedding"),
        "image": {
            "id": "gotaso-pumsuk-passion",
            "ratio": 1.778,
            "tone": "#d0362f",
            "alt": "Gotaso and Pumsuk in intimate proximity, faces nearly touching, silhouetted against warm candlelight - passionate love and deep longing",
            "at": "passionate love and longing",
            "src": "/img_gotaso_pumsuk_passion.png",
            "refs": ["/ch_gotaso.png", "/ch_pumsuk.png"]
        }
    },
    {
        "entry_key": ("641", "Gotaso's Wedding"),
        "image": {
            "id": "wedding-night-anticipation",
            "ratio": 1.778,
            "tone": "#d0362f",
            "alt": "Wedding night symbolic union - two figures in bridal chamber separated by red silk curtains, nervous anticipation and threshold moment",
            "at": "the threshold moment",
            "src": "/img_wedding_night_anticipation.png",
            "refs": []
        }
    },
    {
        "entry_key": ("641", "Gotaso's Wedding"),
        "image": {
            "id": "secret-meeting-night",
            "ratio": 1.778,
            "tone": "#3b82f6",
            "alt": "Secret midnight meeting in hidden pavilion - lovers reaching through lattice screens under moonlight, clandestine romance",
            "at": "secret meetings",
            "src": "/img_secret_meeting_night.png",
            "refs": []
        }
    },
    {
        "entry_key": ("641", "Gotaso's Wedding"),
        "image": {
            "id": "moonlit-silhouettes-romance",
            "ratio": 1.778,
            "tone": "#3b82f6",
            "alt": "Moonlit chamber silhouettes visible through paper screen doors - two figures approaching, romantic anticipation",
            "at": "the moment before",
            "src": "/img_moonlit_silhouettes_romance.png",
            "refs": []
        }
    },
    {
        "entry_key": ("641", "Gotaso's Wedding"),
        "image": {
            "id": "pumsuk-forbidden-desire",
            "ratio": 1.778,
            "tone": "#374151",
            "alt": "Forbidden attraction - Pumsuk stealing glances across architectural divide, showing restraint and internal conflict",
            "at": "forbidden longing",
            "src": "/img_pumsuk_forbidden_desire.png",
            "refs": ["/ch_pumsuk.png", "/ch_gumil_wife.png"]
        }
    },
    {
        "entry_key": ("642", "Daeya Fortress"),
        "image": {
            "id": "steam-cavern-intimacy",
            "ratio": 1.778,
            "tone": "#0e7490",
            "alt": "Steam cavern scene - two figures in misty vapor, vulnerability and trust through emotional connection",
            "at": "vulnerability and trust",
            "src": "/img_steam_cavern_intimacy.png",
            "refs": []
        }
    },
    {
        "entry_key": ("642", "Daeya Fortress"),
        "image": {
            "id": "lovers-parting-war",
            "ratio": 1.778,
            "tone": "#3b82f6",
            "alt": "Lovers' farewell before war - desperate embrace at dawn, love and duty in conflict, bittersweet parting",
            "at": "the farewell",
            "src": "/img_lovers_parting_war.png",
            "refs": []
        }
    },
    {
        "entry_key": ("642", "Daeya Fortress"),
        "image": {
            "id": "emotional-closeness-comfort",
            "ratio": 1.333,
            "tone": "#d4a574",
            "alt": "Physical closeness during vulnerability - one head resting on shoulder, protective embrace, comfort and connection",
            "at": "seeking comfort",
            "src": "/img_emotional_closeness_comfort.png",
            "refs": []
        }
    },
    {
        "entry_key": ("634", "The Summit"),
        "image": {
            "id": "chunchu-royal-intimacy",
            "ratio": 1.333,
            "tone": "#d0362f",
            "alt": "Royal chamber intimacy - silhouettes through silk curtains, suggesting intimate royal moments, power and desire",
            "at": "royal chambers",
            "src": "/img_chunchu_royal_intimacy.png",
            "refs": ["/ch_chunchu.png"]
        }
    },
    {
        "entry_key": ("643", "Emperor of the West"),
        "image": {
            "id": "wu-zetian-seduction-power",
            "ratio": 1.333,
            "tone": "#7c2d12",
            "alt": "Wu Zetian using charm as political tool - calculated intimacy and power dynamics in Tang court",
            "at": "power through allure",
            "src": "/img_wu_zetian_seduction_power.png",
            "refs": ["/ch_wu_zetian.png"]
        }
    }
]

# Function to find entry by year and title
def find_entry(story, year, title):
    for chapter in story:
        if 'entries' in chapter:
            for entry in chapter['entries']:
                if entry.get('year') == year and entry.get('title') == title:
                    return entry
    return None

# Add images to appropriate entries
for item in romantic_images:
    year, title = item['entry_key']
    entry = find_entry(story, year, title)
    
    if entry:
        # Initialize images array if it doesn't exist
        if 'images' not in entry:
            entry['images'] = []
        
        # Add the image
        entry['images'].append(item['image'])
        print(f"Added image '{item['image']['id']}' to {year} - {title}")
    else:
        print(f"WARNING: Entry not found: {year} - {title}")

# Save updated story.json
with open('/workspace/src/lib/data/story.json', 'w', encoding='utf-8') as f:
    json.dump(story, f, ensure_ascii=False, indent='\t')

print("\nSuccessfully updated story.json with romantic/intimate scene images!")
