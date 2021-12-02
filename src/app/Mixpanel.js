import mixpanel from 'mixpanel-browser';

mixpanel.init('625bec61fe419afb9eca429679d7a58e');

const actions = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};

export const Mixpanel = actions;