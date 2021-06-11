# 🙏 God's Promises

## TODO

- [ ] Two components:
  - [ ] Home with 'get a promise' button.
  - [ ] Promise with 'next' - 'previous' buttons.
- [ ] When we get to home, we pre-fetch a promise and we store it on the client state / redux.
- [ ] When we hit 'get a promise' we begin to move through the promises array in the client state.
- [ ] Once we move to a promise, we fetch a new one and store it on client state as the next one.
  - [ ] If the new fetched random promise is already in client state, we pick a random on from the ones already on client state and fetch a new one. Repeat if the new one is already in client.
  - [ ] If the new one is not in client state, we flag it as the next promise and move to that one when we click 'next'
