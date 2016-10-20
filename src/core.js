import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [first, second] = vote.get('pair');
  const firstVotes = vote.getIn(['tally', first], 0);
  const secondVotes = vote.getIn(['tally', second], 0);
  if (firstVotes > secondVotes) return [first];
  if (firstVotes < secondVotes) return [second];
  return [first, second];
}

export function next(state) {
  const vote = state.get('vote');
  const winners = getWinners(vote);
  const entries = state.get('entries').concat(winners);

  if (entries.size === 1) {
    const winner = entries.first();
    return state.remove('vote').remove('entries').set('winner', winner);
  }

  return state.merge({
    vote: Map({ pair: entries.take(2) }),
    entries: entries.skip(2)
  });
}

export function vote(state, entry) {
  return state.updateIn(
    ['vote', 'tally', entry],
    0,
    tally => tally + 1
  );
}
