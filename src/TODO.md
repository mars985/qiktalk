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

## TODO

- edit message
- delete message
- groups

## UI


# QIKTALK

### last seen
  - real time socket updates
  - read receipts
  
### express session
  - fix cors
  - remove jwt cookie, use express session equivalent

### ui
  - improve
  - ugly icons
  - ugly new chat/group interface
  - unify design
  - consistent padding, font size

### deploy
  - build
  - host on prod
  - docker containers?
  - auto start on prod with cloudflare tunnel
  - pm2, nginx

### non-essential
  - organize backend services
  - group roles
