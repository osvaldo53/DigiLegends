export const state = {
  app: {
    initialized: false,
    currentScreen: "title"
  },

  save: {
    version: 3,
    playerName: "",
    bits: 100,
    party: [],
    storage: [],
    digidex: {
      seen: [],
      owned: []
    },
    progress: {
      huntsCompleted: 0
    },
    inventory: []
  },

  battle: {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    log: [],
    result: null,
    rewards: null
  }
};
