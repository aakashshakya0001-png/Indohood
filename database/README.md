# IndoHood Database Layer 🗄️

The `database/` directory houses the data schemas, seed datasets, and persistence abstraction layer for **IndoHood**.

## Directory Layout

```
database/
├── schema.sql           # Standard SQL DDL for enterprise relational databases (PostgreSQL/SQLite)
├── db.js                # Universal persistence query layer (JSON-backed with seed initialization)
├── data/                # Auto-created live persistent records (persisted across restarts)
├── seeds/               # Initial seed files
│   ├── users.json       # Default resident & eco-picker profiles
│   ├── pickups.json     # Default doorstep collection requests
│   ├── activities.json  # Neighborhood segregation activity stream
│   └── articles.json    # Waste awareness short-form educational articles
└── README.md            # This documentation
```

## Relational Entity Model

```mermaid
erDiagram
    USERS ||--o{ PICKUPS : schedules
    USERS ||--o{ ACTIVITIES : logs
    PICKUPS }o--|| USERS : "verified by"
    
    USERS {
        string id PK
        string name
        string email
        string role
        string address
        int wallet_balance
        string avatar
        string bio
    }
    
    PICKUPS {
        string id PK
        string booking_ref UK
        string user_id FK
        string item_name
        string stream
        string weight_est
        int credits
        int co2_grams
        date pickup_date
        string time_slot
        string status
    }
    
    ACTIVITIES {
        string id PK
        string user_id FK
        string user_name
        string action_title
        string category
        string impact_stat
        int credits_earned
        int cheers_count
    }
    
    ARTICLES {
        string id PK
        string title
        string topic
        string read_time
        string summary
        json takeaways
    }
```

## Key Query Methods in `db.js`

- **Users**: `getUsers()`, `getUserById(id)`, `updateUser(id, updates)`
- **Pickups**: `getPickups()`, `getPickupById(id)`, `addPickup(data)`, `updatePickup(id, updates)`
- **Activities**: `getActivities()`, `addActivity(data)`, `cheerActivity(id)`
- **Articles**: `getArticles()`, `getArticleById(id)`
