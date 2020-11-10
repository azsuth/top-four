import { h } from 'preact';
import { shallow } from 'enzyme';

import { withProps } from 'components/game/rankable_topics';

function MockComponent() {
  return <div />;
}

describe('<RankableTopics />', () => {
  describe('withProps', () => {
    it('sorts the active topics by the local ranks', () => {
      const ComponentWithProps = withProps(MockComponent);
      const activeTopics = [
        { uid: '12345', name: 'topic a' },
        { uid: '23456', name: 'topic b' },
        { uid: '34567', name: 'topic c' },
        { uid: '45678', name: 'topic d' }
      ];
      const localRanks = {
        12345: 3,
        23456: 2,
        34567: 1,
        45678: 0
      };

      const wrapper = shallow(
        <ComponentWithProps
          activeTopics={activeTopics}
          localRanks={localRanks}
        />
      );

      const sortedActiveTopics = wrapper.find(MockComponent).props()
        .activeTopics;

      expect(sortedActiveTopics[0].uid).toBe('45678');
      expect(sortedActiveTopics[1].uid).toBe('34567');
      expect(sortedActiveTopics[2].uid).toBe('23456');
      expect(sortedActiveTopics[3].uid).toBe('12345');
    });
  });
});
