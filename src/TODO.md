## HomePage
#### Sidebar

- logout
- toggle theme
- search users
- conversation list

#### Chat

- messages
- text area

## Hierarchy
```python

HomePage
  #Sidebar
    - Logout
    - ToggleTheme
    - SearchBar
    - ConversationList
      - ConversationTile

  #Chat
    MessagePanel
      - MessageTile
      - MessageBox

```

### States

1. `user <User>`
   - set by login
   - used by SearchBar
   - used by MessageBox

2. `conversationId <string>`
   - set by SearchBar
   - set by ConversationTile
 